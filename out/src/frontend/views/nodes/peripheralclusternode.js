"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basenode_1 = require("./basenode");
const svd_1 = require("../../svd");
const common_1 = require("../../../common");
const utils_1 = require("../../utils");
class PeripheralClusterNode extends basenode_1.PeripheralBaseNode {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;
        this.name = options.name;
        this.description = options.description;
        this.offset = options.addressOffset;
        this.accessType = options.accessType || svd_1.AccessType.ReadWrite;
        this.size = options.size || parent.size;
        this.resetValue = options.resetValue || parent.resetValue;
        this.children = [];
        this.parent.addChild(this);
    }
    getTreeItem() {
        const label = `${this.name} [${utils_1.hexFormat(this.offset, 0)}]`;
        const item = new vscode_1.TreeItem(label, this.expanded ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = 'cluster';
        item.tooltip = this.description;
        return item;
    }
    getChildren() {
        return this.children;
    }
    setChildren(children) {
        this.children = children.slice(0, children.length);
        this.children.sort((r1, r2) => r1.offset > r2.offset ? 1 : -1);
    }
    addChild(child) {
        this.children.push(child);
        this.children.sort((r1, r2) => r1.offset > r2.offset ? 1 : -1);
    }
    getBytes(offset, size) {
        return this.parent.getBytes(this.offset + offset, size);
    }
    getAddress(offset) {
        return this.parent.getAddress(this.offset + offset);
    }
    getOffset(offset) {
        return this.parent.getOffset(this.offset + offset);
    }
    getFormat() {
        if (this.format !== common_1.NumberFormat.Auto) {
            return this.format;
        }
        else {
            return this.parent.getFormat();
        }
    }
    updateData() {
        return new Promise((resolve, reject) => {
            const promises = this.children.map((r) => r.updateData());
            Promise.all(promises).then((updated) => {
                resolve(true);
            }).catch((e) => {
                reject('Failed');
            });
        });
    }
    saveState(path) {
        const results = [];
        if (this.format !== common_1.NumberFormat.Auto || this.expanded) {
            results.push({ node: `${path}.${this.name}`, expanded: this.expanded, format: this.format });
        }
        this.children.forEach((c) => {
            results.push(...c.saveState(`${path}.${this.name}`));
        });
        return results;
    }
    findByPath(path) {
        if (path.length === 0) {
            return this;
        }
        else {
            const child = this.children.find((c) => c.name === path[0]);
            if (child) {
                return child.findByPath(path.slice(1));
            }
            else {
                return null;
            }
        }
    }
    markAddresses(addrs) {
        this.children.map((r) => { r.markAddresses(addrs); });
    }
    getPeripheral() {
        return this.parent.getPeripheral();
    }
    getCopyValue() {
        throw new Error('Method not implemented.');
    }
    performUpdate() {
        throw new Error('Method not implemented.');
    }
}
exports.PeripheralClusterNode = PeripheralClusterNode;
//# sourceMappingURL=peripheralclusternode.js.map