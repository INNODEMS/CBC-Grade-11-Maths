/* Alternate Segment Theorem with an algebraic equation (cf. Figure 10.2.18).
 * PT is the tangent at T, TQ a chord, S in the alternate segment.
 *   angle PTQ = (a1*x + b1) deg   (tangent-chord angle, marked at T)
 *   angle TSQ = (a2*x + b2) deg   (inscribed angle, marked at S)
 * They are equal by the theorem; both equal A degrees at the solution.
 * A drives the geometry; a1,b1,a2,b2 build the expression labels.
 * In STACK the first lines become  var A={#taA#}; var a1={#a1#}; ... etc.
 */
var A  = 55;
var a1 = 4, b1 = -5;     // angle PTQ expression
var a2 = 2, b2 = 25;     // angle TSQ expression

var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-3.4, 3.2, 3.4, -3.4],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

var R   = 2.5;
var rad = Math.PI / 180;
var aT  = 270;                       // T at the bottom; tangent horizontal

function lin(a, b) {                  // build a label like "(4x - 5)°"
    var s = a + 'x';
    if (b > 0)      s += ' + ' + b;
    else if (b < 0) s += ' - ' + (-b);
    return '(' + s + ')°';
}

var O = board.create('point', [0, 0], {visible: false, fixed: true});
board.create('circle', [O, R], {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

/* central angle TOQ = 2A, so Q is at aT + 2A; S at the major-arc midpoint (90 + A) */
var T = board.create('point', [R * Math.cos(aT * rad), R * Math.sin(aT * rad)],
    {name: 'T', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [0, -14], anchorX: 'middle', anchorY: 'top'}});
var Q = board.create('point', [R * Math.cos((aT + 2 * A) * rad), R * Math.sin((aT + 2 * A) * rad)],
    {name: 'Q', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [12, 2], anchorX: 'left', anchorY: 'middle'}});
var S = board.create('point', [R * Math.cos((90 + A) * rad), R * Math.sin((90 + A) * rad)],
    {name: 'S', size: 3, fixed: true, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [-12, 2], anchorX: 'right', anchorY: 'middle'}});

/* tangent at T (horizontal); only P is labelled, to the right */
var Ty = R * Math.sin(aT * rad);
var Lend = board.create('point', [-2.0, Ty], {visible: false, fixed: true});
var P = board.create('point', [2.0, Ty],
    {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [6, -2], anchorX: 'left', anchorY: 'middle'}});
board.create('segment', [Lend, P], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* chords / triangle TSQ */
board.create('segment', [T, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [T, S], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});
board.create('segment', [S, Q], {strokeColor: '#333', strokeWidth: 1.5, fixed: true});

/* angle PTQ = (a1 x + b1) at T */
board.create('angle', [P, T, Q],
    {radius: 0.7, type: 'sector', selection: 'minor',
     fillColor: '#90caf9', fillOpacity: 0.5, strokeColor: '#1565c0',
     name: lin(a1, b1), fixed: true});

/* angle TSQ = (a2 x + b2) at S */
board.create('angle', [T, S, Q],
    {radius: 0.6, type: 'sector', selection: 'minor',
     fillColor: '#c5e1a5', fillOpacity: 0.5, strokeColor: '#558b2f',
     name: lin(a2, b2), fixed: true});
