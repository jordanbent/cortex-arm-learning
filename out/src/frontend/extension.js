"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const peripheral_1 = require("./views/peripheral");
const registers_1 = require("./views/registers");
const core_1 = require("./swo/core");
const common_1 = require("../common");
const memory_content_provider_1 = require("./memory_content_provider");
const reporting_1 = require("../reporting");
const configprovider_1 = require("./configprovider");
const socket_1 = require("./swo/sources/socket");
const fifo_1 = require("./swo/sources/fifo");
const file_1 = require("./swo/sources/file");
const serial_1 = require("./swo/sources/serial");
const disassembly_content_provider_1 = require("./disassembly_content_provider");
const symbols_1 = require("../symbols");
class CortexDebugExtension {
    constructor(context) {
        this.context = context;
        this.adapterOutputChannel = null;
        this.clearAdapterOutputChannel = false;
        this.swo = null;
        this.swosource = null;
        this.SVDDirectory = [];
        this.functionSymbols = null;
        this.peripheralProvider = new peripheral_1.PeripheralTreeProvider();
        this.registerProvider = new registers_1.RegisterTreeProvider();
        this.memoryProvider = new memory_content_provider_1.MemoryContentProvider();
        let tmp = [];
        try {
            const dirPath = path.join(context.extensionPath, 'data', 'SVDMap.json');
            tmp = JSON.parse(fs.readFileSync(dirPath, 'utf8'));
        }
        catch (e) { }
        reporting_1.default.activate(context);
        this.peripheralTreeView = vscode.window.createTreeView('cortex-debug.peripherals', {
            treeDataProvider: this.peripheralProvider
        });
        this.registerTreeView = vscode.window.createTreeView('cortex-debug.registers', {
            treeDataProvider: this.registerProvider
        });
        context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('examinememory', this.memoryProvider), vscode.workspace.registerTextDocumentContentProvider('disassembly', new disassembly_content_provider_1.DisassemblyContentProvider()), vscode.commands.registerCommand('cortex-debug.peripherals.updateNode', this.peripheralsUpdateNode.bind(this)), vscode.commands.registerCommand('cortex-debug.peripherals.copyValue', this.peripheralsCopyValue.bind(this)), vscode.commands.registerCommand('cortex-debug.peripherals.setFormat', this.peripheralsSetFormat.bind(this)), vscode.commands.registerCommand('cortex-debug.peripherals.forceRefresh', this.peripheralsForceRefresh.bind(this)), vscode.commands.registerCommand('cortex-debug.registers.copyValue', this.registersCopyValue.bind(this)), vscode.commands.registerCommand('cortex-debug.examineMemory', this.examineMemory.bind(this)), vscode.commands.registerCommand('cortex-debug.viewDisassembly', this.showDisassembly.bind(this)), vscode.commands.registerCommand('cortex-debug.setForceDisassembly', this.setForceDisassembly.bind(this)), vscode.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)), vscode.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)), vscode.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)), vscode.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)), vscode.window.onDidChangeTextEditorSelection((e) => {
            if (e && e.textEditor.document.fileName.endsWith('.cdmem')) {
                this.memoryProvider.handleSelection(e);
            }
        }), vscode.debug.registerDebugConfigurationProvider('cortex-debug', new configprovider_1.CortexDebugConfigurationProvider(context)), this.registerTreeView, this.registerTreeView.onDidCollapseElement((e) => {
            e.element.expanded = false;
        }), this.registerTreeView.onDidExpandElement((e) => {
            e.element.expanded = true;
        }), this.peripheralTreeView, this.peripheralTreeView.onDidExpandElement((e) => {
            e.element.expanded = true;
            e.element.getPeripheral().updateData();
            this.peripheralProvider.refresh();
        }), this.peripheralTreeView.onDidCollapseElement((e) => {
            e.element.expanded = false;
        }));
    }
    getSVDFile(device) {
        const entry = this.SVDDirectory.find((de) => de.expression.test(device));
        return entry ? entry.path : null;
    }
    registerSVDFile(expression, path) {
        if (typeof expression === 'string') {
            expression = new RegExp(`^${expression}$`, '');
        }
        this.SVDDirectory.push({ expression: expression, path: path });
    }
    activeEditorChanged(editor) {
        if (editor !== undefined && vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type === 'cortex-debug') {
            const uri = editor.document.uri;
            if (uri.scheme === 'file') {
                // vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: uri.path });
            }
            else if (uri.scheme === 'disassembly') {
                vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: `${uri.scheme}://${uri.authority}${uri.path}` });
            }
        }
    }
    showDisassembly() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vscode.debug.activeDebugSession) {
                vscode.window.showErrorMessage('No debugging session available');
                return;
            }
            if (!this.functionSymbols) {
                try {
                    const resp = yield vscode.debug.activeDebugSession.customRequest('load-function-symbols');
                    this.functionSymbols = resp.functionSymbols;
                }
                catch (e) {
                    vscode.window.showErrorMessage('Unable to load symbol table. Disassembly view unavailable.');
                }
            }
            try {
                let funcname = yield vscode.window.showInputBox({
                    placeHolder: 'main',
                    ignoreFocusOut: true,
                    prompt: 'Function Name (exact or a regexp) to Disassemble.'
                });
                funcname = funcname ? funcname.trim() : null;
                if (!funcname) {
                    return;
                }
                let functions = this.functionSymbols.filter((s) => s.name === funcname);
                if (functions.length === 0) {
                    let regExp = new RegExp(funcname);
                    if (funcname.endsWith('/i')) {
                        // This is not the best way or UI. But this is the only flag that makes sense
                        regExp = new RegExp(funcname.substring(0, funcname.length - 2), 'i');
                    }
                    functions = this.functionSymbols.filter((s) => regExp.test(s.name));
                }
                let url;
                if (functions.length === 0) {
                    vscode.window.showErrorMessage(`No function matching name/regexp '${funcname}' found.`);
                }
                else if (functions.length === 1) {
                    if (!functions[0].file || (functions[0].scope === symbols_1.SymbolScope.Global)) {
                        url = `disassembly:///${functions[0].name}.cdasm`;
                    }
                    else {
                        url = `disassembly:///${functions[0].file}:::${functions[0].name}.cdasm`;
                    }
                }
                else if (functions.length > 31) { /* arbitrary limit. 31 is prime! */
                    vscode.window.showErrorMessage(`Too many(${functions.length}) functions matching '${funcname}' found.`);
                }
                else {
                    const selected = yield vscode.window.showQuickPick(functions.map((f) => {
                        return {
                            label: f.name,
                            name: f.name,
                            file: f.file,
                            scope: f.scope,
                            description: (!f.file || (f.scope === symbols_1.SymbolScope.Global)) ? 'Global Scope' : `Static in ${f.file}`
                        };
                    }), {
                        ignoreFocusOut: true
                    });
                    if (!selected.file || (selected.scope === symbols_1.SymbolScope.Global)) {
                        url = `disassembly:///${selected.name}.cdasm`;
                    }
                    else {
                        url = `disassembly:///${selected.file}:::${selected.name}.cdasm`;
                    }
                }
                if (url) {
                    vscode.window.showTextDocument(vscode.Uri.parse(url));
                }
            }
            catch (e) {
                vscode.window.showErrorMessage('Unable to show disassembly.');
            }
        });
    }
    setForceDisassembly() {
        vscode.window.showQuickPick([
            { label: 'Auto', description: 'Show disassembly for functions when source cannot be located.' },
            { label: 'Forced', description: 'Always show disassembly for functions.' }
        ], { matchOnDescription: true, ignoreFocusOut: true }).then((result) => {
            const force = result.label === 'Forced';
            vscode.debug.activeDebugSession.customRequest('set-force-disassembly', { force: force });
            reporting_1.default.sendEvent('Force Disassembly', 'Set', force ? 'Forced' : 'Auto');
        }, (error) => { });
    }
    examineMemory() {
        function validateValue(address) {
            if (/^0x[0-9a-f]{1,8}$/i.test(address)) {
                return address;
            }
            else if (/^[0-9]+$/i.test(address)) {
                return address;
            }
            else {
                return null;
            }
        }
        function validateAddress(address) {
            if (address === '') {
                return null;
            }
            return address;
        }
        if (!vscode.debug.activeDebugSession) {
            vscode.window.showErrorMessage('No debugging session available');
            return;
        }
        vscode.window.showInputBox({
            placeHolder: 'Enter a valid C/gdb expression. Use 0x prefix for hexidecimal numbers',
            ignoreFocusOut: true,
            prompt: 'Memory Address'
        }).then((address) => {
            address = address.trim();
            if (!validateAddress(address)) {
                vscode.window.showErrorMessage('Invalid memory address entered');
                reporting_1.default.sendEvent('Examine Memory', 'Invalid Address', address);
                return;
            }
            vscode.window.showInputBox({
                placeHolder: 'Enter a constant value. Prefix with 0x for hexidecimal format.',
                ignoreFocusOut: true,
                prompt: 'Length'
            }).then((length) => {
                length = length.trim();
                if (!validateValue(length)) {
                    vscode.window.showErrorMessage('Invalid length entered');
                    reporting_1.default.sendEvent('Examine Memory', 'Invalid Length', length);
                    return;
                }
                reporting_1.default.sendEvent('Examine Memory', 'Valid', `${address}-${length}`);
                const timestamp = new Date().getTime();
                const addrEnc = encodeURIComponent(`${address}`);
                // tslint:disable-next-line:max-line-length
                vscode.workspace.openTextDocument(vscode.Uri.parse(`examinememory:///Memory%20[${addrEnc},${length}].cdmem?address=${addrEnc}&length=${length}&timestamp=${timestamp}`))
                    .then((doc) => {
                    vscode.window.showTextDocument(doc, { viewColumn: 2, preview: false });
                    reporting_1.default.sendEvent('Examine Memory', 'Used');
                }, (error) => {
                    vscode.window.showErrorMessage(`Failed to examine memory: ${error}`);
                    reporting_1.default.sendEvent('Examine Memory', 'Error', error.toString());
                });
            }, (error) => {
            });
        }, (error) => {
        });
    }
    // Peripherals
    peripheralsUpdateNode(node) {
        node.performUpdate().then((result) => {
            if (result) {
                this.peripheralProvider.refresh();
                reporting_1.default.sendEvent('Peripheral View', 'Update Node');
            }
        }, (error) => {
            vscode.window.showErrorMessage(`Unable to update value: ${error.toString()}`);
        });
    }
    peripheralsCopyValue(node) {
        const cv = node.getCopyValue();
        if (cv) {
            vscode.env.clipboard.writeText(cv).then(() => {
                reporting_1.default.sendEvent('Peripheral View', 'Copy Value');
            });
        }
    }
    peripheralsSetFormat(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield vscode.window.showQuickPick([
                { label: 'Auto', description: 'Automatically choose format (Inherits from parent)', value: common_1.NumberFormat.Auto },
                { label: 'Hex', description: 'Format value in hexidecimal', value: common_1.NumberFormat.Hexidecimal },
                { label: 'Decimal', description: 'Format value in decimal', value: common_1.NumberFormat.Decimal },
                { label: 'Binary', description: 'Format value in binary', value: common_1.NumberFormat.Binary }
            ]);
            node.format = result.value;
            this.peripheralProvider.refresh();
            reporting_1.default.sendEvent('Peripheral View', 'Set Format', result.label);
        });
    }
    peripheralsForceRefresh(node) {
        return __awaiter(this, void 0, void 0, function* () {
            node.getPeripheral().updateData().then((e) => {
                this.peripheralProvider.refresh();
            });
        });
    }
    // Registers
    registersCopyValue(node) {
        const cv = node.getCopyValue();
        if (cv) {
            vscode.env.clipboard.writeText(cv).then(() => {
                reporting_1.default.sendEvent('Register View', 'Copy Value');
            });
        }
    }
    // Debug Events
    debugSessionStarted(session) {
        if (session.type !== 'cortex-debug') {
            return;
        }
        // Clean-up Old output channels
        if (this.swo) {
            this.swo.dispose();
            this.swo = null;
        }
        this.functionSymbols = null;
        session.customRequest('get-arguments').then((args) => {
            let svdfile = args.svdFile;
            if (!svdfile) {
                svdfile = this.getSVDFile(args.device);
            }
            reporting_1.default.beginSession(args);
            this.registerProvider.debugSessionStarted();
            this.peripheralProvider.debugSessionStarted(svdfile ? svdfile : null);
            if (this.swosource) {
                this.initializeSWO(args);
            }
        }, (error) => {
            // TODO: Error handling for unable to get arguments
        });
    }
    debugSessionTerminated(session) {
        if (session.type !== 'cortex-debug') {
            return;
        }
        reporting_1.default.endSession();
        this.registerProvider.debugSessionTerminated();
        this.peripheralProvider.debugSessionTerminated();
        if (this.swo) {
            this.swo.debugSessionTerminated();
        }
        if (this.swosource) {
            this.swosource.dispose();
            this.swosource = null;
        }
        this.clearAdapterOutputChannel = true;
    }
    receivedCustomEvent(e) {
        if (vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type !== 'cortex-debug') {
            return;
        }
        switch (e.event) {
            case 'custom-stop':
                this.receivedStopEvent(e);
                break;
            case 'custom-continued':
                this.receivedContinuedEvent(e);
                break;
            case 'swo-configure':
                this.receivedSWOConfigureEvent(e);
                break;
            case 'adapter-output':
                this.receivedAdapterOutput(e);
                break;
            case 'record-event':
                this.receivedEvent(e);
                break;
            default:
                break;
        }
    }
    receivedStopEvent(e) {
        this.peripheralProvider.debugStopped();
        this.registerProvider.debugStopped();
        vscode.workspace.textDocuments.filter((td) => td.fileName.endsWith('.cdmem'))
            .forEach((doc) => { this.memoryProvider.update(doc); });
        if (this.swo) {
            this.swo.debugStopped();
        }
    }
    receivedContinuedEvent(e) {
        this.peripheralProvider.debugContinued();
        this.registerProvider.debugContinued();
        if (this.swo) {
            this.swo.debugContinued();
        }
    }
    receivedEvent(e) {
        reporting_1.default.sendEvent(e.body.category, e.body.action, e.body.label, e.body.parameters);
    }
    receivedSWOConfigureEvent(e) {
        if (e.body.type === 'socket') {
            this.swosource = new socket_1.SocketSWOSource(e.body.port);
            reporting_1.default.sendEvent('SWO', 'Source', 'Socket');
        }
        else if (e.body.type === 'fifo') {
            this.swosource = new fifo_1.FifoSWOSource(e.body.path);
            reporting_1.default.sendEvent('SWO', 'Source', 'FIFO');
        }
        else if (e.body.type === 'file') {
            this.swosource = new file_1.FileSWOSource(e.body.path);
            reporting_1.default.sendEvent('SWO', 'Source', 'File');
        }
        else if (e.body.type === 'serial') {
            this.swosource = new serial_1.SerialSWOSource(e.body.device, e.body.baudRate, this.context.extensionPath);
            reporting_1.default.sendEvent('SWO', 'Source', 'Serial');
        }
        if (vscode.debug.activeDebugSession) {
            vscode.debug.activeDebugSession.customRequest('get-arguments').then((args) => {
                this.initializeSWO(args);
            });
        }
    }
    receivedAdapterOutput(e) {
        if (!this.adapterOutputChannel) {
            this.adapterOutputChannel = vscode.window.createOutputChannel('Adapter Output');
            this.adapterOutputChannel.show();
        }
        else if (this.clearAdapterOutputChannel) {
            this.adapterOutputChannel.clear();
        }
        this.clearAdapterOutputChannel = false;
        let output = e.body.content;
        if (!output.endsWith('\n')) {
            output += '\n';
        }
        this.adapterOutputChannel.append(output);
    }
    initializeSWO(args) {
        if (!this.swosource) {
            vscode.window.showErrorMessage('Tried to initialize SWO Decoding without a SWO data source');
            return;
        }
        this.swo = new core_1.SWOCore(this.swosource, args, this.context.extensionPath);
    }
}
exports.CortexDebugExtension = CortexDebugExtension;
function activate(context) {
    return new CortexDebugExtension(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map