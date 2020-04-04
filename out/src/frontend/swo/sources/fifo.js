"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const events_1 = require("events");
class FifoSWOSource extends events_1.EventEmitter {
    constructor(SWOPath) {
        super();
        this.SWOPath = SWOPath;
        this.connected = false;
        this.stream = fs.createReadStream(this.SWOPath, { highWaterMark: 128, encoding: null, autoClose: false });
        this.stream.on('data', (buffer) => { this.emit('data', buffer); });
        this.stream.on('close', (buffer) => { this.emit('disconnected'); });
        this.connected = true;
    }
    dispose() {
        this.stream.close();
    }
}
exports.FifoSWOSource = FifoSWOSource;
//# sourceMappingURL=fifo.js.map