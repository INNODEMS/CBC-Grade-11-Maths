/*
    Arithmetic versus geometric growth: the sports-day seating plan
    ---------------------------------------------------------------
    General seating: first row a, each row d more chairs (arithmetic).
    VIP seating: first row g, each row r times the row in front (geometric).
    The board plots the running totals S_n (chairs needed for the first n rows)
    for both sections against the number of rows n, with a dashed line for the
    number of chairs available. Readouts give T_n and S_n for the chosen n and
    the greatest number of rows of each section that fits within the limit.
    Defaults match the activity: a = 25, d = 6, g = 8, r = 2, limit 800.

    Expects: a surface="jsxboard" slate with id="jsx-sequence-growth".
*/

JXG.Options.text.fontSize = 14;

const board = JXG.JSXGraph.initBoard('jsx-sequence-growth', {
    boundingbox: [-1.6, 1550, 16.5, -170],
    keepAspectRatio: false,
    axis: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    defaultAxes: {
        x: { ticks: { insertTicks: false, ticksDistance: 1, minorTicks: 0, label: { fontSize: 11, offset: [-4, -10] } } },
        y: { ticks: { insertTicks: false, ticksDistance: 200, minorTicks: 1, label: { fontSize: 11 } } }
    }
});
board.create('text', [13.6, -95, 'rows, n'], { fixed: true, color: '#555' });
board.create('text', [0.2, 1500, 'total chairs, Sₙ'], { fixed: true, color: '#555' });

// --- Sliders ----------------------------------------------------------------------
const so = (name, snap) => ({ name: name, snapWidth: snap, precision: snap < 1 ? 1 : 0, size: 4, label: { fontSize: 14 } });
const a = board.create('slider', [[1, 1390], [5, 1390], [5, 25, 50]], so('a', 1));
const d = board.create('slider', [[1, 1300], [5, 1300], [1, 6, 15]], so('d', 1));
const g = board.create('slider', [[8.5, 1390], [12.5, 1390], [1, 8, 20]], so('g', 1));
const r = board.create('slider', [[8.5, 1300], [12.5, 1300], [1.1, 2, 3]], so('r', 0.1));
const nS = board.create('slider', [[1, 1210], [5, 1210], [1, 6, 15]], so('n', 1));
const cap = board.create('slider', [[8.5, 1210], [12.5, 1210], [200, 800, 1400]], so('limit', 50));

// --- Sequences ----------------------------------------------------------------------
const Tap = (k) => a.Value() + (k - 1) * d.Value();
const Sap = (k) => k / 2 * (2 * a.Value() + (k - 1) * d.Value());
const Tgp = (k) => g.Value() * Math.pow(r.Value(), k - 1);
const Sgp = (k) => g.Value() * (Math.pow(r.Value(), k) - 1) / (r.Value() - 1);
const fits = (S) => { let k = 0; while (k < 60 && S(k + 1) <= cap.Value()) k++; return k; };

// Capacity line
board.create('functiongraph', [() => cap.Value(), 0, 16], { strokeColor: '#c62828', dash: 2, strokeWidth: 1.5, highlight: false });
board.create('text', [15.2, () => cap.Value() + 40, () => 'limit ' + cap.Value().toFixed(0)], { fixed: true, color: '#c62828', fontSize: 12, anchorX: 'right' });

// Plotted running totals for n = 1..15 (points joined by line segments)
const series = (S, colour) => {
    const crv = board.create('curve', [[], []], { strokeColor: colour, strokeWidth: 2, highlight: false });
    crv.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        for (let k = 1; k <= 15; k++) { this.dataX.push(k); this.dataY.push(Math.min(S(k), 5000)); }
    };
    for (let k = 1; k <= 15; k++) {
        board.create('point', [k, () => Math.min(S(k), 5000)], {
            name: '', size: 2, fixed: true, strokeColor: colour, fillColor: colour, highlight: false,
            showInfobox: false
        });
    }
};
series(Sap, '#1565c0');
series(Sgp, '#ef6c00');

// Marker for the chosen n
board.create('segment', [[() => nS.Value(), 0], [() => nS.Value(), 1150]], { strokeColor: '#757575', dash: 1, highlight: false });

// --- Readouts --------------------------------------------------------------------------
const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-6 ? Math.round(v).toLocaleString('en') : v.toFixed(1));
board.create('text', [-1.3, 1110, () => {
    const k = nS.Value();
    return '<span style="color:#1565c0"><b>General (arithmetic):</b> T<sub>' + k + '</sub> = ' + fmt(Tap(k)) +
        ', S<sub>' + k + '</sub> = ' + fmt(Sap(k)) + '; fits ' + fits(Sap) + ' rows</span>';
}], { fixed: true });
board.create('text', [-1.3, 1040, () => {
    const k = nS.Value();
    return '<span style="color:#ef6c00"><b>VIP (geometric):</b> T<sub>' + k + '</sub> = ' + fmt(Tgp(k)) +
        ', S<sub>' + k + '</sub> = ' + fmt(Sgp(k)) + '; fits ' + fits(Sgp) + ' rows</span>';
}], { fixed: true });
