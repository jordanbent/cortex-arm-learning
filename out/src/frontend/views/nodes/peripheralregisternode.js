"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basenode_1 = require("./basenode");
const svd_1 = require("../../svd");
const utils_1 = require("../../utils");
const common_1 = require("../../../common");
class PeripheralRegisterNode extends basenode_1.PeripheralBaseNode {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;
        this.name = options.name;
        this.description = options.description;
        this.offset = options.addressOffset;
        this.accessType = options.accessType || parent.accessType;
        this.size = options.size || parent.size;
        this.resetValue = options.resetValue !== undefined ? options.resetValue : parent.resetValue;
        this.currentValue = this.resetValue;
        this.hexLength = Math.ceil(this.size / 4);
        this.maxValue = Math.pow(2, this.size);
        this.binaryRegex = new RegExp(`^0b[01]{1,${this.size}}$`, 'i');
        this.hexRegex = new RegExp(`^0x[0-9a-f]{1,${this.hexLength}}$`, 'i');
        this.children = [];
        this.parent.addChild(this);
    }
    reset() {
        this.currentValue = this.resetValue;
    }
    extractBits(offset, width) {
        return utils_1.extractBits(this.currentValue, offset, width);
    }
    updateBits(offset, width, value) {
        return new Promise((resolve, reject) => {
            const limit = Math.pow(2, width);
            if (value > limit) {
                return reject(`Value entered is invalid. Maximum value for this field is ${limit - 1} (${utils_1.hexFormat(limit - 1, 0)})`);
            }
            else {
                const mask = utils_1.createMask(offset, width);
                const sv = value << offset;
                const newval = (this.currentValue & ~mask) | sv;
                this.updateValueInternal(newval).then(resolve, reject);
            }
        });
    }
    getTreeItem() {
        const label = `${this.name} @ ${utils_1.hexFormat(this.offset, 0)}`;
        const collapseState = this.children && this.children.length > 0
            ? (this.expanded ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed)
            : vscode_1.TreeItemCollapsibleState.None;
        const item = new vscode_1.TreeItem(label, collapseState);
        item.contextValue = this.accessType === svd_1.AccessType.ReadWrite ? 'registerRW' : (this.accessType === svd_1.AccessType.ReadOnly ? 'registerRO' : 'registerWO');
        item.tooltip = this.description;
        if (this.accessType === svd_1.AccessType.WriteOnly) {
            item.description = '<Write Only>';
        }
        else {
            switch (this.getFormat()) {
                case common_1.NumberFormat.Decimal:
                    item.description = this.currentValue.toString();
                    break;
                case common_1.NumberFormat.Binary:
                    item.description = utils_1.binaryFormat(this.currentValue, this.hexLength * 4, false, true);
                    break;
                default:
                    item.description = utils_1.hexFormat(this.currentValue, this.hexLength);
                    break;
            }
        }
        return item;
    }
    getChildren() {
        return this.children || [];
    }
    setChildren(children) {
        this.children = children.slice(0, children.length);
        this.children.sort((f1, f2) => f1.offset > f2.offset ? 1 : -1);
    }
    addChild(child) {
        this.children.push(child);
        this.children.sort((f1, f2) => f1.offset > f2.offset ? 1 : -1);
    }
    getFormat() {
        if (this.format !== common_1.NumberFormat.Auto) {
            return this.format;
        }
        else {
            return this.parent.getFormat();
        }
    }
    getCopyValue() {
        switch (this.getFormat()) {
            case common_1.NumberFormat.Decimal:
                return this.currentValue.toString();
            case common_1.NumberFormat.Binary:
                return utils_1.binaryFormat(this.currentValue, this.hexLength * 4);
            default:
                return utils_1.hexFormat(this.currentValue, this.hexLength);
        }
    }
    performUpdate() {
        return new Promise((resolve, reject) => {
            vscode_1.window.showInputBox({ prompt: 'Enter new value: (prefix hex with 0x, binary with 0b)', value: this.getCopyValue() }).then((val) => {
                let numval;
                if (val.match(this.hexRegex)) {
                    numval = parseInt(val.substr(2), 16);
                }
                else if (val.match(this.binaryRegex)) {
                    numval = parseInt(val.substr(2), 2);
                }
                else if (val.match(/^[0-9]+/)) {
                    numval = parseInt(val, 10);
                    if (numval >= this.maxValue) {
                        return reject(`Value entered (${numval}) is greater than the maximum value of ${this.maxValue}`);
                    }
                }
                else {
                    return reject('Value entered is not a valid format.');
                }
                this.updateValueInternal(numval).then(resolve, reject);
            });
        });
    }
    updateValueInternal(value) {
        const address = this.parent.getAddress(this.offset);
        const bytes = [];
        const numbytes = this.size / 8;
        for (let i = 0; i < numbytes; i++) {
            const byte = value & 0xFF;
            value = value >>> 8;
            let bs = byte.toString(16);
            if (bs.length === 1) {
                bs = '0' + bs;
            }
            bytes[i] = bs;
        }
        return new Promise((resolve, reject) => {
            vscode_1.debug.activeDebugSession.customRequest('write-memory', { address: address, data: bytes.join('') }).then((result) => {
                this.parent.updateData().then(() => { }, () => { });
                resolve(true);
            }, reject);
        });
    }
    updateData() {
        const bc = this.size / 8;
        const bytes = this.parent.getBytes(this.offset, bc);
        const buffer = Buffer.from(bytes);
        switch (bc) {
            case 1:
                this.currentValue = buffer.readUInt8(0);
                break;
            case 2:
                this.currentValue = buffer.readUInt16LE(0);
                break;
            case 4:
                this.currentValue = buffer.readUInt32LE(0);
                break;
            default:
                vscode_1.window.showErrorMessage(`Register ${this.name} has invalid size: ${this.size}. Should be 8, 16 or 32.`);
                break;
        }
        this.children.forEach((f) => f.updateData());
        return Promise.resolve(true);
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
        else if (path.length === 1) {
            const child = this.children.find((c) => c.name === path[0]);
            return child;
        }
        else {
            return null;
        }
    }
    getPeripheral() {
        return this.parent.getPeripheral();
    }
    markAddresses(addrs) {
        const finalOffset = this.parent.getOffset(this.offset);
        addrs.setAddrRange(finalOffset, this.size / 8);
    }
}
exports.PeripheralRegisterNode = PeripheralRegisterNode;
//# sourceMappingURL=peripheralregisternode.js.map