/*
    Interactive Explorer: Arcs, Chords, and Segments of a Circle
    ------------------------------------------------------------
    - Draggable points A and B define the chord and arc.
    - Displays chord length, arc length, central angle, and center-to-chord distance.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 15;

const board = JXG.JSXGraph.initBoard('jsxgraph-arcs-chords-segments', {
    boundingbox: [-7, 7, 7, -7],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

const R = 5.0;
const O = board.create('point', [0, 0], { visible: false });

const circle = board.create('circle', [O, R], {
    strokeWidth: 2,
    strokeColor: '#333333',
    fillColor: 'none'
});

// Draggable endpoints on the circle
const A = board.create('glider', [R * Math.cos(0.5), R * Math.sin(0.5), circle], {
    name: 'A', size: 4, strokeColor: '#d32f2f', fillColor: '#d32f2f'
});

const B = board.create('glider', [R * Math.cos(2.5), R * Math.sin(2.5), circle], {
    name: 'B', size: 4, strokeColor: '#d32f2f', fillColor: '#d32f2f'
});

// Radii from Center to A and B
board.create('segment', [O, A], { strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1.5 });
board.create('segment', [O, B], { strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1.5 });

// Chord AB
const chordAB = board.create('segment', [A, B], {
    strokeColor: '#1976d2',
    strokeWidth: 3,
    name: 'Chord',
    withLabel: true,
    label: { position: 'top', offset: [0, 10] }
});

// Minor Arc AB
board.create('arc', [O, A, B], {
    strokeColor: '#e65100',
    strokeWidth: 4,
    fillColor: '#ffb74d',
    fillOpacity: 0.2
});

// Perpendicular distance from center to chord (Apothem)
const M = board.create('midpoint', [chordAB], { visible: false });
board.create('segment', [O, M], {
    strokeColor: '#388e3c',
    dash: 1,
    strokeWidth: 2
});

// Central Angle
board.create('angle', [A, O, B], {
    radius: 1.2,
    type: 'sector',
    fillColor: '#1976d2',
    fillOpacity: 0.15,
    strokeColor: '#1976d2',
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, O, B).toFixed(1) + '°';
    }
});

// -----------------------------------------------------------------------------
// Dynamic Metrics Panel (Bottom Left)
// -----------------------------------------------------------------------------
board.create('text', [-6.5, -5.2, function () {
    const lenChord = A.Dist(B);
    return 'Chord Length: ' + lenChord.toFixed(2) + ' units';
}], { anchorX: 'left', fontSize: 14 });

board.create('text', [-6.5, -5.8, function () {
    const angleRad = JXG.Math.Geometry.trueAngle(A, O, B) * (Math.PI / 180);
    const lenArc = R * angleRad;
    return 'Arc Length (minor): ' + lenArc.toFixed(2) + ' units';
}], { anchorX: 'left', fontSize: 14 });

board.create('text', [-6.5, -6.4, function () {
    const distToChord = O.Dist(M);
    return 'Distance from Center to Chord: ' + distToChord.toFixed(2) + ' units';
}], { anchorX: 'left', fontSize: 14 });