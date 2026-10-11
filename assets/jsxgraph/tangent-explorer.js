/*
    Equation of a tangent line  (Equations of Tangents)
    ----------------------------------------------------
    f(x) = x². Drag the red point P along the curve: the tangent rotates, its
    gradient is f'(a) = 2a, and its equation y = 2a·x − a² updates live. Dashed
    projections mark a on the x-axis and f(a) on the y-axis.

    Draggable: P (its x follows the pointer; y is locked to the curve).
*/

var board = JXG.JSXGraph.initBoard('tangent-explorer', {
    boundingbox: [-5.5, 10, 5.5, -1],
    keepAspectRatio: true,        // equal axis scaling so gradients read true
    axis: true,
    grid: {majorStep: 1, major: {face: 'line', strokeColor: '#c0c0c0', strokeOpacity: 0.5}},
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
var f  = function (x) { return x * x; };
var fp = function (x) { return 2 * x; };
var XMIN = -3, XMAX = 3, X_START = 1.2;

// --- Construction -----------------------------------------------------------
board.create('functiongraph', [f, XMIN, XMAX], {strokeColor: '#0055bb', strokeWidth: 2.5, name: ''});
board.create('text', [-3.5, 8.8, 'f(x) = x²'], {color: '#0055bb', fontSize: 15, fixed: true});

// Red point P — x follows the pointer, y locked to the curve
var P = board.create('point', [X_START, f(X_START)], {
    name: 'P', size: 6, strokeColor: '#cc0000', fillColor: '#cc0000',
    label: {offset: [-16, 8], color: '#cc0000', fontSize: 14}
});
function constrainP() {
    var x = Math.max(XMIN, Math.min(XMAX, P.X()));
    P.coords.setCoordinates(JXG.COORDS_BY_USER, [x, f(x)]);
}
P.on('drag', constrainP);
constrainP();

// Tangent line: through P with slope f'(a). Helper point gives the direction.
var Qt = board.create('point', [function () { return P.X() + 1; },
                                function () { return f(P.X()) + fp(P.X()); }], {visible: false});
board.create('line', [P, Qt], {strokeColor: '#cc0000', strokeWidth: 2.5, fixed: true, highlight: false});

// Dashed projections to the axes
board.create('segment', [P, [function () { return P.X(); }, 0]], {strokeColor: '#999', strokeWidth: 1, dash: 2, fixed: true, highlight: false});
board.create('segment', [P, [0, function () { return P.Y(); }]], {strokeColor: '#999', strokeWidth: 1, dash: 2, fixed: true, highlight: false});
board.create('text', [function () { return P.X(); }, -0.7, 'a'], {fontSize: 14, color: '#444', anchorX: 'middle', fixed: true});
board.create('text', [-0.2, function () { return P.Y(); }, 'f(a)'], {fontSize: 14, color: '#444', anchorX: 'right', fixed: true});

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 0.25; },
    function () {
        var a = P.X(), m = fp(a), c = f(a) - m * a;   // c = -a²
        var sign = c >= 0 ? ' + ' : ' − ';
        var eqn = 'y = ' + m.toFixed(2) + 'x' + sign + Math.abs(c).toFixed(2);
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 'a = ' + a.toFixed(2) + '<br>'
            + 'gradient f′(a) = 2a = <span style="color:#cc0000">' + m.toFixed(2) + '</span><br>'
            + 'tangent: <span style="color:#cc0000">' + eqn + '</span>'
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
