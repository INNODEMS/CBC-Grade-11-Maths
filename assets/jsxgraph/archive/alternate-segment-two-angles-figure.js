/* Alternate Segment Theorem — two given tangent-chord angles (cf. Example 10.2.7).
 * PTL is the tangent at T; TS, TQ, SQ are chords; S is in the alternate segment.
 * Given angles at T:  PTQ = p  and  LTS = q.
 * Unknown inscribed angles:  alpha = TSQ (= p),  beta = TQS (= q).
 * In the STACK question the first two lines become  var p = {#p#};  var q = {#q#};
 */
var p = 55;
var q = 45;

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-3.4, 3.2, 3.4, -3.4],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

var R   = 2.5;
var rad = Math.PI / 180;
var aT  = 270;                       // T at the bottom; tangent is horizontal

/* invisible centre, just to draw the circle */
var O = board.create('point', [0, 0], {visible: false, fixed: true});
board.create('circle', [O, R], {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

/* points on the circle: arc TQ = 2p (CCW), arc ST = 2q */
var T = board.create('point', [R * Math.cos(aT * rad), R * Math.sin(aT * rad)],
    {name: 'T', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [0, -14], anchorX: 'middle', anchorY: 'top'}});
var Q = board.create('point', [R * Math.cos((aT + 2 * p) * rad), R * Math.sin((aT + 2 * p) * rad)],
    {name: 'Q', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [12, 2], anchorX: 'left', anchorY: 'middle'}});
var S = board.create('point', [R * Math.cos((aT - 2 * q) * rad), R * Math.sin((aT - 2 * q) * rad)],
    {name: 'S', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [-12, 2], anchorX: 'right', anchorY: 'middle'}});

/* tangent at T (horizontal): L on the left, P on the right */
var Ty = R * Math.sin(aT * rad);
var L = board.create('point', [-2.0, Ty],
    {name: 'L', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-4, -12], anchorX: 'right', anchorY: 'top'}});
var P = board.create('point', [2.0, Ty],
    {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [6, -2], anchorX: 'left', anchorY: 'middle'}});
board.create('segment', [L, P], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* chords / triangle TSQ */
board.create('segment', [T, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [T, S], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [S, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* given tangent-chord angles at T */
board.create('angle', [P, T, Q],
    {radius: 0.7, type: 'sector', selection: 'minor',
     fillColor: '#90caf9', fillOpacity: 0.5, strokeColor: '#1565c0',
     name: p + '°', fixed: true});
board.create('angle', [S, T, L],
    {radius: 0.55, type: 'sector', selection: 'minor',
     fillColor: '#ffcc80', fillOpacity: 0.5, strokeColor: '#ef6c00',
     name: q + '°', fixed: true});

/* unknown inscribed angles */
board.create('angle', [T, S, Q],
    {radius: 0.55, type: 'sector', selection: 'minor',
     fillColor: '#c5e1a5', fillOpacity: 0.5, strokeColor: '#558b2f',
     name: 'α', fixed: true});
board.create('angle', [T, Q, S],
    {radius: 0.55, type: 'sector', selection: 'minor',
     fillColor: '#ce93d8', fillOpacity: 0.5, strokeColor: '#7b1fa2',
     name: 'β', fixed: true});
