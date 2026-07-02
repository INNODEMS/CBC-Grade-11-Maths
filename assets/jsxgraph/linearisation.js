/*
    Converting a non-linear relationship into a straight line  (13.9)
    -----------------------------------------------------------------
    Data comes from the exponential model y = 8·(0.7)^x (x = 1..6). Slide the "view"
    selector to try three ways of plotting the data. Only one transformation makes
    the points lie on a straight line — for an exponential model it is the semi-log
    plot (x, ln y). The grey dashed chord joins the first and last points; the blue
    polyline lies on it exactly when the transformation has linearised the data.

    Control: the "view" selector (0 linear, 1 semi-log, 2 log-log).
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-linearisation', {
    boundingbox: [-1, 6.4, 7, -1.6],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const xs = [1, 2, 3, 4, 5, 6];
const ys = xs.map(x => 8 * Math.pow(0.7, x));

const view = board.create('slider', [[3.2, 5.9], [6.4, 5.9], [0, 0, 2]], { name: 'view', snapWidth: 1, size: 4 });
const sel = () => Math.round(view.Value());
const Xt = (i) => (sel() === 2 ? Math.log(xs[i]) : xs[i]);
const Yt = (i) => (sel() === 0 ? ys[i] : Math.log(ys[i]));

// Transformed data points
xs.forEach((x, i) => board.create('point', [() => Xt(i), () => Yt(i)],
    { name: '', size: 3, strokeColor: '#1565c0', fillColor: '#1565c0', fixed: true }));

// Polyline through the transformed points (shows the actual shape)
const poly = board.create('curve', [[], []], { strokeColor: '#1565c0', strokeWidth: 2, highlight: false });
poly.updateDataArray = function () {
    this.dataX = xs.map((x, i) => Xt(i));
    this.dataY = xs.map((x, i) => Yt(i));
};

// Straight chord: first to last transformed point (a straight-line reference)
board.create('line', [
    [() => Xt(0), () => Yt(0)],
    [() => Xt(xs.length - 1), () => Yt(xs.length - 1)]
], { strokeColor: '#888', strokeWidth: 1.5, dash: 2, straightFirst: false, straightLast: false, fixed: true, highlight: false });

board.update();

// --- Readouts (MathJax) -----------------------------------------------------
const names = ['\\(\\text{linear axes } (x,\\ y)\\)', '\\(\\text{semi-log } (x,\\ \\ln y)\\)', '\\(\\text{log-log } (\\ln x,\\ \\ln y)\\)'];
const eqns = [
    '\\(y = 8\\,(0.7)^x\\quad\\text{— curved}\\)',
    '\\(\\ln y = 2.08 - 0.357\\,x\\quad\\text{— straight!}\\)',
    '\\(\\ln y \\text{ vs } \\ln x\\quad\\text{— curved}\\)'
];
board.create('text', [-0.9, -0.75, () => names[sel()]],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [-0.9, -1.25, () => eqns[sel()]],
    { fontSize: 14, anchorX: 'left', color: '#0055bb', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
