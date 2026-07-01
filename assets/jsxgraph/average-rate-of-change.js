/*
    Average rate of change = slope of a secant  (13.5)
    --------------------------------------------------
    A curve y = f(x). Drag the two points A and B along it; the green secant line
    joins them and its gradient is the average rate of change over [x_A, x_B]. The
    readout shows both points, the change in x and y, and Δy/Δx.

    Draggable: A, B (gliders on the curve).  Derived: secant, readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-average-rate-of-change', {
    boundingbox: [-6.5, 10.5, 6.5, -6],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const f = (x) => 0.1 * x * x * x - x + 3;
const XMIN = -5, XMAX = 5;
board.create('functiongraph', [f, XMIN, XMAX], { strokeColor: '#0055bb', strokeWidth: 2.5 });
board.create('text', [3.4, 9.6, '\\(y = f(x)\\)'], { fontSize: 14, color: '#0055bb', anchorX: 'left', fixed: true });

// Invisible rail so the points stay on the curve
const rail = board.create('functiongraph', [f, XMIN, XMAX], { visible: false });
const A = board.create('glider', [-3, f(-3), rail], { name: 'A', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0', label: { offset: [-14, 8] } });
const B = board.create('glider', [2, f(2), rail], { name: 'B', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0', label: { offset: [10, 8] } });

// Secant line + slope triangle
board.create('line', [A, B], { strokeColor: '#2e7d32', strokeWidth: 2.5, fixed: true, highlight: false });
const corner = () => [B.X(), A.Y()];
board.create('segment', [A, corner], { strokeColor: '#888', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
board.create('segment', [corner, B], { strokeColor: '#888', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });

// --- Readout (MathJax) ------------------------------------------------------
board.create('text', [-6.2, 9.6, () =>
    '\\(A(' + A.X().toFixed(2) + ',\\ ' + A.Y().toFixed(2) + '),\\ B(' + B.X().toFixed(2) + ',\\ ' + B.Y().toFixed(2) + ')\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-6.2, 8.5, () => {
    const dx = B.X() - A.X(), dy = B.Y() - A.Y();
    return '\\(\\Delta x = ' + dx.toFixed(2) + ',\\quad \\Delta y = ' + dy.toFixed(2) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-6.2, 7.4, () => {
    const dx = B.X() - A.X(), dy = B.Y() - A.Y();
    const rate = Math.abs(dx) > 1e-6 ? (dy / dx).toFixed(3) : '\\text{undefined}';
    return '\\(\\dfrac{\\Delta y}{\\Delta x} = ' + rate + '\\)';
}], { fontSize: 15, anchorX: 'left', color: '#2e7d32', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
