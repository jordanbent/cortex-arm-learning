import { BaseNode } from './basenode';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { CounterNode } from './counternode';

export class CounterFieldNode extends BaseNode {

    constructor(public decription: string, private counter: CounterNode) {
        super(counter);
    }

    public getChildren(): BaseNode[] | Promise<BaseNode[]> {
        return [];  
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {

        const ti = new TreeItem(this.decription, TreeItemCollapsibleState.None);
        const value = this.decription;
        ti.contextValue = 'field';
        console.log('counter field',ti)
        return ti;
    }

    public getCopyValue(): string | undefined {
        const value = this.decription;
        return value.toString();
        }
}
