/*
    Real-Life Application: Smart Garden Sprinkler (Sector Area & Irrigation)
    -----------------------------------------------------------------------
    - Center O represents the sprinkler head at the corner of a lawn.
    - Radius slider controls the water reach (R).
    - Point B is a glider on the circle boundary, controlling the sweep angle.
    - Computes sector area and arc length live.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 15;

const board = JXG.JSXGraph.initBoard('jsxgraph-circle-area', {
    boundingbox: [-7, 7, 7, -7],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

const CENTER = [0, 0];
const MIN_RADIUS = 2.0;
const START_RADIUS = 4.5;
const MAX_RADIUS = 6.0;

// Radius slider for water reach
const radiusSlider = board.create('slider', [[-6.5, 6.5], [-1.5, 6.5], [MIN_RADIUS, START_RADIUS, MAX_RADIUS]], {
    name: 'Water Reach (R)',
    snapWidth: 0.1,
    precision: 1,
    size: 5
});

const O = board.create('point', CENTER, {
    name: 'Sprinkler (O)',
    size: 4,
    strokeColor: '#0288d1',
    fillColor: '#0288d1',
    withLabel: true,
    label: { offset: [-30, -18] }
});

// Full circular boundary (faint background guide)
const circle = board.create('circle', [O, function () { return radiusSlider.Value(); }], {
    strokeWidth: 1.5,
    strokeColor: '#b0bec5',
    dash: 2,
    fillColor: 'none'
});

// Fixed reference point A on the positive x-axis
const A = board.create('point', [
    function () { return radiusSlider.Value(); },
    0
], {
    visible: false
});

// Movable sweep limit B on the circle boundary
const B = board.create('glider', [
    START_RADIUS * Math.cos(1.5),
    START_RADIUS * Math.sin(1.5),
    circle
], {
    name: 'Limit B',
    size: 5,
    strokeColor: '#388e3c',
    fillColor: '#388e3c'
});

// Irrigation Sector Area
board.create('sector', [O, A, B], {
    fillColor: '#81c784',
    fillOpacity: 0.35,
    strokeColor: '#388e3c',
    strokeWidth: 2
});

// Central Sweep Angle
board.create('angle', [A, O, B], {
    radius: 1.0,
    type: 'sector',
    orthoType: 'minor',
    fillColor: '#388e3c',
    fillOpacity: 0.2,
    strokeColor: '#2e7d32',
    strokeWidth: 2,
    withLabel: true,
    name: function () {
        return 'Sweep: ' + JXG.Math.Geometry.trueAngle(A, O, B).toFixed(1) + '°';
    }
});

// -----------------------------------------------------------------------------
// Live Calculation Panel (Bottom)
// -----------------------------------------------------------------------------
board.create('text', [-6.5, -5.2, function () {
    const r = radiusSlider.Value();
    const theta = JXG.Math.Geometry.trueAngle(A, O, B);
    const area = (theta / 360) * Math.PI * Math.pow(r, 2);
    return 'Irrigation Area: \\(\\frac{' + theta.toFixed(1) + '^\\circ}{360^\\circ} \\times \\pi \\times (' + r.toFixed(1) + ')^2 = \\mathbf{' + area.toFixed(2) + '\\ \\text{units}^2}\\)';
}], {
    anchorX: 'left',
    fontSize: 14,
    cssStyle: 'color: #333;'
});

board.create('text', [-6.5, -6.0, function () {
    const r = radiusSlider.Value();
    const theta = JXG.Math.Geometry.trueAngle(A, O, B);
    const arcLen = (theta / 360) * (2 * Math.PI * r);
    return 'Sprinkler Arc Span: \\(\\frac{' + theta.toFixed(1) + '^\\circ}{360^\\circ} \\times 2\\pi(' + r.toFixed(1) + ') = ' + arcLen.toFixed(2) + '\\ \\text{units}\\)';
}], {
    anchorX: 'left',
    fontSize: 14,
    cssStyle: 'color: #333;'
});