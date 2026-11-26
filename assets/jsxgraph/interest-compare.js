/*
    Simple interest against compound interest
    -----------------------------------------
    Opening activity: a youth group in Kisumu invests KSh 10 000 for 3 years
    at 10% p.a. Option A is simple interest, A = P(1 + rt); option B is
    compound interest, A = P(1 + r/n)^(nt).

    Controls live in the HTML slate (range inputs with ids ic-P, ic-r, ic-t,
    ic-n), so the graph can rescale freely as the principal changes. The board
    shows both amounts for 0..20 years, marks year t on both graphs and
    reports the amounts and the extra earned by compounding.

    Expects: a surface="jsxboard" slate with id="jsx-interest-compare" and the
    HTML controls described above (each calls interestUpdate() on input).
*/

JXG.Options.text.fontSize = 13;
JXG.Options.text.useMathJax = false;

const YEARS = 20;
const board = JXG.JSXGraph.initBoard('jsx-interest-compare', {
    boundingbox: [-2.5, 80000, 21, -9000],
    keepAspectRatio: false,
    axis: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    defaultAxes: {
        x: { ticks: { insertTicks: false, ticksDistance: 2, minorTicks: 1, label: { fontSize: 11 } } },
        y: { ticks: { insertTicks: true, minorTicks: 0, label: { fontSize: 11 } } }
    }
});

const state = { P: 10000, r: 10, t: 3, n: 1 };
const PERIODS = [1, 2, 4, 12];
const NAMES = { 1: 'yearly', 2: 'half-yearly', 4: 'quarterly', 12: 'monthly' };

const simple = (t) => state.P * (1 + state.r / 100 * t);
const compound = (t) => state.P * Math.pow(1 + state.r / 100 / state.n, state.n * t);

board.create('functiongraph', [simple, 0, YEARS], { strokeColor: '#1565c0', strokeWidth: 2.5, highlight: false });
board.create('functiongraph', [compound, 0, YEARS], { strokeColor: '#ef6c00', strokeWidth: 2.5, highlight: false });

const ymax = () => board.getBoundingBox()[1];
board.create('segment', [[() => state.t, 0], [() => state.t, () => compound(state.t)]], { strokeColor: '#757575', dash: 2, highlight: false, fixed: true });
board.create('point', [() => state.t, () => simple(state.t)], { name: '', size: 4, color: '#1565c0', fixed: true, showInfobox: false });
board.create('point', [() => state.t, () => compound(state.t)], { name: '', size: 4, color: '#ef6c00', fixed: true, showInfobox: false });

board.create('text', [18.3, () => -0.07 * ymax(), 'years, t'], { fixed: true, color: '#555' });
board.create('text', [0.3, () => 0.97 * ymax(), 'amount (KSh)'], { fixed: true, color: '#555', anchorY: 'top' });

const fmt = (v) => Math.round(v).toLocaleString('en');
board.create('text', [0.3, () => 0.88 * ymax(), () => {
    const t = state.t, A = simple(t), Bc = compound(t);
    return '<div style="background:rgba(255,255,255,0.9);padding:4px 8px;border-radius:4px">' +
        'After <b>' + t + '</b> year' + (t === 1 ? '' : 's') + ' at ' + state.r + '% p.a. on KSh ' + fmt(state.P) + ':<br>' +
        '<span style="color:#1565c0">Simple interest (A): KSh ' + fmt(A) + ' (interest ' + fmt(A - state.P) + ')</span><br>' +
        '<span style="color:#ef6c00">Compound, ' + NAMES[state.n] + ' (B): KSh ' + fmt(Bc) + ' (interest ' + fmt(Bc - state.P) + ')</span><br>' +
        'Compounding earns KSh <b>' + fmt(Bc - A) + '</b> more.</div>';
}], { fixed: true, anchorX: 'left', anchorY: 'top' });

function readNum(id, fallback) {
    const el = document.getElementById(id);
    const v = el ? parseFloat(el.value) : NaN;
    return isNaN(v) ? fallback : v;
}
function setLabel(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

window.interestUpdate = function () {
    state.P = readNum('ic-P', 10000);
    state.r = readNum('ic-r', 10);
    state.t = readNum('ic-t', 3);
    state.n = PERIODS[Math.round(readNum('ic-n', 0))] || 1;
    setLabel('ic-P-val', 'KSh ' + fmt(state.P));
    setLabel('ic-r-val', state.r + '% p.a.');
    setLabel('ic-t-val', state.t + (state.t === 1 ? ' year' : ' years'));
    setLabel('ic-n-val', NAMES[state.n]);
    // Rescale the vertical axis so the larger graph always fits.
    const top = Math.max(compound(YEARS), simple(YEARS)) * 1.12;
    board.setBoundingBox([-2.5, top, 21, -0.11 * top], false);
    board.update();
};
window.interestUpdate();
window.addEventListener('load', window.interestUpdate);
