/*
    Graphing empirical data — a scatter plot  (13.7)
    ------------------------------------------------
    Eight draggable data points. Move any point to change the scatter; the readout
    reports the coordinates of the point you last moved and the number of points.
    A faint marker shows the mean point (x̄, ȳ) so trends and outliers stand out.

    Draggable: the data points.  Derived: mean marker + readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-graphing-empirical-data', {
    boundingbox: [-1.5, 11, 11, -1.8],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false
});

const data = [[1, 2], [2, 3.5], [3, 3], [4, 5], [5, 5.2], [6, 7], [7, 6.4], [8, 8.5]];
const pts = [];
let selected = null;

data.forEach((d, i) => {
    const p = board.create('point', d, {
        name: '', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0', withLabel: false
    });
    p.on('drag', () => { selected = p; });
    pts.push(p);
});
selected = pts[0];

// Mean point (derived) — a light cross
const meanX = () => pts.reduce((s, p) => s + p.X(), 0) / pts.length;
const meanY = () => pts.reduce((s, p) => s + p.Y(), 0) / pts.length;
board.create('point', [meanX, meanY], {
    name: '\\((\\bar x,\\ \\bar y)\\)', size: 5, face: 'x', strokeColor: '#c62828', strokeWidth: 3,
    fixed: true, highlight: false, label: { offset: [10, 8], color: '#c62828' }
});

// --- Readout (MathJax) ------------------------------------------------------
board.create('text', [-1.2, -1.0, () => '\\(n = ' + pts.length + '\\text{ points}\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [4.2, -1.0, () =>
    '\\(\\text{last moved: } (' + selected.X().toFixed(2) + ',\\ ' + selected.Y().toFixed(2) + ')\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
