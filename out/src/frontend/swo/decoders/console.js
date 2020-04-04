"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SWOConsoleProcessor {
    constructor(config) {
        this.position = 0;
        this.timeout = null;
        this.format = 'console';
        this.port = config.port;
        this.encoding = config.encoding || 'utf8';
        this.output = vscode.window.createOutputChannel(`SWO: ${config.label || ''} [port: ${this.port}, type: console]`);
        if (config.showOnStartup) {
            this.output.show(true);
        }
    }
    softwareEvent(packet) {
        if (packet.port !== this.port) {
            return;
        }
        const letters = packet.data.toString(this.encoding);
        for (const letter of letters) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            if (letter === '\n') {
                this.output.append('\n');
                this.position = 0;
                return;
            }
            if (this.position === 0) {
                const date = new Date();
                const header = `[${date.toISOString()}]   `;
                this.output.append(header);
            }
            this.output.append(letter);
            this.position += 1;
            if (this.position >= 80) {
                this.output.append('\n');
                this.position = 0;
            }
            else {
                this.timeout = setTimeout(() => {
                    this.output.append('\n');
                    this.position = 0;
                    this.timeout = null;
                }, 5000);
            }
        }
    }
    hardwareEvent(event) { }
    synchronized() { }
    lostSynchronization() { }
    dispose() {
        this.output.dispose();
    }
}
exports.SWOConsoleProcessor = SWOConsoleProcessor;
//# sourceMappingURL=console.js.map