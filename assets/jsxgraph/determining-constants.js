/*
    Determining constants from a linearised graph  (13.10)
    ------------------------------------------------------
    The learner picks a non-linear MODEL (exponential, power, reciprocal) from a
    native PreTeXt dropdown. The data is linearised to Y = mX + c and a best-fit
    straight line is drawn automatically. Its gradient and intercept (shown with a
    slope triangle and an intercept point) are read off and mapped to the constants
    of the original model, which is then rebuilt with those values — all derived, no
    fitting by hand.

    House-style split:
      - The linearised plot is the JSXGraph board (id="jsx-determining-constants").
      - The MODEL dropdown is a native PreTeXt <select> wired to window.dcModel(key).
      - The step-by-step readouts are written to an html slate id="dc_status".
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 14;

    const board = JXG.JSXGraph.initBoard('jsx-determining-constants', {
        boundingbox: [-1, 4, 7, -3],
        axis: true, grid: true,
        showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false }
    });

    const xs = [1, 2, 3, 4, 5, 6];

    // --- Models: original -> linearised coordinates -------------------------
    const MODELS = {
        exponential: {
            name: 'Exponential', origForm: 'y = A\\,b^{x}',
            f: (x) => 8 * Math.pow(0.7, x),
            X: (x) => x, Y: (y) => Math.log(y),
            xLab: 'x', yLab: '\\ln y', lineForm: '\\ln y = mx + c',
            constants: (m, c) => ({ text: 'b = e^{m} = ' + Math.exp(m).toFixed(2) + ',\\quad A = e^{c} = ' + Math.exp(c).toFixed(2),
                final: 'y = ' + Math.exp(c).toFixed(1) + '\\,(' + Math.exp(m).toFixed(2) + ')^{x}' })
        },
        power: {
            name: 'Power', origForm: 'y = A\\,x^{n}',
            f: (x) => 2 * Math.pow(x, 1.5),
            X: (x) => Math.log(x), Y: (y) => Math.log(y),
            xLab: '\\ln x', yLab: '\\ln y', lineForm: '\\ln y = m\\ln x + c',
            constants: (m, c) => ({ text: 'n = m = ' + m.toFixed(2) + ',\\quad A = e^{c} = ' + Math.exp(c).toFixed(2),
                final: 'y = ' + Math.exp(c).toFixed(1) + '\\,x^{' + m.toFixed(2) + '}' })
        },
        reciprocal: {
            name: 'Reciprocal', origForm: 'y = a + b/x',
            f: (x) => 3 + 12 / x,
            X: (x) => 1 / x, Y: (y) => y,
            xLab: '1/x', yLab: 'y', lineForm: 'y = m(1/x) + c',
            constants: (m, c) => ({ text: 'b = m = ' + m.toFixed(2) + ',\\quad a = c = ' + c.toFixed(2),
                final: 'y = ' + c.toFixed(1) + ' + ' + m.toFixed(1) + '/x' })
        }
    };
    let modelKey = 'exponential';

    const Xv = (i) => MODELS[modelKey].X(xs[i]);
    const Yv = (i) => MODELS[modelKey].Y(MODELS[modelKey].f(xs[i]));

    // --- Points, regression line, intercept point, slope triangle -----------
    xs.forEach((x, i) => board.create('point', [() => Xv(i), () => Yv(i)],
        { name: '', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0', fixed: true, highlight: false }));

    let reg = { m: 1, c: 0, x1: 0, x2: 1 };
    const yOn = (X) => reg.m * X + reg.c;

    board.create('line', [
        [() => Math.min(0, reg.x1), () => yOn(Math.min(0, reg.x1))],
        [() => reg.x2, () => yOn(reg.x2)]
    ], { strokeColor: '#e8710a', strokeWidth: 2.5, straightFirst: false, straightLast: false, fixed: true, highlight: false });

    // intercept point (X = 0)
    board.create('point', [0, () => reg.c], { name: () => 'c = ' + reg.c.toFixed(2), size: 3, strokeColor: '#2e7d32', fillColor: '#2e7d32', fixed: true, label: { offset: [8, -12] } });

    // slope triangle between x1 and x2
    const Pa = board.create('point', [() => reg.x1, () => yOn(reg.x1)], { visible: false });
    const Cn = board.create('point', [() => reg.x2, () => yOn(reg.x1)], { visible: false });
    const Pb = board.create('point', [() => reg.x2, () => yOn(reg.x2)], { visible: false });
    board.create('segment', [Pa, Cn], { strokeColor: '#2e7d32', dash: 2, strokeWidth: 1.5, highlight: false });
    board.create('segment', [Cn, Pb], { strokeColor: '#2e7d32', dash: 2, strokeWidth: 1.5, highlight: false });
    board.create('text', [() => reg.x2 + 0.05, () => (yOn(reg.x1) + yOn(reg.x2)) / 2, () => 'gradient m = ' + reg.m.toFixed(2)],
        { anchorX: 'left', fixed: true, color: '#2e7d32', fontSize: 13 });

    const statusEl = () => document.getElementById('dc_status');
    const setStatus = (h) => { const s = statusEl(); if (s) s.innerHTML = h; };

    function redraw() {
        const M = MODELS[modelKey];
        const X = xs.map((x, i) => Xv(i)), Y = xs.map((x, i) => Yv(i)), n = X.length;
        const mx = X.reduce((a, b) => a + b, 0) / n, my = Y.reduce((a, b) => a + b, 0) / n;
        let sxx = 0, sxy = 0;
        for (let i = 0; i < n; i++) { sxx += (X[i] - mx) ** 2; sxy += (X[i] - mx) * (Y[i] - my); }
        reg.m = sxy / sxx; reg.c = my - reg.m * mx;
        reg.x1 = Math.min(...X); reg.x2 = Math.max(...X);

        const xlo = Math.min(0, reg.x1), xhi = reg.x2;
        const padX = Math.max((xhi - xlo) * 0.18, 0.4);
        const yv = Y.concat([reg.c]);
        const ylo = Math.min(...yv), yhi = Math.max(...yv), padY = Math.max((yhi - ylo) * 0.18, 0.4);
        board.setBoundingBox([xlo - padX, yhi + padY, xhi + padX, ylo - padY], false);
        board.update();

        const con = M.constants(reg.m, reg.c);
        setStatus(
            'Model: <b>' + M.name + '</b> &nbsp; original form \\(' + M.origForm + '\\)<br>' +
            'Linearised: \\(' + M.lineForm + '\\) with \\(X=' + M.xLab + ',\\ Y=' + M.yLab + '\\)<br>' +
            'Straight line: \\(Y = ' + reg.m.toFixed(2) + 'X + ' + reg.c.toFixed(2) + '\\) &nbsp; (gradient \\(m=' + reg.m.toFixed(2) + '\\), intercept \\(c=' + reg.c.toFixed(2) + '\\))<br>' +
            'Constants: \\(' + con.text + '\\)<br>' +
            '<b>Final equation:</b> \\(' + con.final + '\\)'
        );
        if (window.MathJax && window.MathJax.typeset) { try { window.MathJax.typeset(); } catch (e) {} }
    }

    // --- Control API for native PreTeXt dropdown ----------------------------
    window.dcModel = function (k) { if (MODELS[k]) { modelKey = k; redraw(); } };

    redraw();
}());
