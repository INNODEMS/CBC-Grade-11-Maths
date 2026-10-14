/* Alternate Segment Theorem — interactive JSXGraph construction.
 * Converted from the tkz-euclide figure, rebuilt as a live construction:
 *   - O (centre) and T (contact point) are fixed anchors;
 *   - Q and S are gliders you can drag around the circle;
 *   - the tangent at T, the chord TQ, triangle TSQ and all three angle marks
 *     recompute automatically.
 * It shows that the tangent-chord angle PTQ stays equal to half the central
 * angle TOQ, and to the inscribed angle TSQ in the alternate segment.
 * Expects a div with id="jxgbox".
 */
var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-3.6, 3.4, 3.6, -3.6],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

var R = 2.5;
/* minor (non-reflex) angle ABC in degrees, computed from coordinates */
function deg(A, B, C) {
    var a1 = Math.atan2(A.Y() - B.Y(), A.X() - B.X());
    var a2 = Math.atan2(C.Y() - B.Y(), C.X() - B.X());
    var d = Math.abs(a1 - a2) * 180 / Math.PI;
    return d > 180 ? 360 - d : d;
}

/* ---- fixed anchors ---- */
var O = board.create('point', [0, 0],
    {name: 'O', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [8, 8]}});
var T = board.create('point', [0, -R],
    {name: 'T', size: 3, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [0, -14], anchorX: 'middle', anchorY: 'top'}});

var circle = board.create('circle', [O, R],
    {strokeColor: '#888', strokeWidth: 1.5, fixed: true});

/* ---- draggable points constrained to the circle (start at 350 deg and 130 deg) ---- */
var Q = board.create('glider', [R * Math.cos(350 * Math.PI / 180),
                                 R * Math.sin(350 * Math.PI / 180), circle],
    {name: 'Q', size: 4, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [12, 0], anchorX: 'left', anchorY: 'middle'}});
var S = board.create('glider', [R * Math.cos(130 * Math.PI / 180),
                                 R * Math.sin(130 * Math.PI / 180), circle],
    {name: 'S', size: 4, fillColor: '#1565c0', strokeColor: '#1565c0',
     label: {offset: [-10, 10], anchorX: 'right', anchorY: 'bottom'}});

/* ---- tangent at T = perpendicular to the radius OT at T ---- */
var radiusOT = board.create('line', [O, T], {visible: false});
var tangent = board.create('perpendicular', [radiusOT, T],
    {strokeColor: '#333', strokeWidth: 1.5});
/* P: a marker on the tangent, to the right of T, that fixes the angle ray */
var P = board.create('point', [1.7, -R],
    {name: 'P', size: 2, fixed: true, fillColor: '#333', strokeColor: '#333',
     label: {offset: [6, -12], anchorX: 'left', anchorY: 'top'}});

/* ---- radii, chord and triangle TSQ (all live) ---- */
board.create('segment', [O, T], {strokeColor: '#aaa', strokeWidth: 1});
board.create('segment', [O, Q], {strokeColor: '#aaa', strokeWidth: 1});
board.create('segment', [T, Q], {strokeColor: '#333', strokeWidth: 1.5});
board.create('segment', [T, S], {strokeColor: '#333', strokeWidth: 1.5});
board.create('segment', [S, Q], {strokeColor: '#333', strokeWidth: 1.5});

/* ---- live angle marks with dynamic degree readouts ---- */
board.create('angle', [T, O, Q],
    {radius: 0.6, type: 'sector', selection: 'minor',
     fillColor: '#ffb74d', fillOpacity: 0.5, strokeColor: '#ef6c00',
     name: function () { return deg(T, O, Q).toFixed(0) + '°'; }});

board.create('angle', [P, T, Q],
    {radius: 0.8, type: 'sector', selection: 'minor',
     fillColor: '#90caf9', fillOpacity: 0.5, strokeColor: '#1565c0',
     name: function () { return deg(P, T, Q).toFixed(0) + '°'; }});

board.create('angle', [T, S, Q],
    {radius: 0.6, type: 'sector', selection: 'minor',
     fillColor: '#a5d6a7', fillOpacity: 0.5, strokeColor: '#2e7d32',
     name: function () { return deg(T, S, Q).toFixed(0) + '°'; }});

/* ---- caption ---- */
board.create('text', [-3.5, 3.1, function () {
    return '∠PTQ = ' + deg(P, T, Q).toFixed(0) + '°,  ½∠TOQ = ' +
           (deg(T, O, Q) / 2).toFixed(0) + '°,  ∠TSQ = ' + deg(T, S, Q).toFixed(0) + '°';
}], {fontSize: 13, fixed: true, anchorX: 'left', anchorY: 'top'});
