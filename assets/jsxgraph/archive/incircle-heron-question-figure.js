/* ============================================================================
 * Inradius (Heron) question — STACK display figure (non-right triangle).
 * Static randomised figure: a general (non-right-angled) triangle with its three
 * side lengths labelled. No incircle (that is shown in the worked solution).
 *
 * Base BC is the longest side (sc), B at the origin; apex A is reconstructed from
 * the three side lengths so the triangle is exact for any Heronian variant.
 *
 * Sample variant below (the classic 13-14-15 triangle, r = 4). In the STACK
 * question these three lines become:
 *     var sa = {#sa#};   // shortest side
 *     var sb = {#sb#};   // middle side  (= AB)
 *     var sc = {#sc#};   // longest side (= base BC)
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
var sa = 13;        // -> {#sa#}
var sb = 14;        // -> {#sb#}
var sc = 15;        // -> {#sc#}  (base, longest)

var s  = 6.0 / sc;                                   // scale: base = 6 board units
var Ax = (sb*sb - sa*sa + sc*sc) / (2*sc);
var Ay = Math.sqrt(Math.max(sb*sb - Ax*Ax, 0));      // apex height
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

// outward-offset side labels (push each edge midpoint away from the centroid)
var Gx = (A[0]+B[0]+C[0])/3, Gy = (A[1]+B[1]+C[1])/3;
function sideLabel(P, Q, txt) {
  var mx = (P[0]+Q[0])/2, my = (P[1]+Q[1])/2, dx = mx-Gx, dy = my-Gy, L = Math.sqrt(dx*dx+dy*dy) || 1;
  board.create('text', [mx + 0.5*dx/L, my + 0.5*dy/L, txt + ' cm'],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 14, strokeColor: '#333', fixed: true });
}
sideLabel(B, C, sc);   // base
sideLabel(A, B, sb);   // AB
sideLabel(C, A, sa);   // CA
