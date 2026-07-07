/*
    Graphing quadratics — coefficients ↔ graph  (13.2)
    --------------------------------------------------
    Sliders a, b, c control y = ax² + bx + c. The parabola, its vertex, axis of
    symmetry (dashed), x-intercepts and y-intercept all update live.

    Sliders: a, b, c.  Derived: parabola, vertex, axis, intercepts, readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-graphing-quadratics', {
    boundingbox: [-9, 9, 9, -9],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

// --- Sliders ----------------------------------------------------------------
/*const a = board.create('slider', [[-8, 8], [-3.5, 8], [-4, 1, 4]], { name: '\\(a\\)', snapWidth: 0.1 });*/
const a = board.create('slider', [[-8, 8], [-3.5, 8], [-4, 1, 4]], {
    name: '\\(a\\)', snapWidth: 0.1,
    baseline:  { strokeColor: '#B5D4F4', strokeWidth: 5 },
    highline:  { strokeColor: '#185FA5', strokeWidth: 5 },
    point1: { visible: false }, point2: { visible: false },
    point3: { size: 7, fillColor: '#FFC107', strokeColor: '#0C447C', strokeWidth: 2,
              highlightFillColor: '#FFD54F', highlightStrokeColor: '#185FA5' },
    label:  { fontSize: 16, strokeColor: '#0C447C', cssStyle: 'font-weight:700;' }
});
/*const b = board.create('slider', [[-8, 7], [-3.5, 7], [-8, -1, 8]], { name: '\\(b\\)', snapWidth: 0.1 });*/
/*const c = board.create('slider', [[-8, 6], [-3.5, 6], [-8, -3, 8]], { name: '\\(c\\)', snapWidth: 0.1 });*/
// b → red family
const b = board.create('slider', [[-8, 7], [-3.5, 7], [-8, -1, 8]], {
    name: '\\(b\\)', snapWidth: 0.1,
    baseline:  { strokeColor: '#F7C1C1', strokeWidth: 5 },
    highline:  { strokeColor: '#A32D2D', strokeWidth: 5 },
    point1: { visible: false }, point2: { visible: false },
    point3: { size: 7, fillColor: '#FFC107', strokeColor: '#791F1F', strokeWidth: 2,
              highlightFillColor: '#FFD54F', highlightStrokeColor: '#A32D2D' },
    label:  { fontSize: 16, strokeColor: '#791F1F', cssStyle: 'font-weight:700;' }
});

// c → green family
const c = board.create('slider', [[-8, 6], [-3.5, 6], [-8, -3, 8]], {
    name: '\\(c\\)', snapWidth: 0.1,
    baseline:  { strokeColor: '#C0DD97', strokeWidth: 5 },
    highline:  { strokeColor: '#3B6D11', strokeWidth: 5 },
    point1: { visible: false }, point2: { visible: false },
    point3: { size: 7, fillColor: '#FFC107', strokeColor: '#27500A', strokeWidth: 2,
              highlightFillColor: '#FFD54F', highlightStrokeColor: '#3B6D11' },
    label:  { fontSize: 16, strokeColor: '#27500A', cssStyle: 'font-weight:700;' }
});


const f = (x) => a.Value() * x * x + b.Value() * x + c.Value();
board.create('functiongraph', [f], { strokeColor: '#bb0041', strokeWidth: 2.5 });

// --- Real roots (x-intercepts) ---------------------------------------------
function roots() {
    const A = a.Value(), B = b.Value(), C = c.Value();
    if (Math.abs(A) < 1e-6) return Math.abs(B) < 1e-6 ? [] : [-C / B];
    const D = B * B - 4 * A * C;
    if (D < -1e-9) return [];
    if (D < 1e-9) return [-B / (2 * A)];
    const s = Math.sqrt(D);
    return [(-B - s) / (2 * A), (-B + s) / (2 * A)];
}
for (let i = 0; i < 2; i++) {
    board.create('point', [() => { const r = roots(); return r[i] === undefined ? NaN : r[i]; }, 0], {
        name: '', size: 3, strokeColor: '#28c684', fillColor: '#5a28c6', fixed: true
    });
}

// --- y-intercept ------------------------------------------------------------
board.create('point', [0, () => c.Value()], { name: '', size: 3, strokeColor: '#0630b9', fillColor: '#0630b9', fixed: true });

// --- Vertex + axis of symmetry ---------------------------------------------
const vx = () => (Math.abs(a.Value()) < 1e-6 ? NaN : -b.Value() / (2 * a.Value()));
board.create('point', [vx, () => f(vx())], { name: '', size: 4, strokeColor: '#6a1b9a', fillColor: '#6a1b9a', fixed: true });
board.create('line', [[vx, 0], [vx, () => f(vx())]], {
    straightFirst: true, straightLast: true, strokeColor: '#6a1b9a', strokeWidth: 1, dash: 2, fixed: true, highlight: false
});

// --- Readout (MathJax) ------------------------------------------------------
const term = (v, suf) => (v >= 0 ? ' + ' : ' - ') + Math.abs(v).toFixed(1) + suf;
board.create('text', [-8.6, -6.2, () => '\\(y = ' + a.Value().toFixed(1) + 'x^2' + term(b.Value(), 'x') + term(c.Value(), '') + '\\)'],
    { fontSize: 15, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -7.3, () => {
    if (Math.abs(a.Value()) < 1e-6) return '\\(\\text{linear: no vertex}\\)';
    const x = vx();
    return '\\(\\text{vertex }(' + x.toFixed(2) + ',\\ ' + f(x).toFixed(2) + '),\\ \\text{y-int } ' + c.Value().toFixed(1) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
board.create('text', [-8.6, -8.3, () => {
    const r = roots();
    if (r.length === 0) return '\\(\\text{no real x-intercepts}\\)';
    if (r.length === 1) return '\\(\\text{x-intercept } x = ' + r[0].toFixed(2) + '\\)';
    return '\\(\\text{x-intercepts } x = ' + r[0].toFixed(2) + ',\\ ' + r[1].toFixed(2) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
