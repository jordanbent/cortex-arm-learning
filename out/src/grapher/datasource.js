"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphDataSource {
    constructor() {
        this.data = {};
        this.subscriptions = {};
        this.counterStats = {};
    }
    receivedProgramCounterMessage(message) {
        if (!this.counterStats[message.function]) {
            this.counterStats[message.function] = 0;
        }
        this.counterStats[message.function] += 1;
    }
    getProgramCounterStats() {
        return Object.assign({}, this.counterStats);
    }
    receiveDataMessage(message) {
        const gp = {
            timestamp: message.timestamp,
            value: message.data
        };
        const graphId = message.id;
        if (!this.data[graphId]) {
            this.data[graphId] = [];
        }
        if (this.data[graphId]) {
            this.data[graphId].push(gp);
        }
        if (this.subscriptions[graphId]) {
            this.subscriptions[graphId].forEach((fn) => fn(gp));
        }
    }
    getData(graphId, start, end, pad = true) {
        let data = this.data[graphId];
        if (!data) {
            return [];
        }
        data = data.filter((gp) => gp.timestamp >= start && gp.timestamp <= end);
        if (pad && data.length >= 1) {
            const ep = data[data.length - 1];
            data.push({ timestamp: end, value: ep.value });
        }
        return data;
    }
    sampleData(graphId, sampleSize, start = null, end = null) {
        let data = this.data[graphId];
        if (!data) {
            return [];
        }
        if (start === null) {
            start = 0;
        }
        if (end == null) {
            end = new Date().getTime();
        }
        data = data.filter((gp) => gp.timestamp >= start && gp.timestamp <= end);
        if (data.length > sampleSize * 1.5) {
            const sampleRate = Math.round(data.length / sampleSize);
            data = data.filter((gp, idx) => idx % sampleRate === 0);
        }
        return data;
    }
    oldestPoint(graphId) {
        return this.data[graphId] ? this.data[graphId][0] : null;
    }
    subscribe(graphId, callback) {
        if (!this.subscriptions[graphId]) {
            this.subscriptions[graphId] = [];
        }
        this.subscriptions[graphId].push(callback);
    }
}
exports.GraphDataSource = GraphDataSource;
//# sourceMappingURL=datasource.js.map