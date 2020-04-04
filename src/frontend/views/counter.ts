import { TreeItem, TreeDataProvider, EventEmitter, Event, TreeItemCollapsibleState, debug, workspace, ProviderResult} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
import { hexFormat } from '../utils';
import { NodeSetting } from '../../common';
import { CounterNode } from './nodes/counternode';
import { MessageNode } from './nodes/messagenode';
import { BaseNode } from './nodes/basenode';

export class CounterTreeProvider implements TreeDataProvider<BaseNode> {
    // tslint:disable-next-line:variable-name
    public _onDidChangeTreeData: EventEmitter<BaseNode | undefined> = new EventEmitter<BaseNode | undefined>();
    public readonly onDidChangeTreeData: Event<BaseNode | undefined> = this._onDidChangeTreeData.event;

    private counter: CounterNode[];
    private countNum: string;
    private loaded : boolean = false;

    //Obtaining memory from 0xE0001004 to 0xE0001018 word-wise
    private CYCCNT = 0xE0001004;
    private CPICNT = 0xE0001008;
    private EXCCNT = 0xE000100C;
    private SLEEPCNT = 0xE0001010;
    private LSUCNT = 0xE0001014;
    private FOLDCNT = 0xE0001018;

    constructor() {
        this.counter = [];
        this.countNum = '';
    }

    public performanceCounter(): void {

        const length: number = this.FOLDCNT - this.CYCCNT + 4;

        let addressString = (''+this.CYCCNT).trim();
        const addressExpr = encodeURIComponent(`${addressString}`);  
        var counts = [];

        vscode.debug.activeDebugSession.customRequest('read-memory', { address: addressExpr, length: length || 32 }).then((data) => {
            const bytes = data.bytes;
            for (let i = 0; i < length; i+=4) {
                var str = '0x'+bytes[i+3].toString(16)+bytes[i+2].toString(16)+bytes[i+1].toString(16)+bytes[i].toString(16);
                counts.push(str);
            }
            
            //COST COUNTERS

            //DWT_FOLDCNT - cycles saved by instructions which execute in zero cycles
            //DWT_FOLDCNT  = 0xE0001018
            var foldcnt = parseInt(counts.pop(), 16);
    
            //DWT_LSUCNT - cycles spent waiting for loads and stores to complete
            //DWT_LSUCNT   = 0xE0001014
            var lsucnt = parseInt(counts.pop(), 16);

            //DWT_SLEEPCNT - cycles spent sleeping
            //DWT_SLEEPCNT = 0xE0001010
            var sleepcnt = parseInt(counts.pop(), 16);

             //DWT_EXCCNT - cycles spent performing exception entry and exit procedures
            //DWT_EXCCNT   = 0xE000100C
            var exccnt = parseInt(counts.pop(), 16);

            //DWT_CPICNT - additional cycles required to execute multi-cycle instructions and instruction fetch stalls
            //DWT_CPICNT   = 0xE0001008
            var cpicnt = parseInt(counts.pop(), 16);

            //DWT_CYCCNT - cycle counter 
            //DWT_CYCCNT   = 0xE0001004
            var cyccnt = parseInt(counts.pop(), 16);

            //instructions = CYCCNT - CPICNT - EXCCNT - SLEEPCNT - LSUCNT + FOLDCNT 
            var totalCost = cyccnt - cpicnt - exccnt - sleepcnt - lsucnt + foldcnt;
            this.countNum = ''+totalCost;

        }, (error) => {
            const msg = error.message || '';
            vscode.window.showErrorMessage(`Unable to read memory from ${addressExpr}}: ${msg}`);
        });
    }

    public updateCounter(){
        this.performanceCounter();

        this.counter.forEach((node) => {
            node.setCount(this.countNum)
        })
        
        this._onDidChangeTreeData.fire();
    }
   
    public refresh(): void {
        if (debug.activeDebugSession) {
            if (!this.loaded) {
                const count = new CounterNode(this.countNum);
                this.counter.push(count);
                this.loaded = true;
                this._onDidChangeTreeData.fire();
            }
            else {
                this.updateCounter();              
            }
        }
          
    }

    public getTreeItem(element: BaseNode): TreeItem | Promise<TreeItem> {
        return element.getTreeItem();
    }


    public getChildren(element?: BaseNode): ProviderResult<BaseNode[]> {
        if (this.loaded && this.counter.length > 0) {
            return element ? element.getChildren() : this.counter;
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
        this.counter.forEach((r) => {
            state.push(...r._saveState());
        });

        fs.writeFileSync(fspath, JSON.stringify(state), { encoding: 'utf8', flag: 'w' });
    }

    public debugSessionTerminated() {
        if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
            const fspath = path.join(workspace.workspaceFolders[0].uri.fsPath, '.vscode', '.cortex-arm-learning.counter.state.json');
            this._saveState(fspath);
        }
        this.loaded = false;
        this.counter = [];
        this.countNum = '';
        this._onDidChangeTreeData.fire();
    }

    public debugSessionStarted() {
        this.loaded = false;
        this.counter = [];
        this.countNum = '';
        this._onDidChangeTreeData.fire();
    }

    public debugStopped() {
        this.refresh();
    }

    public debugContinued() {
        
    }
}
