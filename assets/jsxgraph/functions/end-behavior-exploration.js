// ============================================================
// BOARD SETUP
// ============================================================
const board = JXG.JSXGraph.initBoard('jsxgraph-end-behavior', {
    boundingbox: [-24, 500, 24, -500],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// ============================================================
// SLIDERS
// ============================================================
const xSlider = board.create('slider', [[-22, -430], [22, -430], [-20, 5, 20]], {
    name: 'x', snapWidth: 0.5, size: 6,
    label: { fontSize: 14, cssClass: 'font-bold' }
});

const aSlider = board.create('slider', [[-22, -480], [22, -480], [-2, 1, 2]], {
    name: 'a', snapWidth: 0.1, size: 6,
    label: { fontSize: 14, cssClass: 'font-bold' }
});

// ============================================================
// GRAPH — reads 'a' live, so it redraws itself automatically
// ============================================================
board.create('functiongraph', [
    (x) => aSlider.Value() * x * x - 2 * x + 3, -20, 20
], { strokeColor: '#2563eb', strokeWidth: 3 });

// ============================================================
// MOVING POINT — reads 'x' and 'a' live
// ============================================================
const P = board.create('point', [
    () => xSlider.Value(),
    () => aSlider.Value() * xSlider.Value() * xSlider.Value() - 2 * xSlider.Value() + 3
], { name: '', size: 5, fixed: true, fillColor: '#ea580c', strokeColor: '#ea580c' });

board.create('segment', [
    [() => xSlider.Value(), 0], [() => xSlider.Value(), () => P.Y()]
], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });

// ============================================================
// TOP READOUTS
// ============================================================
board.create('text', [0, 480, () => 'f(x) = ' + aSlider.Value().toFixed(1) + 'x\u00B2 \u2212 2x + 3'], {
    fontSize: 17, anchorX: 'middle', cssClass: 'font-bold', color: '#1e3a8a'
});

board.create('text', [0, 440, () =>
    'x = ' + xSlider.Value().toFixed(1) + '     f(x) = ' + P.Y().toFixed(1)
], { fontSize: 15, anchorX: 'middle', color: '#0f172a' });

// ============================================================
// END-BEHAVIOR DESCRIPTIONS — pure functions of 'a'
// ============================================================
function leftBehaviorText() {
    const a = aSlider.Value();
    if (Math.abs(a) < 0.05) return 'As x \u2192 \u2212\u221E,  f(x) \u2192 \u221E  (linear, slope \u22122)';
    return a > 0
        ? 'As x \u2192 \u2212\u221E,  f(x) \u2192 \u221E'
        : 'As x \u2192 \u2212\u221E,  f(x) \u2192 \u2212\u221E';
}

function rightBehaviorText() {
    const a = aSlider.Value();
    if (Math.abs(a) < 0.05) return 'As x \u2192 \u221E,  f(x) \u2192 \u2212\u221E  (linear, slope \u22122)';
    return a > 0
        ? 'As x \u2192 \u221E,  f(x) \u2192 \u221E'
        : 'As x \u2192 \u221E,  f(x) \u2192 \u2212\u221E';
}

board.create('text', [-12, -280, () => leftBehaviorText()], {
    fontSize: 14, anchorX: 'middle', cssClass: 'font-bold', color: '#166534'
});
board.create('text', [12, -280, () => rightBehaviorText()], {
    fontSize: 14, anchorX: 'middle', cssClass: 'font-bold', color: '#166534'
});

// ============================================================
// SUMMARY CONCLUSION — what shape does the graph become?
// ============================================================
board.create('text', [0, -340, () => {
    const a = aSlider.Value();
    if (Math.abs(a) < 0.05) return 'a = 0:  the function becomes LINEAR \u2014 one end up, one end down.';
    return a > 0
        ? 'a > 0:  BOTH ends of the graph go UP.'
        : 'a < 0:  BOTH ends of the graph go DOWN.';
}], {
    fontSize: 16, anchorX: 'middle', cssClass: 'font-bold',
    color: () => {
        const a = aSlider.Value();
        if (Math.abs(a) < 0.05) return '#7c3aed';
        return a > 0 ? '#16a34a' : '#dc2626';
    }
});