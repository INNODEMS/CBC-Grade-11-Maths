/*
    Function Notation — one input, one output
    A slider sets the input x; the point P = (x, f(x)) moves along a fixed curve
    with dashed guide lines to each axis. Readouts show x, f(x) and the ordered
    pair, updating live so every input is seen to give exactly one output.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 16;

const board = JXG.JSXGraph.initBoard('jsx-function-notation', {
    boundingbox: [-6, 8, 6, -5],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Parameters -------------------------------------------------------------
// Fixed rule for the whole activity: f(x) = 0.5 x^2 - 2
const f = (x) => 0.5 * x * x - 2;

// --- Fixed graph ------------------------------------------------------------
board.create('functiongraph', [f, -5, 5], { strokeColor: '#1565c0', strokeWidth: 3 });

// --- Input slider -----------------------------------------------------------
const xs = board.create('slider', [[-5, 7], [-1, 7], [-4, 1.5, 4]], {
    name: 'x', snapWidth: 0.1, size: 5
});

// --- Moving point + guide lines ---------------------------------------------
const P = board.create('point', [() => xs.Value(), () => f(xs.Value())], {
    name: 'P', size: 4, strokeColor: '#c62828', fillColor: '#c62828',
    label: { offset: [10, 10] }, fixed: true
});
const footX = board.create('point', [() => xs.Value(), 0], { visible: false });
const footY = board.create('point', [0, () => f(xs.Value())], { visible: false });
board.create('segment', [P, footX], { strokeColor: '#ef6c00', dash: 2, strokeWidth: 1.5 });
board.create('segment', [P, footY], { strokeColor: '#ef6c00', dash: 2, strokeWidth: 1.5 });

// --- Dynamic readouts -------------------------------------------------------
board.create('text', [-5.6, -3.2, () => '\\(x = ' + xs.Value().toFixed(2) + '\\)'],
    { anchorX: 'left', fixed: true });
board.create('text', [-5.6, -4.0, () => '\\(f(x) = ' + f(xs.Value()).toFixed(2) + '\\)'],
    { anchorX: 'left', fixed: true });
board.create('text', [-5.6, -4.8, () =>
    '\\((x,\\,f(x)) = (' + xs.Value().toFixed(2) + ',\\ ' + f(xs.Value()).toFixed(2) + ')\\)'],
    { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });
