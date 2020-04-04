"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const backend_1 = require("../backend");
const ChildProcess = require("child_process");
const events_1 = require("events");
const mi_parse_1 = require("../mi_parse");
const path_1 = require("path");
const nativePath = require("path");
const path = path_1.posix;
function escape(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
exports.escape = escape;
const nonOutput = /^(?:\d*|undefined)[\*\+\=]|[\~\@\&\^]/;
const gdbMatch = /(?:\d*|undefined)\(gdb\)/;
const numRegex = /\d+/;
function couldBeOutput(line) {
    if (nonOutput.exec(line)) {
        return false;
    }
    return true;
}
const trace = false;
class MI2 extends events_1.EventEmitter {
    constructor(application, args) {
        super();
        this.application = application;
        this.args = args;
        this.currentToken = 1;
        this.handlers = {};
    }
    connect(cwd, executable, commands) {
        if (!nativePath.isAbsolute(executable)) {
            executable = nativePath.join(cwd, executable);
        }
        return new Promise((resolve, reject) => {
            const args = [...this.args, executable];
            this.process = ChildProcess.spawn(this.application, args, { cwd: cwd, env: this.procEnv });
            this.process.stdout.on('data', this.stdout.bind(this));
            this.process.stderr.on('data', this.stderr.bind(this));
            this.process.on('exit', (() => { this.emit('quit'); }).bind(this));
            this.process.on('error', ((err) => { this.emit('launcherror', err); }).bind(this));
            const asyncPromise = this.sendCommand('gdb-set target-async on', true);
            const promises = commands.map((c) => this.sendCommand(c));
            promises.push(asyncPromise);
            Promise.all(promises).then(() => {
                this.emit('debug-ready');
                resolve();
            }, reject);
        });
    }
    stdout(data) {
        if (trace) {
            this.log('stderr', 'stdout: ' + data);
        }
        if (typeof data === 'string') {
            this.buffer += data;
        }
        else {
            this.buffer += data.toString('utf8');
        }
        const end = this.buffer.lastIndexOf('\n');
        if (end !== -1) {
            this.onOutput(this.buffer.substr(0, end));
            this.buffer = this.buffer.substr(end + 1);
        }
        if (this.buffer.length) {
            if (this.onOutputPartial(this.buffer)) {
                this.buffer = '';
            }
        }
    }
    stderr(data) {
        if (typeof data === 'string') {
            this.errbuf += data;
        }
        else {
            this.errbuf += data.toString('utf8');
        }
        const end = this.errbuf.lastIndexOf('\n');
        if (end !== -1) {
            this.onOutputStderr(this.errbuf.substr(0, end));
            this.errbuf = this.errbuf.substr(end + 1);
        }
        if (this.errbuf.length) {
            this.logNoNewLine('stderr', this.errbuf);
            this.errbuf = '';
        }
    }
    onOutputStderr(lines) {
        lines = lines.split('\n');
        lines.forEach((line) => {
            this.log('stderr', line);
        });
    }
    onOutputPartial(line) {
        if (couldBeOutput(line)) {
            this.logNoNewLine('stdout', line);
            return true;
        }
        return false;
    }
    onOutput(lines) {
        lines = lines.split('\n');
        lines.forEach((line) => {
            if (couldBeOutput(line)) {
                if (!gdbMatch.exec(line)) {
                    this.log('stdout', line);
                }
            }
            else {
                const parsed = mi_parse_1.parseMI(line);
                if (this.debugOutput) {
                    this.log('log', 'GDB -> App: ' + JSON.stringify(parsed));
                }
                let handled = false;
                if (parsed.token !== undefined) {
                    if (this.handlers[parsed.token]) {
                        this.handlers[parsed.token](parsed);
                        delete this.handlers[parsed.token];
                        handled = true;
                    }
                }
                if (!handled && parsed.resultRecords && parsed.resultRecords.resultClass === 'error') {
                    this.log('stderr', parsed.result('msg') || line);
                }
                if (parsed.outOfBandRecord) {
                    parsed.outOfBandRecord.forEach((record) => {
                        if (record.isStream) {
                            this.log(record.type, record.content);
                        }
                        else {
                            if (record.type === 'exec') {
                                this.emit('exec-async-output', parsed);
                                if (record.asyncClass === 'running') {
                                    this.emit('running', parsed);
                                }
                                else if (record.asyncClass === 'stopped') {
                                    const reason = parsed.record('reason');
                                    if (trace) {
                                        this.log('stderr', 'stop: ' + reason);
                                    }
                                    if (reason === 'breakpoint-hit') {
                                        this.emit('breakpoint', parsed);
                                    }
                                    else if (reason === 'end-stepping-range') {
                                        this.emit('step-end', parsed);
                                    }
                                    else if (reason === 'function-finished') {
                                        this.emit('step-out-end', parsed);
                                    }
                                    else if (reason === 'signal-received') {
                                        this.emit('signal-stop', parsed);
                                    }
                                    else if (reason === 'exited-normally') {
                                        this.emit('exited-normally', parsed);
                                    }
                                    else if (reason === 'exited') { // exit with error code != 0
                                        this.log('stderr', 'Program exited with code ' + parsed.record('exit-code'));
                                        this.emit('exited-normally', parsed);
                                    }
                                    else {
                                        this.log('console', 'Not implemented stop reason (assuming exception): ' + reason);
                                        this.emit('stopped', parsed);
                                    }
                                    this.emit('generic-stopped', parsed);
                                }
                                else {
                                    this.log('log', JSON.stringify(parsed));
                                }
                            }
                            else if (record.type === 'notify') {
                                let tid;
                                let gid;
                                for (const item of record.output) {
                                    if (item[0] === 'id') {
                                        tid = item[1];
                                    }
                                    else if (item[0] === 'group-id') {
                                        gid = item[1];
                                    }
                                }
                                if (record.asyncClass === 'thread-created') {
                                    this.emit('thread-created', { threadId: parseInt(tid), threadGroupId: gid });
                                }
                                else if (record.asyncClass === 'thread-exited') {
                                    this.emit('thread-exited', { threadId: parseInt(tid), threadGroupId: gid });
                                }
                                else if (record.asyncClass === 'thread-selected') {
                                    this.emit('thread-selected', { threadId: parseInt(tid) });
                                }
                                else if (record.asyncClass === 'thread-group-exited') {
                                    this.emit('thread-group-exited', { threadGroupId: tid });
                                }
                            }
                        }
                    });
                    handled = true;
                }
                if (parsed.token === undefined && parsed.resultRecords === undefined && parsed.outOfBandRecord.length === 0) {
                    handled = true;
                }
                if (!handled) {
                    this.log('log', 'Unhandled: ' + JSON.stringify(parsed));
                }
            }
        });
    }
    tryKill() {
        const proc = this.process;
        try {
            process.kill(-proc.pid);
        }
        catch (e) {
            this.log('log', `kill failed for ${-proc.pid}` + e);
        }
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'stop');
            }
            const proc = this.process;
            const to = setTimeout(() => { this.tryKill(); }, 1000);
            this.process.on('exit', (code) => { clearTimeout(to); });
            // Disconnect first. Not doing so and exiting will cause an unwanted detach if the
            // program is in paused state
            yield this.sendCommand('target-disconnect');
            this.sendRaw('-gdb-exit');
        });
    }
    detach() {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'detach');
            }
            yield this.sendCommand('target-detach');
            this.stop();
        });
    }
    interrupt(arg = '') {
        if (trace) {
            this.log('stderr', 'interrupt ' + arg);
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-interrupt ${arg}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'done');
            }, reject);
        });
    }
    continue(threadId) {
        if (trace) {
            this.log('stderr', 'continue');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-continue --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    next(threadId, instruction) {
        if (trace) {
            this.log('stderr', 'next');
        }
        return new Promise((resolve, reject) => {
            const baseCmd = instruction ? 'exec-next-instruction' : 'exec-next';
            this.sendCommand(`${baseCmd} --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    step(threadId, instruction) {
        if (trace) {
            this.log('stderr', 'step');
        }
        return new Promise((resolve, reject) => {
            const baseCmd = instruction ? 'exec-step-instruction' : 'exec-step';
            this.sendCommand(`${baseCmd} --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    stepOut(threadId) {
        if (trace) {
            this.log('stderr', 'stepOut');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-finish --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    restart(commands) {
        if (trace) {
            this.log('stderr', 'restart');
        }
        return this._sendCommandSequence(commands);
    }
    postStart(commands) {
        if (trace) {
            this.log('stderr', 'post-start');
        }
        return this._sendCommandSequence(commands);
    }
    _sendCommandSequence(commands) {
        return new Promise((resolve, reject) => {
            const nextCommand = ((commands) => {
                if (commands.length === 0) {
                    resolve(true);
                }
                else {
                    const command = commands[0];
                    this.sendCommand(command).then((r) => { nextCommand(commands.slice(1)); }, reject);
                }
            }).bind(this);
            nextCommand(commands);
        });
    }
    changeVariable(name, rawValue) {
        if (trace) {
            this.log('stderr', 'changeVariable');
        }
        return this.sendCommand('gdb-set var ' + name + '=' + rawValue);
    }
    setBreakPointCondition(bkptNum, condition) {
        if (trace) {
            this.log('stderr', 'setBreakPointCondition');
        }
        return this.sendCommand('break-condition ' + bkptNum + ' ' + condition);
    }
    addBreakPoint(breakpoint) {
        if (trace) {
            this.log('stderr', 'addBreakPoint');
        }
        return new Promise((resolve, reject) => {
            let location = '';
            if (breakpoint.countCondition) {
                if (breakpoint.countCondition[0] === '>') {
                    location += '-i ' + numRegex.exec(breakpoint.countCondition.substr(1))[0] + ' ';
                }
                else {
                    const match = numRegex.exec(breakpoint.countCondition)[0];
                    if (match.length !== breakpoint.countCondition.length) {
                        // tslint:disable-next-line:max-line-length
                        this.log('stderr', 'Unsupported break count expression: \'' + breakpoint.countCondition + '\'. Only supports \'X\' for breaking once after X times or \'>X\' for ignoring the first X breaks');
                        location += '-t ';
                    }
                    else if (parseInt(match) !== 0) {
                        location += '-t -i ' + parseInt(match) + ' ';
                    }
                }
            }
            if (breakpoint.raw) {
                location += '*' + escape(breakpoint.raw);
            }
            else {
                location += '"' + escape(breakpoint.file) + ':' + breakpoint.line + '"';
            }
            this.sendCommand(`break-insert ${location}`).then((result) => {
                if (result.resultRecords.resultClass === 'done') {
                    const bkptNum = parseInt(result.result('bkpt.number'));
                    breakpoint.number = bkptNum;
                    if (breakpoint.condition) {
                        this.setBreakPointCondition(bkptNum, breakpoint.condition).then((result) => {
                            if (result.resultRecords.resultClass === 'done') {
                                resolve(breakpoint);
                            }
                            else {
                                resolve(null);
                            }
                        }, reject);
                    }
                    else {
                        resolve(breakpoint);
                    }
                }
                else {
                    resolve(null);
                }
            }, reject);
        });
    }
    removeBreakpoints(breakpoints) {
        if (trace) {
            this.log('stderr', 'removeBreakPoint');
        }
        return new Promise((resolve, reject) => {
            if (breakpoints.length === 0) {
                resolve(true);
            }
            else {
                const cmd = 'break-delete ' + breakpoints.join(' ');
                this.sendCommand(cmd).then((result) => {
                    resolve(result.resultRecords.resultClass === 'done');
                }, reject);
            }
        });
    }
    getFrame(thread, frame) {
        return new Promise((resolve, reject) => {
            const command = `stack-info-frame --thread ${thread} --frame ${frame}`;
            this.sendCommand(command).then((result) => {
                const frame = result.result('frame');
                const level = mi_parse_1.MINode.valueOf(frame, 'level');
                const addr = mi_parse_1.MINode.valueOf(frame, 'addr');
                const func = mi_parse_1.MINode.valueOf(frame, 'func');
                const file = mi_parse_1.MINode.valueOf(frame, 'file');
                const fullname = mi_parse_1.MINode.valueOf(frame, 'fullname');
                let line = 0;
                const linestr = mi_parse_1.MINode.valueOf(frame, 'line');
                if (linestr) {
                    line = parseInt(linestr);
                }
                resolve({
                    address: addr,
                    fileName: file,
                    file: fullname,
                    function: func,
                    level: level,
                    line: line
                });
            }, reject);
        });
    }
    getStack(threadId, startLevel, maxLevels) {
        if (trace) {
            this.log('stderr', 'getStack');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`stack-list-frames --thread ${threadId} ${startLevel} ${maxLevels}`).then((result) => {
                const stack = result.result('stack');
                const ret = [];
                stack.forEach((element) => {
                    const level = mi_parse_1.MINode.valueOf(element, '@frame.level');
                    const addr = mi_parse_1.MINode.valueOf(element, '@frame.addr');
                    const func = mi_parse_1.MINode.valueOf(element, '@frame.func');
                    const filename = mi_parse_1.MINode.valueOf(element, '@frame.file');
                    const file = mi_parse_1.MINode.valueOf(element, '@frame.fullname');
                    let line = 0;
                    const lnstr = mi_parse_1.MINode.valueOf(element, '@frame.line');
                    if (lnstr) {
                        line = parseInt(lnstr);
                    }
                    const from = parseInt(mi_parse_1.MINode.valueOf(element, '@frame.from'));
                    ret.push({
                        address: addr,
                        fileName: filename,
                        file: file,
                        function: func || from,
                        level: level,
                        line: line
                    });
                });
                resolve(ret);
            }, reject);
        });
    }
    getStackVariables(thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'getStackVariables');
            }
            const result = yield this.sendCommand(`stack-list-variables --thread ${thread} --frame ${frame} --simple-values`);
            const variables = result.result('variables');
            const ret = [];
            for (const element of variables) {
                const key = mi_parse_1.MINode.valueOf(element, 'name');
                const value = mi_parse_1.MINode.valueOf(element, 'value');
                const type = mi_parse_1.MINode.valueOf(element, 'type');
                ret.push({
                    name: key,
                    valueStr: value,
                    type: type,
                    raw: element
                });
            }
            return ret;
        });
    }
    examineMemory(from, length) {
        if (trace) {
            this.log('stderr', 'examineMemory');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand('data-read-memory-bytes 0x' + from.toString(16) + ' ' + length).then((result) => {
                resolve(result.result('memory[0].contents'));
            }, reject);
        });
    }
    // Pass negative threadId/frameId to specify no context or current context
    evalExpression(name, threadId, frameId) {
        if (trace) {
            this.log('stderr', 'evalExpression');
        }
        return new Promise((resolve, reject) => {
            const thFr = MI2.getThreadFrameStr(threadId, frameId);
            this.sendCommand(`data-evaluate-expression ${thFr} ` + name).then((result) => {
                resolve(result);
            }, reject);
        });
    }
    varCreate(expression, name = '-', scope = '@') {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varCreate');
            }
            let fmt = null;
            expression = expression.trim();
            if (/,[bdhonx]$/i.test(expression)) {
                fmt = expression.substring(expression.length - 1).toLocaleLowerCase();
                expression = expression.substring(0, expression.length - 2);
            }
            expression = expression.replace(/"/g, '\\"');
            const createResp = yield this.sendCommand(`var-create ${name} ${scope} "${expression}"`);
            let overrideVal = null;
            if (fmt && name !== '-') {
                const formatResp = yield this.sendCommand(`var-set-format ${name} ${MI2.FORMAT_SPEC_MAP[fmt]}`);
                overrideVal = formatResp.result('value');
            }
            let result = createResp.result('');
            if (overrideVal) {
                result = result.map((r) => r[0] === 'value' ? ['value', overrideVal] : r);
            }
            return new backend_1.VariableObject(result);
        });
    }
    varEvalExpression(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varEvalExpression');
            }
            return this.sendCommand(`var-evaluate-expression ${name}`);
        });
    }
    varListChildren(name, flattenAnonymous) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varListChildren');
            }
            // TODO: add `from` and `to` arguments
            const res = yield this.sendCommand(`var-list-children --all-values ${name}`);
            const children = res.result('children') || [];
            const omg = [];
            for (const item of children) {
                const child = new backend_1.VariableObject(item[1]);
                if (flattenAnonymous && child.exp.startsWith('<anonymous ')) {
                    omg.push(...yield this.varListChildren(child.name, flattenAnonymous));
                }
                else {
                    omg.push(child);
                }
            }
            return omg;
        });
    }
    static getThreadFrameStr(threadId, frameId) {
        const th = threadId > 0 ? `--thread ${threadId} ` : '';
        const fr = frameId >= 0 ? `--frame ${frameId}` : '';
        return th + fr;
    }
    // Pass negative threadId/frameId to specify no context or current context
    varUpdate(name = '*', threadId, frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varUpdate');
            }
            return this.sendCommand(`var-update ${MI2.getThreadFrameStr(threadId, frameId)} --all-values ${name}`);
        });
    }
    // Pass negative threadId/frameId to specify no context or current context
    varAssign(name, rawValue, threadId, frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varAssign');
            }
            return this.sendCommand(`var-assign ${MI2.getThreadFrameStr(threadId, frameId)} ${name} ${rawValue}`);
        });
    }
    logNoNewLine(type, msg) {
        this.emit('msg', type, msg);
    }
    log(type, msg) {
        this.emit('msg', type, msg[msg.length - 1] === '\n' ? msg : (msg + '\n'));
    }
    sendUserInput(command) {
        if (command.startsWith('-')) {
            return this.sendCommand(command.substr(1));
        }
        else {
            return this.sendCommand(`interpreter-exec console "${command}"`);
        }
    }
    sendRaw(raw) {
        if (this.printCalls || trace) {
            this.log('log', raw);
        }
        if (raw.includes('undefined')) {
            console.log(raw);
        }
        this.process.stdin.write(raw + '\n');
    }
    getCurrentToken() {
        return this.currentToken;
    }
    sendCommand(command, suppressFailure = false) {
        const sel = this.currentToken++;
        return new Promise((resolve, reject) => {
            this.handlers[sel] = (node) => {
                if (node && node.resultRecords && node.resultRecords.resultClass === 'error') {
                    if (suppressFailure) {
                        this.log('stderr', `WARNING: Error executing command '${command}'`);
                        resolve(node);
                    }
                    else {
                        reject(new backend_1.MIError(node.result('msg') || 'Internal error', command));
                    }
                }
                else {
                    resolve(node);
                }
            };
            this.sendRaw(sel + '-' + command);
        });
    }
    isReady() {
        return !!this.process;
    }
}
MI2.FORMAT_SPEC_MAP = {
    b: 'binary',
    d: 'decimal',
    h: 'hexadecimal',
    o: 'octal',
    n: 'natural',
    x: 'hexadecimal'
};
exports.MI2 = MI2;
//# sourceMappingURL=mi2.js.map