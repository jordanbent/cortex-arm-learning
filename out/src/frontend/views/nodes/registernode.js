"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basenode_1 = require("./basenode");
const fieldnode_1 = require("./fieldnode");
const utils_1 = require("../../utils");
class RegisterNode extends basenode_1.BaseNode {
    constructor(name, index) {
        super(null);
        this.name = name;
        this.index = index;
        this.name = this.name;
        if (name.toUpperCase() === 'XPSR' || name.toUpperCase() === 'CPSR') {
            this.fields = [
                new fieldnode_1.FieldNode('Negative Flag (N)', 31, 1, this),
                new fieldnode_1.FieldNode('Zero Flag (Z)', 30, 1, this),
                new fieldnode_1.FieldNode('Carry or borrow flag (C)', 29, 1, this),
                new fieldnode_1.FieldNode('Overflow Flag (V)', 28, 1, this),
                new fieldnode_1.FieldNode('Saturation Flag (Q)', 27, 1, this),
                new fieldnode_1.FieldNode('GE', 16, 4, this),
                new fieldnode_1.FieldNode('Interrupt Number', 0, 8, this),
                new fieldnode_1.FieldNode('ICI/IT', 25, 2, this),
                new fieldnode_1.FieldNode('ICI/IT', 10, 6, this),
                new fieldnode_1.FieldNode('Thumb State (T)', 24, 1, this)
            ];
        }
        else if (name.toUpperCase() === 'CONTROL') {
            this.fields = [
                new fieldnode_1.FieldNode('FPCA', 2, 1, this),
                new fieldnode_1.FieldNode('SPSEL', 1, 1, this),
                new fieldnode_1.FieldNode('nPRIV', 0, 1, this)
            ];
        }
        this.currentValue = 0x00;
        this.currentNaturalValue = '0x00000000';
    }
    extractBits(offset, width) {
        return utils_1.extractBits(this.currentValue, offset, width);
    }
    getTreeItem() {
        const state = this.fields && this.fields.length > 0 ?
            (this.expanded ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed)
            : vscode_1.TreeItemCollapsibleState.None;
        const item = new vscode_1.TreeItem(this.name, state);
        item.description = this.currentNaturalValue;
        item.contextValue = 'register';
        return item;
    }
    getChildren() {
        return this.fields;
    }
    setValue(newValue) {
        this.currentNaturalValue = newValue;
        if (this.name.toUpperCase() === 'CONTROL' || this.name.toUpperCase() === 'XPSR' || this.name.toUpperCase() === 'CPSR') {
            const base = this.currentNaturalValue.startsWith('0x') ? 16 : 10;
            this.currentValue = parseInt(this.currentNaturalValue, base);
            let cv = this.currentValue.toString(16);
            while (cv.length < 8) {
                cv = '0' + cv;
            }
            this.currentNaturalValue = '0x' + cv;
        }
    }
    getCopyValue() {
        return this.currentNaturalValue;
    }
    _saveState() {
        const settings = [];
        if (this.fields && this.fields.length > 0 && this.expanded) {
            settings.push({ node: this.name, expanded: this.expanded });
        }
        return settings;
    }
}
exports.RegisterNode = RegisterNode;
//# sourceMappingURL=registernode.js.map