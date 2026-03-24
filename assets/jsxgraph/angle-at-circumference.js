/*
    Central angle is twice the inscribed angle
    ------------------------------------------
    A and B are draggable points on the circle.
    The radius is controlled by a slider.
    P is also draggable on the circle.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 16;

const board = JXG.JSXGraph.initBoard('jsxgraph-angle-at-circumference', {
    boundingbox: [-8, 8, 8, -8],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------
const CENTER = [0, 0];
const MIN_RADIUS = 2.5;
const START_RADIUS = 5.0;
const MAX_RADIUS = 6.5;

// -----------------------------------------------------------------------------
// Circle and slider
// -----------------------------------------------------------------------------
const radiusSlider = board.create('slider', [[-6.5, 7], [-1.5, 7], [MIN_RADIUS, START_RADIUS, MAX_RADIUS]], {
    name: 'Radius',
    snapWidth: 0.1,
    precision: 1,
    size: 5
});

const O = board.create('point', CENTER, {
    name: 'O',
    fixed: true,
    size: 3,
    strokeColor: '#222222',
    fillColor: '#222222',
    label: {offset: [-10, -20]}
});

const circle = board.create('circle', [O, function () {
    return radiusSlider.Value();
}], {
    strokeWidth: 2,
    strokeColor: '#444444',
    fillColor: 'none'
});

// -----------------------------------------------------------------------------
// Draggable points on the circle
// -----------------------------------------------------------------------------
const A = board.create('glider', [
    START_RADIUS * Math.cos(0.5),
    START_RADIUS * Math.sin(0.5),
    circle
], {
    name: 'A',
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0'
});

const B = board.create('glider', [
    START_RADIUS * Math.cos(2.0),
    START_RADIUS * Math.sin(2.0),
    circle
], {
    name: 'B',
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0',
    label: {offset: [-20, 10]}
});

// -----------------------------------------------------------------------------
// Third draggable point on the circle
// -----------------------------------------------------------------------------
const P = board.create('glider', [
    START_RADIUS * Math.cos(-1.5),
    START_RADIUS * Math.sin(-1.5),
    circle
], {
    name: 'P',
    size: 4,
    strokeColor: '#c62828',
    fillColor: '#c62828',
    fixed: false,
    label: {offset: [0, -20]}
});

// -----------------------------------------------------------------------------
// Chords and radii
// -----------------------------------------------------------------------------
board.create('segment', [O, A], {
    strokeColor: '#666666',
    strokeWidth: 2
});

board.create('segment', [O, B], {
    strokeColor: '#666666',
    strokeWidth: 2
});

board.create('segment', [A, P], {
    strokeColor: '#888888',
    strokeWidth: 2
});

board.create('segment', [B, P], {
    strokeColor: '#888888',
    strokeWidth: 2
});

board.create('segment', [A, B], {
    strokeColor: '#999999',
    strokeWidth: 2,
    dash: 2
});

// -----------------------------------------------------------------------------
// Angle visuals
// -----------------------------------------------------------------------------
board.create('angle', [A, O, B], {
    radius: 1.2,
    type: 'sector',
    orthoType: 'sector',
    fillColor: '#ffb74d',
    highlightFillColor: '#ffb74d',
    fillOpacity: 0.35,
    strokeColor: '#ef6c00',
    strokeWidth: 2,
    withLabel: true,
    selection: 'minor',
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, O, B).toFixed(1) + '°';
    }
});

board.create('angle', [A, P, B], {
    radius: 1.2,
    type: 'sector',
    orthoType: 'sector',
    fillColor: '#c62828',
    highlightFillColor: '#c62828',
    fillOpacity: 0.35,
    strokeColor: '#af2828',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, P, B).toFixed(1) + '°';
    },
    selection: 'minor'
});

// -----------------------------------------------------------------------------
// Dynamic values
// -----------------------------------------------------------------------------
board.create('text', [-6.8, -5.6, function () {
    const theta = JXG.Math.Geometry.trueAngle(A, O, B);
    return '\\(\\angle AOB = ' + theta.toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});

board.create('text', [-6.8, -6.5, function () {
    const phi = JXG.Math.Geometry.trueAngle(A, P, B);
    return '\\(\\angle APB = ' + phi.toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});

/* board.create('text', [-6.8, -7.4, function () {
    const theta = JXG.Math.Geometry.trueAngle(A, O, B);
    const phi = JXG.Math.Geometry.trueAngle(A, P, B);
    return '\\(2 \\times ' + phi.toFixed(1) + '^\\circ = ' + theta.toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});
*/