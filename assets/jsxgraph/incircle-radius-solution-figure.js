/* ============================================================================
 * Inradius worked solution — STACK display figure (triangle + inscribed circle).
 * Same right-angled triangle as the question, now WITH the incircle drawn, its
 * centre I marked, and the inradius segment labelled r = ... cm.
 *
 * For a right triangle with the right angle at the origin and legs on the axes,
 * the incentre lies at (r, r): distance r from each leg. The circle of radius r
 * centred there is tangent to both legs and to the hypotenuse.
 *
 * Sample variant below. In the STACK general feedback these four lines become:
 *     var lh = {#legh#};
 *     var lv = {#legv#};
 *     var hp = {#hyp#};
 *     var r  = {#rad#};
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
var lh = 15;        // longer leg, cm   -> {#legh#}
var lv = 8;         // shorter leg, cm  -> {#legv#}
var hp = 17;        // hypotenuse, cm   -> {#hyp#}
var r  = 3;         // inradius, cm     -> {#rad#}

var s   = 6.0 / Math.max(lh, lv);
var bx  = lh * s, by = lv * s, pad = 1.6;

var board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [-pad, by + pad, bx + pad, -pad],
  keepaspectratio: true, axis: false, showCopyright: false,
  showNavigation: false, pan: { enabled: false }, zoom: { enabled: false }
});

var B = board.create('point', [0, 0],  { name: 'B', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [-9, -9], anchorX: 'right', anchorY: 'top' } });
var C = board.create('point', [bx, 0], { name: 'C', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [9, -7], anchorX: 'left', anchorY: 'top' } });
var A = board.create('point', [0, by], { name: 'A', size: 1, fixed: true,
    fillColor: '#333', strokeColor: '#333',
    label: { offset: [-8, 8], anchorX: 'right', anchorY: 'bottom' } });

board.create('polygon', [A, B, C], {
    borders: { strokeColor: '#1565c0', strokeWidth: 2, highlight: false },
    fillColor: '#1565c0', fillOpacity: 0.05, highlight: false,
    vertices: { visible: false } });
board.create('angle', [A, B, C], { type: 'square', radius: 0.55,
    strokeColor: '#333', fillColor: '#333', fillOpacity: 0.12,
    name: '', label: { visible: false }, highlight: false });

board.create('text', [-0.3, by / 2, lv + ' cm'],
    { anchorX: 'right', anchorY: 'middle', fontSize: 15, strokeColor: '#333', fixed: true });
board.create('text', [bx / 2, -0.3, lh + ' cm'],
    { anchorX: 'middle', anchorY: 'top', fontSize: 15, strokeColor: '#333', fixed: true });
board.create('text', [bx / 2 + 0.25, by / 2 + 0.25, hp + ' cm'],
    { anchorX: 'left', anchorY: 'bottom', fontSize: 15, strokeColor: '#333', fixed: true });

/* ---- inscribed circle: centre I=(r,r), radius r ---- */
var rs = r * s;
var I = board.create('point', [rs, rs], { name: 'I', size: 2, fixed: true,
    fillColor: '#0d8e8e', strokeColor: '#0d8e8e',
    label: { offset: [9, 5], anchorX: 'left', anchorY: 'middle' } });
board.create('circle', [I, rs], { strokeColor: '#0d8e8e', strokeWidth: 2.4,
    fillColor: '#0d8e8e', fillOpacity: 0.06, highlight: false });
board.create('segment', [I, [rs, 0]], { strokeColor: '#0d8e8e', strokeWidth: 1.6,
    dash: 2, highlight: false });
board.create('text', [rs + 0.18, rs / 2, 'r = ' + r + ' cm'],
    { anchorX: 'left', anchorY: 'middle', fontSize: 14, strokeColor: '#0d8e8e', fixed: true });
