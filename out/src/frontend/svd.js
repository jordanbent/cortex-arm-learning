"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const peripheralregisternode_1 = require("./views/nodes/peripheralregisternode");
const peripheralclusternode_1 = require("./views/nodes/peripheralclusternode");
const peripheralnode_1 = require("./views/nodes/peripheralnode");
const utils_1 = require("./utils");
const peripheralfieldnode_1 = require("./views/nodes/peripheralfieldnode");
const xml2js = require("xml2js");
const fs = require("fs");
var AccessType;
(function (AccessType) {
    AccessType[AccessType["ReadOnly"] = 1] = "ReadOnly";
    AccessType[AccessType["ReadWrite"] = 2] = "ReadWrite";
    AccessType[AccessType["WriteOnly"] = 3] = "WriteOnly";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
const ACCESS_TYPE_MAP = {
    'read-only': AccessType.ReadOnly,
    'write-only': AccessType.WriteOnly,
    'read-write': AccessType.ReadWrite,
    'writeOnce': AccessType.WriteOnly,
    'read-writeOnce': AccessType.ReadWrite
};
class SVDParser {
    static parseSVD(path) {
        SVDParser.enumTypeValuesMap = {};
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                xml2js.parseString(data, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const peripheralMap = {};
                    const defaultOptions = {
                        accessType: AccessType.ReadWrite,
                        size: 32,
                        resetValue: 0x0
                    };
                    if (result.device.resetValue) {
                        defaultOptions.resetValue = utils_1.parseInteger(result.device.resetValue[0]);
                    }
                    if (result.device.size) {
                        defaultOptions.size = utils_1.parseInteger(result.device.size[0]);
                    }
                    if (result.device.access) {
                        defaultOptions.accessType = ACCESS_TYPE_MAP[result.device.access[0]];
                    }
                    result.device.peripherals[0].peripheral.forEach((element) => {
                        const name = element.name[0];
                        peripheralMap[name] = element;
                    });
                    // tslint:disable-next-line:forin
                    for (const key in peripheralMap) {
                        const element = peripheralMap[key];
                        if (element.$ && element.$.derivedFrom) {
                            const base = peripheralMap[element.$.derivedFrom];
                            peripheralMap[key] = Object.assign({}, base, element);
                        }
                    }
                    const peripherials = [];
                    // tslint:disable-next-line:forin
                    for (const key in peripheralMap) {
                        peripherials.push(SVDParser.parsePeripheral(peripheralMap[key], defaultOptions));
                    }
                    peripherials.sort((p1, p2) => {
                        if (p1.groupName > p2.groupName) {
                            return 1;
                        }
                        else if (p1.groupName < p2.groupName) {
                            return -1;
                        }
                        else {
                            if (p1.name > p2.name) {
                                return 1;
                            }
                            else if (p1.name < p2.name) {
                                return -1;
                            }
                            else {
                                return 0;
                            }
                        }
                    });
                    for (const p of peripherials) {
                        p.markAddresses();
                    }
                    resolve(peripherials);
                });
            });
        });
    }
    static cleanupDescription(input) {
        return input.replace('\r', '').replace(/\n\s*/g, ' ');
    }
    static parseFields(fieldInfo, parent) {
        const fields = [];
        fieldInfo.map((f) => {
            let offset;
            let width;
            const description = this.cleanupDescription(f.description ? f.description[0] : '');
            if (f.bitOffset && f.bitWidth) {
                offset = utils_1.parseInteger(f.bitOffset[0]);
                width = utils_1.parseInteger(f.bitWidth[0]);
            }
            else if (f.bitRange) {
                let range = f.bitRange[0];
                range = range.substring(1, range.length - 1);
                range = range.split(':');
                const end = utils_1.parseInteger(range[0]);
                const start = utils_1.parseInteger(range[1]);
                width = end - start + 1;
                offset = start;
            }
            else if (f.msb && f.lsb) {
                const msb = utils_1.parseInteger(f.msb[0]);
                const lsb = utils_1.parseInteger(f.lsb[0]);
                width = msb - lsb + 1;
                offset = lsb;
            }
            else {
                // tslint:disable-next-line:max-line-length
                throw new Error(`Unable to parse SVD file: field ${f.name[0]} must have either bitOffset and bitWidth elements, bitRange Element, or msb and lsb elements.`);
            }
            let valueMap = null;
            if (f.enumeratedValues) {
                valueMap = {};
                const eValues = f.enumeratedValues[0];
                if (eValues.$ && eValues.$.derivedFrom) {
                    const found = SVDParser.enumTypeValuesMap[eValues.$.derivedFrom];
                    if (!found) {
                        throw new Error(`Invalid derivedFrom=${eValues.$.derivedFrom} for enumeratedValues of field ${f.name[0]}`);
                    }
                    valueMap = found;
                }
                else {
                    eValues.enumeratedValue.map((ev) => {
                        if (ev.value && ev.value.length > 0) {
                            const evname = ev.name[0];
                            const evdesc = this.cleanupDescription(ev.description ? ev.description[0] : '');
                            const val = ev.value[0].toLowerCase();
                            const evvalue = utils_1.parseInteger(val);
                            valueMap[evvalue] = new peripheralfieldnode_1.EnumeratedValue(evname, evdesc, evvalue);
                        }
                    });
                    // According to the SVD spec/schema, I am not sure any scope applies. Seems like everything is in a global name space
                    // No make sense but how I am interpreting it for now. Easy to make it scope based but then why allow referencing
                    // other peripherals. Global scope it is. Overrides dups from previous definitions!!!
                    if (eValues.name && eValues.name[0]) {
                        let evName = eValues.name[0];
                        for (const prefix of [null, f.name[0], parent.name, parent.parent.name]) {
                            evName = prefix ? prefix + '.' + evName : evName;
                            SVDParser.enumTypeValuesMap[evName] = valueMap;
                        }
                    }
                }
            }
            const baseOptions = {
                name: f.name[0],
                description: description,
                offset: offset,
                width: width,
                enumeration: valueMap
            };
            if (f.dim) {
                if (!f.dimIncrement) {
                    throw new Error(`Unable to parse SVD file: field ${f.name[0]} has dim element, with no dimIncrement element.`);
                }
                const count = utils_1.parseInteger(f.dim[0]);
                const increment = utils_1.parseInteger(f.dimIncrement[0]);
                let index = [];
                if (f.dimIndex) {
                    index = utils_1.parseDimIndex(f.dimIndex[0], count);
                }
                else {
                    for (let i = 0; i < count; i++) {
                        index.push(`${i}`);
                    }
                }
                const namebase = f.name[0];
                const offsetbase = offset;
                for (let i = 0; i < count; i++) {
                    const name = namebase.replace('%s', index[i]);
                    fields.push(new peripheralfieldnode_1.PeripheralFieldNode(parent, Object.assign({}, baseOptions, { name: name, offset: offsetbase + (increment * i) })));
                }
            }
            else {
                fields.push(new peripheralfieldnode_1.PeripheralFieldNode(parent, Object.assign({}, baseOptions)));
            }
        });
        return fields;
    }
    static parseRegisters(regInfo, parent) {
        const registers = [];
        regInfo.forEach((r) => {
            const baseOptions = {};
            if (r.access) {
                baseOptions.accessType = ACCESS_TYPE_MAP[r.access[0]];
            }
            if (r.size) {
                baseOptions.size = utils_1.parseInteger(r.size[0]);
            }
            if (r.resetValue) {
                baseOptions.resetValue = utils_1.parseInteger(r.resetValue[0]);
            }
            if (r.dim) {
                if (!r.dimIncrement) {
                    throw new Error(`Unable to parse SVD file: register ${r.name[0]} has dim element, with no dimIncrement element.`);
                }
                const count = utils_1.parseInteger(r.dim[0]);
                const increment = utils_1.parseInteger(r.dimIncrement[0]);
                let index = [];
                if (r.dimIndex) {
                    index = utils_1.parseDimIndex(r.dimIndex[0], count);
                }
                else {
                    for (let i = 0; i < count; i++) {
                        index.push(`${i}`);
                    }
                }
                const namebase = r.name[0];
                const descbase = this.cleanupDescription(r.description ? r.description[0] : '');
                const offsetbase = utils_1.parseInteger(r.addressOffset[0]);
                for (let i = 0; i < count; i++) {
                    const name = namebase.replace('%s', index[i]);
                    const description = descbase.replace('%s', index[i]);
                    const register = new peripheralregisternode_1.PeripheralRegisterNode(parent, Object.assign({}, baseOptions, { name: name, description: description, addressOffset: offsetbase + (increment * i) }));
                    if (r.fields && r.fields.length === 1) {
                        SVDParser.parseFields(r.fields[0].field, register);
                    }
                    registers.push(register);
                }
            }
            else {
                const description = this.cleanupDescription(r.description ? r.description[0] : '');
                const register = new peripheralregisternode_1.PeripheralRegisterNode(parent, Object.assign({}, baseOptions, { name: r.name[0], description: description, addressOffset: utils_1.parseInteger(r.addressOffset[0]) }));
                if (r.fields && r.fields.length === 1) {
                    SVDParser.parseFields(r.fields[0].field, register);
                }
                registers.push(register);
            }
        });
        registers.sort((a, b) => {
            if (a.offset < b.offset) {
                return -1;
            }
            else if (a.offset > b.offset) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return registers;
    }
    static parseClusters(clusterInfo, parent) {
        const clusters = [];
        if (!clusterInfo) {
            return [];
        }
        clusterInfo.forEach((c) => {
            const baseOptions = {};
            if (c.access) {
                baseOptions.accessType = ACCESS_TYPE_MAP[c.access[0]];
            }
            if (c.size) {
                baseOptions.size = utils_1.parseInteger(c.size[0]);
            }
            if (c.resetValue) {
                baseOptions.resetValue = utils_1.parseInteger(c.resetValue);
            }
            if (c.dim) {
                if (!c.dimIncrement) {
                    throw new Error(`Unable to parse SVD file: cluster ${c.name[0]} has dim element, with no dimIncrement element.`);
                }
                const count = utils_1.parseInteger(c.dim[0]);
                const increment = utils_1.parseInteger(c.dimIncrement[0]);
                let index = [];
                if (c.dimIndex) {
                    index = utils_1.parseDimIndex(c.dimIndex[0], count);
                }
                else {
                    for (let i = 0; i < count; i++) {
                        index.push(`${i}`);
                    }
                }
                const namebase = c.name[0];
                const descbase = this.cleanupDescription(c.description ? c.description[0] : '');
                const offsetbase = utils_1.parseInteger(c.addressOffset[0]);
                for (let i = 0; i < count; i++) {
                    const name = namebase.replace('%s', index[i]);
                    const description = descbase.replace('%s', index[i]);
                    const cluster = new peripheralclusternode_1.PeripheralClusterNode(parent, Object.assign({}, baseOptions, { name: name, description: description, addressOffset: offsetbase + (increment * i) }));
                    if (c.register) {
                        SVDParser.parseRegisters(c.register, cluster);
                    }
                    clusters.push(cluster);
                }
            }
            else {
                const description = this.cleanupDescription(c.description ? c.description[0] : '');
                const cluster = new peripheralclusternode_1.PeripheralClusterNode(parent, Object.assign({}, baseOptions, { name: c.name[0], description: description, addressOffset: utils_1.parseInteger(c.addressOffset[0]) }));
                if (c.register) {
                    SVDParser.parseRegisters(c.register, cluster);
                    clusters.push(cluster);
                }
            }
        });
        return clusters;
    }
    static parsePeripheral(p, defaults) {
        const ab = p.addressBlock[0];
        const totalLength = utils_1.parseInteger(ab.size[0]);
        const options = {
            name: p.name[0],
            baseAddress: utils_1.parseInteger(p.baseAddress[0]),
            description: this.cleanupDescription(p.description ? p.description[0] : ''),
            totalLength: totalLength
        };
        if (p.access) {
            options.accessType = ACCESS_TYPE_MAP[p.access[0]];
        }
        if (p.size) {
            options.size = utils_1.parseInteger(p.size[0]);
        }
        if (p.resetValue) {
            options.resetValue = utils_1.parseInteger(p.resetValue[0]);
        }
        if (p.groupName) {
            options.groupName = p.groupName[0];
        }
        const peripheral = new peripheralnode_1.PeripheralNode(options);
        if (p.registers) {
            if (p.registers[0].register) {
                SVDParser.parseRegisters(p.registers[0].register, peripheral);
            }
            if (p.registers[0].cluster) {
                SVDParser.parseClusters(p.registers[0].cluster, peripheral);
            }
        }
        return peripheral;
    }
}
SVDParser.enumTypeValuesMap = {};
exports.SVDParser = SVDParser;
//# sourceMappingURL=svd.js.map