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
const k = board.create('slider', [[8.5, 7.6], [12.3, 7.6], [6, 24, 60]], {
    name: '',
    withLabel: false,
    snapWidth: 1,
    precision: 0
});

board.create('text', [
    12.8,
    7.6,
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

// In the Moving Company activity x is the number of workers w and
// y is the time t in hours, so the readouts use both names.
board.create('text', [
    8.5,
    12.6,
    () => "\\(t = \\dfrac{" + k.Value().toFixed(0) + "}{w}\\)"
], {
    fontSize: 18
});

board.create('text', [
    8.5,
    11.2,
    () => "workers \\(w = " + P.X().toFixed(2) + "\\)"
], {
    fontSize: 16
});

board.create('text', [
    8.5,
    10.2,
    () => "time \\(t = " + P.Y().toFixed(2) + "\\) hours"
], {
    fontSize: 16
});

board.create('text', [
    8.5,
    9.0,
    () => "\\(w \\times t = " + (P.X() * P.Y()).toFixed(2) + "\\)"
], {
    fontSize: 18,
    color: "#2e7d32"
});

// Axis labels
board.create('text', [13.2, 0.7, 'workers, w'], { fontSize: 13, color: '#555', fixed: true });
board.create('text', [0.3, 14.6, 'time, t (hours)'], { fontSize: 13, color: '#555', fixed: true });