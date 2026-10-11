/*
    Inverse Trigonometric Functions — which angle gives this ratio?
    Buttons choose sin^-1, cos^-1 or tan^-1. A slider changes the ratio; the graph
    of the selected inverse function is drawn (ratio on the x-axis, angle in degrees
    on the y-axis) with a point at (ratio, angle). Readouts show the ratio, the
    angle returned, and the inverse expression.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 15;

const board = JXG.JSXGraph.initBoard('jsx-inverse-trigonometric-functions', {
    boundingbox: [-5, 215, 5, -120],
    axis: true,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const DEG = 180 / Math.PI;
const FNS = [
    { name: '\\sin^{-1}', sym: 'sin', dom: [-1, 1], angle: (r) => Math.asin(r) * DEG, valid: (r) => r >= -1 && r <= 1 },
    { name: '\\cos^{-1}', sym: 'cos', dom: [-1, 1], angle: (r) => Math.acos(r) * DEG, valid: (r) => r >= -1 && r <= 1 },
    { name: '\\tan^{-1}', sym: 'tan', dom: [-4, 4], angle: (r) => Math.atan(r) * DEG, valid: () => true }
];
let current = 0;

// --- Ratio slider -----------------------------------------------------------
const r = board.create('slider', [[-4, 195], [0, 195], [-4, 0.5, 4]], { name: 'ratio', snapWidth: 0.05, size: 5 });

// --- Curve of the selected inverse function ---------------------------------
board.create('functiongraph', [
    (x) => FNS[current].angle(x),
    () => FNS[current].dom[0], () => FNS[current].dom[1]
], { strokeColor: '#1565c0', strokeWidth: 3 });

// --- Moving point at (ratio, angle) -----------------------------------------
const P = board.create('point', [
    () => r.Value(),
    () => (FNS[current].valid(r.Value()) ? FNS[current].angle(r.Value()) : NaN)
], { name: 'P', size: 4, strokeColor: '#c62828', fillColor: '#c62828', fixed: true, label: { offset: [10, 8] } });

// --- Control API for native PreTeXt buttons ---------------------------------
window.itSelect = function (i) {
    if (i < 0 || i >= FNS.length) return;
    current = i;
    board.update();
};

// --- Readouts ---------------------------------------------------------------
board.create('text', [-4.6, 165, () => '\\(\\text{ratio} = ' + r.Value().toFixed(2) + '\\)'], { anchorX: 'left', fixed: true });
board.create('text', [-4.6, 140, () => {
    const rv = r.Value();
    if (!FNS[current].valid(rv)) return '\\(\\text{angle: undefined for this ratio}\\)';
    return '\\(\\text{angle} = ' + FNS[current].angle(rv).toFixed(1) + '^\\circ\\)';
}], { anchorX: 'left', fixed: true });
board.create('text', [-4.6, -100, () => {
    const rv = r.Value();
    if (!FNS[current].valid(rv)) return '\\(' + FNS[current].name + '(' + rv.toFixed(2) + ')\\text{ is undefined}\\)';
    return '\\(' + FNS[current].name + '(' + rv.toFixed(2) + ') = ' + FNS[current].angle(rv).toFixed(1) + '^\\circ\\)';
}], { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });
