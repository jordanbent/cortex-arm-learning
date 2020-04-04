"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ExternalServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'External';
        this.portsNeeded = [];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const target = this.args.gdbTarget;
        return [
            `target-select extended-remote ${target}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"',
            'target-download',
            'interpreter-exec console "monitor reset halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"'
        ];
        return commands;
    }
    serverExecutable() {
        return null;
    }
    serverArguments() {
        return [];
    }
    initMatch() {
        return null;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.ExternalServerController = ExternalServerController;
//# sourceMappingURL=external.js.map