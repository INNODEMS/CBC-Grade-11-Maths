/*
    Opposite angles of a cyclic quadrilateral sum to 180°
    -----------------------------------------------------
    A, B, C, and D are draggable points on the circle.
    The radius is controlled by a slider.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 16;

const board = JXG.JSXGraph.initBoard('jsxgraph-cyclic-quadrilateral', {
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
    visible: false
});

const circle = board.create('circle', [O, function () {
    return radiusSlider.Value();
}], {
    strokeWidth: 2,
    strokeColor: '#444444',
    fillColor: 'none'
});

// -----------------------------------------------------------------------------
// Draggable points on the circle (Vertices A, B, C, D)
// -----------------------------------------------------------------------------
const A = board.create('glider', [
    START_RADIUS * Math.cos(0.2),
    START_RADIUS * Math.sin(0.2),
    circle
], {
    name: 'A',
    size: 4,
    strokeColor: '#1e88e5',
    fillColor: '#1e88e5'
});

const B = board.create('glider', [
    START_RADIUS * Math.cos(1.8),
    START_RADIUS * Math.sin(1.8),
    circle
], {
    name: 'B',
    size: 4,
    strokeColor: '#1e88e5',
    fillColor: '#1e88e5'
});

const C = board.create('glider', [
    START_RADIUS * Math.cos(3.2),
    START_RADIUS * Math.sin(3.2),
    circle
], {
    name: 'C',
    size: 4,
    strokeColor: '#1e88e5',
    fillColor: '#1e88e5'
});

const D = board.create('glider', [
    START_RADIUS * Math.cos(4.8),
    START_RADIUS * Math.sin(4.8),
    circle
], {
    name: 'D',
    size: 4,
    strokeColor: '#1e88e5',
    fillColor: '#1e88e5'
});

// -----------------------------------------------------------------------------
// Cyclic Polygon
// -----------------------------------------------------------------------------
board.create('polygon', [A, B, C, D], {
    fillColor: '#1e88e5',
    fillOpacity: 0.1,
    strokeColor: '#1e88e5',
    strokeWidth: 2
});

// -----------------------------------------------------------------------------
// Angle Visuals (Corrected point order & minor arc constraint for interior angles)
// -----------------------------------------------------------------------------
board.create('angle', [B, A, D], {
    radius: 0.9,
    type: 'sector',
    orthoType: 'minor',
    fillColor: '#ef6c00',
    fillOpacity: 0.35,
    strokeColor: '#ef6c00',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(B, A, D).toFixed(1) + '°';
    }
});

board.create('angle', [C, B, A], {
    radius: 0.9,
    type: 'sector',
    orthoType: 'minor',
    fillColor: '#2e7d32',
    fillOpacity: 0.35,
    strokeColor: '#2e7d32',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(C, B, A).toFixed(1) + '°';
    }
});

board.create('angle', [D, C, B], {
    radius: 0.9,
    type: 'sector',
    orthoType: 'minor',
    fillColor: '#ef6c00',
    fillOpacity: 0.35,
    strokeColor: '#ef6c00',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(D, C, B).toFixed(1) + '°';
    }
});

board.create('angle', [A, D, C], {
    radius: 0.9,
    type: 'sector',
    orthoType: 'minor',
    fillColor: '#2e7d32',
    fillOpacity: 0.35,
    strokeColor: '#2e7d32',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return JXG.Math.Geometry.trueAngle(A, D, C).toFixed(1) + '°';
    }
});

// -----------------------------------------------------------------------------
// Dynamic Sum Verifications at the Bottom
// -----------------------------------------------------------------------------
board.create('text', [-6.8, -5.8, function () {
    const a = JXG.Math.Geometry.trueAngle(B, A, D);
    const c = JXG.Math.Geometry.trueAngle(D, C, B);
    return '\\(\\angle A + \\angle C = ' + a.toFixed(1) + '^\\circ + ' + c.toFixed(1) + '^\\circ = ' + (a + c).toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});

board.create('text', [-6.8, -6.8, function () {
    const b = JXG.Math.Geometry.trueAngle(C, B, A);
    const d = JXG.Math.Geometry.trueAngle(A, D, C);
    return '\\(\\angle B + \\angle D = ' + b.toFixed(1) + '^\\circ + ' + d.toFixed(1) + '^\\circ = ' + (b + d).toFixed(1) + '^\\circ\\)';
}], {
    anchorX: 'left'
});