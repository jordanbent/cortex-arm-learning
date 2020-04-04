import { TreeItem, TreeItemCollapsibleState } from 'vscode';

import { BaseNode } from './basenode';
import { FieldNode } from './fieldnode';
import { NodeSetting } from '../../../common';

export interface StackValue {
    number: number;
    value: string;
}

export class StackNode extends BaseNode {
    private fields: FieldNode[];
    private memoryAddress: string;
    private memoryValue: string; 
    

    constructor(public address: string, public value: string) {
        super(null);
        this.memoryAddress = address;
        this.memoryValue = value;
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {

        const state = this.fields && this.fields.length > 0 ?
            (this.expanded ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed)
            : TreeItemCollapsibleState.None;
        
        const item = new TreeItem(this.memoryAddress, state);
        item.description = this.memoryValue;
        item.contextValue = 'stack node';

        return item;
    }

    public getChildren(): FieldNode[] {
        return this.fields;
    }

    public setValue(newValue: string) {
        this.memoryValue = newValue;
        this.value = newValue;
    }

    public getCopyValue(): string {
        return this.memoryAddress;
    }

    public getCurrentValue(): string {
        return this.memoryValue;
    }

    public getMemoryAddress(): string {
        return this.memoryAddress;
    }

    public setAddress(newAddr: string){
        this.memoryAddress = newAddr;
    }

    public _saveState(): NodeSetting[] {
        const settings: NodeSetting[] = [];
        if (this.fields && this.fields.length > 0 && this.expanded) {
            settings.push({ node: this.memoryAddress, expanded: this.expanded });
        }
        return settings;
    }
}
