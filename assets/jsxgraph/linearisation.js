/*
    Converting a non-linear relationship into a straight line  (13.9)
    -----------------------------------------------------------------
    The learner picks a non-linear MODEL (quadratic, exponential, power,
    reciprocal) and a TRANSFORMATION from two native PreTeXt dropdowns. The chosen
    transformation is applied to the data, the transformed points are plotted, and
    a best-fit line is drawn. The figure reports whether that transformation has
    linearised the data (the points lie on the line) and why.

    House-style split:
      - The transformed plot is the JSXGraph board (id="jsx-linearisation").
      - The MODEL and TRANSFORMATION dropdowns are native PreTeXt <select>s wired to
        window.linModel(key) and window.linTransform(key).
      - A status line is written to an html slate with id="lin_status".
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 14;

    const board = JXG.JSXGraph.initBoard('jsx-linearisation', {
        boundingbox: [-1, 10, 8, -2],
        axis: true, grid: true,
        showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false }
    });

    const xs = [1, 2, 3, 4, 5, 6];

    // --- Models -------------------------------------------------------------
    const MODELS = {
        quadratic:   { name: 'Quadratic',   eq: 'y = 0.5x^2 + 1', f: (x) => 0.5 * x * x + 1, correct: 'x2',     shape: 'a parabola' },
        exponential: { name: 'Exponential', eq: 'y = 8(0.7)^x',   f: (x) => 8 * Math.pow(0.7, x), correct: 'semilog', shape: 'exponential decay' },
        power:       { name: 'Power',       eq: 'y = 2x^{1.5}',   f: (x) => 2 * Math.pow(x, 1.5), correct: 'loglog',  shape: 'a power curve' },
        reciprocal:  { name: 'Reciprocal',  eq: 'y = 12/x',       f: (x) => 12 / x,               correct: 'recip',   shape: 'a reciprocal curve' }
    };
    const TRANSFORMS = {
        linear:  { label: '(x, y)',        why: 'plain axes' },
        x2:      { label: '(x^2, y)',      why: 'plotting y against x^2' },
        semilog: { label: '(x, ln y)',     why: 'plotting ln y against x' },
        loglog:  { label: '(ln x, ln y)',  why: 'plotting ln y against ln x' },
        recip:   { label: '(1/x, y)',      why: 'plotting y against 1/x' }
    };

    let modelKey = 'exponential', transformKey = 'linear';

    const YS = () => xs.map(x => MODELS[modelKey].f(x));
    function xval(i) {
        const x = xs[i];
        switch (transformKey) {
            case 'x2': return x * x;
            case 'loglog': return Math.log(x);
            case 'recip': return 1 / x;
            default: return x;
        }
    }
    function yval(i) {
        const y = MODELS[modelKey].f(xs[i]);
        return (transformKey === 'semilog' || transformKey === 'loglog') ? Math.log(y) : y;
    }

    // --- Transformed points + best-fit line ---------------------------------
    xs.forEach((x, i) => board.create('point', [() => xval(i), () => yval(i)],
        { name: '', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0', fixed: true, highlight: false }));

    let reg = { m: 1, c: 0, x1: 0, x2: 1 };
    board.create('line', [
        [() => reg.x1, () => reg.m * reg.x1 + reg.c],
        [() => reg.x2, () => reg.m * reg.x2 + reg.c]
    ], { strokeColor: '#e8710a', strokeWidth: 2, dash: 2, straightFirst: false, straightLast: false, fixed: true, highlight: false });

    const statusEl = () => document.getElementById('lin_status');
    const setStatus = (h) => { const s = statusEl(); if (s) s.innerHTML = h; };

    function redraw() {
        const X = xs.map((x, i) => xval(i)), Y = xs.map((x, i) => yval(i));
        const n = X.length;
        const mx = X.reduce((a, b) => a + b, 0) / n, my = Y.reduce((a, b) => a + b, 0) / n;
        let sxx = 0, sxy = 0, syy = 0;
        for (let i = 0; i < n; i++) { sxx += (X[i] - mx) ** 2; sxy += (X[i] - mx) * (Y[i] - my); syy += (Y[i] - my) ** 2; }
        reg.m = sxy / sxx; reg.c = my - reg.m * mx;
        reg.x1 = Math.min(...X); reg.x2 = Math.max(...X);
        const r2 = (syy === 0) ? 1 : (sxy * sxy) / (sxx * syy);
        const straight = r2 > 0.9995;

        // rescale board to the transformed data
        const padX = Math.max((reg.x2 - reg.x1) * 0.15, 0.5);
        const ymin = Math.min(...Y), ymax = Math.max(...Y), padY = Math.max((ymax - ymin) * 0.15, 0.5);
        board.setBoundingBox([reg.x1 - padX, ymax + padY, reg.x2 + padX, ymin - padY], false);
        board.update();

        const M = MODELS[modelKey], T = TRANSFORMS[transformKey];
        setStatus(
            'Model: <b>' + M.name + '</b> &nbsp; \\(' + M.eq + '\\) (' + M.shape + ')<br>' +
            'Transformation: <b>' + T.label.replace(/</g, '&lt;') + '</b> — ' + T.why + '<br>' +
            (straight
                ? '<span style="color:#2e7d32">These transformed points lie on a straight line, so this transformation <b>linearises</b> the data.</span>'
                : '<span style="color:#c62828">The transformed points are still curved — this transformation does <b>not</b> linearise this model.</span>')
        );
        if (window.MathJax && window.MathJax.typeset) { try { window.MathJax.typeset(); } catch (e) {} }
    }

    // --- Control API for native PreTeXt dropdowns ---------------------------
    window.linModel = function (k) { if (MODELS[k]) { modelKey = k; redraw(); } };
    window.linTransform = function (k) { if (TRANSFORMS[k]) { transformKey = k; redraw(); } };

    redraw();
}());
