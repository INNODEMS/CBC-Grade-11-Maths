/* Two chords AB and CD meeting at right angles at P, with P the midpoint of CD
 * (cf. the worked example). Then AP*PB = CP*PD = CP^2.
 * Because the perpendicular from the centre to a chord bisects it, AB (which is
 * perpendicular to CD and bisects it) passes through the centre -> AB is a diameter.
 * Geometry: P at origin, AB horizontal, CD vertical, C=(0,y), D=(0,-y).
 * In STACK:  var AP={#AP#}, PB={#PB#}, y={#y#};
 */
var AP = 3, PB = 12, y = 6;

var cx = (PB - AP) / 2;        // centre on the x-axis (= midpoint of AB)
var r  = (AP + PB) / 2;        // radius (AB is a diameter)
var pad = 1.3;

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [cx - r - pad, r + pad, cx + r + pad, -r - pad],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
});

board.create('circle', [[cx, 0], r], {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

var A = board.create('point', [-AP, 0], {name: 'A', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-12, 0], anchorX: 'right', anchorY: 'middle'}});
var B = board.create('point', [PB, 0],  {name: 'B', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [12, 0], anchorX: 'left', anchorY: 'middle'}});
var C = board.create('point', [0, y],   {name: 'C', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-6, 12], anchorX: 'right', anchorY: 'bottom'}});
var D = board.create('point', [0, -y],  {name: 'D', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-6, -12], anchorX: 'right', anchorY: 'top'}});
var P = board.create('point', [0, 0],   {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333', label: {offset: [-6, -12], anchorX: 'right', anchorY: 'top'}});

board.create('segment', [A, B], {strokeColor: '#1565c0', strokeWidth: 2.5, fixed: true});
board.create('segment', [C, D], {strokeColor: '#d32f2f', strokeWidth: 2.5, fixed: true});

/* right-angle mark at P (between PB east and PC north) */
board.create('angle', [B, P, C], {type: 'square', radius: 0.6, fillColor: '#bbb', fillOpacity: 0.6, strokeColor: '#666', fixed: true});

function lbl(x, yy, txt, ax, ay) {
    board.create('text', [x, yy, txt], {anchorX: ax, anchorY: ay, fontSize: 13, fixed: true, cssStyle: 'color:#333'});
}
lbl(-AP / 2, 0.35, AP + ' cm', 'middle', 'bottom');   // AP
lbl(PB / 2, 0.35, PB + ' cm', 'middle', 'bottom');    // PB
lbl(0.4, y / 2, 'y cm', 'left', 'middle');            // CP
lbl(0.4, -y / 2, 'y cm', 'left', 'middle');           // PD
