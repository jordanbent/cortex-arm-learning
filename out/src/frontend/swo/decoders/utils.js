"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_parser_1 = require("binary-parser");
const SignedParser = new binary_parser_1.Parser().endianess('little').int32('value');
const UnsignedParser = new binary_parser_1.Parser().endianess('little').uint32('value');
const FloatParser = new binary_parser_1.Parser().endianess('little').floatle('value');
function parseFloat(buffer) {
    if (buffer.length < 4) {
        const tmp = Buffer.alloc(4);
        buffer.copy(tmp);
        buffer = tmp;
    }
    const result = FloatParser.parse(buffer);
    return result.value;
}
exports.parseFloat = parseFloat;
function parseSigned(buffer) {
    if (buffer.length < 4) {
        const tmp = Buffer.alloc(4);
        buffer.copy(tmp);
        buffer = tmp;
    }
    const result = SignedParser.parse(buffer);
    return result.value;
}
exports.parseSigned = parseSigned;
function parseUnsigned(buffer) {
    if (buffer.length < 4) {
        const tmp = Buffer.alloc(4);
        buffer.copy(tmp);
        buffer = tmp;
    }
    const result = UnsignedParser.parse(buffer);
    return result.value;
}
exports.parseUnsigned = parseUnsigned;
function parseQ(buffer, mask, shift) {
    const value = parseSigned(buffer);
    const fractional = value & mask;
    const integer = value >> shift;
    return integer + (fractional / mask);
}
exports.parseQ = parseQ;
function parseUQ(buffer, mask, shift) {
    const value = parseUnsigned(buffer);
    const fractional = value & mask;
    const integer = value >>> shift;
    return integer + (fractional / mask);
}
exports.parseUQ = parseUQ;
exports.decoders = {
    signed: parseSigned,
    float: parseFloat,
    Q8_24: (buffer) => parseQ(buffer, 0xFFFFFF, 24),
    Q16_16: (buffer) => parseQ(buffer, 0xFFFF, 16),
    Q24_8: (buffer) => parseQ(buffer, 0xFF, 8),
    UQ8_24: (buffer) => parseUQ(buffer, 0xFFFFFF, 24),
    UQ16_16: (buffer) => parseUQ(buffer, 0xFFFF, 16),
    UQ24_8: (buffer) => parseUQ(buffer, 0xFF, 8),
    unsigned: parseUnsigned
};
//# sourceMappingURL=utils.js.map