/*
    Inverse Functions — a mirror image across y = x
    Sliders change the function f(x) = a x + b. The inverse is drawn as the
    reflection of the graph across the line y = x (plotted parametrically as
    (f(t), t)), so it updates the instant a slider moves. Equations of f and its
    inverse are shown, and y = x is fixed for reference.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 15;

const board = JXG.JSXGraph.initBoard('jsx-inverse-functions', {
    boundingbox: [-9, 9, 9, -9],
    axis: true,
    grid: true,
    keepaspectratio: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Line y = x (fixed reference) -------------------------------------------
board.create('functiongraph', [(x) => x, -9, 9], { strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1.5 });
board.create('text', [7.4, 8.3, 'y = x'], { fixed: true, color: '#757575' });

// --- Sliders ----------------------------------------------------------------
const a = board.create('slider', [[-8, 8], [-4.5, 8], [-3, 2, 3]], { name: 'a', snapWidth: 0.5, size: 4 });
const b = board.create('slider', [[-8, 7], [-4.5, 7], [-4, 1, 4]], { name: 'b', snapWidth: 0.5, size: 4 });

const f = (x) => a.Value() * x + b.Value();

// --- f(x) and its inverse (reflection across y = x) -------------------------
board.create('functiongraph', [f, -9, 9], { strokeColor: '#1565c0', strokeWidth: 3 });
board.create('curve', [(t) => f(t), (t) => t, -12, 12], { strokeColor: '#c62828', strokeWidth: 3 });

// --- Readouts ---------------------------------------------------------------
const num = (v) => v.toFixed(1);
board.create('text', [-8.6, -6.4, () =>
    '\\(\\color{#1565c0}{f(x) = ' + num(a.Value()) + 'x + ' + num(b.Value()) + '}\\)'],
    { anchorX: 'left', fixed: true });
board.create('text', [-8.6, -7.6, () => {
    const av = a.Value();
    if (Math.abs(av) < 1e-6) return '\\(\\color{#c62828}{\\text{no inverse (}a = 0\\text{)}}\\)';
    return '\\(\\color{#c62828}{f^{-1}(x) = \\dfrac{x - ' + num(b.Value()) + '}{' + num(av) + '}}\\)';
}], { anchorX: 'left', fixed: true });
