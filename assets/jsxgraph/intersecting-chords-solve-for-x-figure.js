/* Intersecting chords with AP and PD given as expressions in x.
 * Geometry identical to the numeric version; only the AP and PD labels change.
 * In STACK:  var AP={#ta_AP#}, PB={#PB#}, CP={#CP#}, PD={#ta_PD#}, b1={#b1#}, b2={#b2#};
 */
var AP = 2, PB = 6, CP = 3, PD = 4;   // true numeric lengths (for geometry)
var b1 = -1, b2 = 1;                   // AP = x + b1,  PD = x + b2

var rad = Math.PI / 180;
var aAB = 20 * rad, aCD = 75 * rad;
var ux = Math.cos(aAB), uy = Math.sin(aAB);
var vx = Math.cos(aCD), vy = Math.sin(aCD);

var Ap = [-AP * ux, -AP * uy], Bp = [PB * ux, PB * uy];
var Cp = [-CP * vx, -CP * vy], Dp = [PD * vx, PD * vy];

function circum(p1, p2, p3) {
    var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1];
    var d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    var cx = ((x1*x1 + y1*y1) * (y2 - y3) + (x2*x2 + y2*y2) * (y3 - y1) + (x3*x3 + y3*y3) * (y1 - y2)) / d;
    var cy = ((x1*x1 + y1*y1) * (x3 - x2) + (x2*x2 + y2*y2) * (x1 - x3) + (x3*x3 + y3*y3) * (x2 - x1)) / d;
    return [cx, cy];
}
var ctr = circum(Ap, Bp, Cp);
var rr  = Math.hypot(ctr[0] - Ap[0], ctr[1] - Ap[1]);
var pad = 1.6;

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [ctr[0] - rr - pad, ctr[1] + rr + pad, ctr[0] + rr + pad, ctr[1] - rr - pad],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
});

board.create('circle', [ctr, rr], {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

var A = board.create('point', Ap, {name: 'A', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-12, -2], anchorX: 'right', anchorY: 'middle'}});
var B = board.create('point', Bp, {name: 'B', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [10, 8], anchorX: 'left', anchorY: 'bottom'}});
var C = board.create('point', Cp, {name: 'C', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-10, -8], anchorX: 'right', anchorY: 'top'}});
var D = board.create('point', Dp, {name: 'D', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [0, 12], anchorX: 'middle', anchorY: 'bottom'}});
var P = board.create('point', [0, 0], {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [9, -4], anchorX: 'left', anchorY: 'top'}});

board.create('segment', [A, B], {strokeColor: '#1565c0', strokeWidth: 2.5, fixed: true});
board.create('segment', [C, D], {strokeColor: '#d32f2f', strokeWidth: 2.5, fixed: true});

var nAB = [-uy, ux], nCD = [-vy, vx], off = 0.6;
function lbl(p1, p2, n, sgn, txt) {
    board.create('text',
        [(p1[0] + p2[0]) / 2 + sgn * off * n[0], (p1[1] + p2[1]) / 2 + sgn * off * n[1], txt],
        {anchorX: 'middle', anchorY: 'middle', fontSize: 13, fixed: true, cssStyle: 'color:#333'});
}
function xexp(b) { return '(x' + (b > 0 ? ' + ' + b : ' - ' + (-b)) + ') cm'; }

lbl(Ap, [0, 0], nAB,  1, xexp(b1));      // AP = x + b1
lbl([0, 0], Bp, nAB, -1, PB + ' cm');    // PB
lbl(Cp, [0, 0], nCD,  1, CP + ' cm');    // CP
lbl([0, 0], Dp, nCD,  1, xexp(b2));      // PD = x + b2
