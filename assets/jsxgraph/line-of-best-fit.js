/*
    Line of best fit  (13.8)
    ------------------------
    Eight data points with fixed x = 1..8; drag each point up or down to change the
    data. Drag the orange handles to set YOUR estimate of the line of best fit. Tick
    the checkbox to reveal the true least-squares line for comparison.

    Draggable: the data points (vertically) and the two orange line handles.
    Checkbox: reveal/hide the least-squares line.  Derived: least-squares line + readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-line-of-best-fit', {
    boundingbox: [-1.5, 10.6, 10, -1.8],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

// --- Data points: x fixed, y draggable -------------------------------------
const xs = [1, 2, 3, 4, 5, 6, 7, 8];
const ys0 = [2.5, 3.2, 3.0, 4.4, 5.0, 5.3, 6.6, 7.0];
const pts = xs.map((x, i) => {
    const p = board.create('point', [x, ys0[i]], { name: '', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0' });
    p.on('drag', () => p.coords.setCoordinates(JXG.COORDS_BY_USER, [x, p.Y()]));   // lock x
    return p;
});

// --- Student's line (two draggable handles) --------------------------------
const H1 = board.create('point', [1, 4], { name: '', size: 5, strokeColor: '#e8710a', fillColor: '#e8710a' });
const H2 = board.create('point', [8, 6], { name: '', size: 5, strokeColor: '#e8710a', fillColor: '#e8710a' });
board.create('line', [H1, H2], { strokeColor: '#e8710a', strokeWidth: 2.5 });

// --- Least-squares line of best fit (revealed by checkbox) ------------------
function lsq() {
    const n = pts.length;
    const mx = pts.reduce((s, p) => s + p.X(), 0) / n;
    const my = pts.reduce((s, p) => s + p.Y(), 0) / n;
    let sxy = 0, sxx = 0;
    pts.forEach(p => { sxy += (p.X() - mx) * (p.Y() - my); sxx += (p.X() - mx) ** 2; });
    const m = sxx === 0 ? 0 : sxy / sxx;
    return { m, c: my - m * mx };
}
const show = board.create('checkbox', [-1.2, 9.9, 'Show line of best fit'], { fontSize: 13 });
board.create('line', [
    [0, () => lsq().c],
    [1, () => lsq().m + lsq().c]
], { strokeColor: '#2e7d32', strokeWidth: 2.5, dash: 2, fixed: true, highlight: false, visible: () => show.Value() });

// --- Readouts (MathJax) -----------------------------------------------------
const eq = (m, c) => 'y = ' + m.toFixed(2) + 'x' + (c >= 0 ? ' + ' : ' - ') + Math.abs(c).toFixed(2);
board.create('text', [-1.2, 9.0, () => {
    const m = (H2.Y() - H1.Y()) / (H2.X() - H1.X()), c = H1.Y() - m * H1.X();
    return '\\(\\text{your line: } ' + eq(m, c) + '\\)';
}], { fontSize: 14, anchorX: 'left', color: '#e8710a', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-1.2, 8.2, () => {
    const l = lsq();
    return '\\(\\text{best fit: } ' + eq(l.m, l.c) + '\\)';
}], { fontSize: 14, anchorX: 'left', color: '#2e7d32', visible: () => show.Value(), cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
