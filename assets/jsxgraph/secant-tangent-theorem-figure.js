/* Secant and tangent from an external point P (secant-tangent theorem).
 * Secant meets the circle at A,B; tangent touches at T.  PT^2 = PA*PB,  PB = PA+AB.
 * Construction (points before the circle): place P at the origin, A,B on the secant
 * ray, and T at distance PT = sqrt(PA*PB) along the tangent direction. The circle is
 * then just the circumcircle of A,B,T; because |PT| equals the tangent length
 * sqrt(power), PT is automatically tangent to that circle at T.
 * In STACK:  var PA={#PA#}, PB={#PB#}, PT={#ta_pt#};
 */
var PA = 4, PB = 16, PT = 8;

var rad = Math.PI / 180;
var u = [Math.cos(150 * rad), Math.sin(150 * rad)];   // secant direction (A,B)
var w = [Math.cos(212 * rad), Math.sin(212 * rad)];   // tangent direction (T)

var Pp = [0, 0];
var Ap = [PA * u[0], PA * u[1]], Bp = [PB * u[0], PB * u[1]];
var Tp = [PT * w[0], PT * w[1]];

function circum(p1, p2, p3) {
    var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1];
    var d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    var cx = ((x1*x1 + y1*y1) * (y2 - y3) + (x2*x2 + y2*y2) * (y3 - y1) + (x3*x3 + y3*y3) * (y1 - y2)) / d;
    var cy = ((x1*x1 + y1*y1) * (x3 - x2) + (x2*x2 + y2*y2) * (x1 - x3) + (x3*x3 + y3*y3) * (x2 - x1)) / d;
    return [cx, cy];
}
var ctr = circum(Ap, Bp, Tp);
var rr  = Math.hypot(ctr[0] - Ap[0], ctr[1] - Ap[1]);
var pad = 1.2;

var board = JXG.JSXGraph.initBoard('jsx-intersecting-secants', {
    boundingbox: [ctr[0] - rr - pad, ctr[1] + rr + pad, Math.max(ctr[0] + rr, 0) + pad + 0.6, ctr[1] - rr - pad],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
});

board.create('circle', [ctr, rr], {strokeColor: '#178a8a', strokeWidth: 1.5, fixed: true});
board.create('segment', [Pp, Bp], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});  // secant
board.create('segment', [Pp, Tp], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});  // tangent

var A = board.create('point', Ap, {name: 'A', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [2, 12], anchorX: 'left', anchorY: 'bottom'}});
var B = board.create('point', Bp, {name: 'B', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, 12], anchorX: 'right', anchorY: 'bottom'}});
var T = board.create('point', Tp, {name: 'T', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, -12], anchorX: 'right', anchorY: 'top'}});
var P = board.create('point', Pp, {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [10, 0], anchorX: 'left', anchorY: 'middle'}});

function lbl(p1, p2, dx, dy, txt) {
    board.create('text', [(p1[0] + p2[0]) / 2 + dx, (p1[1] + p2[1]) / 2 + dy, txt],
        {anchorX: 'middle', anchorY: 'middle', fontSize: 13, fixed: true, cssStyle: 'color:#333'});
}
lbl(Pp, Ap, 0, 0.8, PA + ' cm');         // PA, above secant
lbl(Ap, Bp, 0, 0.8, PB - PA + ' cm');    // AB, above secant
lbl(Pp, Tp, 0, -0.8, '? cm');            // PT (unknown), below tangent
