/* 
    Angles in the same segment are equal
    ------------------------------------
    A and B define the arc/chord.
    P and Q are draggable points on the circumference.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 16;

const board = JXG.JSXGraph.initBoard('jsxgraph-angles-in-segment', {
    boundingbox: [-8, 8, 8, -8],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// -----------------------------------------------------------------------------
// Parameters & Circle
// -----------------------------------------------------------------------------
const CENTER = [0, 0];
const RADIUS = 5.0;

const O = board.create('point', CENTER, {
    name: 'O',
    fixed: true,
    visible: false
});

const circle = board.create('circle', [O, RADIUS], {
    strokeWidth: 2,
    strokeColor: '#444444',
    fillColor: 'none'
});

// -----------------------------------------------------------------------------
// Draggable points on the circle
// -----------------------------------------------------------------------------
const A = board.create('glider', [
    RADIUS * Math.cos(0.5),
    RADIUS * Math.sin(0.5),
    circle
], {
    name: 'A',
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0'
});

const B = board.create('glider', [
    RADIUS * Math.cos(2.5),
    RADIUS * Math.sin(2.5),
    circle
], {
    name: 'B',
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0',
    label: {offset: [-20, 10]}
});

const P = board.create('glider', [
    RADIUS * Math.cos(-1.0),
    RADIUS * Math.sin(-1.0),
    circle
], {
    name: 'P',
    size: 4,
    strokeColor: '#c62828',
    fillColor: '#c62828',
    label: {offset: [0, -20]}
});

const Q = board.create('glider', [
    RADIUS * Math.cos(-2.2),
    RADIUS * Math.sin(-2.2),
    circle
], {
    name: 'Q',
    size: 4,
    strokeColor: '#2e7d32',
    fillColor: '#2e7d32',
    label: {offset: [-15, -15]}
});

// -----------------------------------------------------------------------------
// Chords
// -----------------------------------------------------------------------------
board.create('segment', [A, P], { strokeColor: '#888888', strokeWidth: 2 });
board.create('segment', [B, P], { strokeColor: '#888888', strokeWidth: 2 });

board.create('segment', [A, Q], { strokeColor: '#888888', strokeWidth: 2, dash: 1 });
board.create('segment', [B, Q], { strokeColor: '#888888', strokeWidth: 2, dash: 1 });

board.create('segment', [A, B], { strokeColor: '#999999', strokeWidth: 2, dash: 2 });

// -----------------------------------------------------------------------------
// Angle visuals
// -----------------------------------------------------------------------------
board.create('angle', [A, P, B], {
    radius: 1.0,
    type: 'sector',
    fillColor: '#c62828',
    fillOpacity: 0.35,
    strokeColor: '#af2828',
    strokeWidth: 2,
    withLabel: true,
    selection: 'minor',
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, P, B).toFixed(1) + '°';
    }
});

board.create('angle', [A, Q, B], {
    radius: 1.2,
    type: 'sector',
    fillColor: '#2e7d32',
    fillOpacity: 0.35,
    strokeColor: '#1b5e20',
    strokeWidth: 2,
    withLabel: true,
    selection: 'minor',
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, Q, B).toFixed(1) + '°';
    }
});

// -----------------------------------------------------------------------------
// Dynamic value readout text
// -----------------------------------------------------------------------------
board.create('text', [-6.8, -6.2, function () {
    const pAngle = JXG.Math.Geometry.trueAngle(A, P, B);
    const qAngle = JXG.Math.Geometry.trueAngle(A, Q, B);
    return '\\(\\angle \\text{APB} = ' + pAngle.toFixed(1) + '^\\circ,\\quad \\angle \\text{AQB} = ' + qAngle.toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});