"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
class XYGraph {
    constructor(configuration, datasource) {
        this.configuration = configuration;
        this.datasource = datasource;
        this.span = 10 * 1000;
        this.stopped = false;
        this.height = 350;
        this.width = 350;
        this.margins = {
            top: 30,
            right: 30,
            left: 40,
            bottom: 60
        };
        this.span = configuration.timespan * 1000;
        this.x = d3.scaleLinear().range([0, this.width]).domain([configuration.xMinimum || 0, configuration.xMaximum || 65535]);
        this.y = d3.scaleLinear().range([this.height, 0]).domain([configuration.yMinimum || 0, configuration.yMaximum || 65535]);
        this.currentX = configuration.initialX || (((configuration.xMinimum || 0) + (configuration.xMaximum || 65535)) / 2);
        this.currentY = configuration.initialY || (((configuration.yMinimum || 0) + (configuration.yMaximum || 65535)) / 2);
        this.line = d3.line().x((d) => this.x(d.x)).y((d) => this.y(d.y));
        const wrapper = d3.select('.graph-container').append('div').attr('class', 'graph-wrapper');
        wrapper.append('h3').text(configuration.label);
        // tslint:disable-next-line:max-line-length
        this.svg = wrapper.append('svg').attr('width', this.width + this.margins.left + this.margins.right).attr('height', this.height + this.margins.top + this.margins.bottom);
        this.g = this.svg.append('g').attr('transform', `translate(${this.margins.left},${this.margins.top})`);
        this.xAxis = this.g.append('g').attr('transform', `translate(0,${this.height})`).call(d3.axisBottom(this.x));
        this.yAxis = this.g.append('g').call(d3.axisLeft(this.y));
        datasource.subscribe(configuration.xGraphId, this.receivedX.bind(this));
        datasource.subscribe(configuration.yGraphId, this.receivedY.bind(this));
        this.path = this.g.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5);
        window.requestAnimationFrame(this.updateGraph.bind(this));
        this.points = [];
    }
    stop() {
        this.stopped = true;
    }
    continue() {
        this.stopped = false;
    }
    receivedX(point) {
        const xy = {
            timestamp: point.timestamp,
            y: this.currentY,
            x: point.value
        };
        this.currentX = point.value;
        this.points.push(xy);
    }
    receivedY(point) {
        const xy = {
            timestamp: point.timestamp,
            y: point.value,
            x: this.currentX
        };
        this.currentY = point.value;
        this.points.push(xy);
    }
    updateGraph() {
        if (!this.stopped) {
            try {
                const now = new Date().getTime();
                const limit = now - this.span;
                if (this.points.length > 0) {
                    const last = this.points[this.points.length - 1];
                    this.points = this.points.filter((xy) => xy.timestamp >= limit);
                    if (this.points.length === 0) {
                        this.points.push(last);
                    }
                    this.path.datum(this.points).attr('d', this.line);
                }
            }
            catch (e) {
                console.log('Error Updating Plot: ', e);
            }
        }
        window.requestAnimationFrame(this.updateGraph.bind(this));
    }
}
exports.XYGraph = XYGraph;
//# sourceMappingURL=xygraph.js.map