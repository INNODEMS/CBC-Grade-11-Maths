/*
    Transforming sine and cosine graphs: y = a sin(b(x - c)) + d
    ------------------------------------------------------------
    Four sliders change a (amplitude and reflection), b (number of cycles in
    360 degrees), c (horizontal shift, in degrees) and d (vertical shift).
    A button switches between sine and cosine. The basic graph y = sin x or
    y = cos x is drawn dashed for comparison, the midline y = d is dotted, and
    the readouts give the equation, amplitude, period, shifts, and the maximum
    and minimum values. x is measured in degrees.

    Expects: a surface="jsxboard" slate with id="jsx-trig-transformations".
*/

JXG.Options.text.fontSize = 14;

const board = JXG.JSXGraph.initBoard('jsx-trig-transformations', {
    boundingbox: [-40, 10.2, 400, -6],
    keepAspectRatio: false,
    axis: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    defaultAxes: {
        x: { ticks: { insertTicks: false, ticksDistance: 90, minorTicks: 2,
                      label: { fontSize: 12, offset: [-10, -12] } } },
        y: { ticks: { insertTicks: false, ticksDistance: 1, minorTicks: 0,
                      label: { fontSize: 12 } } }
    }
});
board.create('text', [385, -0.6, 'x°'], { fixed: true, color: '#555' });

const DEG = Math.PI / 180;

// --- Sliders -------------------------------------------------------------------
const opts = (name, snap, prec) => ({ name: name, snapWidth: snap, precision: prec, size: 4, label: { fontSize: 15 } });
const a = board.create('slider', [[0, 9.4], [120, 9.4], [-3, 1, 3]], opts('a', 0.5, 1));
const b = board.create('slider', [[0, 8.5], [120, 8.5], [0.5, 1, 4]], opts('b', 0.5, 1));
const c = board.create('slider', [[0, 7.6], [120, 7.6], [-180, 0, 180]], opts('c', 15, 0));
const d = board.create('slider', [[0, 6.7], [120, 6.7], [-2, 0, 2]], opts('d', 0.5, 1));

// --- Sine or cosine ---------------------------------------------------------------
let useCos = false;
const base = (t) => (useCos ? Math.cos(t * DEG) : Math.sin(t * DEG));
const f = (x) => a.Value() * base(b.Value() * (x - c.Value())) + d.Value();

board.create('button', [175, 9.4, 'Switch sin / cos', () => {
    useCos = !useCos;
    board.update();
}], { fixed: true });

// --- Graphs ------------------------------------------------------------------------
board.create('functiongraph', [base, -40, 400], {
    strokeColor: '#9e9e9e', strokeWidth: 1.5, dash: 2, highlight: false
});
board.create('functiongraph', [() => d.Value(), -40, 400], {
    strokeColor: '#2e7d32', strokeWidth: 1, dash: 1, highlight: false
});
board.create('functiongraph', [f, -40, 400], {
    strokeColor: '#1565c0', strokeWidth: 3, highlight: false, numberPointsHigh: 1600
});

// --- Readouts --------------------------------------------------------------------
const n = (v, p) => {
    const r = Math.round(v * 100) / 100;
    return Number.isInteger(r) ? r.toString() : r.toFixed(p === undefined ? 1 : p);
};
function equation() {
    const av = a.Value(), bv = b.Value(), cv = c.Value(), dv = d.Value();
    const fn = useCos ? 'cos' : 'sin';
    let coef = av === 1 ? '' : (av === -1 ? '−' : (av < 0 ? '−' + n(-av) : n(av)));
    if (av === 0) return 'y = ' + n(dv);
    let inner = 'x';
    if (cv !== 0) inner = 'x ' + (cv > 0 ? '− ' : '+ ') + Math.abs(cv) + '°';
    let arg;
    if (bv === 1) arg = inner;
    else arg = n(bv) + (cv !== 0 ? '(' + inner + ')' : 'x');
    let out = 'y = ' + coef + ' ' + fn + '(' + arg + ')';
    if (dv !== 0) out += (dv > 0 ? ' + ' : ' − ') + n(Math.abs(dv));
    return out.replace('=  ', '= ');
}
board.create('text', [175, 8.4, () => '<b>' + equation() + '</b>'], { fixed: true, fontSize: 16, color: '#1565c0' });
board.create('text', [175, 7.5, () =>
    'amplitude = ' + n(Math.abs(a.Value())) + ',   period = ' + n(360 / b.Value()) + '°'], { fixed: true });
board.create('text', [175, 6.7, () =>
    'shift: ' + (c.Value() === 0 ? 'none' : Math.abs(c.Value()) + '° ' + (c.Value() > 0 ? 'right' : 'left')) +
    ',   midline y = ' + n(d.Value())], { fixed: true });
board.create('text', [175, 5.9, () =>
    'maximum = ' + n(d.Value() + Math.abs(a.Value())) + ',   minimum = ' + n(d.Value() - Math.abs(a.Value())) +
    (a.Value() < 0 ? '   (reflected in the midline)' : '')], { fixed: true });
