/*
    Stacking functions / the sum rule  (Derivatives of Polynomials)
    ---------------------------------------------------------------
    f(x) = x² (blue), g(x) = 2x (green), h(x) = f + g = x² + 2x (purple).
    Drag the cursor along the x-axis. The coloured stack on the vertical line
    shows that the height of h is f + g. The short tangent segments on each curve
    show the gradients, and the readout confirms f'(x) + g'(x) = h'(x).

    Draggable: the cursor on the x-axis (x clamps to [−1, 3]).
*/

var board = JXG.JSXGraph.initBoard('stacking-functions', {
    boundingbox: [-1.7, 16, 3.7, -2.6],
    keepAspectRatio: false,
    axis: true,
    grid: {majorStep: 1, major: {face: 'line', strokeColor: '#c8c8c8', strokeOpacity: 0.4}},
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
var f  = function (x) { return x * x; },        fp = function (x) { return 2 * x; };
var g  = function (x) { return 2 * x; },        gp = function ()  { return 2; };
var h  = function (x) { return f(x) + g(x); },  hp = function (x) { return fp(x) + gp(); };
var XMIN = -1, XMAX = 3, X_START = 1, T = 0.55;   // T = tangent half-width
var BLUE = '#0055bb', GREEN = '#2e7d32', PURPLE = '#7b1fa2';

// --- Curves -----------------------------------------------------------------
board.create('functiongraph', [f, XMIN, XMAX], {strokeColor: BLUE,   strokeWidth: 2.2, name: ''});
board.create('functiongraph', [g, XMIN, XMAX], {strokeColor: GREEN,  strokeWidth: 2.2, name: ''});
board.create('functiongraph', [h, XMIN, XMAX], {strokeColor: PURPLE, strokeWidth: 2.6, name: ''});
board.create('text', [3.05, f(3),       'f = x²'],      {color: BLUE,   fontSize: 13, fixed: true, anchorX: 'left'});
board.create('text', [3.05, g(3) - 0.6, 'g = 2x'],      {color: GREEN,  fontSize: 13, fixed: true, anchorX: 'left'});
board.create('text', [2.15, h(2.5),     'h = x² + 2x'], {color: PURPLE, fontSize: 13, fixed: true, anchorX: 'left'});

// --- Draggable x cursor (on the x-axis) -------------------------------------
var cur = board.create('point', [X_START, 0], {
    name: 'x', size: 5, strokeColor: '#cc0000', fillColor: '#cc0000', face: 'o',
    label: {offset: [0, -16], color: '#cc0000', fontSize: 14, anchorX: 'middle'}
});
function constrainCur() {
    var x = Math.max(XMIN, Math.min(XMAX, cur.X()));
    cur.coords.setCoordinates(JXG.COORDS_BY_USER, [x, 0]);
}
cur.on('drag', constrainCur);
constrainCur();

var X = function () { return cur.X(); };

// Reference vertical line at the cursor
board.create('segment', [[X, -2.6], [X, 16]], {strokeColor: '#bbb', strokeWidth: 1, dash: 2});

// Stacked heights: blue 0→f, then green f→f+g=h (so the top sits on the h curve)
board.create('segment', [[X, 0], [X, function () { return f(cur.X()); }]],
    {strokeColor: BLUE, strokeWidth: 5, opacity: 0.5});
board.create('segment', [[X, function () { return f(cur.X()); }], [X, function () { return h(cur.X()); }]],
    {strokeColor: GREEN, strokeWidth: 5, opacity: 0.5});

// Points on each curve
var Pf = board.create('point', [X, function () { return f(cur.X()); }], {name: '', size: 3, color: BLUE,   fixed: true});
var Pg = board.create('point', [X, function () { return g(cur.X()); }], {name: '', size: 3, color: GREEN,  fixed: true});
var Ph = board.create('point', [X, function () { return h(cur.X()); }], {name: '', size: 4, color: PURPLE, fixed: true});

// Short tangent segments (gradients) on each curve
function tangentSeg(fn, dfn, color) {
    board.create('segment', [
        function () { return [cur.X() - T, fn(cur.X()) - dfn(cur.X()) * T]; },
        function () { return [cur.X() + T, fn(cur.X()) + dfn(cur.X()) * T]; }
    ], {strokeColor: color, strokeWidth: 3});
}
tangentSeg(f, fp,            BLUE);
tangentSeg(g, function () { return 2; }, GREEN);
tangentSeg(h, hp,           PURPLE);

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 0.25; },
    function () {
        var x = cur.X();
        return '<div style="background:rgba(255,255,255,0.88);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 'heights: <span style="color:' + BLUE + '">f=' + f(x).toFixed(2) + '</span> + '
            + '<span style="color:' + GREEN + '">g=' + g(x).toFixed(2) + '</span> = '
            + '<span style="color:' + PURPLE + '">h=' + h(x).toFixed(2) + '</span><br>'
            + 'slopes: <span style="color:' + BLUE + '">f′=' + fp(x).toFixed(2) + '</span> + '
            + '<span style="color:' + GREEN + '">g′=2.00</span> = '
            + '<span style="color:' + PURPLE + '">h′=' + hp(x).toFixed(2) + '</span>'
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
