JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-inverse-variation', {
    boundingbox: [-1, 15, 15, -1],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

// -----------------------------------------------------------------------------
// Slider for k
// -----------------------------------------------------------------------------
const k = board.create('slider', [[1.0, 14.0], [4.8, 14.0], [6, 24, 60]], {
    name: '',
    snapWidth: 1,
    precision: 0
});

board.create('text', [
    6.2,
    14.0,
    () => "k = " + k.Value().toFixed(0)
]);

// -----------------------------------------------------------------------------
// Hyperbola y = k/x
// -----------------------------------------------------------------------------
const curve = board.create('functiongraph', [
    x => k.Value() / x,
    0.5,
    15
], {
    strokeWidth: 3,
    strokeColor: '#1565c0'
});

// -----------------------------------------------------------------------------
// Draggable point
// -----------------------------------------------------------------------------
const P = board.create('glider', [4, 6, curve], {
    name: 'P',
    size: 5,
    strokeColor: '#e65100',
    fillColor: '#e65100'
});

// -----------------------------------------------------------------------------
// Guide lines
// -----------------------------------------------------------------------------
board.create('segment', [
    [() => P.X(), 0],
    P
], {
    dash: 2,
    strokeColor: '#888'
});

board.create('segment', [
    [0, () => P.Y()],
    P
], {
    dash: 2,
    strokeColor: '#888'
});

// -----------------------------------------------------------------------------
// Dynamic values
// -----------------------------------------------------------------------------

board.create('text', [
    9,
    12.6,
    () => "\\[y=\\frac{" + k.Value().toFixed(0) + "}{x}\\]"
], {
    fontSize: 20
});

board.create('text', [
    9,
    11.1,
    () => "(x = " + P.X().toFixed(2) + ")"
], {
    fontSize: 16
});

board.create('text', [
    9,
    10.0,
    () => "\\[y=" + P.Y().toFixed(2) + "\\]"
], {
    fontSize: 18
});

board.create('text', [
    9,
    8.9,
    () => "\\[xy=" + (P.X() * P.Y()).toFixed(2) + "\\]"
], {
    fontSize: 20,
    color: "#2e7d32"
});