"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
const events_1 = require("events");
class FileSWOSource extends events_1.EventEmitter {
    constructor(SWOPath) {
        super();
        this.SWOPath = SWOPath;
        this.connected = false;
        this.fd = null;
        this.interval = null;
        fs.open(SWOPath, 'r', (err, fd) => {
            if (err) {
                vscode.window.showWarningMessage(`Unable to open path: ${SWOPath} - Unable to read SWO data.`);
            }
            else {
                this.fd = fd;
                this.interval = setInterval(this.read.bind(this), 2);
                this.connected = true;
                this.emit('connected');
            }
        });
    }
    read() {
        const buf = Buffer.alloc(64);
        fs.read(this.fd, buf, 0, 64, null, (err, bytesRead, buffer) => {
            if (bytesRead > 0) {
                this.emit('data', buffer.slice(0, bytesRead));
            }
        });
    }
    dispose() {
        this.emit('disconnected');
        clearInterval(this.interval);
        fs.closeSync(this.fd);
    }
}
exports.FileSWOSource = FileSWOSource;
//# sourceMappingURL=file.js.map