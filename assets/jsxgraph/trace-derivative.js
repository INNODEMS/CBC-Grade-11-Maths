/*
    Tracing out the derivative  f → f′
    -----------------------------------
    f(x) = x³ − 4x (blue). Drag the red point P along the curve: a short red
    tangent shows the slope there, and the green point D sits directly above/below
    P at height equal to that slope, f′(x) = 3x² − 4. D leaves a trace, so dragging
    P across the curve builds the derivative graph in real time. The green trail
    crosses the x-axis exactly under the turning points of f (where the tangent is
    horizontal), is below the axis where f is falling, and above where f is rising.

    Draggable: P (glider on the curve). Everything else is derived from P.
    Note: the trail accumulates as you drag; reload the page to clear it. (A PreTeXt
    "reset" control could call board.clearTraces() if a clear button is wanted.)
*/

var board = JXG.JSXGraph.initBoard('trace-derivative', {
    boundingbox: [-2.8, 9, 2.8, -5.5],
    keepAspectRatio: false,
    axis: true,
    grid: {majorStep: 1, minorStep: 1},
    showCopyright: false,
    showNavigation: false,
    pan: {enabled: false},
    zoom: {enabled: false},
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 0},
            name: 'x', withLabel: true, label: {position: 'rt', offset: [10, 12]}},
        y: {ticks: {insertTicks: false, ticksDistance: 2, minorticks: 1},
            name: 'y', withLabel: true, label: {position: 'rt', offset: [12, 0]}}
    }
});

// --- Parameters -------------------------------------------------------------
var f  = function (x) { return x * x * x - 4 * x; };   // the function
var fp = function (x) { return 3 * x * x - 4; };       // its derivative
var XMIN = -2, XMAX = 2;        // drag / trace domain
var TAN_HALF = 0.7;            // half-width of the drawn tangent segment
var X_START = -2;             // P starts at the left end, drag rightwards

// --- Construction -----------------------------------------------------------
board.create('functiongraph', [f, XMIN, XMAX], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});
board.create('text', [0.25, 8.4, 'f(x) = x³ − 4x'], {
    color: '#0055bb', fontSize: 15, fixed: true
});

// Red point P. Instead of a glider (which would snap to the NEAREST point on the
// curve as the mouse moves), P's x-coordinate follows the pointer and its y is
// locked to the curve — so dragging always lands on the point of f with the same
// x as the mouse. The 'drag' handler re-projects y = f(x) on every move.
var P = board.create('point', [X_START, f(X_START)], {
    name: 'P', size: 6, strokeColor: '#cc0000', fillColor: '#cc0000',
    label: {offset: [-14, 8], color: '#cc0000', fontSize: 14}
});

function constrainP() {
    var x = Math.max(XMIN, Math.min(XMAX, P.X()));   // clamp to the curve's domain
    P.coords.setCoordinates(JXG.COORDS_BY_USER, [x, f(x)]);
}
P.on('drag', constrainP);
constrainP();   // sit exactly on the curve on load

// Short red tangent at P (slope = f′ there)
board.create('segment', [
    function () { return [P.X() - TAN_HALF, f(P.X()) - fp(P.X()) * TAN_HALF]; },
    function () { return [P.X() + TAN_HALF, f(P.X()) + fp(P.X()) * TAN_HALF]; }
], {strokeColor: '#cc0000', strokeWidth: 2.5, dash: 0});

// Green derivative point: same x, height = slope of the tangent. It TRACES.
var D = board.create('point', [
    function () { return P.X(); },
    function () { return fp(P.X()); }
], {
    name: '', size: 3, strokeColor: '#2e7d32', fillColor: '#2e7d32',
    trace: true
});

// Dashed connector: P (height f(x)) to D (height f′(x)) — same x
board.create('segment', [P, D], {strokeColor: '#999', strokeWidth: 1, dash: 2, fixed: true, highlight: false});

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 0.25; },
    function () {
        var x = P.X(), m = fp(x);
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 'x = ' + x.toFixed(2) + '<br>'
            + 'slope of tangent = '
            + '<span style="color:#2e7d32">f′(x) = ' + m.toFixed(2) + '</span>'
            + '<br><span style="color:#777;font-size:12px">drag P to trace y = f′(x)</span>'
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
