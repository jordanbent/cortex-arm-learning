"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChildProcess = require("child_process");
const fs = require("fs");
function spawnTerminalEmulator(preferedEmulator) {
    return new Promise((resolve, reject) => {
        const ttyFileOutput = '/tmp/vscode-gdb-tty-0' + Math.floor(Math.random() * 100000000).toString(36);
        ChildProcess.spawn(preferedEmulator || 'x-terminal-emulator', ['-e', 'sh -c "tty > ' + ttyFileOutput + ' && sleep 4294967294"']);
        let it = 0;
        const interval = setInterval(() => {
            if (fs.existsSync(ttyFileOutput)) {
                clearInterval(interval);
                const tty = fs.readFileSync(ttyFileOutput).toString('utf8');
                fs.unlink(ttyFileOutput, (err) => {
                    console.log('Error unlinking terminal session');
                });
                return resolve(tty);
            }
            it++;
            if (it > 500) {
                reject();
            }
        }, 10);
    });
}
exports.spawnTerminalEmulator = spawnTerminalEmulator;
//# sourceMappingURL=console.js.map