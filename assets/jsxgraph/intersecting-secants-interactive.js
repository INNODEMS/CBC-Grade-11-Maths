/* Two-Secant Theorem — interactive JSXGraph construction.
 * Adapted from the tkz-euclide statement figure, rebuilt as a live construction:
 *   - O (centre) is a hidden anchor and the circle is fixed;
 *   - P is a draggable external point;
 *   - A and C are gliders you drag around the circle — each sets the direction of
 *     one secant from P;
 *   - B and D are the far intersections of each secant with the circle, computed
 *     automatically, as are the four lengths and the two products.
 * It demonstrates that PA x PB = PC x PD (the power of the point P) wherever the
 * secants point. Expects a div with id="jsx-intersecting-secants".
 */
var board = JXG.JSXGraph.initBoard('jsx-intersecting-secants', {
    boundingbox: [-1.2, 3.4, 8.4, -3.0],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

/* ---- centre + fixed circle ---- */
var O = board.create('point', [4, 0], {visible: false, fixed: true, name: 'O'});
var circle = board.create('circle', [O, 2],
    {strokeColor: '#178a8a', strokeWidth: 2, fixed: true});

/* ---- draggable external point ---- */
var P = board.create('point', [0, 0],
    {name: 'P', size: 4, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-12, 0], anchorX: 'right', anchorY: 'middle'}});

/* ---- secant 1: glider A on the circle sets the direction; B is the far point ---- */
var A = board.create('glider', [2.108, 0.649, circle],
    {name: 'A', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-6, 10], anchorX: 'right', anchorY: 'bottom'}});
var linePA = board.create('line', [P, A], {visible: false});
var B = board.create('otherintersection', [circle, linePA, A],
    {name: 'B', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [10, 6], anchorX: 'left', anchorY: 'bottom'}});

/* ---- secant 2: glider C on the circle sets the direction; D is the far point ---- */
var C = board.create('glider', [2.057, -0.475, circle],
    {name: 'C', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [-6, -10], anchorX: 'right', anchorY: 'top'}});
var linePC = board.create('line', [P, C], {visible: false});
var D = board.create('otherintersection', [circle, linePC, C],
    {name: 'D', size: 3, fillColor: '#333', strokeColor: '#333',
     label: {offset: [10, -6], anchorX: 'left', anchorY: 'top'}});

/* ---- the two secants (drawn from P out to the far points) ---- */
board.create('segment', [P, B], {strokeColor: '#1565c0', strokeWidth: 2.5});
board.create('segment', [P, D], {strokeColor: '#d32f2f', strokeWidth: 2.5});

/* ---- dynamic length labels (external segment + whole secant on each) ---- */
function segLabel(from, to, frac, sgn, prefix, colour) {
    var xf = function () {
        var dx = to.X() - from.X(), dy = to.Y() - from.Y();
        var L = Math.hypot(dx, dy) || 1;
        return from.X() + frac * dx + sgn * 0.35 * (-dy / L);
    };
    var yf = function () {
        var dx = to.X() - from.X(), dy = to.Y() - from.Y();
        var L = Math.hypot(dx, dy) || 1;
        return from.Y() + frac * dy + sgn * 0.35 * (dx / L);
    };
    board.create('text', [xf, yf, function () { return prefix + ' = ' + from.Dist(to).toFixed(2); }],
        {anchorX: 'middle', anchorY: 'middle', fontSize: 13, fixed: true,
         cssStyle: 'color:' + colour + ';'});
}
segLabel(P, A, 0.5,  1, 'PA', '#1565c0');   // external segment, secant 1
segLabel(P, B, 0.85, 1, 'PB', '#1565c0');   // whole secant 1
segLabel(P, C, 0.5, -1, 'PC', '#d32f2f');   // external segment, secant 2
segLabel(P, D, 0.85, -1, 'PD', '#d32f2f');  // whole secant 2

/* ---- product read-outs, top right, proving the theorem live ---- */
board.create('text', [8.3, 3.2, function () {
    return 'PA · PB = ' + P.Dist(A).toFixed(2) + ' · ' + P.Dist(B).toFixed(2) + ' = ' + (P.Dist(A) * P.Dist(B)).toFixed(2);
}], {anchorX: 'right', anchorY: 'top', fontSize: 15, fixed: true,
     cssStyle: 'color:#1565c0;'});

board.create('text', [8.3, 2.6, function () {
    return 'PC · PD = ' + P.Dist(C).toFixed(2) + ' · ' + P.Dist(D).toFixed(2) + ' = ' + (P.Dist(C) * P.Dist(D)).toFixed(2);
}], {anchorX: 'right', anchorY: 'top', fontSize: 15, fixed: true,
     cssStyle: 'color:#d32f2f;'});
