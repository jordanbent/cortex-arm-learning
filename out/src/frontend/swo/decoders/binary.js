"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utils_1 = require("./utils");
function parseEncoded(buffer, encoding) {
    return utils_1.decoders[encoding] ? utils_1.decoders[encoding](buffer) : utils_1.decoders.unsigned(buffer);
}
class SWOBinaryProcessor {
    constructor(config) {
        this.format = 'binary';
        this.port = config.port;
        this.scale = config.scale || 1;
        this.encoding = (config.encoding || 'unsigned').replace('.', '_');
        this.output = vscode.window.createOutputChannel(`SWO: ${config.label || ''} [port: ${this.port}, encoding: ${this.encoding}]`);
    }
    softwareEvent(packet) {
        if (packet.port !== this.port) {
            return;
        }
        const date = new Date();
        const hexvalue = packet.data.toString('hex');
        const decodedValue = parseEncoded(packet.data, this.encoding);
        const scaledValue = decodedValue * this.scale;
        this.output.appendLine(`[${date.toISOString()}]   ${hexvalue} - ${decodedValue} - ${scaledValue}`);
    }
    hardwareEvent(event) { }
    synchronized() { }
    lostSynchronization() { }
    dispose() {
        this.output.dispose();
    }
}
exports.SWOBinaryProcessor = SWOBinaryProcessor;
//# sourceMappingURL=binary.js.map