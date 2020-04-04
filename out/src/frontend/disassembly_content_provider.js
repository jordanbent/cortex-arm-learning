"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class DisassemblyContentProvider {
    provideTextDocumentContent(uri, token) {
        return new Promise((resolve, reject) => {
            let funcName;
            let file;
            const path = uri.path;
            const pathParts = path.substring(1, path.length - 6).split(':::');
            if (pathParts.length === 1) {
                file = null;
                funcName = pathParts[0];
            }
            else {
                file = pathParts[0];
                funcName = pathParts[1];
            }
            vscode.debug.activeDebugSession.customRequest('disassemble', { function: funcName, file: file }).then((data) => {
                const instructions = data.instructions;
                let output = '';
                instructions.forEach((i) => {
                    output += `${i.address}: ${this.padEnd(15, i.opcodes)} \t${i.instruction}\n`;
                });
                resolve(output);
            }, (error) => {
                vscode.window.showErrorMessage(error.message);
                reject(error.message);
            });
        });
    }
    padEnd(len, value) {
        for (let i = value.length; i < len; i++) {
            value += ' ';
        }
        return value;
    }
}
exports.DisassemblyContentProvider = DisassemblyContentProvider;
//# sourceMappingURL=disassembly_content_provider.js.map