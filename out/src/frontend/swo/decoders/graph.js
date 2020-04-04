"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const events_1 = require("events");
function parseEncoded(buffer, encoding) {
    return utils_1.decoders[encoding] ? utils_1.decoders[encoding](buffer) : utils_1.decoders.unsigned(buffer);
}
class SWOGraphProcessor extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.format = 'graph';
        // core.socketServer.registerProcessor(this);
        this.port = config.port;
        this.encoding = config.encoding || 'unsigned';
        this.scale = config.scale || 1;
        this.graphId = config.graphId;
    }
    softwareEvent(packet) {
        if (packet.port !== this.port) {
            return;
        }
        const raw = packet.data.toString('hex');
        const decodedValue = parseEncoded(packet.data, this.encoding);
        const scaledValue = decodedValue * this.scale;
        const message = { type: 'data', data: scaledValue, id: this.graphId };
        this.emit('message', message);
    }
    hardwareEvent(event) { }
    synchronized() { }
    lostSynchronization() { }
    dispose() { }
}
exports.SWOGraphProcessor = SWOGraphProcessor;
//# sourceMappingURL=graph.js.map