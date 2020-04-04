"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const events_1 = require("events");
class BMPServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'BMP';
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
        const commands = [
            `target-select extended-remote ${this.args.BMPGDBSerialPort}`
        ];
        if (this.args.powerOverBMP === 'enable') {
            commands.push('interpreter-exec console "monitor tpwr enable"');
            // sleep for 100 ms. MCU need some time to boot up after power up
            commands.push('interpreter-exec console "shell sleep 0.1"');
        }
        else if (this.args.powerOverBMP === 'disable') {
            commands.push('interpreter-exec console "monitor tpwr disable"');
        }
        else {
            // keep last power state (do nothing)
        }
        if (this.args.interface === 'jtag') {
            commands.push('interpreter-exec console "monitor jtag_scan"');
        }
        else {
            commands.push('interpreter-exec console "monitor swdp_scan"');
        }
        commands.push(`interpreter-exec console "attach ${this.args.targetId}"`, 'interpreter-exec console "set mem inaccessible-by-default off"');
        return commands;
    }
    launchCommands() {
        const commands = [
            'target-download',
            'interpreter-exec console "SoftwareReset"',
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
            'interpreter-exec console "SoftwareReset"'
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
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [];
        commands.push('EnableITMAccess', `BaseSWOSetup ${ratio}`, 'SetITMId 1', 'ITMDWTTransferEnable', 'DisableITMPorts 0xFFFFFFFF', `EnableITMPorts ${portMask}`, 'EnableDWTSync', 'ITMSyncEnable', 'ITMGlobalEnable');
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
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
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            this.emit('event', new common_1.SWOConfigureEvent({ type: 'serial', device: this.args.swoConfig.source, baudRate: this.args.swoConfig.swoFrequency }));
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.BMPServerController = BMPServerController;
//# sourceMappingURL=bmp.js.map