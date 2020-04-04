"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basenode_1 = require("./basenode");
const addrranges_1 = require("../../addrranges");
const common_1 = require("../../../common");
const memreadutils_1 = require("../../memreadutils");
const utils_1 = require("../../utils");
const vscode = require("vscode");
class PeripheralNode extends basenode_1.PeripheralBaseNode {
    constructor(options) {
        super(null);
        this.name = options.name;
        this.baseAddress = options.baseAddress;
        this.totalLength = options.totalLength;
        this.description = options.description;
        this.groupName = options.groupName || '';
        this.resetValue = options.resetValue || 0;
        this.size = options.size || 32;
        this.children = [];
        this.addrRanges = [];
    }
    getPeripheral() {
        return this;
    }
    getTreeItem() {
        const label = `${this.name} @ ${utils_1.hexFormat(this.baseAddress)}`;
        const item = new vscode_1.TreeItem(label, this.expanded ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = 'peripheral';
        item.tooltip = this.description;
        return item;
    }
    getCopyValue() {
        throw new Error('Method not implemented.');
    }
    getChildren() {
        return this.children;
    }
    setChildren(children) {
        this.children = children;
        this.children.sort((c1, c2) => c1.offset > c2.offset ? 1 : -1);
    }
    addChild(child) {
        this.children.push(child);
        this.children.sort((c1, c2) => c1.offset > c2.offset ? 1 : -1);
    }
    getBytes(offset, size) {
        try {
            return new Uint8Array(this.currentValue.slice(offset, offset + size));
        }
        catch (e) {
            return new Uint8Array(0);
        }
    }
    getAddress(offset) {
        return this.baseAddress + offset;
    }
    getOffset(offset) {
        return offset;
    }
    getFormat() {
        return this.format;
    }
    updateData() {
        return new Promise((resolve, reject) => {
            if (!this.expanded) {
                resolve(false);
                return;
            }
            this.readMemory().then((unused) => {
                const promises = this.children.map((r) => r.updateData());
                Promise.all(promises).then((_) => {
                    resolve(true);
                }).catch((e) => {
                    const msg = e.message || 'unknown error';
                    const str = `Failed to update peripheral ${this.name}: ${msg}`;
                    if (vscode.debug.activeDebugConsole) {
                        vscode.debug.activeDebugConsole.appendLine(str);
                    }
                    reject(new Error(str));
                });
            }, (e) => {
                const msg = e.message || 'unknown error';
                const str = `Failed to update peripheral ${this.name}: ${msg}`;
                if (vscode.debug.activeDebugConsole) {
                    vscode.debug.activeDebugConsole.appendLine(str);
                }
                reject(new Error(str));
            });
        });
    }
    readMemory() {
        if (!this.currentValue) {
            this.currentValue = new Array(this.totalLength);
        }
        return memreadutils_1.MemReadUtils.readMemoryChunks(this.baseAddress, this.addrRanges, this.currentValue);
    }
    markAddresses() {
        let ranges = [new addrranges_1.AddrRange(this.baseAddress, this.totalLength)]; // Default range
        const skipAddressGaps = true;
        if (skipAddressGaps) {
            // Split the entire range into a set of smaller ranges. Some svd files specify
            // a very large address space but may use very little of it.
            const gapThreshold = 16; // Merge gaps less than this many bytes, avoid too many gdb requests
            const addresses = new addrranges_1.AddressRangesInUse(this.totalLength);
            this.children.map((child) => child.markAddresses(addresses));
            ranges = addresses.getAddressRangesOptimized(this.baseAddress, false, gapThreshold);
        }
        // OpenOCD has an issue where the max number of bytes readable are 8191 (instead of 8192)
        // which causes unaligned reads (via gdb) and silent failures. There is patch for this in OpenOCD
        // but in general, it is good to split the reads up. see http://openocd.zylin.com/#/c/5109/
        // Another benefit, we can minimize gdb timeouts
        const maxBytes = (4 * 1024); // Should be a multiple of 4 to be safe for MMIO reads
        this.addrRanges = addrranges_1.AddressRangesInUse.splitIntoChunks(ranges, maxBytes, this.name, this.totalLength);
    }
    getPeripheralNode() {
        return this;
    }
    selected() {
        return this.performUpdate();
    }
    saveState(path) {
        const results = [];
        if (this.format !== common_1.NumberFormat.Auto || this.expanded) {
            results.push({ node: `${this.name}`, expanded: this.expanded, format: this.format });
        }
        this.children.forEach((c) => {
            results.push(...c.saveState(`${this.name}`));
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
    performUpdate() {
        throw new Error('Method not implemented.');
    }
}
exports.PeripheralNode = PeripheralNode;
//# sourceMappingURL=peripheralnode.js.map