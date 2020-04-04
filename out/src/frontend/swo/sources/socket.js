"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const net = require("net");
class SocketSWOSource extends events_1.EventEmitter {
    constructor(SWOPort) {
        super();
        this.SWOPort = SWOPort;
        this.client = null;
        this.connected = false;
        this.client = net.createConnection({ port: this.SWOPort, host: 'localhost' }, () => { this.connected = true; this.emit('connected'); });
        this.client.on('data', (buffer) => { this.emit('data', buffer); });
        this.client.on('end', () => { this.emit('disconnected'); });
    }
    dispose() {
        this.client.destroy();
    }
}
exports.SocketSWOSource = SocketSWOSource;
//# sourceMappingURL=socket.js.map