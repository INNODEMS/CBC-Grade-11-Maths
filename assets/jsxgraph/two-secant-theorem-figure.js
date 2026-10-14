/* Two secants from an external point P (cf. Figure 10.4.13).
 * Two-secant theorem: PA*PB = PC*PD.  PB = PA + AB,  PD = PC + CD.
 * Construction (points first, then the circle): place P at the origin and mark
 * A,B on one ray and C,D on the other at their given distances; by the converse
 * of the two-secant theorem the four points are concyclic, so the circle is just
 * the circumcircle of any three of them (and P is automatically external).
 * In STACK:  var PA={#PA#}, PB={#PB#}, PC={#PC#}, PD={#ta_pd#};
 */
var PA = 4, PB = 12, PC = 3, PD = 16;

var rad = Math.PI / 180;
var u1 = [Math.cos(158 * rad), Math.sin(158 * rad)];   // upper secant direction
var u2 = [Math.cos(202 * rad), Math.sin(202 * rad)];   // lower secant direction

var Pp = [0, 0];
var Ap = [PA * u1[0], PA * u1[1]], Bp = [PB * u1[0], PB * u1[1]];
var Cp = [PC * u2[0], PC * u2[1]], Dp = [PD * u2[0], PD * u2[1]];

function circum(p1, p2, p3) {
    var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1];
    var d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    var cx = ((x1*x1 + y1*y1) * (y2 - y3) + (x2*x2 + y2*y2) * (y3 - y1) + (x3*x3 + y3*y3) * (y1 - y2)) / d;
    var cy = ((x1*x1 + y1*y1) * (x3 - x2) + (x2*x2 + y2*y2) * (x1 - x3) + (x3*x3 + y3*y3) * (x2 - x1)) / d;
    return [cx, cy];
}
var ctr = circum(Ap, Bp, Cp);
var rr  = Math.hypot(ctr[0] - Ap[0], ctr[1] - Ap[1]);
var pad = 1.2;

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [ctr[0] - rr - pad, ctr[1] + rr + pad, Math.max(ctr[0] + rr, 0) + pad + 0.6, ctr[1] - rr - pad],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
});

board.create('circle', [ctr, rr], {strokeColor: '#178a8a', strokeWidth: 1.5, fixed: true});

/* secant lines drawn from P out to the far points */
board.create('segment', [Pp, Bp], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [Pp, Dp], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

var A = board.create('point', Ap, {name: 'A', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [2, 12], anchorX: 'left', anchorY: 'bottom'}});
var B = board.create('point', Bp, {name: 'B', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, 12], anchorX: 'right', anchorY: 'bottom'}});
var C = board.create('point', Cp, {name: 'C', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [4, -12], anchorX: 'left', anchorY: 'top'}});
var D = board.create('point', Dp, {name: 'D', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-4, -12], anchorX: 'right', anchorY: 'top'}});
var P = board.create('point', Pp, {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [10, 0], anchorX: 'left', anchorY: 'middle'}});

function lbl(p1, p2, dy, txt) {
    board.create('text', [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + dy, txt],
        {anchorX: 'middle', anchorY: 'middle', fontSize: 13, fixed: true, cssStyle: 'color:#333'});
}
lbl(Pp, Ap,  0.8, PA + ' cm');     // PA, above upper secant
lbl(Ap, Bp,  0.8, PB - PA + ' cm'); // AB = PB - PA, above upper secant
lbl(Pp, Cp, -0.8, PC + ' cm');     // PC, below lower secant
