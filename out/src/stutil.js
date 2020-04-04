"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const os = require("os");
const events_1 = require("events");
class STUtilServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'ST-Util';
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
            'interpreter-exec console "monitor halt"',
            'interpreter-exec console "monitor reset"',
            'target-download',
            'interpreter-exec console "monitor reset"',
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
            'interpreter-exec console "monitor halt"',
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
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            return os.platform() === 'win32' ? 'st-util.exe' : 'st-util';
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = ['-p', gdbport.toString(), '-v', '--no-reset'];
        if (this.args.v1) {
            serverargs.push('--stlinkv1');
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /Listening at \*/g;
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
exports.STUtilServerController = STUtilServerController;
//# sourceMappingURL=stutil.js.map