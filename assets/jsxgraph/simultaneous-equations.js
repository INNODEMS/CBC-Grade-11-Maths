/*
    Solving simultaneous equations graphically  (13.4)
    --------------------------------------------------
    Two straight lines y = m₁x + c₁ (blue) and y = m₂x + c₂ (red). Their point of
    intersection is the simultaneous solution. Drag the sliders: when the gradients
    differ there is exactly one solution; equal gradients give parallel lines (no
    solution) or the same line (infinitely many).

    Sliders: m₁, c₁, m₂, c₂.  Derived: the two lines, intersection, readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-simultaneous-equations', {
    boundingbox: [-9, 9, 9, -9],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const m1 = board.create('slider', [[-8, 8], [-3.5, 8], [-5, 1, 5]], { name: '\\(m_1\\)', snapWidth: 0.1, fillColor: '#0055bb', strokeColor: '#0055bb', highline: { strokeColor: '#0055bb' } });
const c1 = board.create('slider', [[-8, 7], [-3.5, 7], [-8, 2, 8]], { name: '\\(c_1\\)', snapWidth: 0.5, fillColor: '#0055bb', strokeColor: '#0055bb', highline: { strokeColor: '#0055bb' } });
const m2 = board.create('slider', [[-8, 6], [-3.5, 6], [-5, -1, 5]], { name: '\\(m_2\\)', snapWidth: 0.1, fillColor: '#c62828', strokeColor: '#c62828', highline: { strokeColor: '#c62828' } });
const c2 = board.create('slider', [[-8, 5], [-3.5, 5], [-8, -2, 8]], { name: '\\(c_2\\)', snapWidth: 0.5, fillColor: '#c62828', strokeColor: '#c62828', highline: { strokeColor: '#c62828' } });

// Lines built from function-defined endpoints (so 'intersection' works)
const L1a = board.create('point', [-12, () => m1.Value() * -12 + c1.Value()], { visible: false });
const L1b = board.create('point', [12, () => m1.Value() * 12 + c1.Value()], { visible: false });
const L2a = board.create('point', [-12, () => m2.Value() * -12 + c2.Value()], { visible: false });
const L2b = board.create('point', [12, () => m2.Value() * 12 + c2.Value()], { visible: false });
const L1 = board.create('line', [L1a, L1b], { strokeColor: '#0055bb', strokeWidth: 2.5, fixed: true, highlight: false });
const L2 = board.create('line', [L2a, L2b], { strokeColor: '#c62828', strokeWidth: 2.5, fixed: true, highlight: false });

// Intersection point (invalid/hidden when the lines are parallel)
board.create('intersection', [L1, L2, 0], { name: '', size: 5, strokeColor: '#6a1b9a', fillColor: '#6a1b9a', fixed: true });

// --- Readout (MathJax) ------------------------------------------------------
const eq = (m, c, sub) => '\\(y = ' + m.Value().toFixed(1) + 'x' + (c.Value() >= 0 ? ' + ' : ' - ') + Math.abs(c.Value()).toFixed(1) + '\\)';
board.create('text', [-8.6, -6.0, () => eq(m1, c1, 1)], { fontSize: 14, anchorX: 'left', color: '#0055bb', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-8.6, -6.9, () => eq(m2, c2, 2)], { fontSize: 14, anchorX: 'left', color: '#c62828', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-8.6, -8.0, () => {
    const dm = m1.Value() - m2.Value(), dc = c1.Value() - c2.Value();
    if (Math.abs(dm) > 1e-6) {
        const x = dc / -dm;   // m1 x + c1 = m2 x + c2  ->  x = (c2-c1)/(m1-m2)
        const xs = (c2.Value() - c1.Value()) / dm, ys = m1.Value() * xs + c1.Value();
        return '\\(\\text{one solution: } (' + xs.toFixed(2) + ',\\ ' + ys.toFixed(2) + ')\\)';
    }
    return Math.abs(dc) < 1e-6 ? '\\(\\text{same line: infinitely many solutions}\\)'
                               : '\\(\\text{parallel lines: no solution}\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
