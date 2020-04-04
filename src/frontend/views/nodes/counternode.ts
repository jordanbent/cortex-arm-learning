import { TreeItem, TreeItemCollapsibleState } from 'vscode';

import { BaseNode } from './basenode';
import { FieldNode } from './fieldnode';
import { NodeSetting } from '../../../common';

export interface CounterValue {
    number: number;
    value: string;
}

export class CounterNode extends BaseNode {
    private fields: FieldNode[];
    private name: string;
    private currentCount: string; 
    

    constructor(public count: string) {
        super(null);
        this.name = 'Performance Counter: '
        this.currentCount = count;
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {

        const state = this.fields && this.fields.length > 0 ?
            (this.expanded ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed)
            : TreeItemCollapsibleState.None;
        
        const item = new TreeItem(this.name, state);
        item.description = this.currentCount;
        item.contextValue = 'counter node';
        return item;
    }

    public getChildren(): FieldNode[] {
        return this.fields;
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
