"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hexFormat(value, padding = 8, includePrefix = true) {
    let base = value.toString(16);
    while (base.length < padding) {
        base = '0' + base;
    }
    return includePrefix ? '0x' + base : base;
}
exports.hexFormat = hexFormat;
function binaryFormat(value, padding = 0, includePrefix = true, group = false) {
    let base = (value >>> 0).toString(2);
    while (base.length < padding) {
        base = '0' + base;
    }
    if (group) {
        const nibRem = 4 - (base.length % 4);
        for (let i = 0; i < nibRem; i++) {
            base = '0' + base;
        }
        const groups = base.match(/[01]{4}/g);
        base = groups.join(' ');
        base = base.substring(nibRem);
    }
    return includePrefix ? '0b' + base : base;
}
exports.binaryFormat = binaryFormat;
function createMask(offset, width) {
    let r = 0;
    const a = offset;
    const b = offset + width - 1;
    for (let i = a; i <= b; i++) {
        r = (r | (1 << i)) >>> 0;
    }
    return r;
}
exports.createMask = createMask;
function extractBits(value, offset, width) {
    const mask = createMask(offset, width);
    const bvalue = ((value & mask) >>> offset) >>> 0;
    return bvalue;
}
exports.extractBits = extractBits;
function parseInteger(value) {
    if ((/^0b([01]+)$/i).test(value)) {
        return parseInt(value.substring(2), 2);
    }
    else if ((/^0x([0-9a-f]+)$/i).test(value)) {
        return parseInt(value.substring(2), 16);
    }
    else if ((/^[0-9]+/i).test(value)) {
        return parseInt(value, 10);
    }
    else if ((/^#[0-1]+/i).test(value)) {
        return parseInt(value.substring(1), 2);
    }
    return undefined;
}
exports.parseInteger = parseInteger;
function parseDimIndex(spec, count) {
    if (spec.indexOf(',') !== -1) {
        const components = spec.split(',').map((c) => c.trim());
        if (components.length !== count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        return components;
    }
    if (/^([0-9]+)\-([0-9]+)$/i.test(spec)) {
        const parts = spec.split('-').map((p) => parseInteger(p));
        const start = parts[0];
        const end = parts[1];
        const numElements = end - start + 1;
        if (numElements < count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        const components = [];
        for (let i = 0; i < count; i++) {
            components.push(`${start + i}`);
        }
        return components;
    }
    if (/^[a-zA-Z]\-[a-zA-Z]$/.test(spec)) {
        const start = spec.charCodeAt(0);
        const end = spec.charCodeAt(2);
        const numElements = end - start + 1;
        if (numElements < count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        const components = [];
        for (let i = 0; i < count; i++) {
            components.push(String.fromCharCode(start + i));
        }
        return components;
    }
    return [];
}
exports.parseDimIndex = parseDimIndex;
//# sourceMappingURL=utils.js.map