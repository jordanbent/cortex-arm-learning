"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const console_1 = require("./decoders/console");
const binary_1 = require("./decoders/binary");
const graph_1 = require("./decoders/graph");
const advanced_1 = require("./decoders/advanced");
const events_1 = require("events");
const common_1 = require("./common");
const utils_1 = require("./decoders/utils");
const RingBuffer = require('ringbufferjs');
var Status;
(function (Status) {
    Status[Status["IDLE"] = 1] = "IDLE";
    Status[Status["UNSYNCED"] = 2] = "UNSYNCED";
    Status[Status["TIMESTAMP"] = 3] = "TIMESTAMP";
    Status[Status["HARDWARE_EVENT"] = 4] = "HARDWARE_EVENT";
    Status[Status["SOFTWARE_EVENT"] = 5] = "SOFTWARE_EVENT";
    Status[Status["RESERVED"] = 6] = "RESERVED";
})(Status || (Status = {}));
const LENGTH_MASK = 0b00000011;
const OVERFLOW_MASK = 0b01110000;
const HARDWARE_MASK = 0b00000100;
const PORT_MASK = 0b11111000;
const TIMESTAMP_MASK = 0b00001111;
class ITMDecoder extends events_1.EventEmitter {
    constructor() {
        super();
        this.syncBuffer = new RingBuffer(6);
        this.status = Status.IDLE;
        this.rxCount = 0;
        this.timestamp = 0;
        this.syncBuffer.enq(0xFF);
        this.syncBuffer.enq(0xFF);
        this.syncBuffer.enq(0xFF);
        this.syncBuffer.enq(0xFF);
        this.syncBuffer.enq(0xFF);
        this.syncBuffer.enq(0xFF);
        // Prefill the sync buffer
    }
    resetRxPacket(port, length, type) {
        this.rxBuffer = Buffer.alloc(length, 0);
        this.rxTargetLength = length;
        this.rxPacketType = type;
        this.rxPort = port;
        this.rxCount = 0;
    }
    rxWriteByte(byte) {
        this.rxBuffer.writeUInt8(byte, this.rxCount);
        this.rxCount++;
        return this.rxCount === this.rxTargetLength;
    }
    getRxPacket() {
        return {
            type: this.rxPacketType,
            port: this.rxPort,
            size: this.rxCount,
            data: this.rxBuffer
        };
    }
    checkSync(byte) {
        this.syncBuffer.enq(byte);
        const bytes = this.syncBuffer.peekN(6);
        return (bytes[5] === 0x80 && bytes[4] === 0x00 && bytes[3] === 0x00 && bytes[2] === 0x00 && bytes[1] === 0x00 && bytes[0] === 0x00);
    }
    processByte(byte) {
        let newStatus = this.status;
        if (this.checkSync(byte)) { // check for completed sync
            newStatus = Status.IDLE;
            this.emit('synchronized');
        }
        else {
            switch (this.status) {
                case Status.IDLE:
                    if (byte === 0x00) {
                        break;
                    } // Sync Packet
                    else if (byte === 0b01110000) {
                        this.emit('overflow');
                    }
                    else if ((byte & TIMESTAMP_MASK) === 0x00) {
                        this.timestamp = 0;
                        this.resetRxPacket(-1, 5, common_1.PacketType.TIMESTAMP);
                        this.rxWriteByte(byte);
                        if (byte & 0x80) {
                            newStatus = Status.TIMESTAMP;
                        }
                        else {
                            this.emit('timestamp', this.getRxPacket());
                        }
                    }
                    else if ((byte & LENGTH_MASK) !== 0x00) {
                        let count = byte & 0x03;
                        if (count === 3) {
                            count = 4;
                        }
                        const port = (byte & PORT_MASK) >>> 3;
                        if ((byte & HARDWARE_MASK) !== 0) {
                            this.resetRxPacket(port, count, common_1.PacketType.HARDWARE);
                            newStatus = Status.HARDWARE_EVENT;
                        }
                        else {
                            this.resetRxPacket(port, count, common_1.PacketType.SOFTWARE);
                            newStatus = Status.SOFTWARE_EVENT;
                        }
                    }
                    else {
                        newStatus = Status.RESERVED;
                        this.emit('lost-synchronization');
                    }
                    break;
                case Status.TIMESTAMP:
                    this.rxWriteByte(byte);
                    if ((byte & 0x80) === 0x00) {
                        this.emit('timestamp', this.getRxPacket());
                        newStatus = Status.IDLE;
                    }
                    break;
                case Status.UNSYNCED:
                    break;
                case Status.SOFTWARE_EVENT:
                    if (this.rxWriteByte(byte)) {
                        this.emit('software-event', this.getRxPacket());
                        newStatus = Status.IDLE;
                    }
                    break;
                case Status.HARDWARE_EVENT:
                    if (this.rxWriteByte(byte)) {
                        this.emit('hardware-event', this.getRxPacket());
                        newStatus = Status.IDLE;
                    }
                    break;
                case Status.RESERVED:
                    if ((byte & 0x80) === 0x00) {
                        newStatus = Status.IDLE;
                    }
                    break;
            }
        }
        this.status = newStatus;
    }
}
class SWOWebview {
    constructor(extensionPath, graphs) {
        this.extensionPath = extensionPath;
        this.graphs = graphs;
        this.currentStatus = 'stopped';
        this.processors = [];
        this.lastId = 0;
        this.now = new Date();
        const time = this.now.toTimeString();
        const showOptions = { preserveFocus: true, viewColumn: vscode.ViewColumn.Beside };
        const viewOptions = {
            retainContextWhenHidden: true,
            enableFindWidget: false,
            enableCommandUris: false,
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'dist'))]
        };
        this.viewPanel = vscode.window.createWebviewPanel('cortex-debug.grapher', `SWO Graphs [${time}]`, showOptions, viewOptions);
        this.viewPanel.webview.onDidReceiveMessage((msg) => { this.onMessage(msg); });
        this.viewPanel.webview.html = this.getHTML();
    }
    getHTML() {
        const scriptUri = vscode.Uri.file(path.join(this.extensionPath, 'dist', 'grapher.bundle.js')).with({ scheme: 'vscode-resource' });
        const nonce = this.getNonce();
        let html = fs.readFileSync(path.join(this.extensionPath, 'resources', 'grapher.html'), { encoding: 'utf8', flag: 'r' });
        html = html.replace(/\$\{nonce\}/g, nonce).replace(/\$\{scriptUri\}/g, scriptUri.toString());
        return html;
    }
    getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    registerProcessors(processor) {
        processor.on('message', this.sendMessage.bind(this));
        this.processors.push(processor);
    }
    clearProcessors() {
        this.processors = [];
    }
    sendMessage(message) {
        message.timestamp = new Date().getTime();
        this.viewPanel.webview.postMessage(message);
    }
    onMessage(message) {
        console.log('Received message: ', message);
        if (message.type === 'init') {
            const message = { type: 'configure', graphs: this.graphs, status: this.currentStatus };
            console.log('Configure Message: ', message);
            this.viewPanel.webview.postMessage(message);
        }
    }
}
class SWOCore {
    constructor(source, args, extensionPath) {
        this.source = source;
        this.processors = [];
        this.connected = false;
        this.itmDecoder = new ITMDecoder();
        vscode.debug.activeDebugSession.customRequest('load-function-symbols').then((result) => {
            this.functionSymbols = result.functionSymbols;
        }, (error) => {
            this.functionSymbols = [];
        });
        if (this.source.connected) {
            this.connected = true;
        }
        else {
            this.source.on('connected', () => { this.connected = true; });
        }
        this.source.on('data', this.handleData.bind(this));
        this.source.on('disconnected', () => { this.connected = false; });
        if (args.graphConfig.length >= 1) {
            this.webview = new SWOWebview(extensionPath, args.graphConfig);
        }
        args.swoConfig.decoders.forEach((conf) => {
            let processor;
            switch (conf.type) {
                case 'console':
                    this.processors.push(new console_1.SWOConsoleProcessor(conf));
                    break;
                case 'binary':
                    this.processors.push(new binary_1.SWOBinaryProcessor(conf));
                    break;
                case 'graph':
                    processor = new graph_1.SWOGraphProcessor(conf);
                    if (this.webview) {
                        this.webview.registerProcessors(processor);
                    }
                    this.processors.push(processor);
                    break;
                case 'advanced':
                    try {
                        processor = new advanced_1.SWOAdvancedProcessor(conf);
                        if (this.webview) {
                            this.webview.registerProcessors(processor);
                        }
                        this.processors.push(processor);
                        break;
                    }
                    catch (e) {
                        vscode.window.showErrorMessage(`Error Initializing Advanced Decoder: ${e.toString()}`);
                    }
                default:
                    break;
            }
        });
        this.itmDecoder.on('software-event', this.processPacket.bind(this));
        this.itmDecoder.on('hardware-event', this.processPacket.bind(this));
        this.itmDecoder.on('synchronized', this.synchronized.bind(this));
        this.itmDecoder.on('lost-synchronization', this.lostSynchronization.bind(this));
        this.itmDecoder.on('timestamp', this.processTimestampPacket.bind(this));
        this.itmDecoder.on('overflow', this.overflow.bind(this));
    }
    handleData(data) {
        for (let i = 0; i < data.length; i++) {
            const byte = data.readUInt8(i);
            this.itmDecoder.processByte(byte);
        }
    }
    processPacket(packet) {
        if (packet.type === common_1.PacketType.SOFTWARE) {
            this.processors.forEach((p) => p.softwareEvent(packet));
        }
        else if (packet.type === common_1.PacketType.HARDWARE) {
            this.processors.forEach((p) => p.hardwareEvent(packet));
            if (packet.port === 2) {
                if (this.webview) {
                    const pc = utils_1.parseUnsigned(packet.data);
                    const symbol = this.getFunctionAtAddress(pc);
                    const message = {
                        type: 'program-counter',
                        counter: pc,
                        function: symbol ? symbol.name : '**Unknown**'
                    };
                    this.webview.sendMessage(message);
                }
            }
            else {
                // tslint:disable-next-line:no-console
                console.log('Received Other Hardware Packet: ', packet);
            }
        }
    }
    processTimestampPacket(packet) {
        let timestamp = 0;
        for (let i = 1; i < packet.size; i++) {
            timestamp = timestamp << 7;
            const bits = packet.data.readUInt8(i) & 0x7F;
            timestamp = timestamp | bits;
        }
    }
    overflow() { }
    lostSynchronization() {
        this.processors.forEach((p) => p.lostSynchronization());
    }
    synchronized() {
        this.processors.forEach((p) => p.synchronized());
    }
    calculatePortMask(configuration) {
        let mask = 0;
        configuration.forEach((c) => {
            if (c.type === 'advanced') {
                const ac = c;
                for (const port of ac.ports) {
                    mask = (mask | (1 << port)) >>> 0;
                }
            }
            else {
                const bc = c;
                mask = (mask | (1 << bc.port)) >>> 0;
            }
        });
        return mask;
    }
    debugSessionTerminated() {
        if (this.webview) {
            const message = { type: 'status', status: 'terminated' };
            this.webview.sendMessage(message);
        }
    }
    debugStopped() {
        if (this.webview) {
            const message = { type: 'status', status: 'stopped' };
            this.webview.sendMessage(message);
        }
    }
    debugContinued() {
        if (this.webview) {
            const message = { type: 'status', status: 'continued' };
            this.webview.sendMessage(message);
        }
    }
    dispose() {
        this.processors.forEach((p) => p.dispose());
        this.processors = null;
        if (this.webview) {
            this.webview.clearProcessors();
        }
        this.connected = false;
    }
    getFunctionAtAddress(address) {
        const matches = this.functionSymbols.filter((s) => s.address <= address && (s.address + s.length) > address);
        if (!matches || matches.length === 0) {
            return undefined;
        }
        return matches[0];
    }
}
exports.SWOCore = SWOCore;
//# sourceMappingURL=core.js.map