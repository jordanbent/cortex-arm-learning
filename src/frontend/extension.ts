import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { PeripheralTreeProvider } from './views/peripheral';
import { RegisterTreeProvider } from './views/registers';
import { CounterTreeProvider } from './views/counter';
import { StackTreeProvider } from './views/stack';
import { BaseNode, PeripheralBaseNode } from './views/nodes/basenode';

import { SWOCore } from './swo/core';
import { SWOSource } from './swo/sources/common';
import { NumberFormat, ConfigurationArguments } from '../common';
import { MemoryContentProvider } from './memory_content_provider';
import Reporting from '../reporting';

import { CortexDebugConfigurationProvider } from './configprovider';
import { SocketSWOSource } from './swo/sources/socket';
import { FifoSWOSource } from './swo/sources/fifo';
import { FileSWOSource } from './swo/sources/file';
import { SerialSWOSource } from './swo/sources/serial';
import { DisassemblyContentProvider } from './disassembly_content_provider';
import { SymbolInformation, SymbolScope } from '../symbols';
import { Cluster } from 'cluster';

interface SVDInfo {
    expression: RegExp;
    path: string;
}

export class CortexDebugExtension {
    private adapterOutputChannel: vscode.OutputChannel = null;
    private clearAdapterOutputChannel = false;
    private swo: SWOCore = null;
    private swosource: SWOSource = null;

    private peripheralProvider: PeripheralTreeProvider;
    private registerProvider: RegisterTreeProvider;
    private stackProvider: StackTreeProvider;
    private counterProvider: CounterTreeProvider;
    private memoryProvider: MemoryContentProvider;
    private arrayProvider: MemoryContentProvider;

    private peripheralTreeView: vscode.TreeView<PeripheralBaseNode>;
    private registerTreeView: vscode.TreeView<BaseNode>;
    private stackTreeView: vscode.TreeView<BaseNode>;
    private counterTreeView: vscode.TreeView<BaseNode>;

    private SVDDirectory: SVDInfo[] = [];
    private functionSymbols: SymbolInformation[] = null;

    constructor(private context: vscode.ExtensionContext) {
        this.peripheralProvider = new PeripheralTreeProvider();
        this.registerProvider = new RegisterTreeProvider();
        this.stackProvider = new StackTreeProvider();
        this.counterProvider = new CounterTreeProvider();
        this.memoryProvider = new MemoryContentProvider();
        this.arrayProvider = new MemoryContentProvider();

        const myProvider = new class implements vscode.TextDocumentContentProvider 
        {
    		// emitter and its event
    		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    		onDidChange = this.onDidChangeEmitter.event;

    		provideTextDocumentContent(uri: vscode.Uri): string {
                console.log(uri)
                fs.readFile(uri.path, function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    return data;
                });
                return 'Error'
            }
	    }

        let tmp = [];
        try {
            const dirPath = path.join(context.extensionPath, 'data', 'SVDMap.json');
            tmp = JSON.parse(fs.readFileSync(dirPath, 'utf8'));
        }
        catch (e) {}

        Reporting.activate(context);

        this.peripheralTreeView = vscode.window.createTreeView('cortex-arm-learning.peripherals', {
            treeDataProvider: this.peripheralProvider
        });

        this.registerTreeView = vscode.window.createTreeView('cortex-arm-learning.registers', {
            treeDataProvider: this.registerProvider
        });

        this.counterTreeView = vscode.window.createTreeView('cortex-arm-learning.counter', {
            treeDataProvider: this.counterProvider
        });

        this.stackTreeView = vscode.window.createTreeView('cortex-arm-learning.stack', {
            treeDataProvider: this.stackProvider
        });

