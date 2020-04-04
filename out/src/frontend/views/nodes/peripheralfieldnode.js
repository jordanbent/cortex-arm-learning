"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basenode_1 = require("./basenode");
const svd_1 = require("../../svd");
const common_1 = require("../../../common");
const utils_1 = require("../../utils");
class EnumeratedValue {
    constructor(name, description, value) {
        this.name = name;
        this.description = description;
        this.value = value;
    }
}
exports.EnumeratedValue = EnumeratedValue;
class PeripheralFieldNode extends basenode_1.PeripheralBaseNode {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;
        this.name = options.name;
        this.description = options.description;
        this.offset = options.offset;
        this.width = options.width;
        if (!options.accessType) {
            this.accessType = parent.accessType;
        }
        else {
            if (parent.accessType === svd_1.AccessType.ReadOnly && options.accessType !== svd_1.AccessType.ReadOnly) {
                this.accessType = svd_1.AccessType.ReadOnly;
            }
            else if (parent.accessType === svd_1.AccessType.WriteOnly && options.accessType !== svd_1.AccessType.WriteOnly) {
                this.accessType = svd_1.AccessType.WriteOnly;
            }
            else {
                this.accessType = options.accessType;
            }
        }
        if (options.enumeration) {
            this.enumeration = options.enumeration;
            this.enumerationMap = {};
            this.enumerationValues = [];
            // tslint:disable-next-line:forin
            for (const key in options.enumeration) {
                const val = key;
                const name = options.enumeration[key].name;
                this.enumerationValues.push(name);
                this.enumerationMap[name] = key;
            }
        }
        this.parent.addChild(this);
    }
    getTreeItem() {
        const value = this.parent.extractBits(this.offset, this.width);
        const rangestart = this.offset;
        const rangeend = this.offset + this.width - 1;
        const label = `${this.name} [${rangeend}:${rangestart}]`;
        const context = this.name.toLowerCase() === 'reserved' ? 'field-res' : (this.parent.accessType === svd_1.AccessType.ReadOnly ? 'field-ro' : 'field');
        const item = new vscode_1.TreeItem(label, vscode_1.TreeItemCollapsibleState.None);
        item.contextValue = context;
        item.tooltip = this.description;
        if (this.name.toLowerCase() !== 'reserved') {
            if (this.accessType === svd_1.AccessType.WriteOnly) {
                item.description = '<Write Only>';
            }
            else {
                let formatted = '';
                switch (this.getFormat()) {
                    case common_1.NumberFormat.Decimal:
                        formatted = value.toString();
                        break;
                    case common_1.NumberFormat.Binary:
                        formatted = utils_1.binaryFormat(value, this.width);
                        break;
                    case common_1.NumberFormat.Hexidecimal:
                        formatted = utils_1.hexFormat(value, Math.ceil(this.width / 4), true);
                        break;
                    default:
                        formatted = this.width >= 4 ? utils_1.hexFormat(value, Math.ceil(this.width / 4), true) : utils_1.binaryFormat(value, this.width);
                        break;
                }
                if (this.enumeration && this.enumeration[value]) {
                    item.description = `${this.enumeration[value].name} (${formatted})`;
                }
                else {
                    item.description = formatted;
                }
            }
        }
        return item;
    }
    getChildren() {
        return [];
    }
    performUpdate() {
        return new Promise((resolve, reject) => {
            if (this.enumeration) {
                vscode_1.window.showQuickPick(this.enumerationValues).then((val) => {
                    if (val === undefined) {
                        return reject('Input not selected');
                    }
                    const numval = this.enumerationMap[val];
                    this.parent.updateBits(this.offset, this.width, numval).then(resolve, reject);
                });
            }
            else {
                vscode_1.window.showInputBox({ prompt: 'Enter new value: (prefix hex with 0x, binary with 0b)', value: this.getCopyValue() }).then((val) => {
                    const numval = utils_1.parseInteger(val);
                    if (numval === undefined) {
                        return reject('Unable to parse input value.');
                    }
                    this.parent.updateBits(this.offset, this.width, numval).then(resolve, reject);
                });
            }
        });
    }
    getCopyValue() {
        const value = this.parent.extractBits(this.offset, this.width);
        switch (this.getFormat()) {
            case common_1.NumberFormat.Decimal:
                return value.toString();
            case common_1.NumberFormat.Binary:
                return utils_1.binaryFormat(value, this.width);
            case common_1.NumberFormat.Hexidecimal:
                return utils_1.hexFormat(value, Math.ceil(this.width / 4), true);
            default:
                return this.width >= 4 ? utils_1.hexFormat(value, Math.ceil(this.width / 4), true) : utils_1.binaryFormat(value, this.width);
        }
    }
    updateData() {
        return Promise.resolve(true);
    }
    getFormat() {
        if (this.format !== common_1.NumberFormat.Auto) {
            return this.format;
        }
        else {
            return this.parent.getFormat();
        }
    }
    saveState(path) {
        if (this.format !== common_1.NumberFormat.Auto) {
            return [{ node: `${path}.${this.name}`, format: this.format }];
        }
        else {
            return [];
        }
    }
    findByPath(path) {
        if (path.length === 0) {
            return this;
        }
        else {
            return null;
        }
    }
    getPeripheral() {
        return this.parent.getPeripheral();
    }
    markAddresses(a) {
        throw new Error('Method not implemented.');
    }
}
exports.PeripheralFieldNode = PeripheralFieldNode;
//# sourceMappingURL=peripheralfieldnode.js.map