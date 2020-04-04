"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const events_1 = require("events");
const commandExistsSync = require('command-exists').sync;
class PEServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort', 'swoPort', 'consolePort'];
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
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor _reset"',
            'target-download',
            'interpreter-exec console "monitor _reset"',
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
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor _reset"'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    serverExecutable() {
        console.log('Getting Exec');
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            if (os.platform() === 'win32') {
                return 'pegdbserver_console.exe';
            }
            else {
                return 'pegdbserver_console';
            }
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = [];
        serverargs.push('-startserver');
        serverargs.push('-singlesession');
        serverargs.push(`-device=${this.args.device}`);
        serverargs.push(`-serverport=${gdbport}`);
        if (this.args.ipAddress) {
            serverargs.push(`-serverip=${this.args.ipAddress}`);
        }
        if (this.args.rtos) {
            serverargs.push(`-kernal=${this.args.rtos}`);
        }
        if (this.args.interface) {
            serverargs.push(`-interface=${this.args.interface}`);
        }
        if (this.args.configFiles) {
            serverargs.push(`-configfile=${this.args.configFiles[0]}`);
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /All Servers Running/g;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.PEServerController = PEServerController;
//# sourceMappingURL=pemicro.js.map