        context.subscriptions.push(
          
            vscode.workspace.registerTextDocumentContentProvider('lookup', myProvider),
            vscode.workspace.registerTextDocumentContentProvider('examinememory', this.memoryProvider),
            vscode.workspace.registerTextDocumentContentProvider('examinearray', this.arrayProvider),
            vscode.workspace.registerTextDocumentContentProvider('disassembly', new DisassemblyContentProvider()),

            vscode.commands.registerCommand('cortex-arm-learning.lookup', async () => {
                const uri = vscode.Uri.file('C:/Users/Jordan.jordanspc/Desktop/FYP/cotrex-development-extension/cortex-arm-learning/src/frontend/lookup.txt');
                uri.scheme === 'file';
                console.log(uri)                                                                
                
                let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
                
                await vscode.window.showTextDocument(doc, { preview: false }); 
            }),

            vscode.commands.registerCommand('cortex-arm-learning.peripherals.updateNode', this.peripheralsUpdateNode.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.peripherals.copyValue', this.peripheralsCopyValue.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.peripherals.setFormat', this.peripheralsSetFormat.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.peripherals.forceRefresh', this.peripheralsForceRefresh.bind(this)),
            
            vscode.commands.registerCommand('cortex-arm-learning.stack.copyValue', this.stackCopyValue.bind(this)),

            vscode.commands.registerCommand('cortex-arm-learning.registers.copyValue', this.registersCopyValue.bind(this)),
            
            vscode.commands.registerCommand('cortex-arm-learning.examineMemory', this.examineMemory.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.examineArray', this.examineArray.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.viewDisassembly', this.showDisassembly.bind(this)),
            vscode.commands.registerCommand('cortex-arm-learning.setForceDisassembly', this.setForceDisassembly.bind(this)),

            vscode.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)),
            vscode.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)),
            vscode.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)),
            vscode.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)),
            vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
                if (e && e.textEditor.document.fileName.endsWith('.cdmem')) { this.memoryProvider.handleSelection(e); }
            }),

            vscode.debug.registerDebugConfigurationProvider('cortex-arm-learning', new CortexDebugConfigurationProvider(context)),

            this.stackTreeView,
            this.stackTreeView.onDidCollapseElement((e) => {
                e.element.expanded = false;
            }),
            this.stackTreeView.onDidExpandElement((e) => {
                e.element.expanded = true;
            }),

            this.registerTreeView,
            this.registerTreeView.onDidCollapseElement((e) => {
                e.element.expanded = false;
            }),
            this.registerTreeView.onDidExpandElement((e) => {
                e.element.expanded = true;
            }),

            this.counterTreeView,
            this.counterTreeView.onDidCollapseElement((e) => {
                e.element.expanded = false;
            }),
            this.counterTreeView.onDidExpandElement((e) => {
                e.element.expanded = true;
            }),

            this.peripheralTreeView,
            this.peripheralTreeView.onDidExpandElement((e) => {
                e.element.expanded = true;
                e.element.getPeripheral().updateData();
                this.peripheralProvider.refresh();
            }),
            this.peripheralTreeView.onDidCollapseElement((e) => {
                e.element.expanded = false;
            })
        );
    }

    private getSVDFile(device: string): string {
        const entry = this.SVDDirectory.find((de) => de.expression.test(device));
        return entry ? entry.path : null;
    }

    public registerSVDFile(expression: RegExp | string, path: string): void {
        if (typeof expression === 'string') {
            expression = new RegExp(`^${expression}$`, '');
        }

        this.SVDDirectory.push({ expression: expression, path: path });
    }

    private activeEditorChanged(editor: vscode.TextEditor) {
        if (editor !== undefined && vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type === 'cortex-arm-learning') {
            const uri = editor.document.uri;
            if (uri.scheme === 'file') {
                // vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: uri.path });
            }
            else if (uri.scheme === 'disassembly') {
                vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: `${uri.scheme}://${uri.authority}${uri.path}` });
            }
        }
    }

    private async showDisassembly() {
        if (!vscode.debug.activeDebugSession) {
            vscode.window.showErrorMessage('No debugging session available');
            return;
        }

        if (!this.functionSymbols) {
            try {
                const resp = await vscode.debug.activeDebugSession.customRequest('load-function-symbols');
                this.functionSymbols = resp.functionSymbols;
            }
            catch (e) {
                vscode.window.showErrorMessage('Unable to load symbol table. Disassembly view unavailable.');
            }
        }

        try {
            let funcname: string = await vscode.window.showInputBox({
                placeHolder: 'main',
                ignoreFocusOut: true,
                prompt: 'Function Name (exact or a regexp) to Disassemble.'
            });
            
            funcname = funcname ? funcname.trim() : null;
            if (!funcname) { return ; }

            let functions = this.functionSymbols.filter((s) => s.name === funcname);
            if (functions.length === 0) {
                let regExp = new RegExp(funcname);
                if (funcname.endsWith('/i')) {
                    // This is not the best way or UI. But this is the only flag that makes sense
                    regExp = new RegExp(funcname.substring(0, funcname.length - 2), 'i');
                }
                functions = this.functionSymbols.filter((s) => regExp.test(s.name));
            }

            let url: string;

            if (functions.length === 0) {
                vscode.window.showErrorMessage(`No function matching name/regexp '${funcname}' found.`);
            }
            else if (functions.length === 1) {
                if (!functions[0].file || (functions[0].scope === SymbolScope.Global)) {
                    url = `disassembly:///${functions[0].name}.cdasm`;
                }
                else {
                    url = `disassembly:///${functions[0].file}:::${functions[0].name}.cdasm`;
                }
            }
            else if (functions.length > 31) { /* arbitrary limit. 31 is prime! */
                vscode.window.showErrorMessage(`Too many(${functions.length}) functions matching '${funcname}' found.`);
            }
            else {
                const selected = await vscode.window.showQuickPick(functions.map((f) => {
                    return {
                        label: f.name,
                        name: f.name,
                        file: f.file,
                        scope: f.scope,
                        description: (!f.file || (f.scope === SymbolScope.Global)) ? 'Global Scope' : `Static in ${f.file}`
                    };
                }), {
                    ignoreFocusOut: true
                });

                if (!selected.file || (selected.scope === SymbolScope.Global)) {
                    url = `disassembly:///${selected.name}.cdasm`;
                }
                else {
                    url = `disassembly:///${selected.file}:::${selected.name}.cdasm`;
                }
            }

            if (url) {
                vscode.window.showTextDocument(vscode.Uri.parse(url));
            }
        }
        catch (e) {
            vscode.window.showErrorMessage('Unable to show disassembly.');
        }
    }

    private setForceDisassembly() {
        vscode.window.showQuickPick(
            [
                { label: 'Auto', description: 'Show disassembly for functions when source cannot be located.' },
                { label: 'Forced', description: 'Always show disassembly for functions.' }
            ],
            { matchOnDescription: true, ignoreFocusOut: true }
        ).then((result) => {
            const force = result.label === 'Forced';
            vscode.debug.activeDebugSession.customRequest('set-force-disassembly', { force: force });
            Reporting.sendEvent('Force Disassembly', 'Set', force ? 'Forced' : 'Auto');
        }, (error) => {});
    }

    private examineArray()
    {
        function validateValue(length) {

            let reg = /\d+/g;
            let dims = length.match(reg)
            if(!dims || dims.length >= 3)
                return null;
            else if(dims.length == 1)
            {
                var t = ['1', dims[0]]
                dims = t
            }
            return dims;
        }

        function validateSize(size){
                
            if(size.toUpperCase() === 'BYTE' || size.toUpperCase() === 'BYTES')
                return 1;
            else if(size.toUpperCase() === 'HALFWORD' || size.toUpperCase() === 'HALFWORDS')
                return 2;
            else if(size.toUpperCase() === 'WORD' || size.toUpperCase() === 'WORDS')
                return 4;
            else
                return null;
        }

        function validateAddress(address: string) {
            if (address === '') {
                return null;
            }
            return address;
        }

        if (!vscode.debug.activeDebugSession) {
            vscode.window.showErrorMessage('No debugging session available');
            return;
        }

        vscode.window.showInputBox({
            placeHolder: 'Enter the Start Address of your array. Use 0x prefix for hexidecimal numbers',
            ignoreFocusOut: true,
            prompt: 'Memory Address'
        }).then(
            (address) => {
                address = address.trim();
                if (!validateAddress(address)) {
                    vscode.window.showErrorMessage('Invalid memory address entered');
                    Reporting.sendEvent('Examine Array', 'Invalid Address', address);
                    return;
                }
                vscode.window.showInputBox({
                    placeHolder: 'Enter the Element Size of your array: BYTE, HALFWORD, WORD.',
                    ignoreFocusOut: true,
                    prompt: 'Element Size'
                }).then(
                    (size) => {
                        size = size.trim()
                        let sizeVal = validateSize(size);
                        if (!sizeVal) {
                            vscode.window.showErrorMessage('Invalid element size entered');
                            Reporting.sendEvent('Examine Array', 'Invalid Size', size);
                            return;
                        }
                         vscode.window.showInputBox({
                            placeHolder: 'Enter the dimensions of your array: 1D: Length; 2D: Rows, Cols',
                            ignoreFocusOut: true,
                            prompt: 'Dimensions'
                        }).then(
                            (dimensions) => {
                            dimensions = dimensions.trim();
                            let dims = validateValue(dimensions);
                            if (!dims) {
                                vscode.window.showErrorMessage('Invalid length entered');
                                Reporting.sendEvent('Examine Array', 'Invalid Length', dimensions);
                                return;
                            }
                            let len = 1;
                            dimensions = '';
                            dims.forEach(function (value){
                                dimensions += value+','
                                len *= (+value);
                            })
                            var length = len * sizeVal;

                            vscode.window.showInputBox({
                                placeHolder: 'Memory Display Type: Hex (default), Ascii, Decimal, Binary',
                                ignoreFocusOut: true,
                                prompt: 'Display Type'
                            }).then(
                                (displayType) => {
                                    displayType = displayType.trim()

                                    const addrEnc:string = encodeURIComponent(`${address}`);             
                                    const lenStr:string = length.toString();
                                    
                                    const array:string = 'true'
                                    const sizeStr:string = sizeVal.toString();
                                    const display:string = displayType;
                                    
                                    Reporting.sendEvent('Examine Array', 'Valid', `${address}-${lenStr}`); 
                                    this.accessMemory('examinearray', addrEnc, lenStr, dimensions, array, sizeStr,display)
                                },
                                (error) => {});
                        },
                        (error) => {});
                    },
                    (error) => {});
                },
                (error) => {});
    }
    
    private accessMemory(docName, addrEnc, lengthString, dimensions, array, size, display){
        // tslint:disable-next-line:max-line-length
        console.log(docName, addrEnc, lengthString, dimensions, array, size, display)
        vscode.workspace.openTextDocument(vscode.Uri.parse(`${docName}:///Memory%20[${addrEnc},${lengthString}].cdmem?address=${addrEnc}&length=${lengthString}&dimensions=${dimensions}&array=${array}&size=${size}&display=${display}`))
        .then((doc) => {
            vscode.window.showTextDocument(doc, { viewColumn: 2, preview: false });
            Reporting.sendEvent('Examine Memory', 'Used');
        }, (error) => {
            vscode.window.showErrorMessage(`Failed to examine memory: ${error}`);
            Reporting.sendEvent('Examine Memory', 'Error', error.toString());
        }); 
    }

    private examineMemory() {
        function validateValue(length) {
            if (/^0x[0-9a-f]{1,8}$/i.test(length)) {
                return length;
            }
            else if (/^[0-9]+$/i.test(length)) {
                return length;
            }
            else {
                return null;
            }
        }

        function validateAddress(address: string) {
            if (address === '') {
                return null;
            }
            return address;
        }

        if (!vscode.debug.activeDebugSession) {
            vscode.window.showErrorMessage('No debugging session available');
            return;
        }

        vscode.window.showInputBox({
            placeHolder: 'Enter a valid memory address. Use 0x prefix for hexidecimal numbers',
            ignoreFocusOut: true,
            prompt: 'Memory Address'
        }).then(
            (address) => {
                address = address.trim();
                if (!validateAddress(address)) {
                    vscode.window.showErrorMessage('Invalid memory address entered');
                    Reporting.sendEvent('Examine Memory', 'Invalid Address', address);
                    return;
                }

                vscode.window.showInputBox({
                    placeHolder: 'Enter a constant value. Prefix with 0x for hexidecimal format.',
                    ignoreFocusOut: true,
                    prompt: 'Length'
                }).then(
                    (length) => {
                        length = length.trim();
                        if (!validateValue(length)) {
                            vscode.window.showErrorMessage('Invalid length entered');
                            Reporting.sendEvent('Examine Memory', 'Invalid Length', length);
                            return;
                        }

                        const addrEnc:string = encodeURIComponent(`${address}`);             
                        const lenStr:string = length.toString();
                        const dimensions:string = '1,'+lenStr;
                        const array:string = 'false';
                        const sizeStr:string = '4';
                        const display:string = 'hex'

                        Reporting.sendEvent('Examine Memory', 'Valid', `${address}-${length}`);
                        // tslint:disable-next-line:max-line-length
                        this.accessMemory('examinememory', addrEnc, lenStr, dimensions, array, sizeStr,display)
                    },
                    (error) => {

                    }
                );
            },
            (error) => {

            }
        );
    }

    
    // Peripherals    
    private peripheralsUpdateNode(node: PeripheralBaseNode): void {
        node.performUpdate().then((result) => {
            if (result) {
                this.peripheralProvider.refresh();
                Reporting.sendEvent('Peripheral View', 'Update Node');
            }
        }, (error) => {
            vscode.window.showErrorMessage(`Unable to update value: ${error.toString()}`);
        });
    }

    private peripheralsCopyValue(node: PeripheralBaseNode): void {
        const cv = node.getCopyValue();
        if (cv) {
            vscode.env.clipboard.writeText(cv).then(() => {
                Reporting.sendEvent('Peripheral View', 'Copy Value');
            });
        }
    }

    private async peripheralsSetFormat(node: PeripheralBaseNode): Promise<void> {
        const result = await vscode.window.showQuickPick([
            { label: 'Auto', description: 'Automatically choose format (Inherits from parent)', value: NumberFormat.Auto },
            { label: 'Hex', description: 'Format value in hexidecimal', value: NumberFormat.Hexidecimal },
            { label: 'Decimal', description: 'Format value in decimal', value: NumberFormat.Decimal },
            { label: 'Binary', description: 'Format value in binary', value: NumberFormat.Binary }
        ]);

        node.format = result.value;
        this.peripheralProvider.refresh();
        Reporting.sendEvent('Peripheral View', 'Set Format', result.label);
    }

    private async peripheralsForceRefresh(node: PeripheralBaseNode): Promise<void> {
        node.getPeripheral().updateData().then((e) => {
            this.peripheralProvider.refresh();
        });
    }

    // Registers
    private registersCopyValue(node: BaseNode): void {
        const cv = node.getCopyValue();
        //console.log("register"+cv);
        if (cv) {
            vscode.env.clipboard.writeText(cv).then(() => {
                Reporting.sendEvent('Register View', 'Copy Value');
            });
        }
    }

    //Stack
    private stackCopyValue(node: BaseNode): void {
        const cv = node.getCopyValue();
        //console.log("register"+cv);
        if (cv) {
            vscode.env.clipboard.writeText(cv).then(() => {
                Reporting.sendEvent('Stack View', 'Copy Value');
            });
        }
    }

    // Debug Events
    private debugSessionStarted(session: vscode.DebugSession) {
        if (session.type !== 'cortex-arm-learning') { return; }

        // Clean-up Old output channels
        if (this.swo) {
            this.swo.dispose();
            this.swo = null;
        }

        this.functionSymbols = null;

        session.customRequest('get-arguments').then((args) => {
            let svdfile = args.svdFile;
            if (!svdfile) {
                svdfile = this.getSVDFile(args.device);
            }

            Reporting.beginSession(args as ConfigurationArguments);
            
            this.counterProvider.debugSessionStarted();
            this.stackProvider.debugSessionStarted();
            this.registerProvider.debugSessionStarted();
            this.peripheralProvider.debugSessionStarted(svdfile ? svdfile : null);

            if (this.swosource) { this.initializeSWO(args); }
        }, (error) => {
            // TODO: Error handling for unable to get arguments
        });
    }

    private debugSessionTerminated(session: vscode.DebugSession) {
        if (session.type !== 'cortex-arm-learning') { return; }

        Reporting.endSession();

        this.counterProvider.debugSessionTerminated();
        this.stackProvider.debugSessionTerminated();
        this.registerProvider.debugSessionTerminated();
        this.peripheralProvider.debugSessionTerminated();
        if (this.swo) {
            this.swo.debugSessionTerminated();
        }
        if (this.swosource) {
            this.swosource.dispose();
            this.swosource = null;
        }
        this.clearAdapterOutputChannel = true;
    }

    private receivedCustomEvent(e: vscode.DebugSessionCustomEvent) {
        if (vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type !== 'cortex-arm-learning') { return; }
        switch (e.event) {
            case 'custom-stop':
                this.receivedStopEvent(e);
                break;
            case 'custom-continued':
                this.receivedContinuedEvent(e);
                break;
            case 'swo-configure':
                this.receivedSWOConfigureEvent(e);
                break;
            case 'adapter-output':
                this.receivedAdapterOutput(e);
                break;
            case 'record-event':
                this.receivedEvent(e);
                break;
            default:
                break;
        }
    }

    private receivedStopEvent(e) {
        this.peripheralProvider.debugStopped();
        this.registerProvider.debugStopped();
        this.stackProvider.debugStopped();
        this.counterProvider.debugStopped();

        vscode.workspace.textDocuments.filter((td) => td.fileName.endsWith('.cdmem'))
            .forEach((doc) => { this.memoryProvider.update(doc); });
        if (this.swo) { this.swo.debugStopped(); }
    }

    private receivedContinuedEvent(e) {
        this.peripheralProvider.debugContinued();
        this.registerProvider.debugContinued();
        this.stackProvider.debugContinued();
        this.counterProvider.debugContinued();

        if (this.swo) { this.swo.debugContinued(); }
    }

    private receivedEvent(e) {
        Reporting.sendEvent(e.body.category, e.body.action, e.body.label, e.body.parameters);
    }

    private receivedSWOConfigureEvent(e) {
        if (e.body.type === 'socket') {
            this.swosource = new SocketSWOSource(e.body.port);
            Reporting.sendEvent('SWO', 'Source', 'Socket');
        }
        else if (e.body.type === 'fifo') {
            this.swosource = new FifoSWOSource(e.body.path);
            Reporting.sendEvent('SWO', 'Source', 'FIFO');
        }
        else if (e.body.type === 'file') {
            this.swosource = new FileSWOSource(e.body.path);
            Reporting.sendEvent('SWO', 'Source', 'File');
        }
        else if (e.body.type === 'serial') {
            this.swosource = new SerialSWOSource(e.body.device, e.body.baudRate, this.context.extensionPath);
            Reporting.sendEvent('SWO', 'Source', 'Serial');
        }

        if (vscode.debug.activeDebugSession) {
            vscode.debug.activeDebugSession.customRequest('get-arguments').then((args) => {
                this.initializeSWO(args);
            });
        }
    }

    private receivedAdapterOutput(e) {
        if (!this.adapterOutputChannel) {
            this.adapterOutputChannel = vscode.window.createOutputChannel('Adapter Output');
            this.adapterOutputChannel.show();
        } else if (this.clearAdapterOutputChannel) {
            this.adapterOutputChannel.clear();
        }
        this.clearAdapterOutputChannel = false;

        let output = e.body.content;
        if (!output.endsWith('\n')) { output += '\n'; }
        this.adapterOutputChannel.append(output);
    }

    private initializeSWO(args) {
        if (!this.swosource) {
            vscode.window.showErrorMessage('Tried to initialize SWO Decoding without a SWO data source');
            return;
        }

        this.swo = new SWOCore(this.swosource, args, this.context.extensionPath);
    }
}

