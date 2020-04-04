"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const os = require("os");
const events_1 = require("events");
const commandExistsSync = require('command-exists').sync;
const EXECUTABLE_NAMES = ['JLinkGDBServerCLExe', 'JLinkGDBServerCL', 'JLinkGDBServer'];
class JLinkServerController extends events_1.EventEmitter {
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
        if (this.args.swoConfig.enabled) {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency | 0;
        const cpuFrequency = this.args.swoConfig.cpuFrequency | 0;
        const commands = [
            `monitor SWO EnableTarget ${cpuFrequency} ${swoFrequency} ${portMask} 0`,
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            if (os.platform() === 'win32') {
                return 'JLinkGDBServerCL.exe';
            }
            else {
                for (const name in EXECUTABLE_NAMES) {
                    if (commandExistsSync(name)) {
                        return name;
                    }
                }
                return 'JLinkGDBServer';
            }
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        const swoport = this.ports['swoPort'];
        const consoleport = this.ports['consolePort'];
        let cmdargs = [
            '-if', this.args.interface,
            '-port', gdbport.toString(),
            '-swoport', swoport.toString(),
            '-telnetport', consoleport.toString(),
            '-device', this.args.device
        ];
        if (this.args.serialNumber) {
            cmdargs.push('-select', `usb=${this.args.serialNumber}`);
        }
        else if (this.args.ipAddress) {
            cmdargs.push('-select', `ip=${this.args.ipAddress}`);
        }
        if (this.args.rtos) {
            cmdargs.push('-rtos', this.args.rtos);
        }
        if (this.args.jlinkscript) {
            cmdargs.push('-jlinkscriptfile', this.args.jlinkscript);
        }
        if (this.args.serverArgs) {
            cmdargs = cmdargs.concat(this.args.serverArgs);
        }
        return cmdargs;
    }
    initMatch() {
        return /Waiting for GDB connection\.\.\./g;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled) {
            if (this.args.swoConfig.source === 'probe') {
                this.emit('event', new common_1.SWOConfigureEvent({ type: 'socket', port: this.ports['swoPort'] }));
            }
            else {
                this.emit('event', new common_1.SWOConfigureEvent({
                    type: 'serial',
                    device: this.args.swoConfig.source,
                    baudRate: this.args.swoConfig.swoFrequency
                }));
            }
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.JLinkServerController = JLinkServerController;
//# sourceMappingURL=jlink.js.map