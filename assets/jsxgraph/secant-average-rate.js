/*
    Average rate of change = slope of the secant line
    ---------------------------------------------------
    Stone in flight: s(t) = 20t - 5t² (height in metres, t in seconds).
    A and B are draggable points that stay ON the curve (gliders). The green
    secant line joins them; the grey right-triangle shows the run Δt and rise Δs.
    The readout reproduces the activity table: a, b, s(a), s(b), Δt, Δs and the
    average rate Δs/Δt (m/s). Drag A and B to any interval — e.g. [1,3] gives an
    average rate of 0, because the stone is at the same height at both times.

    Draggable: A, B (gliders on the curve).  Fixed: the curve, the axes.
*/

var board = JXG.JSXGraph.initBoard('secant-average-rate', {
    boundingbox: [-0.7, 23, 4.9, -3],
    keepAspectRatio: false,          // t and s have different units/scales
    axis: true,
    grid: {majorStep: 1, minorStep: 0.5},
    showCopyright: false,
    showNavigation: false,
    pan: {enabled: false},
    zoom: {enabled: false},
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 4},
            name: 't', withLabel: true,
            label: {position: 'rt', offset: [10, 12]}},
        y: {ticks: {insertTicks: false, ticksDistance: 5, minorticks: 4},
            name: 's', withLabel: true,
            label: {position: 'rt', offset: [12, 0]}}
    }
});

// --- Parameters -------------------------------------------------------------
var s = function (t) { return 20 * t - 5 * t * t; };   // stone height
var A_START = 1;      // default interval [1, 2]  ->  average rate 5 m/s
var B_START = 2;

// --- Construction (curve -> rail -> gliders -> secant) ----------------------
board.create('functiongraph', [s, 0, 4], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});

board.create('text', [0.15, 21.6, 's(t) = 20t − 5t²'], {
    color: '#0055bb', fontSize: 15, fixed: true
});

// Invisible curve used as the rail the two points glide along
var rail = board.create('functiongraph', [s, 0, 4], {visible: false});

var A = board.create('glider', [A_START, s(A_START), rail], {
    name: 'A', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: {offset: [-14, 8], color: '#1565c0', fontSize: 14}
});

var B = board.create('glider', [B_START, s(B_START), rail], {
    name: 'B', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: {offset: [10, 8], color: '#1565c0', fontSize: 14}
});

// Secant line through A and B (the average rate IS its slope)
board.create('line', [A, B], {
    strokeColor: '#2e7d32', strokeWidth: 2.5,
    straightFirst: true, straightLast: true
});

// --- Decorations: slope triangle (run Δt and rise Δs) -----------------------
// Corner of the right-triangle, at (t_B, s(a)): tracks both points.
var corner = function () { return [B.X(), A.Y()]; };

board.create('segment', [A, corner], {           // horizontal run Δt
    strokeColor: '#777', strokeWidth: 1.5, dash: 2
});
board.create('segment', [corner, B], {           // vertical rise Δs
    strokeColor: '#777', strokeWidth: 1.5, dash: 2
});

// Δt label under the run, Δs label beside the rise
board.create('text', [
    function () { return (A.X() + B.X()) / 2; },
    function () { return A.Y() - 1.4; },
    function () { return 'Δt'; }
], {color: '#555', fontSize: 13, fixed: true, anchorX: 'middle'});

board.create('text', [
    function () { return B.X() + 0.12; },
    function () { return (A.Y() + B.Y()) / 2; },
    function () { return 'Δs'; }
], {color: '#555', fontSize: 13, fixed: true, anchorX: 'left'});

// --- Dynamic readout (mirrors the activity table columns) -------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 1.7; },
    function () { return board.getBoundingBox()[3] + 2.8; },
    function () {
        var a = A.X(), b = B.X();
        var sa = s(a), sb = s(b);
        var dt = b - a, ds = sb - sa;
        var rate = Math.abs(dt) > 1e-6
            ? '<span style="color:#2e7d32">' + (ds / dt).toFixed(2) + ' m/s</span>'
            : '<span style="color:#999">—</span>';
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;line-height:1.7;font-size:13px;color:#333">'
            + 'a = ' + a.toFixed(2) + ' s,&nbsp; b = ' + b.toFixed(2) + ' s<br>'
            + 's(a) = ' + sa.toFixed(2) + ' m,&nbsp; s(b) = ' + sb.toFixed(2) + ' m<br>'
            + '<span style="color:#555">Δt = ' + dt.toFixed(2) + ' s,&nbsp; '
            + 'Δs = ' + ds.toFixed(2) + ' m</span><br>'
            + 'average rate = Δs/Δt = ' + rate
            + '</div>';
    }
], {
    useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true
});
