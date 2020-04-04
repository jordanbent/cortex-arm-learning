"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../common");
class BaseNode {
    constructor(parent) {
        this.parent = parent;
        this.expanded = false;
    }
    getParent() {
        return this.parent;
    }
    getCommand() {
        return undefined;
    }
}
exports.BaseNode = BaseNode;
class PeripheralBaseNode extends BaseNode {
    constructor(parent) {
        super(parent);
        this.parent = parent;
        this.format = common_1.NumberFormat.Auto;
    }
    selected() {
        return Promise.resolve(false);
    }
}
exports.PeripheralBaseNode = PeripheralBaseNode;
//# sourceMappingURL=basenode.js.map