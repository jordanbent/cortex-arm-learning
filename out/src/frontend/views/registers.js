"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs = require("fs");
const path = require("path");
const registernode_1 = require("./nodes/registernode");
const messagenode_1 = require("./nodes/messagenode");
class RegisterTreeProvider {
    constructor() {
        // tslint:disable-next-line:variable-name
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.loaded = false;
        this.registers = [];
        this.registerMap = {};
    }
    refresh() {
        if (vscode_1.debug.activeDebugSession) {
            if (!this.loaded) {
                vscode_1.debug.activeDebugSession.customRequest('read-register-list').then((data) => {
                    this.createRegisters(data);
                    this._refreshRegisterValues();
                });
            }
            else {
                this._refreshRegisterValues();
            }
        }
    }
    _refreshRegisterValues() {
        vscode_1.debug.activeDebugSession.customRequest('read-registers').then((data) => {
            data.forEach((reg) => {
                const index = parseInt(reg.number, 10);
                const regNode = this.registerMap[index];
                if (regNode) {
                    regNode.setValue(reg.value);
                }
            });
            this._onDidChangeTreeData.fire();
        });
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
    createRegisters(regInfo) {
        this.registerMap = {};
        this.registers = [];
        regInfo.forEach((reg, idx) => {
            if (reg) {
                const rn = new registernode_1.RegisterNode(reg, idx);
                this.registers.push(rn);
                this.registerMap[idx] = rn;
            }
        });
        this.loaded = true;
        vscode_1.workspace.findFiles('.vscode/.cortex-debug.registers.state.json', null, 1).then((value) => {
            if (value.length > 0) {
                const fspath = value[0].fsPath;
                const data = fs.readFileSync(fspath, 'utf8');
                const settings = JSON.parse(data);
                settings.forEach((s) => {
                    if (s.node.indexOf('.') === -1) {
                        const register = this.registers.find((r) => r.name === s.node);
                        if (register) {
                            if (s.expanded) {
                                register.expanded = s.expanded;
                            }
                        }
                    }
                    else {
                        const [regname, fieldname] = s.node.split('.');
                        const register = this.registers.find((r) => r.name === regname);
                        if (register) {
                            const field = register.getChildren().find((f) => f.name === fieldname);
                        }
                    }
                });
                this._onDidChangeTreeData.fire();
            }
        }, (error) => {
        });
        this._onDidChangeTreeData.fire();
    }
    updateRegisterValues(values) {
        values.forEach((reg) => {
            const node = this.registerMap[reg.number];
            node.setValue(reg.value);
        });
        this._onDidChangeTreeData.fire();
    }
    getChildren(element) {
        if (this.loaded && this.registers.length > 0) {
            return element ? element.getChildren() : this.registers;
        }
        else if (!this.loaded) {
            return [new messagenode_1.MessageNode('Not in active debug session.')];
        }
        else {
            return [];
        }
    }
    _saveState(fspath) {
        const state = [];
        this.registers.forEach((r) => {
            state.push(...r._saveState());
        });
        fs.writeFileSync(fspath, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
    }
    debugSessionTerminated() {
        if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
            const fspath = path.join(vscode_1.workspace.workspaceFolders[0].uri.fsPath, '.vscode', '.cortex-debug.registers.state.json');
            this._saveState(fspath);
        }
        this.loaded = false;
        this.registers = [];
        this.registerMap = {};
        this._onDidChangeTreeData.fire();
    }
    debugSessionStarted() {
        this.loaded = false;
        this.registers = [];
        this.registerMap = {};
        this._onDidChangeTreeData.fire();
    }
    debugStopped() {
        this.refresh();
    }
    debugContinued() {
    }
}
exports.RegisterTreeProvider = RegisterTreeProvider;
//# sourceMappingURL=registers.js.map