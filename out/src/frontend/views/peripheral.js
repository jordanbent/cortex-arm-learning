"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const reporting_1 = require("../../reporting");
const svd_1 = require("../svd");
const messagenode_1 = require("./nodes/messagenode");
class PeripheralTreeProvider {
    constructor() {
        // tslint:disable-next-line:variable-name
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.peripherials = [];
        this.loaded = false;
    }
    saveState(path) {
        const state = [];
        this.peripherials.forEach((p) => {
            state.push(...p.saveState());
        });
        fs.writeFileSync(path, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
    }
    loadSVD(SVDFile) {
        if (!path.isAbsolute(SVDFile)) {
            const fullpath = path.normalize(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, SVDFile));
            SVDFile = fullpath;
        }
        this.svdFileName = SVDFile;
        return svd_1.SVDParser.parseSVD(SVDFile).then((peripherals) => {
            this.peripherials = peripherals;
            this.loaded = true;
            return true;
        });
    }
    findNodeByPath(path) {
        const pathParts = path.split('.');
        const peripheral = this.peripherials.find((p) => p.name === pathParts[0]);
        if (!peripheral) {
            return null;
        }
        return peripheral.findByPath(pathParts.slice(1));
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
    getChildren(element) {
        if (this.loaded && this.peripherials.length > 0) {
            if (element) {
                return element.getChildren();
            }
            else {
                return this.peripherials;
            }
        }
        else if (!this.loaded) {
            return [new messagenode_1.MessageNode('No SVD File Loaded: ' + this.svdFileName || 'None', null)];
        }
        else {
            return [];
        }
    }
    debugSessionStarted(svdfile) {
        return new Promise((resolve, reject) => {
            this.peripherials = [];
            this.loaded = false;
            this._onDidChangeTreeData.fire();
            if (svdfile) {
                setTimeout(() => {
                    this.loadSVD(svdfile).then(() => {
                        vscode.workspace.findFiles('.vscode/.cortex-debug.peripherals.state.json', null, 1).then((value) => {
                            if (value.length > 0) {
                                const fspath = value[0].fsPath;
                                const data = fs.readFileSync(fspath, 'utf8');
                                const settings = JSON.parse(data);
                                settings.forEach((s) => {
                                    const node = this.findNodeByPath(s.node);
                                    if (node) {
                                        node.expanded = s.expanded || false;
                                        node.format = s.format;
                                    }
                                });
                                this._onDidChangeTreeData.fire();
                            }
                        }, (error) => {
                        });
                        this._onDidChangeTreeData.fire();
                        resolve();
                        reporting_1.default.sendEvent('Peripheral View', 'Used', svdfile);
                    }, (e) => {
                        this.peripherials = [];
                        this.loaded = false;
                        this._onDidChangeTreeData.fire();
                        const msg = `Unable to parse SVD file: ${e.toString()}`;
                        vscode.window.showErrorMessage(msg);
                        if (vscode.debug.activeDebugConsole) {
                            vscode.debug.activeDebugConsole.appendLine(msg);
                        }
                        resolve();
                        reporting_1.default.sendEvent('Peripheral View', 'Error', e.toString());
                    });
                }, 150);
            }
            else {
                resolve();
                reporting_1.default.sendEvent('Peripheral View', 'No SVD');
            }
        });
    }
    debugSessionTerminated() {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const fspath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', '.cortex-debug.peripherals.state.json');
            this.saveState(fspath);
        }
        this.peripherials = [];
        this.loaded = false;
        this._onDidChangeTreeData.fire();
        return Promise.resolve(true);
    }
    debugStopped() {
        if (this.loaded) {
            const promises = this.peripherials.map((p) => p.updateData());
            Promise.all(promises).then((_) => { this._onDidChangeTreeData.fire(); }, (_) => { this._onDidChangeTreeData.fire(); });
        }
    }
    debugContinued() {
    }
}
exports.PeripheralTreeProvider = PeripheralTreeProvider;
//# sourceMappingURL=peripheral.js.map