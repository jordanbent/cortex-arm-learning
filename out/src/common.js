"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_debugadapter_1 = require("vscode-debugadapter");
var NumberFormat;
(function (NumberFormat) {
    NumberFormat[NumberFormat["Auto"] = 0] = "Auto";
    NumberFormat[NumberFormat["Hexidecimal"] = 1] = "Hexidecimal";
    NumberFormat[NumberFormat["Decimal"] = 2] = "Decimal";
    NumberFormat[NumberFormat["Binary"] = 3] = "Binary";
})(NumberFormat = exports.NumberFormat || (exports.NumberFormat = {}));
class AdapterOutputEvent extends vscode_debugadapter_1.Event {
    constructor(content, type) {
        super('adapter-output', { content: content, type: type });
    }
}
exports.AdapterOutputEvent = AdapterOutputEvent;
class StoppedEvent extends vscode_debugadapter_1.Event {
    constructor(reason, threadId, allThreadsStopped) {
        super('stopped', {
            reason: reason,
            threadId: threadId,
            allThreadsStopped: allThreadsStopped
        });
    }
}
exports.StoppedEvent = StoppedEvent;
class SWOConfigureEvent extends vscode_debugadapter_1.Event {
    constructor(params) {
        const body = params;
        super('swo-configure', body);
    }
}
exports.SWOConfigureEvent = SWOConfigureEvent;
class TelemetryEvent extends vscode_debugadapter_1.Event {
    constructor(category, action, label, parameters = {}) {
        const body = { category: category, action: action, label: label, parameters: parameters };
        super('record-event', body);
    }
}
exports.TelemetryEvent = TelemetryEvent;
function calculatePortMask(decoders) {
    if (!decoders) {
        return 0;
    }
    let mask = 0;
    decoders.forEach((d) => {
        if (d.type === 'advanced') {
            for (const port of d.ports) {
                mask = (mask | (1 << port)) >>> 0;
            }
        }
        else {
            mask = (mask | (1 << d.port)) >>> 0;
        }
    });
    return mask;
}
exports.calculatePortMask = calculatePortMask;
//# sourceMappingURL=common.js.map