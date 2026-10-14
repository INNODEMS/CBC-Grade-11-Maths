/*
    Graphing circles — equation ↔ graph  (13.1)
    -------------------------------------------
    Drag the centre C and change the radius slider r. The circle, its standard-form
    equation (x−h)² + (y−k)² = r², the centre (h, k) and the radius update live.

    Draggable: C (centre).  Slider: r (radius).  Derived: the circle + readouts.
*/

JXG.Options.text.useMathJax = true;

const board = JXG.JSXGraph.initBoard('jsx-graphing-circles', {
    boundingbox: [-8, 8, 8, -8],
    keepaspectratio: true,          // a circle must look circular
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

// --- Controls ---------------------------------------------------------------
const r = board.create('slider', [[-7.2, 7], [-2.5, 7], [0.1, 3, 7]], {
    name: '\\(r\\)', snapWidth: 0.1, size: 4,
    fillColor: '#c62828', strokeColor: '#c62828',
    highline: { strokeColor: '#c62828' }, baseline: { strokeColor: '#aaa' }
});

const C = board.create('point', [2, 1], {
    name: 'C', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: { offset: [8, 8] }
});

// --- Construction -----------------------------------------------------------
board.create('circle', [C, () => r.Value()], {
    strokeColor: '#c62828', strokeWidth: 2.5, fillColor: '#ef9a9a', fillOpacity: 0.12
});

// radius spoke (dashed) with a label
const edge = board.create('point', [() => C.X() + r.Value(), () => C.Y()], { visible: false });
board.create('segment', [C, edge], { strokeColor: '#c62828', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false });
board.create('text', [
    () => C.X() + r.Value() / 2,
    () => C.Y() + 0.4,
    () => '\\(r = ' + r.Value().toFixed(1) + '\\)'
], { fontSize: 13, color: '#c62828', anchorX: 'middle', fixed: true });

// --- Readout (MathJax, bottom-left) -----------------------------------------
const sgn = (v) => (v >= 0 ? '- ' : '+ ') + Math.abs(v).toFixed(1);
board.create('text', [-7.6, -5.6, () => {
    const h = C.X(), k = C.Y(), rr = r.Value();
    return '\\((x ' + sgn(h) + ')^2 + (y ' + sgn(k) + ')^2 = ' + rr.toFixed(1) + '^2 \\)';
}], { fontSize: 15, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });

board.create('text', [-7.6, -6.7, () => {
    return '\\(\\text{centre } (' + C.X().toFixed(1) + ',\\ ' + C.Y().toFixed(1) + '), \\quad r = ' + r.Value().toFixed(1) + '\\)';
}], { fontSize: 14, anchorX: 'left', cssStyle: 'background:rgba(255,255,255,0.82);padding:2px 5px' });
