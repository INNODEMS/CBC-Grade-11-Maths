/* ============================================================================
 * Inradius (Heron) worked solution — STACK display figure.
 * Same non-right triangle as the question, now WITH the inscribed circle drawn,
 * the incentre I marked, and the inradius segment labelled r = ... cm.
 *
 * The incentre is the weighted average of the vertices by opposite side length:
 *     I = (lA*A + lB*B + lC*C) / (lA + lB + lC),   lX = side opposite vertex X.
 * With the base BC on the x-axis, the y-coordinate of I equals the inradius.
 *
 * Sample variant below (13-14-15, r = 4). In the STACK general feedback these
 * four lines become:
 *     var sa = {#sa#};
 *     var sb = {#sb#};
 *     var sc = {#sc#};
 *     var r  = {#ta1#};   // inradius to 1 d.p. (label only)
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
var sa = 13;        // -> {#sa#}
var sb = 14;        // -> {#sb#}
var sc = 15;        // -> {#sc#}  (base, longest)
var r  = 4;         // -> {#ta1#}

var s  = 6.0 / sc;
var Ax = (sb*sb - sa*sa + sc*sc) / (2*sc);
var Ay = Math.sqrt(Math.max(sb*sb - Ax*Ax, 0));
var A = [Ax*s, Ay*s], B = [0, 0], C = [sc*s, 0];

var xmin = Math.min(A[0], B[0], C[0]), xmax = Math.max(A[0], B[0], C[0]);
var ymin = Math.min(A[1], B[1], C[1]), ymax = Math.max(A[1], B[1], C[1]);
var pad = 1.6;
var board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [xmin - pad, ymax + pad, xmax + pad, ymin - pad],
  keepaspectratio: true, axis: false, showCopyright: false,
  showNavigation: false, pan: { enabled: false }, zoom: { enabled: false }
});

var pA = board.create('point', A, { name: 'A', size: 1, fixed: true, fillColor: '#333', strokeColor: '#333', label: { offset: [0, 10], anchorX: 'middle', anchorY: 'bottom' } });
var pB = board.create('point', B, { name: 'B', size: 1, fixed: true, fillColor: '#333', strokeColor: '#333', label: { offset: [-9, -8], anchorX: 'right', anchorY: 'top' } });
var pC = board.create('point', C, { name: 'C', size: 1, fixed: true, fillColor: '#333', strokeColor: '#333', label: { offset: [9, -8], anchorX: 'left', anchorY: 'top' } });

board.create('polygon', [pA, pB, pC], {
    borders: { strokeColor: '#1565c0', strokeWidth: 2, highlight: false },
    fillColor: '#1565c0', fillOpacity: 0.05, highlight: false, vertices: { visible: false } });

var Gx = (A[0]+B[0]+C[0])/3, Gy = (A[1]+B[1]+C[1])/3;
function sideLabel(P, Q, txt) {
  var mx = (P[0]+Q[0])/2, my = (P[1]+Q[1])/2, dx = mx-Gx, dy = my-Gy, L = Math.sqrt(dx*dx+dy*dy) || 1;
  board.create('text', [mx + 0.5*dx/L, my + 0.5*dy/L, txt + ' cm'],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 14, strokeColor: '#333', fixed: true });
}
sideLabel(B, C, sc);
sideLabel(A, B, sb);
sideLabel(C, A, sa);

// incentre + inscribed circle
var lA = sc*s, lB = sa*s, lC = sb*s, P = lA + lB + lC;   // lX = side opposite vertex X
var Ix = (lA*A[0] + lB*B[0] + lC*C[0]) / P;
var Iy = (lA*A[1] + lB*B[1] + lC*C[1]) / P;               // = inradius (base on x-axis)
var I = board.create('point', [Ix, Iy], { name: 'I', size: 2, fixed: true, fillColor: '#0d8e8e', strokeColor: '#0d8e8e', label: { offset: [8, 4], anchorX: 'left', anchorY: 'middle' } });
board.create('circle', [I, [Ix, 0]], { strokeColor: '#0d8e8e', strokeWidth: 2.4, fillColor: '#0d8e8e', fillOpacity: 0.06, highlight: false });
board.create('segment', [I, [Ix, 0]], { strokeColor: '#0d8e8e', strokeWidth: 1.6, dash: 2, highlight: false });
board.create('text', [Ix + 0.18, Iy/2, 'r = ' + r + ' cm'], { anchorX: 'left', anchorY: 'middle', fontSize: 14, strokeColor: '#0d8e8e', fixed: true });
