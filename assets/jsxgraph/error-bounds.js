/*
    Error bounds on a number line: adding and subtracting measurements
    -----------------------------------------------------------------
    A textbook is measured: length L and width W (defaults 30.0 cm and
    25.0 cm, to the nearest 0.1 cm, as in the opening activity). Each row is a
    zoomed number line centred on the working value. The coloured bar shows
    the interval from the lower limit to the upper limit.

      L, W   : working value +/- half the unit of measurement
      L + W  : (Lmin + Wmin) to (Lmax + Wmax)   -> absolute error doubles
      L - W  : (Lmin - Wmax) to (Lmax - Wmin)   -> absolute error doubles too

    The checkbox switches the unit of measurement between 0.1 cm and 1 cm.

    Expects: a surface="jsxboard" slate with id="jsx-error-bounds".
*/

JXG.Options.text.fontSize = 13;
JXG.Options.text.useMathJax = false;

const board = JXG.JSXGraph.initBoard('jsx-error-bounds', {
    boundingbox: [-0.3, 12, 12.3, -0.6],
    keepAspectRatio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const Ls = board.create('slider', [[0.6, 11.2], [4.6, 11.2], [20, 30, 40]], { name: 'L', snapWidth: 0.1, precision: 1, size: 4 });
const Ws = board.create('slider', [[7, 11.2], [11, 11.2], [10, 25, 30]], { name: 'W', snapWidth: 0.1, precision: 1, size: 4 });
const whole = board.create('checkbox', [0.6, 10.3, 'measured to the nearest whole cm (instead of 0.1 cm)'], { fixed: true });

const unit = () => (whole.Value() ? 1 : 0.1);
const lim = () => unit() / 2;                       // limit of accuracy
const L = () => (whole.Value() ? Math.round(Ls.Value()) : Ls.Value());
const W = () => (whole.Value() ? Math.round(Ws.Value()) : Ws.Value());
const dp = () => (whole.Value() ? 1 : 2);
const f = (v) => v.toFixed(dp());

// One zoomed number line per row. The line always shows centre +/- 3 limits.
const X0 = 2.2, X1 = 11.8;
function row(y, title, colour, centre, lo, hi, note) {
    const toX = (v) => X0 + (X1 - X0) * (v - (centre() - 3 * lim())) / (6 * lim());
    board.create('text', [0, y + 0.05, title], { fixed: true, color: colour, fontSize: 14, anchorY: 'middle' });
    board.create('segment', [[X0, y], [X1, y]], { strokeColor: '#555', strokeWidth: 1.5, fixed: true, highlight: false });
    for (let k = -3; k <= 3; k++) {
        board.create('segment', [[X0 + (X1 - X0) * (k + 3) / 6, y - 0.12], [X0 + (X1 - X0) * (k + 3) / 6, y + 0.12]],
            { strokeColor: '#555', strokeWidth: 1, fixed: true, highlight: false });
    }
    board.create('segment', [[() => toX(lo()), y], [() => toX(hi()), y]],
        { strokeColor: colour, strokeWidth: 9, strokeOpacity: 0.55, fixed: true, highlight: false });
    board.create('point', [() => toX(centre()), y], { name: '', size: 3, color: '#000', fixed: true, showInfobox: false });
    board.create('text', [() => toX(lo()), y - 0.45, () => f(lo())], { fixed: true, anchorX: 'middle', color: colour });
    board.create('text', [() => toX(hi()), y - 0.45, () => f(hi())], { fixed: true, anchorX: 'middle', color: colour });
    board.create('text', [() => toX(centre()), y + 0.45, () => f(centre())], { fixed: true, anchorX: 'middle', color: '#000' });
    board.create('text', [X0, y - 0.95, note], { fixed: true, color: '#444', fontSize: 12 });
}

row(8.6, 'L (cm)', '#1565c0', L, () => L() - lim(), () => L() + lim(),
    () => 'limit of accuracy ±' + f(lim()) + ' cm');
row(6.3, 'W (cm)', '#2e7d32', W, () => W() - lim(), () => W() + lim(),
    () => 'limit of accuracy ±' + f(lim()) + ' cm');
row(3.9, 'L + W', '#6a1b9a', () => L() + W(), () => L() + W() - 2 * lim(), () => L() + W() + 2 * lim(),
    () => 'min = ' + f(L() - lim()) + ' + ' + f(W() - lim()) + ',  max = ' + f(L() + lim()) + ' + ' + f(W() + lim()) +
        ';  absolute error = ' + f(lim()) + ' + ' + f(lim()) + ' = ' + f(2 * lim()) + ' cm');
row(1.5, 'L − W', '#c62828', () => L() - W(), () => L() - W() - 2 * lim(), () => L() - W() + 2 * lim(),
    () => 'min = ' + f(L() - lim()) + ' − ' + f(W() + lim()) + ',  max = ' + f(L() + lim()) + ' − ' + f(W() - lim()) +
        ';  absolute error = ' + f(2 * lim()) + ' cm');
