/*
    Roots of a quadratic ↔ the graph  (13.3)
    ----------------------------------------
    Sliders a, b, c control y = ax² + bx + c. The x-intercepts are the real roots.
    The discriminant D = b² − 4ac decides the case: D>0 two roots, D=0 one repeated
    root, D<0 no real roots. The readout reports D, the number of real roots and
    their values.

    Sliders: a, b, c.  Derived: parabola, roots, vertex, discriminant readout.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-quadratic-roots', {
    boundingbox: [-9, 9, 9, -9],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const a = board.create('slider', [[-8, 8], [-3.5, 8], [-4, 1, 4]], { name: '\\(a\\)', snapWidth: 0.1 });
const b = board.create('slider', [[-8, 7], [-3.5, 7], [-8, -2, 8]], { name: '\\(b\\)', snapWidth: 0.1 });
const c = board.create('slider', [[-8, 6], [-3.5, 6], [-8, -3, 8]], { name: '\\(c\\)', snapWidth: 0.1 });

const disc = () => b.Value() * b.Value() - 4 * a.Value() * c.Value();
const f = (x) => a.Value() * x * x + b.Value() * x + c.Value();
board.create('functiongraph', [f], { strokeColor: '#0055bb', strokeWidth: 2.5 });

function roots() {
    const A = a.Value(), B = b.Value();
    if (Math.abs(A) < 1e-6) return Math.abs(B) < 1e-6 ? [] : [-c.Value() / B];
    const D = disc();
    if (D < -1e-9) return [];
    if (D < 1e-9) return [-B / (2 * A)];
    const s = Math.sqrt(D);
    return [(-B - s) / (2 * A), (-B + s) / (2 * A)];
}
for (let i = 0; i < 2; i++) {
    board.create('point', [() => { const r = roots(); return r[i] === undefined ? NaN : r[i]; }, 0], {
        name: '', size: 4, strokeColor: '#c62828', fillColor: '#c62828', fixed: true
    });
}

// Vertex (helps see how the parabola sits relative to the axis)
const vx = () => (Math.abs(a.Value()) < 1e-6 ? NaN : -b.Value() / (2 * a.Value()));
board.create('point', [vx, () => f(vx())], { name: '', size: 3, strokeColor: '#6a1b9a', fillColor: '#6a1b9a', fixed: true });

// --- Readout (MathJax) ------------------------------------------------------
const term = (v, suf) => (v >= 0 ? ' + ' : ' - ') + Math.abs(v).toFixed(1) + suf;
board.create('text', [-8.6, -6.2, () => '\\(y = ' + a.Value().toFixed(1) + 'x^2' + term(b.Value(), 'x') + term(c.Value(), '') + '\\)'],
    { fontSize: 15, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -7.3, () => '\\(D = b^2 - 4ac = ' + disc().toFixed(2) + '\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -8.3, () => {
    const r = roots();
    if (r.length === 0) return '\\(\\text{no real roots }(D<0)\\)';
    if (r.length === 1) return '\\(\\text{one repeated root } x = ' + r[0].toFixed(2) + '\\)';
    return '\\(\\text{two roots } x = ' + r[0].toFixed(2) + ',\\ ' + r[1].toFixed(2) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
