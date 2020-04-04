"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basenode_1 = require("./basenode");
const vscode_1 = require("vscode");
class FieldNode extends basenode_1.BaseNode {
    constructor(name, offset, size, register) {
        super(register);
        this.name = name;
        this.offset = offset;
        this.size = size;
        this.register = register;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        const ti = new vscode_1.TreeItem(this.name, vscode_1.TreeItemCollapsibleState.None);
        const value = this.register.extractBits(this.offset, this.size);
        console.log(value);
        ti.description = value.toString();
        ti.contextValue = 'field';
        return ti;
    }
    getCopyValue() {
        const value = this.register.extractBits(this.offset, this.size);
        return value.toString();
    }
}
exports.FieldNode = FieldNode;
//# sourceMappingURL=fieldnode.js.map