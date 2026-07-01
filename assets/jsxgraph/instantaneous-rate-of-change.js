/*
    Instantaneous rate of change = slope of the tangent  (13.6)
    -----------------------------------------------------------
    The same curve y = f(x). Drag the point P along it; the orange tangent line
    touches the curve at P and its gradient is the instantaneous rate of change
    there, f'(x). The readout shows P, the gradient and the tangent's equation.

    Draggable: P (its x follows the pointer; y stays on the curve).
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-instantaneous-rate-of-change', {
    boundingbox: [-6.5, 10.5, 6.5, -6],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const f  = (x) => 0.1 * x * x * x - x + 3;
const fp = (x) => 0.3 * x * x - 1;               // f'(x)
const XMIN = -5, XMAX = 5;

board.create('functiongraph', [f, XMIN, XMAX], { strokeColor: '#0055bb', strokeWidth: 2.5 });
board.create('text', [3.4, 9.6, '\\(y = f(x)\\)'], { fontSize: 14, color: '#0055bb', anchorX: 'left', fixed: true });

// P: x follows the pointer, y locked to the curve (not a nearest-point glider)
const P = board.create('point', [-2, f(-2)], { name: 'P', size: 6, strokeColor: '#cc0000', fillColor: '#cc0000', label: { offset: [-14, 10] } });
function constrainP() {
    const x = Math.max(XMIN, Math.min(XMAX, P.X()));
    P.coords.setCoordinates(JXG.COORDS_BY_USER, [x, f(x)]);
}
P.on('drag', constrainP);
constrainP();

// Tangent line (fixed so only P is draggable)
const Q = board.create('point', [() => P.X() + 1, () => f(P.X()) + fp(P.X())], { visible: false });
board.create('line', [P, Q], { strokeColor: '#e8710a', strokeWidth: 2.5, fixed: true, highlight: false });

// --- Readout (MathJax) ------------------------------------------------------
board.create('text', [-6.2, 9.6, () => '\\(P(' + P.X().toFixed(2) + ',\\ ' + f(P.X()).toFixed(2) + ')\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-6.2, 8.5, () => '\\(\\text{gradient } f\'(x) = ' + fp(P.X()).toFixed(3) + '\\)'],
    { fontSize: 15, anchorX: 'left', color: '#e8710a', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-6.2, 7.4, () => {
    const m = fp(P.X()), cc = f(P.X()) - m * P.X();
    return '\\(\\text{tangent: } y = ' + m.toFixed(2) + 'x' + (cc >= 0 ? ' + ' : ' - ') + Math.abs(cc).toFixed(2) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
