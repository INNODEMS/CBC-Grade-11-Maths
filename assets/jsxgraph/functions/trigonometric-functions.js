/*
    Trigonometric Functions — unit circle linked to sin, cos, tan graphs
    A slider moves a point around a unit circle (left). The point's height gives
    sin, its horizontal distance gives cos, and the three function graphs (right,
    sharing the x-axis as their zero line) show matching points that move together
    as the angle changes. Readouts show the angle and sin/cos/tan values.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 14;

const board = JXG.JSXGraph.initBoard('jsx-trigonometric-functions', {
    boundingbox: [-9, 4.6, 12, -4.6],
    keepaspectratio: true,
    axis: true,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Parameters -------------------------------------------------------------
const CX = -6, R = 2;                 // unit-circle centre x, radius (on the x-axis)
const S = 1.5;                        // vertical value scale for the graphs
const gx = (d) => (d / 360) * 10;     // map angle (deg) -> graph x in [0,10]
const rad = (d) => d * Math.PI / 180;

// --- Angle slider -----------------------------------------------------------
const th = board.create('slider', [[-9, 4.0], [-1.5, 4.0], [0, 60, 360]], { name: '\\(\\theta^\\circ\\)', snapWidth: 1, size: 5 });

// --- Unit circle ------------------------------------------------------------
const O = board.create('point', [CX, 0], { name: 'O', size: 2, strokeColor: '#222', fillColor: '#222', fixed: true });
board.create('circle', [O, R], { strokeColor: '#555', strokeWidth: 1.5 });

const Pc = board.create('point', [() => CX + R * Math.cos(rad(th.Value())), () => R * Math.sin(rad(th.Value()))],
    { name: 'P', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0', fixed: true });
board.create('segment', [O, Pc], { strokeColor: '#1565c0', strokeWidth: 2 });
const foot = board.create('point', [() => CX + R * Math.cos(rad(th.Value())), 0], { visible: false });
board.create('segment', [foot, Pc], { strokeColor: '#2e7d32', strokeWidth: 2 });   // sine (height)
board.create('segment', [O, foot], { strokeColor: '#c62828', strokeWidth: 2 });     // cosine (base)

// --- Three graphs (share the x-axis as the value-zero line) -----------------
board.create('curve', [(d) => gx(d), (d) => S * Math.sin(rad(d)), 0, 360], { strokeColor: '#2e7d32', strokeWidth: 2 });
board.create('curve', [(d) => gx(d), (d) => S * Math.cos(rad(d)), 0, 360], { strokeColor: '#c62828', strokeWidth: 2 });
board.create('curve', [(d) => gx(d), (d) => {
    const t = Math.tan(rad(d)) * S;
    return (Math.abs(t) > 4.4) ? NaN : t;
}, 0, 360], { strokeColor: '#8e24aa', strokeWidth: 2, dash: 1 });

// vertical guide + moving points on each graph
const gline1 = board.create('point', [() => gx(th.Value()), 4.4], { visible: false });
const gline2 = board.create('point', [() => gx(th.Value()), -4.4], { visible: false });
board.create('line', [gline1, gline2], { strokeColor: '#bbb', dash: 2, straightFirst: false, straightLast: false, strokeWidth: 1 });
board.create('point', [() => gx(th.Value()), () => S * Math.sin(rad(th.Value()))], { name: '', size: 3, color: '#2e7d32', fixed: true });
board.create('point', [() => gx(th.Value()), () => S * Math.cos(rad(th.Value()))], { name: '', size: 3, color: '#c62828', fixed: true });
board.create('point', [() => gx(th.Value()), () => {
    const t = Math.tan(rad(th.Value())) * S;
    return (Math.abs(t) > 4.4) ? NaN : t;
}], { name: '', size: 3, color: '#8e24aa', fixed: true });

// --- Axis labels for the graph region ---------------------------------------
[90, 180, 270, 360].forEach((d) => board.create('text', [gx(d), -0.5, d + '°'], { anchorX: 'middle', fixed: true, cssStyle: 'color:#888; font-size:11px' }));

// --- Readouts ---------------------------------------------------------------
board.create('text', [-9, -3.4, () => '\\(\\theta = ' + th.Value().toFixed(0) + '^\\circ\\)'], { anchorX: 'left', fixed: true });
board.create('text', [-9, -4.1, () => {
    const d = th.Value(), t = Math.tan(rad(d));
    const tanStr = (Math.abs(Math.cos(rad(d))) < 1e-3) ? '\\text{undef}' : t.toFixed(2);
    return '\\(\\color{#2e7d32}{\\sin=' + Math.sin(rad(d)).toFixed(2) + '}\\ \\ \\color{#c62828}{\\cos=' + Math.cos(rad(d)).toFixed(2) + '}\\ \\ \\color{#8e24aa}{\\tan=' + tanStr + '}\\)';
}], { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });