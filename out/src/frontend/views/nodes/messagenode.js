"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basenode_1 = require("./basenode");
const vscode_1 = require("vscode");
class MessageNode extends basenode_1.PeripheralBaseNode {
    constructor(message, tooltip) {
        super(null);
        this.message = message;
        this.tooltip = tooltip;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        const ti = new vscode_1.TreeItem(this.message, vscode_1.TreeItemCollapsibleState.None);
        ti.tooltip = this.tooltip;
        return ti;
    }
    getCopyValue() {
        return null;
    }
    performUpdate() {
        return Promise.resolve(false);
    }
    updateData() {
        return Promise.resolve(false);
    }
    getPeripheral() {
        return null;
    }
    markAddresses(a) {
    }
    saveState(path) {
        return [];
    }
    findByPath(path) {
        return null;
    }
}
exports.MessageNode = MessageNode;
//# sourceMappingURL=messagenode.js.map