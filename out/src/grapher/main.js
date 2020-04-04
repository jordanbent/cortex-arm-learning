"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeseriesgraph_1 = require("./timeseriesgraph");
const xygraph_1 = require("./xygraph");
const datasource_1 = require("./datasource");
function init() {
    // let datasource: GraphDataSource = null;
    const graphs = [];
    function processConfiguration(message) {
        window.datasource = new datasource_1.GraphDataSource();
        message.graphs.forEach((config) => {
            if (config.type === 'realtime') {
                const graph = new timeseriesgraph_1.TimeseriesGraph(config, window.datasource);
                graphs.push(graph);
                if (message.status === 'stopped' || message.status === 'terminated') {
                    graph.stop();
                }
            }
            else if (config.type === 'x-y-plot') {
                const graph = new xygraph_1.XYGraph(config, window.datasource);
                graphs.push(graph);
                if (message.status === 'stopped' || message.status === 'terminated') {
                    graph.stop();
                }
            }
        });
        // const psg: ProgramStatsGraph = new ProgramStatsGraph(window.datasource);
        // if (message.status === 'stopped' || message.status === 'terminated') { psg.stop(); }
        // graphs.push(psg);
    }
    function processStatus(message) {
        if (message.status === 'stopped' || message.status === 'terminated') {
            graphs.forEach((g) => g.stop());
        }
        else if (message.status === 'continued') {
            graphs.forEach((g) => g.continue());
        }
    }
    function processData(message) {
        if (window.datasource) {
            window.datasource.receiveDataMessage(message);
        }
    }
    function processProgramCounter(message) {
        window.datasource.receivedProgramCounterMessage(message);
    }
    window.addEventListener('message', (event) => {
        const message = event.data;
        switch (message.type) {
            case 'configure':
                processConfiguration(message);
                break;
            case 'data':
                processData(message);
                break;
            case 'status':
                processStatus(message);
                break;
            case 'program-counter':
                processProgramCounter(message);
                break;
            default:
                console.log(`Got unrecognized message type: ${message.type}`);
                break;
        }
    });
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ type: 'init' });
}
init();
//# sourceMappingURL=main.js.map