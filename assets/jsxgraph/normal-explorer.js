/*
    Tangent and normal  (Equations of Normals)
    -------------------------------------------
    f(x) = x². Drag the red point P along the curve. The tangent (orange) has
    gradient f'(a) = 2a; the normal (teal) is perpendicular to it, so its gradient
    is −1/(2a) and the two gradients multiply to −1. A right-angle square at P
    confirms the perpendicularity. At the vertex (a = 0) the tangent is horizontal
    and the normal is vertical.

    Draggable: P (x follows the pointer; y locked to the curve).
*/

var board = JXG.JSXGraph.initBoard('normal-explorer', {
    boundingbox: [-5.5, 10, 5.5, -1],
    keepAspectRatio: true,        // equal axis scaling so the right angle looks like 90°
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
var ORANGE = '#e8710a', TEAL = '#00897b';

// --- Construction -----------------------------------------------------------
board.create('functiongraph', [f, XMIN, XMAX], {strokeColor: '#0055bb', strokeWidth: 2.5, name: ''});
board.create('text', [-3.5, 8.8, 'f(x) = x²'], {color: '#0055bb', fontSize: 15, fixed: true});

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

// Tangent (orange) through P, and the normal (teal) as its perpendicular at P
var Qt = board.create('point', [function () { return P.X() + 1; },
                                function () { return f(P.X()) + fp(P.X()); }], {visible: false});
var tangent = board.create('line', [P, Qt], {strokeColor: ORANGE, strokeWidth: 2.5, fixed: true, highlight: false});
var normal  = board.create('perpendicular', [tangent, P], {strokeColor: TEAL, strokeWidth: 2.5, dash: 0, fixed: true, highlight: false});

// Right-angle square between tangent and normal at P
var Qn = board.create('glider', [P.X(), f(P.X()) + 1, normal], {visible: false});
board.create('angle', [Qt, P, Qn], {
    type: 'square', radius: 0.45, fillColor: '#bbbbbb', fillOpacity: 0.5,
    strokeColor: '#777', label: {visible: false}
});

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 0.25; },
    function () {
        var a = P.X(), mt = fp(a);
        var normalStr, prodStr;
        if (Math.abs(mt) < 1e-6) {
            normalStr = '<span style="color:' + TEAL + '">undefined (vertical)</span>';
            prodStr = '—';
        } else {
            normalStr = '<span style="color:' + TEAL + '">' + (-1 / mt).toFixed(2) + '</span>';
            prodStr = (mt * (-1 / mt)).toFixed(0);
        }
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 'tangent gradient = <span style="color:' + ORANGE + '">' + mt.toFixed(2) + '</span><br>'
            + 'normal gradient = ' + normalStr + '<br>'
            + 'product = ' + prodStr
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
