import { TreeItem, TreeDataProvider, EventEmitter, Event, TreeItemCollapsibleState, debug, workspace, ProviderResult} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
import { hexFormat } from '../utils';
import { NodeSetting } from '../../common';
import { StackNode, StackValue } from './nodes/stackNode';
import { MessageNode } from './nodes/messagenode';
import { BaseNode } from './nodes/basenode';

export class StackTreeProvider implements TreeDataProvider<BaseNode> {
    // tslint:disable-next-line:variable-name
    public _onDidChangeTreeData: EventEmitter<BaseNode | undefined> = new EventEmitter<BaseNode | undefined>();
    public readonly onDidChangeTreeData: Event<BaseNode | undefined> = this._onDidChangeTreeData.event;

    private stack: StackNode[];
    private stackMap: { [index: number]: StackNode };
    private loaded: boolean = false;
    private stackPointer;
    private initialSP;
    private previousSP;

    constructor() {
        this.stackPointer = 0;
        this.previousSP = 0;
        this.stack = [];
        this.stackMap = {};
        this.initialSP = 0x20020000;
    }

    private parseHexOrDecInt(str: string): number {
        return str.startsWith('0x') ? parseInt(str.substring(2), 16) : parseInt(str, 10);
    }

    private getStackPointer(){
        debug.activeDebugSession.customRequest('read-registers').then((data) => {
                    data.forEach((reg) => 
                    {
                        if(reg && reg.number == "13")
                        {
                            this.stackPointer = reg.value;
                        }
                    })
                });
    }

    private getStackValues(address, length){
        this.stack = [];

        vscode.debug.activeDebugSession.customRequest('read-memory', { address: address, length: length || 32 }).then((data) => {
            const bytes = data.bytes;

            var memoryAddress = '';
            var memoryValue = '';

            const address = this.parseHexOrDecInt(data.startAddress);
            let lineAddress = address - (address % 4);

            for (let i = 0; i < length; i+=4) {
                
                var spString = '';
                if(i == 0)
                    spString = 'SP-> ';
                else 
                    spString = '        ';
                    
                memoryAddress = spString+'0x'+hexFormat(lineAddress, 2, false);
                memoryAddress = memoryAddress.toUpperCase();               

                memoryValue = '0x'+bytes[i+3].toString(16)+bytes[i+2].toString(16)+bytes[i+1].toString(16)+bytes[i].toString(16);
                memoryValue = memoryValue.toUpperCase();

                this.stack.forEach((sn) => {
                    const memAdr = sn.getMemoryAddress();
                    const memVal = sn.getCurrentValue();
                    if(memAdr === memoryAddress){
                        sn.setValue(memVal)
                    }
                    else{
                    }
                });

                const sn = new StackNode(memoryAddress, memoryValue);
                this.stack.push(sn);
                lineAddress += 4;                
            }
            const sn = new StackNode('        0X20020000', '0x00000000');
            this.stack.push(sn);
            this._onDidChangeTreeData.fire();
        }, (error) => {
            const msg = error.message || '';
            vscode.window.showErrorMessage(`Invalid use of Stack. Stack is Full Descending Format. ${hexFormat(length, 8)}: ${msg} bytes is not valid memory within the stack.`);
        });
    }
   
    public refresh(): void {
        if (debug.activeDebugSession) {
            
            this.getStackPointer();
            var currentSP = this.stackPointer;
    
            if(currentSP == 0 || this.initialSP == currentSP)
            {
                if(!this.loaded)
                {
                    this.stack = [];
                    const sn = new StackNode('SP-> 0X20020000', '0x00000000');
                    this.stack.push(sn);
                    this.loaded = true;
                    this._onDidChangeTreeData.fire();
                }
                else
                    console.log('in')
            }
            else{
                this.stack = [];
                const length = (''+(this.initialSP - currentSP)).trim();
                var address = (''+currentSP).trim();
                const addrEnc = encodeURIComponent(`${address}`);
                
                this.getStackValues(addrEnc,length);
            }
        }
    }

    public getTreeItem(element: BaseNode): TreeItem | Promise<TreeItem> {
        return element.getTreeItem();
    }

    public updateStackValues(values: StackValue[]) {
        values.forEach((stack) => {
            const node = this.stackMap[stack.number];
            node.setValue(stack.value);
        });

        this._onDidChangeTreeData.fire();
    }

    public getChildren(element?: BaseNode): ProviderResult<BaseNode[]> {
        if (this.loaded && this.stack.length > 0) {
            return element ? element.getChildren() : this.stack;
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
        this.stack.forEach((r) => {
            state.push(...r._saveState());
        });

        fs.writeFileSync(fspath, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
    }

    public debugSessionTerminated() {
        if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
            const fspath = path.join(workspace.workspaceFolders[0].uri.fsPath, '.vscode', '.cortex-arm-learning.stack.state.json');
            this._saveState(fspath);
        }
        this.loaded = false;
        this.stackPointer = 0;
        this.stack = [];
        this.stackMap = {};
        this._onDidChangeTreeData.fire();
    }

    public debugSessionStarted() {
        this.loaded = false;
        this.stack = [];
        this.stackMap = {};
        this._onDidChangeTreeData.fire();
    }

    public debugStopped() {
        this.refresh();
    }

    public debugContinued() {
        
    }
}
