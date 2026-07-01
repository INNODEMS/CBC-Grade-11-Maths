/*
    Position → velocity: the stone, revisited
    -----------------------------------------
    s(t) = 20t − 5t² (height, m) in blue and its derivative v(t) = s′(t) = 20 − 10t
    (velocity, m/s) in orange, plotted against the same time axis. Drag the time
    marker t₀ along the t-axis. A shared vertical cursor links the two graphs:
      • the blue point is the stone's height s(t₀);
      • the orange tangent to s has slope = the stone's velocity, which is exactly
        the height of the orange point on the v-graph at the same time;
      • the green arrow at the stone shows its direction of motion — long and up
        near launch, shrinking to zero at the top (t = 2, v = 0), then reversing
        and growing as the stone falls.

    Draggable: t₀ (the red marker on the t-axis). Everything else follows from it.
*/

var board = JXG.JSXGraph.initBoard('kinematics-velocity', {
    boundingbox: [-0.8, 23, 4.8, -22],
    keepAspectRatio: false,
    axis: true,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: {enabled: false},
    zoom: {enabled: false},
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1, minorticks: 0},
            name: 't (s)', withLabel: true, label: {position: 'rt', offset: [-5, 14]}},
        y: {ticks: {insertTicks: false, ticksDistance: 5, minorticks: 0},
            name: '', withLabel: false}
    }
});

// --- Parameters -------------------------------------------------------------
var s = function (t) { return 20 * t - 5 * t * t; };   // height  (m)
var v = function (t) { return 20 - 10 * t; };          // velocity (m/s) = s'(t)
var TMIN = 0, TMAX = 4;
var T_START = 1;
var TAN_HALF = 0.7;       // half-width of the tangent drawn on s
var ARROW_SCALE = 0.18;   // m of arrow per m/s of velocity

// --- Construction: the two graphs -------------------------------------------
board.create('functiongraph', [s, TMIN, TMAX], {strokeColor: '#0055bb', strokeWidth: 2.5});
board.create('functiongraph', [v, TMIN, TMAX], {strokeColor: '#e8710a', strokeWidth: 2.5});

board.create('text', [2.05, 21.5, 's(t) = 20t − 5t²  (height, m)'],
    {color: '#0055bb', fontSize: 14, fixed: true, anchorX: 'middle'});
board.create('text', [3.05, -17, "v(t) = s′(t) = 20 − 10t  (m/s)"],
    {color: '#e8710a', fontSize: 14, fixed: true, anchorX: 'middle'});

// --- Time marker t₀ on the t-axis (free point, clamped to the axis) ----------
var T = board.create('point', [T_START, 0], {
    name: 't₀', size: 5, strokeColor: '#cc0000', fillColor: '#cc0000',
    label: {offset: [6, -16], color: '#cc0000', fontSize: 14}
});
// The blue height point is ALSO draggable — drag it along the position curve.
var Ps = board.create('point', [T_START, s(T_START)],
    {name: '', size: 5, strokeColor: '#0055bb', fillColor: '#0055bb'});

// Single source of truth for the time. Dragging EITHER the red marker or the blue
// point sets it, and both points (plus everything derived) snap to the new time.
function setTime(t) {
    t = Math.max(TMIN, Math.min(TMAX, t));
    T.coords.setCoordinates(JXG.COORDS_BY_USER, [t, 0]);
    Ps.coords.setCoordinates(JXG.COORDS_BY_USER, [t, s(t)]);
}
T.on('drag',  function () { setTime(T.X()); });
Ps.on('drag', function () { setTime(Ps.X()); });
setTime(T_START);

// Shared vertical cursor linking the two graphs at the chosen time
board.create('line', [
    function () { return [T.X(), board.getBoundingBox()[3]]; },
    function () { return [T.X(), board.getBoundingBox()[1]]; }
], {strokeColor: '#bbb', strokeWidth: 1, dash: 2, straightFirst: false, straightLast: false,
    fixed: true, highlight: false});

// Orange velocity point (derived — follows the time)
var Pv = board.create('point', [function () { return T.X(); }, function () { return v(T.X()); }],
    {name: '', size: 4, strokeColor: '#e8710a', fillColor: '#e8710a', fixed: true});

// Orange tangent to s at t₀ — its slope IS the velocity (the orange point's height)
board.create('segment', [
    function () { return [T.X() - TAN_HALF, s(T.X()) - v(T.X()) * TAN_HALF]; },
    function () { return [T.X() + TAN_HALF, s(T.X()) + v(T.X()) * TAN_HALF]; }
], {strokeColor: '#e8710a', strokeWidth: 1.5, dash: 2});

// Green motion arrow at the stone: direction & magnitude of velocity
var aBase = board.create('point', [function () { return T.X() + 0.07; }, function () { return s(T.X()); }],
    {visible: false});
var aTip = board.create('point', [function () { return T.X() + 0.07; },
    function () { return s(T.X()) + ARROW_SCALE * v(T.X()); }], {visible: false});
board.create('arrow', [aBase, aTip], {strokeColor: '#2e7d32', strokeWidth: 3});

// --- Dynamic readout --------------------------------------------------------
board.create('text', [
    function () { return board.getBoundingBox()[2] - 0.15; },
    function () { return board.getBoundingBox()[3] + 0.3; },
    function () {
        var t = T.X(), pos = s(t), vel = v(t);
        var status = Math.abs(vel) < 0.05 ? 'at the highest point — momentarily at rest'
            : (vel > 0 ? 'rising' : 'falling');
        return '<div style="background:rgba(255,255,255,0.85);padding:7px 11px;'
            + 'border-radius:5px;font-size:13px;color:#333;line-height:1.6">'
            + 't₀ = ' + t.toFixed(2) + ' s<br>'
            + '<span style="color:#0055bb">height s(t₀) = ' + pos.toFixed(2) + ' m</span><br>'
            + '<span style="color:#e8710a">velocity s′(t₀) = ' + vel.toFixed(2) + ' m/s</span><br>'
            + '<span style="color:#2e7d32">' + status + '</span>'
            + '<br><span style="color:#777;font-size:12px">acceleration s″(t) = −10 m/s² (constant)</span>'
            + '</div>';
    }
], {useHTML: true, anchorX: 'right', anchorY: 'bottom', fixed: true});
