/*
    Rate of cooling  (Differentiation in Real Life)
    ------------------------------------------------
    A cup of tea cools as T(t) = 80 − 20t + 2t² (°C), for 0 ≤ t ≤ 5 minutes.
    Drag the red point along the curve. The orange tangent's slope is the
    instantaneous rate of cooling T'(t) = −20 + 4t (°C per minute): steep and
    negative at first, then flattening to 0 at t = 5, where the tea has reached
    room temperature (30 °C, dashed line).

    Draggable: the point (t follows the pointer; T locked to the curve).
*/

var board = JXG.JSXGraph.initBoard('cooling-rate', {
    boundingbox: [-0.6, 88, 5.7, 20],
    keepAspectRatio: false,
    axis: true,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: {enabled: false},
    zoom: {enabled: false},
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 0},
            name: 't (min)', withLabel: true, label: {position: 'rt', offset: [-10, 14]}},
        y: {ticks: {insertTicks: false, ticksDistance: 10, minorticks: 1},
            name: 'T (°C)', withLabel: true, label: {position: 'rt', offset: [16, -5]}}
    }
});

// --- Parameters -------------------------------------------------------------
var T  = function (t) { return 80 - 20 * t + 2 * t * t; };
var Tp = function (t) { return -20 + 4 * t; };
var TMIN = 0, TMAX = 5, T_START = 1;
var ORANGE = '#e8710a', ROOM = 30;

// --- Construction -----------------------------------------------------------
// Room-temperature reference
board.create('segment', [[-0.6, ROOM], [5.7, ROOM]], {strokeColor: '#888', strokeWidth: 1, dash: 2});
board.create('text', [2.3, ROOM + 2.5, 'room temperature 30 °C'], {color: '#777', fontSize: 13, fixed: true});

board.create('functiongraph', [T, TMIN, TMAX], {strokeColor: '#0055bb', strokeWidth: 2.5, name: ''});
board.create('text', [0.15, 84.5, 'T(t) = 80 − 20t + 2t²'], {color: '#0055bb', fontSize: 14, fixed: true});

// Red point — t follows the pointer, T locked to the curve
var P = board.create('point', [T_START, T(T_START)], {
    name: '', size: 6, strokeColor: '#cc0000', fillColor: '#cc0000'
});
function constrainP() {
    var t = Math.max(TMIN, Math.min(TMAX, P.X()));
    P.coords.setCoordinates(JXG.COORDS_BY_USER, [t, T(t)]);
}
P.on('drag', constrainP);
constrainP();

// Orange tangent = instantaneous rate of cooling
var Qt = board.create('point', [function () { return P.X() + 1; },
                                function () { return T(P.X()) + Tp(P.X()); }], {visible: false});
board.create('line', [P, Qt], {strokeColor: ORANGE, strokeWidth: 2.5, fixed: true, highlight: false});

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 1.5; },
    function () {
        var t = P.X(), rate = Tp(t);
        var word = rate < -0.001 ? 'cooling' : (rate > 0.001 ? 'warming' : 'no change');
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 't = ' + t.toFixed(2) + ' min<br>'
            + 'T(t) = ' + T(t).toFixed(2) + ' °C<br>'
            + 'rate T′(t) = <span style="color:' + ORANGE + '">' + rate.toFixed(2) + ' °C/min</span>'
            + ' <span style="color:#777;font-size:12px">(' + word + ')</span>'
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
