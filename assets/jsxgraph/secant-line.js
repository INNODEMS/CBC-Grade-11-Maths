/*
    Secant line = average rate of change (generic concept figure)
    -------------------------------------------------------------
    Replaces the static CNX secant image. A generic curve y = f(x) with two
    points (a, f(a)) and (a+h, f(a+h)) that the student can drag ALONG the curve
    (gliders). The green secant joins them; dashed projections drop to both axes
    so a, a+h, f(a), f(a+h) can be read off. The readout shows the secant slope,
    which equals the average rate of change of f over [a, a+h]. No grid.

    Draggable: the two points (gliders on the curve). Fixed: the curve, the axes.
*/

JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('secant-line', {
    boundingbox: [-2.4, 9, 9, -1.8],
    keepAspectRatio: false,
    axis: true,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: {enabled: false},
    zoom: {enabled: false},
    defaultAxes: {
        x: {ticks: {visible: false}, name: 'x', withLabel: true,
            label: {position: 'rt', offset: [10, 12]}},
        y: {ticks: {visible: false}, name: 'y', withLabel: true,
            label: {position: 'rt', offset: [12, 0]}}
    }
});

// --- Parameters -------------------------------------------------------------
// A generic increasing curve whose slope visibly changes, so the secant slope
// (average rate) clearly differs from the curve's steepness at either end.
var f = function (x) { return 0.055 * x * x * x - 0.52* x * x + 1.8 * x + 1.5; };
var A_START = 1;     // default left point  -> x = a
var B_START = 6;     // default right point -> x = a + h

// --- Construction (curve -> rail -> gliders -> secant) ----------------------
board.create('functiongraph', [f, -3, 9], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});
board.create('text', [5.4, 8.3, '\\(y = f(x)\\)'], {
    color: '#0055bb', fontSize: 15, fixed: true
});
    
var rail = board.create('functiongraph', [f, 0, 8], {visible: false});

var Pa = board.create('glider', [A_START, f(A_START), rail], {
    name: '\\((a,f(a))\\)', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: {offset: [5, -5], anchorX: 'left', anchorY: 'top', color: '#1565c0', fontSize: 14}
});
var Pb = board.create('glider', [B_START, f(B_START), rail], {
    name: '\\((a+h,f(a+h))\\)', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: {offset: [-5, 5], anchorX: 'right', anchorY: 'bottom', color: '#1565c0', fontSize: 14}
});

// Secant line through the two points (its slope IS the average rate of change)
board.create('line', [Pa, Pb], {
    strokeColor: '#2e7d32', strokeWidth: 2.5,
    straightFirst: true, straightLast: true
});

// --- Decorations: dashed projections to both axes ---------------------------
// Verticals down to the x-axis
board.create('segment', [Pa, [function () { return Pa.X(); }, 0]],
    {strokeColor: '#999', strokeWidth: 1, dash: 2});
board.create('segment', [Pb, [function () { return Pb.X(); }, 0]],
    {strokeColor: '#999', strokeWidth: 1, dash: 2});
// Horizontals across to the y-axis
board.create('segment', [Pa, [0, function () { return Pa.Y(); }]],
    {strokeColor: '#999', strokeWidth: 1, dash: 2});
board.create('segment', [Pb, [0, function () { return Pb.Y(); }]],
    {strokeColor: '#999', strokeWidth: 1, dash: 2});

// Axis labels for a, a+h (below x-axis) and f(a), f(a+h) (left of y-axis)
board.create('text', [function () { return Pa.X() + 0.1; }, -0.55, '\\(a\\)'],
    {fontSize: 14, color: '#444', anchorX: 'middle', fixed: true});
board.create('text', [function () { return Pb.X(); }, -0.55, '\\(a+h\\)'],
    {fontSize: 14, color: '#444', anchorX: 'middle', fixed: true});
board.create('text', [-0.2, function () { return Pa.Y(); }, '\\(f(a)\\)'],
    {fontSize: 14, color: '#444', anchorX: 'right', fixed: true});
board.create('text', [-0.2, function () { return Pb.Y(); }, '\\(f(a+h)\\)'],
    {fontSize: 14, color: '#444', anchorX: 'right', fixed: true});

// --- Dynamic readout --------------------------------------------------------
// board.create('text', [
//     function () { return board.getBoundingBox()[2] - 0.15; },
//     function () { return board.getBoundingBox()[3] + 0.25; },
//     function () {
//         var dx = Pb.X() - Pa.X();
//         var slope = Math.abs(dx) > 1e-6 ? (f(Pb.X()) - f(Pa.X())) / dx : null;
//         var val = slope === null ? '—' : slope.toFixed(2);
//         return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
//             + 'border-radius:5px;font-size:13px;color:#333">'
//             + 'secant slope = '
//             + '<span style="color:#2e7d32">' + val + '</span>'
//             + '<br><span style="color:#777;font-size:12px">= average rate of change over [a, a+h]</span>'
//             + '</div>';
//     }
// ], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