function interpolateString(tpl: string, data: object): string {
	let re = /\$\{([^\}]+)\}/g, match;
	while (match = re.exec(tpl)) {
		let path = match[1].split('.').reverse();
		let obj = data[path.pop()];
		while (path.length) obj = obj[path.pop()];
		tpl = tpl.replace(match[0], obj)
	}
	return tpl;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "cortex-arm-learning" is now active!');
    
    const command = 'cortex-debud-master.make';
    const commandHandler = () => {
        const vars = {

            // - the path of the folder opened in VS Code
            workspaceFolder: vscode.workspace.rootPath,

            // - the name of the folder opened in VS Code without any slashes (/)
            workspaceFolderBasename: (vscode.workspace.rootPath)? path.basename(vscode.workspace.rootPath) : null,

            // - the current opened file
            file: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.fileName : null,

            // - the current opened file relative to workspaceFolder
            relativeFile: (vscode.window.activeTextEditor && vscode.workspace.rootPath) ? path.relative(
                vscode.workspace.rootPath,
                vscode.window.activeTextEditor.document.fileName
            ) : null,

            // - the current opened file's basename
            fileBasename: (vscode.window.activeTextEditor) ? path.basename(vscode.window.activeTextEditor.document.fileName) : null,

            // - the current opened file's basename with no file extension
            fileBasenameNoExtension: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).name : null,

            // - the current opened file's dirname
            fileDirname: (vscode.window.activeTextEditor) ? path.dirname(vscode.window.activeTextEditor.document.fileName) : null,

            // - the current opened file's extension
            fileExtname: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).ext : null,
            
            // - the task runner's current working directory on startup
            cwd: vscode.workspace.rootPath ||  require('os').homedir(), 
            
            //- the current selected line number in the active file
            lineNumber: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.selection.active.line + 1 : null,

            // - the current selected text in the active file
            selectedText: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection) : null,

            // - the path to the running VS Code executable
            execPath: process.execPath

        }

        const terminal = vscode.window.createTerminal({cwd: vars.cwd });
        terminal.show(true)
		terminal.sendText(interpolateString('make', vars))

    };
    
    let cmd = vscode.commands.registerCommand(command, commandHandler);
    context.subscriptions.push(cmd);

    let makeButton = vscode.window.createStatusBarItem(1,0);
    makeButton.color = 'white'
    makeButton.command = command
    makeButton.text = 'Build - Debugger'
    makeButton.tooltip = 'cortex-arm-learning'
    makeButton.show()
    return new CortexDebugExtension(context);
}

export function deactivate() {}
