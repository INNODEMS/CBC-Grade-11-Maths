/*
    Feasible region with an objective line: the youth-group poultry project
    -----------------------------------------------------------------------
    k = number of Kienyeji chicks (KSh 500 each), e = number of Exotic layer
    chicks (KSh 800 each). Constraints from the opening activity:
        500k + 800e <= budget   (grant, default KSh 50 000)
        k + e       <= coop     (coop space, default 40 birds)
        k           >= minimum  (grant rule, default 10 Kienyeji)
        e           >= 0
    The shaded feasible region updates with the sliders. A dashed objective
    line "expected profit = constant" passes through the draggable point Q;
    learners slide it outwards to find the last whole-number point it touches.
    The "Show best plan" checkbox marks the best whole-number plan, and the
    readout says which constraints actually limit the region (for the default
    numbers the budget line lies completely outside it).

    Expects: a surface="jsxboard" slate with id="jsx-poultry-region".
*/

JXG.Options.text.fontSize = 13;
JXG.Options.text.useMathJax = false;

const board = JXG.JSXGraph.initBoard('jsx-poultry-region', {
    boundingbox: [-7, 84, 66, -8],
    keepAspectRatio: false,
    axis: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    defaultAxes: {
        x: { ticks: { insertTicks: false, ticksDistance: 10, minorTicks: 1, label: { fontSize: 11 } } },
        y: { ticks: { insertTicks: false, ticksDistance: 10, minorTicks: 1, label: { fontSize: 11 } } }
    }
});
board.create('text', [52, -4.5, 'Kienyeji, k'], { fixed: true, color: '#555' });
board.create('text', [1, 58, 'Exotic, e'], { fixed: true, color: '#555' });

// --- Sliders ----------------------------------------------------------------
const so = (name, snap) => ({ name: name, snapWidth: snap, precision: 0, size: 4, label: { fontSize: 13 } });
const budget = board.create('slider', [[3, 80], [15, 80], [10000, 50000, 60000]], so('budget (KSh)', 1000));
const coop = board.create('slider', [[3, 75], [15, 75], [20, 40, 50]], so('coop space', 1));
const minK = board.create('slider', [[3, 70], [15, 70], [0, 10, 30]], so('minimum k', 1));
const pk = board.create('slider', [[31, 80], [43, 80], [100, 400, 1000]], so('profit per k', 50));
const pe = board.create('slider', [[31, 75], [43, 75], [100, 500, 1000]], so('profit per e', 50));

const B = () => budget.Value(), C = () => coop.Value(), M = () => minK.Value();
const feasible = (k, e) => e >= -1e-9 && k >= M() - 1e-9 && k + e <= C() + 1e-9 && 500 * k + 800 * e <= B() + 1e-9;

// --- Constraint lines (clipped to the plotting area) ---------------------------
const lineStyle = (colour) => ({ strokeColor: colour, strokeWidth: 2, highlight: false, fixed: true });
board.create('curve', [(t) => t, (t) => (B() - 500 * t) / 800,
    () => Math.max(0, (B() - 800 * 56) / 500), () => Math.min(64, B() / 500)], lineStyle('#c62828'));
board.create('curve', [(t) => t, (t) => C() - t, () => Math.max(0, C() - 56), () => Math.min(64, C())], lineStyle('#1565c0'));
board.create('segment', [[() => M(), 0], [() => M(), 62]], lineStyle('#2e7d32'));
board.create('text', [() => Math.min(60, B() / 500) - 1, 2.5, 'budget'], { fixed: true, color: '#c62828', anchorX: 'right' });
board.create('text', [() => Math.min(60, C()) - 1, 6.5, 'coop'], { fixed: true, color: '#1565c0', anchorX: 'right' });
board.create('text', [() => M() + 0.8, 60, () => 'k = ' + M()], { fixed: true, color: '#2e7d32' });

