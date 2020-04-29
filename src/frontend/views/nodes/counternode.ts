import { TreeItem, TreeItemCollapsibleState} from 'vscode';

import { BaseNode } from './basenode';
import { FieldNode } from './fieldnode';
import { CounterFieldNode } from './counterfieldnode';
import { NodeSetting } from '../../../common';

export interface CounterValue {
    number: number;
    value: string;
}

export class CounterNode extends BaseNode {
    private fields: FieldNode[];
    private cfields: CounterFieldNode[];
    private name: string;
    private currentCount: string; 
    

    constructor(public nam: string, public count: string, public description:string) {
        super(null);
        this.name = nam
        this.currentCount = count;

        if(this.name === 'CPI Counter:'||
            this.name === 'EXE Counter:'||
            this.name === 'Sleep Counter:'||
            this.name === 'LSU Counter:'||
            this.name === 'Fold Counter:')
            {
                this.cfields = [new CounterFieldNode(description, this)];
            }
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {

        const state = this.cfields && this.cfields.length > 0 ?
            (this.expanded ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed)
            : TreeItemCollapsibleState.None;
        
        const item = new TreeItem(this.name, state);
        item.description = this.currentCount;
        item.contextValue = 'counter node';
        return item;
    }

    public getChildren(): CounterFieldNode[] {
        return this.cfields;
    }

    public setCount(newValue: string) {
        this.currentCount = newValue;
    }

    public getCopyValue(): string {
        return this.currentCount;
    }

    public _saveState(): NodeSetting[] {
        const settings: NodeSetting[] = [];
        if (this.fields && this.fields.length > 0 && this.expanded) {
            settings.push({ node: this.name, expanded: this.expanded });
        }
        return settings;
    }
}

