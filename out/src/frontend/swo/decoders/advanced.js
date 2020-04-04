"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const events_1 = require("events");
const dynamicRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
class SWOAdvancedProcessor extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.format = 'advanced';
        this.ports = [];
        const decoderPath = config.decoder;
        const resolved = dynamicRequire.resolve(decoderPath);
        if (dynamicRequire.cache[resolved]) {
            delete dynamicRequire.cache[resolved];
        } // Force reload
        const decoderModule = dynamicRequire(decoderPath);
        if (decoderModule && decoderModule.default) {
            const decoderClass = decoderModule.default;
            try {
                this.decoder = new decoderClass();
                this.decoder.init(config, this.displayOutput.bind(this), this.graphData.bind(this));
            }
            catch (e) {
                throw new Error(`Error instantiating decoder class: ${e.toString()}`);
            }
            this.ports = config.ports;
            this.output = vscode.window.createOutputChannel(`SWO: ${this.decoder.outputLabel() || ''} [type: ${this.decoder.typeName()}]`);
        }
        else {
            throw new Error(`Unable to load decoder class from: ${config.decoder}`);
        }
    }
    softwareEvent(packet) {
        if (this.ports.indexOf(packet.port) !== -1) {
            this.decoder.softwareEvent(packet.port, packet.data);
        }
    }
    hardwareEvent(event) { }
    synchronized() {
        this.decoder.synchronized();
    }
    lostSynchronization() {
        this.decoder.lostSynchronization();
    }
    displayOutput(output, timestamp = true) {
        this.output.append(output);
    }
    graphData(data, id) {
        const message = { type: 'data', data: data, id: id };
        this.emit('data', message);
    }
    dispose() {
        this.output.dispose();
    }
}
exports.SWOAdvancedProcessor = SWOAdvancedProcessor;
//# sourceMappingURL=advanced.js.map