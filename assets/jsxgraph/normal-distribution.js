/*
    Normal distribution — probability is the area under the bell curve
    ------------------------------------------------------------------
    Sliders set the mean mu and standard deviation sigma of N(mu, sigma)
    (defaults: heights with mu = 165 cm, sigma = 8 cm, as in the worked
    example). Two points a and b slide along the x-axis; the area under the
    curve between them is shaded and its value P(a < X < b) is shown, with
    a and b also written as "mu + z sigma". Buttons jump to mu +/- sigma,
    mu +/- 2 sigma and mu +/- 3 sigma so learners can check the
    68-95-99.7 rule for any mu and sigma.

    Expects: a surface="jsxboard" slate with id="jsx-normal-distribution".
*/

JXG.Options.text.fontSize = 14;

const board = JXG.JSXGraph.initBoard('jsx-normal-distribution', {
    boundingbox: [95, 0.155, 235, -0.04],
    keepAspectRatio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Axes (x only; the density scale is not needed for the reading) ---------
const xAxis = board.create('axis', [[0, 0], [1, 0]], {
    ticks: { insertTicks: false, ticksDistance: 10, minorTicks: 1, drawLabels: true,
             label: { fontSize: 12, offset: [-8, -12] } },
    strokeColor: '#555'
});
board.create('text', [228, -0.018, 'x'], { fixed: true, fontSize: 14, color: '#555' });

// --- Sliders -----------------------------------------------------------------
const mu = board.create('slider', [[100, 0.142], [140, 0.142], [140, 165, 190]], {
    name: 'μ', snapWidth: 1, precision: 0, size: 4, label: { fontSize: 14 }
});
const sigma = board.create('slider', [[100, 0.128], [140, 0.128], [4, 8, 15]], {
    name: 'σ', snapWidth: 0.5, precision: 1, size: 4, label: { fontSize: 14 }
});

// --- Normal density and cumulative probability -------------------------------
function pdf(x) {
    const m = mu.Value(), s = sigma.Value();
    const z = (x - m) / s;
    return Math.exp(-0.5 * z * z) / (s * Math.sqrt(2 * Math.PI));
}

// erf by Abramowitz and Stegun 7.1.26 (error below 1.5e-7)
function erf(x) {
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return sign * y;
}
function Phi(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }

// --- Bell curve ----------------------------------------------------------------
board.create('functiongraph', [pdf, 95, 235], { strokeColor: '#1565c0', strokeWidth: 3, highlight: false });

// --- Bounds a and b (gliders on the x-axis, snapped to 0.5) --------------------
const A = board.create('glider', [157, 0, xAxis], {
    name: 'a', size: 5, strokeColor: '#c62828', fillColor: '#c62828', label: { offset: [-4, 14], fontSize: 15 }
});
const B = board.create('glider', [173, 0, xAxis], {
    name: 'b', size: 5, strokeColor: '#c62828', fillColor: '#c62828', label: { offset: [-4, 14], fontSize: 15 }
});
function snap(P) {
    const x = Math.min(232, Math.max(98, Math.round(P.X() * 2) / 2));
    P.setPosition(JXG.COORDS_BY_USER, [x, 0]);
}
A.on('drag', () => snap(A));
B.on('drag', () => snap(B));

const lo = () => Math.min(A.X(), B.X());
const hi = () => Math.max(A.X(), B.X());

// --- Shaded area between a and b ---------------------------------------------------
const shade = board.create('curve', [[], []], {
    fillColor: '#ef6c00', fillOpacity: 0.35, strokeWidth: 0, highlight: false
});
shade.updateDataArray = function () {
    const l = lo(), h = hi(), n = 80;
    this.dataX = [l];
    this.dataY = [0];
    for (let i = 0; i <= n; i++) {
        const x = l + (h - l) * i / n;
        this.dataX.push(x);
        this.dataY.push(pdf(x));
    }
    this.dataX.push(h);
    this.dataY.push(0);
};

// Dashed line at the mean
board.create('segment', [[() => mu.Value(), 0], [() => mu.Value(), () => pdf(mu.Value())]], {
    strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1, highlight: false
});

// --- Readouts ----------------------------------------------------------------------
const zText = (x) => {
    const z = (x - mu.Value()) / sigma.Value();
    if (Math.abs(z) < 0.005) return 'μ';
    return 'μ ' + (z > 0 ? '+ ' : '− ') + Math.abs(z).toFixed(2) + 'σ';
};
board.create('text', [160, 0.146, () =>
    'X ~ N(' + mu.Value().toFixed(0) + ', ' + sigma.Value().toFixed(1) + ')'],
    { fixed: true, fontSize: 15 });
board.create('text', [160, 0.134, () =>
    'a = ' + lo().toFixed(1) + ' = ' + zText(lo()) + ',   b = ' + hi().toFixed(1) + ' = ' + zText(hi())],
    { fixed: true });
board.create('text', [160, 0.121, () => {
    const p = Phi((hi() - mu.Value()) / sigma.Value()) - Phi((lo() - mu.Value()) / sigma.Value());
    return '<b>P(a &lt; X &lt; b) = ' + p.toFixed(3) + '</b>  (' + (100 * p).toFixed(1) + '% of the area)';
}], { fixed: true, fontSize: 15, color: '#ef6c00' });

// --- Buttons for the 68-95-99.7 rule ------------------------------------------------
function setBand(k) {
    const m = mu.Value(), s = sigma.Value();
    A.setPosition(JXG.COORDS_BY_USER, [m - k * s, 0]);
    B.setPosition(JXG.COORDS_BY_USER, [m + k * s, 0]);
    board.update();
}
board.create('button', [100, 0.108, 'μ ± σ', () => setBand(1)], { fixed: true });
board.create('button', [114, 0.108, 'μ ± 2σ', () => setBand(2)], { fixed: true });
board.create('button', [130, 0.108, 'μ ± 3σ', () => setBand(3)], { fixed: true });
