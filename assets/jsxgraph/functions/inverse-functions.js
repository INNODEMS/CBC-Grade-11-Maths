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
// Numbers are written without a trailing ".0", and a negative constant is
// written "x - 2" rather than "x + -2.0".
const num = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v).toString() : v.toFixed(1));

const linear = (av, bv) => {
    if (Math.abs(av) < 1e-9) return num(bv);
    let ax;
    if (Math.abs(av - 1) < 1e-9) ax = 'x';
    else if (Math.abs(av + 1) < 1e-9) ax = '-x';
    else ax = num(av) + 'x';
    if (Math.abs(bv) < 1e-9) return ax;
    return ax + (bv > 0 ? ' + ' + num(bv) : ' - ' + num(-bv));
};

board.create('text', [-8.6, -6.4, () =>
    '<span style="color:#1565c0">\\(f(x) = ' + linear(a.Value(), b.Value()) + '\\)</span>'],
    { anchorX: 'left', fixed: true });

board.create('text', [-8.6, -7.6, () => {
    const av = a.Value(), bv = b.Value();
    if (Math.abs(av) < 1e-6) {
        return '<span style="color:#c62828">\\(\\text{no inverse: } a = 0 \\text{, so } f \\text{ is constant}\\)</span>';
    }
    const top = Math.abs(bv) < 1e-9 ? 'x' : 'x' + (bv > 0 ? ' - ' + num(bv) : ' + ' + num(-bv));
    const rhs = Math.abs(av - 1) < 1e-9 ? top : '\\dfrac{' + top + '}{' + num(av) + '}';
    return '<span style="color:#c62828">\\(f^{-1}(x) = ' + rhs + '\\)</span>';
}], { anchorX: 'left', fixed: true });
