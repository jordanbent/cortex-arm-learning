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
const assert = require("assert");
const os = require("os");
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
suite('Serial Port tests', () => {
    const extensionPath = vscode.extensions.getExtension('marus25.cortex-debug').extensionPath;
    const binaryPath = path.normalize(path.join(extensionPath, 'binary_modules', process.version, os.platform(), process.arch, 'node_modules'));
    test('Serial Port exists', () => __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(binaryPath)) {
            console.error(`Error: Missing dir. '${binaryPath}'`);
            console.log('Try the following commands to create the serial port module:');
            console.log(`    cd ${extensionPath}`);
            console.log(`    ./serial-port-build.sh ${process.versions['electron']} ${process.versions.node}`);
            assert.fail(`Missing dir ${binaryPath}`);
        }
    }));
    test('Serial Port list', () => __awaiter(this, void 0, void 0, function* () {
        if (module.paths.indexOf(binaryPath) === -1) {
            module.paths.splice(0, 0, binaryPath);
        }
        let SerialPort;
        try {
            SerialPort = module.require('serialport');
        }
        catch (e) {
            assert.fail(e);
        }
        yield SerialPort.list().then((ports) => {
            // We should disable next block when things are working fine across all platforms
            if (true) {
                for (const port of ports) {
                    console.log('\tFound port: ' + port.path);
                }
            }
        });
    }));
});
//# sourceMappingURL=serialport.test.js.map