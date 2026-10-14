/* Alternate Segment Theorem — STACK display figure (fixed variant).
 * Converted from the tkz-euclide source. theta is the central angle TOQ.
 * In the STACK question this line becomes:  var theta = {#theta#};
 */
var theta = 80;                 // central angle TOQ (degrees)

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-3.3, 3.2, 3.3, -3.4],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

var R   = 2.5;
var rad = Math.PI / 180;

/* ---- points (fixed: this is a static randomised display) ---- */
var O = board.create('point', [0, 0],
    {name: 'O', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [8, 8]}});

var Tang = 270 * rad;
var T = board.create('point', [R * Math.cos(Tang), R * Math.sin(Tang)],
    {name: 'T', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [0, -14], anchorX: 'middle', anchorY: 'top'}});

var Qang = (270 + theta) * rad;
var Q = board.create('point', [R * Math.cos(Qang), R * Math.sin(Qang)],
    {name: 'Q', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [12, 0], anchorX: 'left', anchorY: 'middle'}});

var Sang = (90 + theta / 2) * rad;     // midpoint of the major arc (alternate segment)
var S = board.create('point', [R * Math.cos(Sang), R * Math.sin(Sang)],
    {name: 'S', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [-10, 10], anchorX: 'right', anchorY: 'bottom'}});

/* ---- circle ---- */
board.create('circle', [O, R], {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

/* ---- tangent at T: horizontal line (perpendicular to radius OT) ---- */
var Px = R * Math.cos(Tang) + 1.7;
var Lx = R * Math.cos(Tang) - 1.2;
var P = board.create('point', [Px, R * Math.sin(Tang)],
    {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [6, -12], anchorX: 'left', anchorY: 'top'}});
var Lend = board.create('point', [Lx, R * Math.sin(Tang)], {visible: false, fixed: true});
board.create('segment', [Lend, P], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* ---- radii (gray) and triangle TSQ ---- */
board.create('segment', [O, T], {strokeColor: '#aaa', strokeWidth: 1, fixed: true});
board.create('segment', [O, Q], {strokeColor: '#aaa', strokeWidth: 1, fixed: true});
board.create('segment', [T, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [T, S], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [S, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* ---- central angle TOQ = theta (given) ---- */
board.create('angle', [T, O, Q],
    {radius: 0.6, type: 'sector', selection: 'minor',
     fillColor: '#ffb74d', fillOpacity: 0.5, strokeColor: '#ef6c00',
     name: theta + '°', fixed: true});

/* ---- tangent-chord angle PTQ = unknown ---- */
board.create('angle', [P, T, Q],
    {radius: 0.7, type: 'sector', selection: 'minor',
     fillColor: '#90caf9', fillOpacity: 0.5, strokeColor: '#1565c0',
     name: '?', fixed: true});
