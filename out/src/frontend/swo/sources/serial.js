"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const os = require("os");
const vscode = require("vscode");
const path = require("path");
class SerialSWOSource extends events_1.EventEmitter {
    constructor(device, baudRate, extensionPath) {
        super();
        this.device = device;
        this.baudRate = baudRate;
        this.serialPort = null;
        this.connected = false;
        const binarypath = path.normalize(path.join(extensionPath, 'binary_modules', process.version, os.platform(), process.arch, 'node_modules'));
        if (module.paths.indexOf(binarypath) === -1) {
            module.paths.splice(0, 0, binarypath);
        }
        let SerialPort;
        try {
            const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
            SerialPort = requireFunc('serialport');
        }
        catch (e) {
            // tslint:disable-next-line:max-line-length
            vscode.window.showErrorMessage('Unable to load Serial Port Module. A recent Visual Studio Code update has likely broken compatibility with the serial module. Please visit https://github.com/Marus/cortex-debug for more information.');
            return;
        }
        this.serialPort = new SerialPort(device, { baudRate: baudRate, autoOpen: false });
        this.serialPort.on('data', (buffer) => {
            this.emit('data', buffer);
        });
        this.serialPort.on('error', (error) => {
            vscode.window.showErrorMessage(`Unable to open serial port: ${device} - ${error.toString()}`);
        });
        this.serialPort.on('open', () => {
            this.connected = true;
            this.emit('connected');
        });
        this.serialPort.open();
    }
    dispose() {
        if (this.serialPort) {
            this.serialPort.close();
            this.emit('disconnected');
        }
    }
}
exports.SerialSWOSource = SerialSWOSource;
//# sourceMappingURL=serial.js.map