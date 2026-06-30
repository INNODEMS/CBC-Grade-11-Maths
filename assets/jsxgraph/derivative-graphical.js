var board = JXG.JSXGraph.initBoard('derivative-graphical', {
    boundingbox: [-3, 6, 3, -1],
    axis: true,
    grid: {majorStep: 1, major: {face: 'line', strokeColor: '#c0c0c0', strokeOpacity: 0.5}},
    showCopyright: false,
    showNavigation: false,
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 10},
            name: 'x', withLabel: true,
            label: {position: 'rt', offset: [0, 15]}},
        y: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 10},
            name: 'y', withLabel: true,
            label: {position: 'rt', offset: [15, 0]}}
    }
});

// --- Minor grid every 0.1 -------------------------------------------------
// JSXGraph 1.8.0's grid element renders no usable minor lines (minorElements
// draws nothing as lines, and its auto minorGrid over-draws ~70x for fine
// spacing). So we draw the minor grid ourselves as ONE faint curve whose data
// array is all the 0.1-spaced segments, separated by NaN breaks. Light (~130
// segments) and reliable. Sits on layer 0, behind the curve and axes.
function addFineGrid(board, step, color, opacity) {
    var c = board.create('curve', [[], []], {
        strokeColor: color, strokeWidth: 1, strokeOpacity: opacity,
        highlight: false, fixed: true, layer: 0, name: '', withLabel: false
    });
    c.updateDataArray = function () {
        var bb = board.getBoundingBox();              // [xmin, ymax, xmax, ymin]
        var xmin = bb[0], ymax = bb[1], xmax = bb[2], ymin = bb[3];
        var dx = [], dy = [], i, n, x, y;
        var x0 = Math.ceil(xmin / step) * step; n = Math.round((xmax - x0) / step);
        for (i = 0; i <= n; i++) { x = x0 + i * step; dx.push(x, x, NaN); dy.push(ymin, ymax, NaN); }
        var y0 = Math.ceil(ymin / step) * step; n = Math.round((ymax - y0) / step);
        for (i = 0; i <= n; i++) { y = y0 + i * step; dx.push(xmin, xmax, NaN); dy.push(y, y, NaN); }
        this.dataX = dx; this.dataY = dy;
    };
    return c;
}
addFineGrid(board, 0.1, '#e3e3e3', 0.9);   // faint grey lines every 0.1
board.update();

var f = function(x) { return x * x; };

board.create('functiongraph', [f, -3, 3], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});

board.create('text', [1.4, 5.6, 'f(x) = x\u00B2'], {
    color: '#0055bb', fontSize: 14, fixed: true
});

var hiddenCurve = board.create('functiongraph', [f, -3, 3], {visible: false});

var P = board.create('glider', [1, 1, hiddenCurve], {
    name: '', fillColor: '#cc0000', strokeColor: '#cc0000', size: 6
});

board.create('tangent', [P], {
    strokeColor: '#cc0000', strokeWidth: 2, dash: 1
});

board.create('text', [-2.8, -0.8, function() {
    var slope = 2 * P.X();
    return 'x\u2080 \u2248 ' + P.X().toFixed(1) +
           ',\u2002 slope = ' + slope.toFixed(2);
}], {fontSize: 14, fixed: true, color: '#cc0000'});