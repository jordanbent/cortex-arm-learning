import { TreeItem, TreeDataProvider, EventEmitter, Event, TreeItemCollapsibleState, debug, workspace, ProviderResult} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { NodeSetting } from '../../common';
import { RegisterNode, RegisterValue } from './nodes/registernode';
import { MessageNode } from './nodes/messagenode';
import { BaseNode } from './nodes/basenode';

export class RegisterTreeProvider implements TreeDataProvider<BaseNode> {
    // tslint:disable-next-line:variable-name
    public _onDidChangeTreeData: EventEmitter<BaseNode | undefined> = new EventEmitter<BaseNode | undefined>();
    public readonly onDidChangeTreeData: Event<BaseNode | undefined> = this._onDidChangeTreeData.event;

    private registers: RegisterNode[];
    private registerMap: { [index: number]: RegisterNode };
    private loaded: boolean = false;

    constructor() {
        this.registers = [];
        this.registerMap = {};
    }

    public refresh(): void {
        if (debug.activeDebugSession) {
            if (!this.loaded) {
                debug.activeDebugSession.customRequest('read-register-list').then((data) => {
                    //console.log(data)
                    this.createRegisters(data);
                    this._refreshRegisterValues();
                });
            }
            else {
                this._refreshRegisterValues();

            }
        }
    }

    public _refreshRegisterValues() {
        //console.log(this.registerMap);
        debug.activeDebugSession.customRequest('read-registers').then((data) => {
            data.forEach((reg) => {
                const index = parseInt(reg.number, 10);
                const regNode = this.registerMap[index];
                if (regNode) { regNode.setValue((reg.value)); }
            });
            this._onDidChangeTreeData.fire();
        });
    }

    public getTreeItem(element: BaseNode): TreeItem | Promise<TreeItem> {
        return element.getTreeItem();
    }

    public createRegisters(regInfo: string[]) {
        this.registerMap = {};
        this.registers = [];
        
        regInfo.forEach((reg, idx) => {
            if (reg) {
                if( reg.toUpperCase() === 'R0' || 
                    reg.toUpperCase() === 'R1' || 
                    reg.toUpperCase() === 'R2' || 
                    reg.toUpperCase() === 'R3' || 
                    reg.toUpperCase() === 'R4' || 
                    reg.toUpperCase() === 'R5' || 
                    reg.toUpperCase() === 'R6' || 
                    reg.toUpperCase() === 'R7' || 
                    reg.toUpperCase() === 'R8' || 
                    reg.toUpperCase() === 'R9' || 
                    reg.toUpperCase() === 'R10' || 
                    reg.toUpperCase() === 'R11' || 
                    reg.toUpperCase() ===  'R12' ||
                    reg.toUpperCase() ===  'PC' ||
                    reg.toUpperCase() ===  'LR' ||
                    reg.toUpperCase() ===  'SP' ||
                    reg.toUpperCase() === 'XPSR' ||
                    reg.toUpperCase() === 'CPSR')
                {
                    const rn = new RegisterNode(reg, idx);
                    this.registers.push(rn);
                    this.registerMap[idx] = rn;
                }
                
            }
        });

        this.loaded = true;

        workspace.findFiles('.vscode/.cortex-arm-learning.registers.state.json', null, 1).then((value) => {
            if (value.length > 0) {
                const fspath = value[0].fsPath;
                const data = fs.readFileSync(fspath, 'utf8');
                const settings = JSON.parse(data);
                
                settings.forEach((s: NodeSetting) => {
                    if (s.node.indexOf('.') === -1) {
                        const register = this.registers.find((r) => r.name === s.node);
                        if (register) {
                            if (s.expanded) { register.expanded = s.expanded; }
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

    public updateRegisterValues(values: RegisterValue[]) {
        values.forEach((reg) => {
            const node = this.registerMap[reg.number];
            node.setValue(reg.value);
        });

        this._onDidChangeTreeData.fire();
    }

    public getStackPointerValue()
    {
        if (this.loaded && this.registers.length > 0) {
            for(let i in this.registers)
            {
                if(this.registers[i].name === 'sp')
                {
                    return this.registers[i].getCurrentValue();
                }
            }
        }
    }

    public getChildren(element?: BaseNode): ProviderResult<BaseNode[]> {
        if (this.loaded && this.registers.length > 0) {
            return element ? element.getChildren() : this.registers;
        }
        else if (!this.loaded) {
            return (MessageNode["Not Active"]);
        }
        else {
            return [];
        }
    }

    public _saveState(fspath: string) {
        const state: NodeSetting[] = [];
        this.registers.forEach((r) => {
            state.push(...r._saveState());
        });

        fs.writeFileSync(fspath, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
    }

    public debugSessionTerminated() {
        if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
            const fspath = path.join(workspace.workspaceFolders[0].uri.fsPath, '.vscode', '.cortex-arm-learning.registers.state.json');
            this._saveState(fspath);
        }

        this.loaded = false;
        this.registers = [];
        this.registerMap = {};
        this._onDidChangeTreeData.fire();
    }

    public debugSessionStarted() {
        this.loaded = false;
        this.registers = [];
        this.registerMap = {};
        this._onDidChangeTreeData.fire();
    }

    public debugStopped() {
        this.refresh();
    }

    public debugContinued() {
        
    }
}
