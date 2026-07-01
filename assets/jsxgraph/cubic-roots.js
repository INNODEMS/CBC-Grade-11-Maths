/*
    Roots of a cubic ↔ the graph  (13.3)
    ------------------------------------
    Sliders a, b, c, d control y = ax³ + bx² + cx + d. The x-intercepts are the real
    roots. A cubic has one, two (one repeated), or three real roots — drag the
    sliders to move between the cases. The readout reports how many real roots there
    are and their values.

    Sliders: a, b, c, d.  Derived: cubic graph, real-root points, readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-cubic-roots', {
    boundingbox: [-9, 9, 9, -9],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const a = board.create('slider', [[-8, 8], [-3.5, 8], [-3, 1, 3]], { name: '\\(a\\)', snapWidth: 0.1 });
const b = board.create('slider', [[-8, 7], [-3.5, 7], [-6, 0, 6]], { name: '\\(b\\)', snapWidth: 0.1 });
const c = board.create('slider', [[-8, 6], [-3.5, 6], [-8, -3, 8]], { name: '\\(c\\)', snapWidth: 0.1 });
const d = board.create('slider', [[-8, 5], [-3.5, 5], [-8, 0, 8]], { name: '\\(d\\)', snapWidth: 0.1 });

const f = (x) => a.Value() * x ** 3 + b.Value() * x ** 2 + c.Value() * x + d.Value();
board.create('functiongraph', [f], { strokeColor: '#0055bb', strokeWidth: 2.5 });

// Real roots via JSXGraph's numeric polynomial solver (golden pattern).
let cache = { key: null, roots: [] };
function realRoots() {
    const key = [a.Value(), b.Value(), c.Value(), d.Value()].join(',');
    if (key !== cache.key) {
        let rs;
        if (Math.abs(a.Value()) < 1e-6) {
            rs = JXG.Math.Numerics.polzeros([d.Value(), c.Value(), b.Value()]);
        } else {
            rs = JXG.Math.Numerics.polzeros([d.Value(), c.Value(), b.Value(), a.Value()]);
        }
        cache = { key, roots: rs.filter((z) => Math.abs(z.imaginary) < 1e-7).map((z) => z.real).sort((p, q) => p - q) };
    }
    return cache.roots;
}
for (let i = 0; i < 3; i++) {
    board.create('point', [() => { const r = realRoots(); return r[i] === undefined ? NaN : r[i]; }, 0], {
        name: '', size: 4, strokeColor: '#c62828', fillColor: '#c62828', fixed: true
    });
}

// --- Readout (MathJax) ------------------------------------------------------
const term = (v, suf) => (v >= 0 ? ' + ' : ' - ') + Math.abs(v).toFixed(1) + suf;
board.create('text', [-8.6, -6.2, () =>
    '\\(y = ' + a.Value().toFixed(1) + 'x^3' + term(b.Value(), 'x^2') + term(c.Value(), 'x') + term(d.Value(), '') + '\\)'],
    { fontSize: 15, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -7.4, () => {
    const r = realRoots();
    const n = r.length;
    return '\\(' + n + '\\text{ real root' + (n === 1 ? '' : 's') + '}\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -8.4, () => {
    const r = realRoots();
    if (r.length === 0) return '';
    return '\\(x = ' + r.map((v) => v.toFixed(2)).join(',\\ ') + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
