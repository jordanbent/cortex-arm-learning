"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const events_1 = require("events");
class PyOCDServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'PyOCD';
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
            'interpreter-exec console "monitor reset halt"',
            'target-download',
            'interpreter-exec console "monitor reset halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const gdbport = this.ports['gdbPort'];
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor reset"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [
            'EnableITMAccess',
            `BaseSWOSetup ${ratio}`,
            'SetITMId 1',
            'ITMDWTTransferEnable',
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable',
            'ITMGlobalEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        return this.args.serverpath ? this.args.serverpath : 'pyocd-gdbserver';
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = ['--persist', '--port', gdbport.toString(), '--reset-break'];
        if (this.args.boardId) {
            serverargs.push('--board');
            serverargs.push(this.args.boardId);
        }
        if (this.args.targetId) {
            serverargs.push('--target');
            serverargs.push(this.args.targetId.toString());
        }
        if (this.args.cmsisPack) {
            serverargs.push('--pack');
            serverargs.push(this.args.cmsisPack.toString());
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /GDB server started (at|on) port/;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            this.emit('event', new common_1.SWOConfigureEvent({
                type: 'serial',
                device: this.args.swoConfig.source,
                baudRate: this.args.swoConfig.swoFrequency
            }));
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.PyOCDServerController = PyOCDServerController;
//# sourceMappingURL=pyocd.js.map