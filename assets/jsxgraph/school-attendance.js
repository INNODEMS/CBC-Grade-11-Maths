/*
    Graphical methods in real life — school attendance  (13.11)
    -----------------------------------------------------------
    Weekly attendance over a 12-week term, drawn as a line graph. Drag the point so
    it glides along the graph: the readout shows the week, the attendance there, and
    whether attendance is rising or falling. The highest (green) and lowest (red)
    weeks are marked.

    Draggable: the point gliding along the graph.  Derived: readouts, highest/lowest.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-school-attendance', {
    boundingbox: [-1.5, 495, 16.5, 383],
    axis: true, grid: true,
    showCopyright: false, showNavigation: false,
    defaultAxes: {
        x: { ticks: { insertTicks: false, ticksDistance: 1, minorticks: 0 }, name: 'week', withLabel: true, label: { position: 'rt', offset: [-8, 14] } },
        y: { ticks: { insertTicks: false, ticksDistance: 20, minorticks: 1 }, name: 'attendance', withLabel: true, label: { position: 'rt', offset: [14, -5] } }
    }
});

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const att = [418, 432, 447, 440, 455, 428, 405, 421, 452, 468, 461, 449];

// Line graph + data markers
board.create('curve', [weeks, att], { strokeColor: '#0055bb', strokeWidth: 2.5 });
weeks.forEach((w, i) => board.create('point', [w, att[i]], { name: '', size: 2, strokeColor: '#0055bb', fillColor: '#0055bb', fixed: true }));

// Highest and lowest weeks
const hi = att.indexOf(Math.max(...att)), lo = att.indexOf(Math.min(...att));
board.create('point', [weeks[hi], att[hi]], { name: 'highest', size: 5, strokeColor: '#2e7d32', fillColor: '#2e7d32', fixed: true, label: { offset: [8, 10], color: '#2e7d32' } });
board.create('point', [weeks[lo], att[lo]], { name: 'lowest', size: 5, strokeColor: '#c62828', fillColor: '#c62828', fixed: true, label: { offset: [8, -14], color: '#c62828' } });

// Gliding point
const rail = board.create('curve', [weeks, att], { visible: false });
const G = board.create('glider', [4, att[3], rail], { name: '', size: 6, strokeColor: '#e8710a', fillColor: '#e8710a' });
board.create('segment', [[() => G.X(), 383], [() => G.X(), () => G.Y()]], { strokeColor: '#bbb', strokeWidth: 1, dash: 2, fixed: true, highlight: false });

// --- Readouts (MathJax, right) ----------------------------------------------
const R = 12.7;
board.create('text', [R, 486, () => '\\(\\text{week } ' + Math.max(1, Math.min(12, Math.round(G.X()))) + '\\)'],
    { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 470, () => '\\(\\text{attendance } \\approx ' + Math.round(G.Y()) + '\\)'],
    { fontSize: 14, anchorX: 'left', color: '#e8710a', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 454, () => {
    const w = Math.max(1, Math.min(11, Math.floor(G.X() + 0.5)));
    const slope = att[w] - att[w - 1];
    return '\\(\\text{' + (Math.abs(G.X() - Math.round(G.X())) < 0.02 && (Math.round(G.X()) === hi + 1 || Math.round(G.X()) === lo + 1) ? 'turning point' : (slope > 0 ? 'rising' : 'falling')) + '}\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 434, '\\(\\text{highest: week ' + (hi + 1) + ',\\ ' + att[hi] + '}\\)'],
    { fontSize: 13, anchorX: 'left', color: '#2e7d32', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
board.create('text', [R, 418, '\\(\\text{lowest: week ' + (lo + 1) + ',\\ ' + att[lo] + '}\\)'],
    { fontSize: 13, anchorX: 'left', color: '#c62828', cssStyle: 'background:rgba(255,255,255,0.82);padding:1px 5px' });