// --- Feasible region: clip a large box by each half-plane (Sutherland-Hodgman) ---
function clip(poly, a, b, c) {           // keep a*k + b*e <= c
    const out = [], inside = (p) => a * p[0] + b * p[1] <= c + 1e-9;
    for (let i = 0; i < poly.length; i++) {
        const P = poly[i], Q = poly[(i + 1) % poly.length];
        const ip = inside(P), iq = inside(Q);
        if (ip) out.push(P);
        if (ip !== iq) {
            const t = (c - a * P[0] - b * P[1]) / (a * (Q[0] - P[0]) + b * (Q[1] - P[1]));
            out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
        }
    }
    return out;
}
function region() {
    let poly = [[0, 0], [70, 0], [70, 70], [0, 70]];
    poly = clip(poly, 0, -1, 0);            // e >= 0
    poly = clip(poly, -1, 0, -M());         // k >= minimum
    poly = clip(poly, 1, 1, C());           // k + e <= coop
    poly = clip(poly, 500, 800, B());       // budget
    return poly;
}
const shade = board.create('curve', [[], []], {
    fillColor: '#ffb300', fillOpacity: 0.3, strokeColor: '#ef6c00', strokeWidth: 1, highlight: false
});
shade.updateDataArray = function () {
    const p = region();
    this.dataX = p.map((v) => v[0]); this.dataY = p.map((v) => v[1]);
    if (p.length) { this.dataX.push(p[0][0]); this.dataY.push(p[0][1]); }
};

// --- Objective line through a draggable point Q ------------------------------------
const Q = board.create('point', [15, 10], {
    name: 'Q', size: 4, strokeColor: '#6a1b9a', fillColor: '#6a1b9a', snapToGrid: true, snapSizeX: 1, snapSizeY: 1
});
const profitAt = (k, e) => pk.Value() * k + pe.Value() * e;
board.create('line', [
    () => -profitAt(Q.X(), Q.Y()), () => pk.Value(), () => pe.Value()
], { strokeColor: '#6a1b9a', dash: 2, strokeWidth: 2, highlight: false, fixed: true });

// --- Best whole-number plan (brute force over the grid) --------------------------------
function best() {
    let bk = null, be = null, bp = -1;
    for (let k = 0; k <= 70; k++) for (let e = 0; e <= 70; e++) {
        if (!feasible(k, e)) continue;
        const p = profitAt(k, e);
        if (p > bp + 1e-9) { bp = p; bk = k; be = e; }
    }
    return bk === null ? null : { k: bk, e: be, p: bp };
}
const showBest = board.create('checkbox', [31, 70, 'Show best plan'], { fixed: true });
board.create('point', [() => (best() || { k: -50 }).k, () => (best() || { e: -50 }).e], {
    name: 'best', size: 5, face: 'x', strokeColor: '#000', fixed: true,
    visible: () => showBest.Value() && best() !== null
});

// --- Readouts -----------------------------------------------------------------------------
const fmt = (v) => Math.round(v).toLocaleString('en');
board.create('text', [24, 66, () => {
    const k = Q.X(), e = Q.Y();
    const ok = feasible(k, e);
    return '<b>Q = (' + k + ', ' + e + ')</b>: cost KSh ' + fmt(500 * k + 800 * e) +
        ', expected profit KSh ' + fmt(profitAt(k, e)) +
        (ok ? ' <span style="color:#2e7d32">(possible)</span>' : ' <span style="color:#c62828">(not possible)</span>');
}], { fixed: true, anchorX: 'left' });
board.create('text', [24, 58, () => {
    const p = region();
    if (!p.length) return '<span style="color:#c62828">No plan satisfies all the constraints.</span>';
    const maxCost = Math.max(...p.map((v) => 500 * v[0] + 800 * v[1]));
    const budgetNote = maxCost < B() - 1e-6
        ? 'The budget line lies outside the region: the budget never limits the plan.'
        : 'The budget line forms part of the boundary.';
    let s = budgetNote;
    if (showBest.Value()) {
        const b = best();
        s += '<br><b>Best plan:</b> ' + b.k + ' Kienyeji and ' + b.e + ' Exotic, profit KSh ' + fmt(b.p);
    }
    return s;
}], { fixed: true, anchorX: 'left', fontSize: 12 });
