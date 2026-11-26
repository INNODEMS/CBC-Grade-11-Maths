/* ============================================================================
 * Inradius question — STACK display figure (right triangle, sides labelled).
 * Static randomised figure: shows the right-angled triangle with its three side
 * lengths, but NOT the incircle (that is revealed in the worked solution).
 *
 * The legs/hyp below are a sample variant. In the STACK question text these three
 * lines become:
 *     var lh = {#legh#};   // longer leg  (horizontal)
 *     var lv = {#legv#};   // shorter leg (vertical)
 *     var hp = {#hyp#};
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
var lh = 15;        // longer leg, cm   -> {#legh#}
var lv = 8;         // shorter leg, cm  -> {#legv#}
var hp = 17;        // hypotenuse, cm   -> {#hyp#}

var s   = 6.0 / Math.max(lh, lv);     // scale so the longer leg is 6 board units
var bx  = lh * s, by = lv * s, pad = 1.6;

var board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [-pad, by + pad, bx + pad, -pad],
  keepaspectratio: true, axis: false, showCopyright: false,
  showNavigation: false, pan: { enabled: false }, zoom: { enabled: false }
});

/* ---- vertices (fixed: static display) ---- */
var B = board.create('point', [0, 0],  { name: 'B', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [-9, -9], anchorX: 'right', anchorY: 'top' } });
var C = board.create('point', [bx, 0], { name: 'C', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [9, -7], anchorX: 'left', anchorY: 'top' } });
var A = board.create('point', [0, by], { name: 'A', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [-8, 8], anchorX: 'right', anchorY: 'bottom' } });

/* ---- triangle + right-angle mark at B ---- */
board.create('polygon', [A, B, C], {
    borders: { strokeColor: '#1565c0', strokeWidth: 2, highlight: false },
    fillColor: '#1565c0', fillOpacity: 0.05, highlight: false,
    vertices: { visible: false } });
board.create('angle', [A, B, C], { type: 'square', radius: 0.55,
    strokeColor: '#333', fillColor: '#333', fillOpacity: 0.12,
    name: '', label: { visible: false }, highlight: false });

/* ---- side-length labels (true cm) ---- */
board.create('text', [-0.3, by / 2, lv + ' cm'],
    { anchorX: 'right', anchorY: 'middle', fontSize: 15, strokeColor: '#333', fixed: true });
board.create('text', [bx / 2, -0.3, lh + ' cm'],
    { anchorX: 'middle', anchorY: 'top', fontSize: 15, strokeColor: '#333', fixed: true });
board.create('text', [bx / 2 + 0.25, by / 2 + 0.25, hp + ' cm'],
    { anchorX: 'left', anchorY: 'bottom', fontSize: 15, strokeColor: '#333', fixed: true });
