"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const os = require("os");
const path = require("path");
const symbols_1 = require("../symbols");
const SYMBOL_REGEX = /^([0-9a-f]{8})\s([lg\ !])([w\ ])([C\ ])([W\ ])([I\ ])([dD\ ])([FfO\ ])\s([^\s]+)\s([0-9a-f]+)\s(.*)$/;
const TYPE_MAP = {
    'F': symbols_1.SymbolType.Function,
    'f': symbols_1.SymbolType.File,
    'O': symbols_1.SymbolType.Object,
    ' ': symbols_1.SymbolType.Normal
};
const SCOPE_MAP = {
    'l': symbols_1.SymbolScope.Local,
    'g': symbols_1.SymbolScope.Global,
    ' ': symbols_1.SymbolScope.Neither,
    '!': symbols_1.SymbolScope.Both
};
class SymbolTable {
    constructor(toolchainPath, toolchainPrefix, executable, demangle) {
        this.toolchainPath = toolchainPath;
        this.toolchainPrefix = toolchainPrefix;
        this.executable = executable;
        this.demangle = demangle;
        this.allSymbols = [];
        // The following are caches that are either created on demand or on symbol load. Helps performance
        // on large executables since most of our searches are linear. Or, to avoid a search entirely if possible
        // Case sensitivity for path names is an issue: We follow just what gcc records so inherently case-sensitive
        // or case-preserving. We don't try to re-interpret/massage those path-names. Maybe later
        //
        // TODO: Support for source-maps for both gdb and for symbol/file lookups
        this.staticsByFile = {};
        this.globalVars = [];
        this.globalFuncs = [];
        this.staticVars = [];
        this.staticFuncs = [];
        this.fileMap = {}; // basename of a file to a potential list of aliases we found
    }
    loadSymbols() {
        try {
            let objdumpExePath = os.platform() !== 'win32' ? `${this.toolchainPrefix}-objdump` : `${this.toolchainPrefix}-objdump.exe`;
            if (this.toolchainPath) {
                objdumpExePath = path.normalize(path.join(this.toolchainPath, objdumpExePath));
            }
            const options = ['--syms', '-Wi'];
            if (this.demangle) {
                options.push('-C');
            }
            const objdump = childProcess.spawnSync(objdumpExePath, [...options, this.executable]);
            const output = objdump.stdout.toString();
            const lines = output.split(/[\r\n]+/g);
            this.collectCompilationUnits(lines);
            let currentFile = null;
            let currentMapped = null;
            for (const line of lines) {
                const match = line.match(SYMBOL_REGEX);
                if (match) {
                    if (match[7] === 'd' && match[8] === 'f') {
                        if (match[11]) {
                            currentFile = match[11].trim();
                            currentMapped = this.addToFileMap(currentFile.split('/').pop(), currentFile);
                        }
                        else {
                            // This can happen with C++. Inline and template methods/variables/functions/etc. are listed with
                            // an empty file association. So, symbols after this line can come from multiple compilation
                            // units with no clear owner. These can be locals, globals or other.
                            currentFile = null;
                            currentMapped = null;
                        }
                    }
                    const type = TYPE_MAP[match[8]];
                    const scope = SCOPE_MAP[match[2]];
                    let name = match[11].trim();
                    let hidden = false;
                    if (name.startsWith('.hidden')) {
                        name = name.substring(7).trim();
                        hidden = true;
                    }
                    const sym = {
                        address: parseInt(match[1], 16),
                        type: type,
                        origScope: scope,
                        scope: scope,
                        section: match[9].trim(),
                        length: parseInt(match[10], 16),
                        name: name,
                        file: scope === symbols_1.SymbolScope.Local ? currentFile : null,
                        fileMaps: scope === symbols_1.SymbolScope.Local ? currentMapped : [],
                        instructions: null,
                        hidden: hidden
                    };
                    this.allSymbols.push(sym);
                    if (scope !== symbols_1.SymbolScope.Local) {
                        if (type === symbols_1.SymbolType.Function) {
                            sym.scope = symbols_1.SymbolScope.Global;
                            this.globalFuncs.push(sym);
                        }
                        else if (type === symbols_1.SymbolType.Object) {
                            if (scope === symbols_1.SymbolScope.Global) {
                                this.globalVars.push(sym);
                            }
                            else {
                                // These fail gdb create-vars. So ignoring them. C++ generates them
                                console.log('SymbolTable: ignoring non local object: ' + name);
                            }
                        }
                    }
                    else if (currentFile) {
                        // Yes, you can have statics with no file association in C++. They are neither
                        // truly global or local. Some can be considered but not sure how to filter
                        if (type === symbols_1.SymbolType.Object) {
                            this.staticVars.push(sym);
                        }
                        else if (type === symbols_1.SymbolType.Function) {
                            this.staticFuncs.push(sym);
                        }
                    }
                    else if (type === symbols_1.SymbolType.Function) {
                        sym.scope = symbols_1.SymbolScope.Global;
                        this.globalFuncs.push(sym);
                    }
                    else if (type === symbols_1.SymbolType.Object) {
                        // We are currently ignoring Local objects with no file association for objects.
                        // Revisit later with care and decide how to classify them
                        console.log('SymbolTable: ignoring local object: ' + name);
                    }
                }
            }
        }
        catch (e) { }
    }
    addToFileMap(key, newMap) {
        const value = this.fileMap[key] || [];
        if (value.indexOf(newMap) === -1) {
            value.push(newMap);
        }
        this.fileMap[key] = value;
        return value;
    }
    collectCompilationUnits(lines) {
        // Loop over and collect the set of compilation units. This is where true file names are stored
        // Most file names listed by objdump are just the base-name and I am not sure exactly how the base
        // file-name is supposed to map to an actual compilation unit. Esp. when duplicates exist. This only
        // matters for static variables/functions
        let isCompileUnit = false;
        let curName = '';
        let curDir = '';
        let curSimpleName = '';
        const cUnitRexp = /^ <0>.*Abbrev Number.*\(DW_TAG_compile_unit\)/;
        for (const line of lines) {
            if (cUnitRexp.test(line)) {
                isCompileUnit = true;
            }
            else if (isCompileUnit) {
                const match = line.match(/.*DW_AT_([^\s]*).*\)\:\s(.*)/);
                if (match) {
                    if (match[1] === 'name') {
                        curName = match[2];
                        curSimpleName = curName.split('/').pop();
                        this.addToFileMap(curSimpleName, curSimpleName);
                        this.addToFileMap(curSimpleName, curName);
                    }
                    else if (match[1] === 'comp_dir') {
                        curDir = match[2];
                        if (curName !== '') {
                            this.addToFileMap(curSimpleName, curDir + '/' + curName);
                        }
                    }
                }
                else if (line.startsWith(' <')) {
                    isCompileUnit = false;
                    curSimpleName = curName = curDir = '';
                }
            }
        }
    }
    getFunctionAtAddress(address) {
        return this.allSymbols.find((s) => s.type === symbols_1.SymbolType.Function && s.address <= address && (s.address + s.length) > address);
    }
    getFunctionSymbols() {
        return this.allSymbols.filter((s) => s.type === symbols_1.SymbolType.Function);
    }
    getGlobalVariables() {
        return this.globalVars;
    }
    getStaticVariables(file) {
        let ret = this.staticsByFile[file];
        if (!ret) {
            ret = [];
            for (const s of this.staticVars) {
                if (s.fileMaps.indexOf(file) !== -1) {
                    ret.push(s);
                }
            }
            this.staticsByFile[file] = ret;
        }
        return ret;
    }
    getFunctionByName(name, file) {
        if (file) { // Try to find static function first
            for (const s of this.staticFuncs) { // Try exact matches first (maybe not needed)
                if ((s.name === name) && (s.file === file)) {
                    return s;
                }
            }
            for (const s of this.staticFuncs) { // Try any match
                if ((s.name === name) && (s.fileMaps.indexOf(file) !== -1)) {
                    return s;
                }
            }
        }
        // Fall back to global scope
        return this.globalFuncs.find((s) => s.name === name);
    }
}
exports.SymbolTable = SymbolTable;
//# sourceMappingURL=symbols.js.map