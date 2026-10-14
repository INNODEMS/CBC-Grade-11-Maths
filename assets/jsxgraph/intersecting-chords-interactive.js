/* Intersecting Chords Theorem — interactive JSXGraph construction.
 * Converted from the tkz-euclide statement figure, rebuilt as a live construction:
 *   - O (centre) is a hidden anchor and the circle is fixed;
 *   - A, B, C and D are gliders you can drag around the circle;
 *   - the blue chord AB, the red chord CD, and their intersection P all recompute
 *     automatically, as do the four segment-length labels and the two products.
 * It demonstrates that AP x PB = CP x PD wherever the four points sit.
 * Expects a div with id="jxgbox".
 */
var board = JXG.JSXGraph.initBoard('jsx-intersecting-chords', {
    boundingbox: [-4.2, 4.6, 4.6, -4.2],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

var R = 3;
function onC(d) { return [R * Math.cos(d * Math.PI / 180), R * Math.sin(d * Math.PI / 180)]; }

/* ---- centre + fixed circle ---- */
var O = board.create('point', [0, 0], {visible: false, fixed: true, name: 'O'});
var circle = board.create('circle', [O, R],
    {strokeColor: '#555', strokeWidth: 2, fixed: true});

/* ---- draggable points constrained to the circle (initial angles from the tkz) ---- */
var A = board.create('glider', [onC(175)[0], onC(175)[1], circle],
    {name: 'A', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-12, 0], anchorX: 'right', anchorY: 'middle'}});
var B = board.create('glider', [onC(18)[0], onC(18)[1], circle],
    {name: 'B', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [12, 2], anchorX: 'left', anchorY: 'middle'}});
var C = board.create('glider', [onC(248)[0], onC(248)[1], circle],
    {name: 'C', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-10, -8], anchorX: 'right', anchorY: 'top'}});
var D = board.create('glider', [onC(72)[0], onC(72)[1], circle],
    {name: 'D', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [0, 12], anchorX: 'middle', anchorY: 'bottom'}});

/* ---- the two chords ---- */
var chordAB = board.create('segment', [A, B], {strokeColor: '#1565c0', strokeWidth: 2.5});
var chordCD = board.create('segment', [C, D], {strokeColor: '#d32f2f', strokeWidth: 2.5});

/* ---- P: derived intersection of the two chords ---- */
var P = board.create('intersection', [chordAB, chordCD, 0],
    {name: 'P', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [8, 10], anchorX: 'left', anchorY: 'bottom'}});

/* ---- dynamic segment-length labels, nudged perpendicular to each chord ---- */
function lenLabel(P1, P2, sgn, colour) {
    var xf = function () {
        var dx = P2.X() - P1.X(), dy = P2.Y() - P1.Y();
        var L = Math.hypot(dx, dy) || 1;
        return (P1.X() + P2.X()) / 2 + sgn * 0.42 * (-dy / L);
    };
    var yf = function () {
        var dx = P2.X() - P1.X(), dy = P2.Y() - P1.Y();
        var L = Math.hypot(dx, dy) || 1;
        return (P1.Y() + P2.Y()) / 2 + sgn * 0.42 * (dx / L);
    };
    board.create('text', [xf, yf, function () { return P1.Dist(P2).toFixed(2); }],
        {anchorX: 'middle', anchorY: 'middle', fontSize: 14, fixed: true,
         cssStyle: 'color:' + colour + ';'});
}
lenLabel(A, P,  1, '#1565c0');   // AP
lenLabel(P, B,  1, '#1565c0');   // PB
lenLabel(C, P, -1, '#d32f2f');   // CP
lenLabel(P, D, -1, '#d32f2f');   // PD

/* ---- product read-outs, top right, proving the theorem live ---- */
board.create('text', [4.5, 4.4, function () {
    return 'AP · PB = ' + A.Dist(P).toFixed(2) + ' · ' + P.Dist(B).toFixed(2) + ' = ' + (A.Dist(P) * P.Dist(B)).toFixed(2);
}], {anchorX: 'right', anchorY: 'top', fontSize: 15, fixed: true,
     cssStyle: 'color:#1565c0;'});

board.create('text', [4.5, 3.8, function () {
    return 'CP · PD = ' + C.Dist(P).toFixed(2) + ' · ' + P.Dist(D).toFixed(2) + ' = ' + (C.Dist(P) * P.Dist(D)).toFixed(2);
}], {anchorX: 'right', anchorY: 'top', fontSize: 15, fixed: true,
     cssStyle: 'color:#d32f2f;'});
