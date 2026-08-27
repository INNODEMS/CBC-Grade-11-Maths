/* Interactive: place A on the circle so that P, A, B are collinear (secant PAB).
 * Fixed: circle, external P, B on circle, tangent point T (tangent PT drawn).
 * The circle is fixed by B, T and the tangent-at-T condition (independent of A).
 * A is a glider on the circle; segments PA and AB follow it so the student can
 * see when P, A, B line up. In STACK, A is bound to an input with bind_point.
 * Standalone (this file): A is a plain glider for visual testing.
 * JS needs only PB and PT to place B and T; PA is NOT used here.
 */
var PB = 16, PT = 8;

var rad = Math.PI / 180;
var u = [Math.cos(150 * rad), Math.sin(150 * rad)];   // secant direction (B sits here)
var w = [Math.cos(212 * rad), Math.sin(212 * rad)];   // tangent direction (T sits here)

var Pp = [0, 0];
var Bp = [PB * u[0], PB * u[1]];
var Tp = [PT * w[0], PT * w[1]];

/* circle tangent to line PT at T and passing through B */
function fixedCircle(P, T, B) {
    var dx = T[0] - P[0], dy = T[1] - P[1], L = Math.hypot(dx, dy);
    var nx = -dy / L, ny = dx / L;                 // unit perpendicular to PT
    var tbx = T[0] - B[0], tby = T[1] - B[1];
    var s = -(tbx * tbx + tby * tby) / (2 * (nx * tbx + ny * tby));
    return [[T[0] + s * nx, T[1] + s * ny], Math.abs(s)];
}
var fc = fixedCircle(Pp, Tp, Bp), ctr = fc[0], rr = fc[1];
var pad = 1.2;

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [ctr[0] - rr - pad, ctr[1] + rr + pad, Math.max(ctr[0] + rr, 0) + pad + 0.6, ctr[1] - rr - pad],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
});

var circle = board.create('circle', [ctr, rr], {strokeColor: '#178a8a', strokeWidth: 1.5, fixed: true});

var P = board.create('point', Pp, {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [10, 0], anchorX: 'left', anchorY: 'middle'}});
var B = board.create('point', Bp, {name: 'B', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, 12], anchorX: 'right', anchorY: 'bottom'}});
var T = board.create('point', Tp, {name: 'T', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, -12], anchorX: 'right', anchorY: 'top'}});

board.create('segment', [P, T], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});   // tangent (fixed)

/* draggable A on the circle (start away from the correct near point) */
var A = board.create('glider', [ctr[0], ctr[1] + rr, circle],
    {name: 'A', size: 4, fillColor: '#d32f2f', strokeColor: '#d32f2f', label: {offset: [8, 8]}});

/* live segments so the student sees when P, A, B are collinear */
board.create('segment', [P, A], {strokeColor: '#1565c0', strokeWidth: 2, dash: 0});
board.create('segment', [A, B], {strokeColor: '#1565c0', strokeWidth: 2, dash: 0});

/* AP labelled as the unknown x (midpoint of P-A, follows the glider) */
board.create('text', [
    function () { return (P.X() + A.X()) / 2 - 0.3; },
    function () { return (P.Y() + A.Y()) / 2 + 0.5; },
    'x'
], {anchorX: 'middle', anchorY: 'middle', fontSize: 15, fixed: true, cssStyle: 'color:#1565c0'});

/* AB labelled with its LIVE length (updates as A is dragged) */
board.create('text', [
    function () { return (A.X() + B.X()) / 2 - 0.3; },
    function () { return (A.Y() + B.Y()) / 2 + 0.5; },
    function () { return A.Dist(B).toFixed(1) + ' cm'; }
], {anchorX: 'middle', anchorY: 'middle', fontSize: 13, fixed: true, cssStyle: 'color:#1565c0'});

/* PT (given) on the tangent */
board.create('text', [
    (Pp[0] + Tp[0]) / 2 + 0.4,
    (Pp[1] + Tp[1]) / 2,
    PT + ' cm'
], {anchorX: 'left', anchorY: 'middle', fontSize: 13, fixed: true, cssStyle: 'color:#333'});
