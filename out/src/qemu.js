"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const commandExistsSync = require('command-exists').sync;
const EXECUTABLE_NAMES = ['qemu-system-arm'];
class QEMUServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort'];
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
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor stop"',
            'interpreter-exec console "monitor system_reset"'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            for (const name in EXECUTABLE_NAMES) {
                if (commandExistsSync(name)) {
                    return name;
                }
            }
            return 'qemu-system-arm';
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let cmdargs = [
            '-cpu', this.args.cpu,
            '-machine', this.args.machine,
            '-nographic',
            '-semihosting-config', 'enable=on,target=native',
            '-gdb', 'tcp::' + gdbport.toString(),
            '-S',
            '-kernel', this.args.executable
        ];
        if (this.args.serverArgs) {
            cmdargs = cmdargs.concat(this.args.serverArgs);
        }
        return cmdargs;
    }
    initMatch() {
        return null;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.QEMUServerController = QEMUServerController;
//# sourceMappingURL=qemu.js.map