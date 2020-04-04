import { BaseNode } from './basenode';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { RegisterNode } from './registernode';

export class FieldNode extends BaseNode {
    constructor(public name: string, private offset: number, private size: number, private register: RegisterNode) {
        super(register);
    }

    public getChildren(): BaseNode[] | Promise<BaseNode[]> {
        return [];  
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {

        const ti = new TreeItem(this.name, TreeItemCollapsibleState.None);
        const value = this.register.extractBits(this.offset, this.size);

        if(this.name === 'Binary')
        {
            ti.description =  this.register.hex2bin(value.toString());
        }
        else if(this.name === 'Decimal')
        {
            ti.description = this.register.hex2Dec(value.toString());
        }
        else if(this.name === 'Ascii')
        {
            ti.description = this.register.hex2Acsii(value.toString());
        }
        else
        {
            ti.description = value.toString();
        }

        ti.contextValue = 'field';
        
        return ti;
    }

    public getCopyValue(): string | undefined {
        const value = this.register.extractBits(this.offset, this.size);
        if(this.name === 'Binary')
        {
            return  this.register.hex2bin(value.toString());
        }
        else if(this.name === 'Decimal')
        {
            return this.register.hex2Dec(value.toString());
        }
        else if(this.name === 'Ascii')
        {
            return this.register.hex2Acsii(value.toString());
        }
        else
        {
            return value.toString();
        }
    }
}
