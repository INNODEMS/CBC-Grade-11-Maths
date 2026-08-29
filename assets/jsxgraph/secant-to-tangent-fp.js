var board = JXG.JSXGraph.initBoard('secant-to-tangent-fp', {
    boundingbox: [-0.5, 4, 5, -0.5],
    keepAspectRatio: true,
    axis: true,
    grid: {majorStep: 1, minorStep: 0.25},
    showCopyright: false,
    showNavigation: false,
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 2},
            name: 'x', withLabel: true,
            label: {position: 'rt', offset: [0, 15]}},
        y: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 2},
            name: 'y', withLabel: true,
            label: {position: 'rt', offset: [15, 0]}}
    }
});

var f = function(x) { return x * x; };

board.create('functiongraph', [f, -1, 5], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});

board.create('text', [2.5, 7.5, 'f(x) = x\u00B2'], {
    color: '#0055bb', fontSize: 14, fixed: true
});

// Invisible curve used as glider rail for both P and Q
var hiddenCurve = board.create('functiongraph', [f, -0.5, 4.5], {visible: false});

// Point P: draggable along the curve
var P = board.create('glider', [1, 1, hiddenCurve], {
    name: 'P', fillColor: '#cc0000', strokeColor: '#cc0000', size: 6,
    label: {offset: [-15, 10], color: '#cc0000', fontSize: 13}
});

// Point Q: also draggable along the curve
var Q = board.create('glider', [2, 4, hiddenCurve], {
    name: 'Q', fillColor: '#009900', strokeColor: '#009900', size: 6,
    label: {offset: [5, 10], color: '#009900', fontSize: 13}
});

// Dashed horizontal segment from P to Q at height of P (shows the run Δx)
board.create('segment', [
    function() { return [P.X(), f(P.X())]; },
    function() { return [Q.X(), f(P.X())]; }
], {
    strokeColor: '#888', strokeWidth: 1, dash: 2
});

// Secant line through P and Q
board.create('line', [P, Q], {
    strokeColor: '#009900', strokeWidth: 2,
    straightFirst: true, straightLast: true
});

// Tangent line at P
board.create('tangent', [P], {
    strokeColor: '#cc0000', strokeWidth: 2, dash: 2
});

// Info box anchored to bottom-right of board with semi-opaque white background
board.create('text', [
    function() { return board.getBoundingBox()[2] - 0.15; },
    function() { return board.getBoundingBox()[3] + 0.2; },
    function() {
        var x0 = P.X();
        var x1 = Q.X();
        var dx = x1 - x0;
        var secant = Math.abs(dx) > 0.0001
            ? (f(x1) - f(x0)) / dx
            : 2 * x0;
        var tangent = 2 * x0;
        return '<div style="background:rgba(255,255,255,0.82);padding:6px 10px;border-radius:4px;line-height:1.8">'
            + '<span style="color:#009900;font-size:13px">Secant slope \u2248 ' + secant.toFixed(3) + '</span><br>'
            + '<span style="color:#cc0000;font-size:13px">Tangent slope = ' + tangent.toFixed(3) + '</span><br>'
            + '<span style="color:#555;font-size:13px">x\u2080 = ' + x0.toFixed(2) + '</span>'
            + '</div>';
    }
], {
    useHTML: true,
    anchorX: 'right',
    anchorY: 'bottom',
    fixed: true
});
