/*
    Determining constants from a linearised graph  (13.10)
    ------------------------------------------------------
    The data (blue) is the semi-log plot (x, ln y) of an exponential model
    y = A·b^x. On this plot ln y = (ln b)x + ln A, a straight line: the gradient is
    ln b and the intercept is ln A. Drag the gradient (m) and intercept (c) sliders
    to fit the line to the data; the recovered constants A = e^c and b = e^m and the
    original equation update live. A good fit recovers A ≈ 8, b ≈ 0.7.

    Controls: m (gradient), c (intercept).  Derived: constants A, b + original equation.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-determining-constants', {
    boundingbox: [-1, 3.1, 7, -1.6],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

// True model -> linearised data points (x, ln y)
const xs = [1, 2, 3, 4, 5, 6];
xs.forEach(x => board.create('point', [x, Math.log(8 * Math.pow(0.7, x))],
    { name: '', size: 3, strokeColor: '#1565c0', fillColor: '#1565c0', fixed: true }));

// Student's fitted line ln y = m x + c
const m = board.create('slider', [[-0.8, 2.75], [2.6, 2.75], [-2, -0.5, 0]], { name: '\\(m\\)', snapWidth: 0.001 });
const c = board.create('slider', [[-0.8, 2.3], [2.6, 2.3], [0, 1.5, 3]], { name: '\\(c\\)', snapWidth: 0.01 });
board.create('line', [[0, () => c.Value()], [1, () => m.Value() + c.Value()]],
    { strokeColor: '#e8710a', strokeWidth: 2.5, fixed: true, highlight: false });

// --- Readouts (MathJax, upper right) ----------------------------------------
const R = 3.7;
board.create('text', [R, 2.6, () => '\\(\\text{gradient } m = ' + m.Value().toFixed(3) + '\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 2.1, () => '\\(\\text{intercept } c = ' + c.Value().toFixed(3) + '\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 1.5, () => '\\(A = e^{c} = ' + Math.exp(c.Value()).toFixed(2) + '\\)'],
    { fontSize: 14, anchorX: 'left', color: '#2e7d32', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 1.0, () => '\\(b = e^{m} = ' + Math.exp(m.Value()).toFixed(3) + '\\)'],
    { fontSize: 14, anchorX: 'left', color: '#2e7d32', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 0.4, () => '\\(y = ' + Math.exp(c.Value()).toFixed(2) + '\\,(' + Math.exp(m.Value()).toFixed(2) + ')^{x}\\)'],
    { fontSize: 15, anchorX: 'left', color: '#e8710a', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
