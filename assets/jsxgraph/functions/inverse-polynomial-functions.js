/*
    Inverse of Polynomial Functions — the horizontal line test
    The polynomial is chosen by native PreTeXt buttons that call window.ipSelect(i).
    A draggable horizontal line lets the learner test how many times a horizontal
    line meets the graph. The activity reports whether the function is one-to-one,
    whether the horizontal line test passes, and draws the inverse (reflection
    across y = x) whenever an inverse exists. A native PreTeXt checkbox calls
    window.ipRestrict(checked) to restrict x^2 to x >= 0, making it one-to-one.

    Expects: a surface="jsxboard" slate with id="jsx-inverse-polynomial-functions",
    native PreTeXt buttons wired to ipSelect(0..2), and a checkbox wired to
    ipRestrict(bool).
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 15;

    const board = JXG.JSXGraph.initBoard('jsx-inverse-polynomial-functions', {
        boundingbox: [-9, 9, 9, -9],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // --- Line y = x ---------------------------------------------------------
    board.create('functiongraph', [(x) => x, -9, 9], { strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1.5 });

    // --- Function catalogue -------------------------------------------------
    const TYPES = [
        { name: 'f(x) = 2x + 6', fn: (x) => 2 * x + 6, dom: [-7, 1.5], oneToOne: true,
          invEq: 'f^{-1}(x) = \\dfrac{x - 6}{2}', inv: (t) => 2 * t + 6 },
        { name: 'f(x) = x^3 + 2', fn: (x) => x * x * x + 2, dom: [-2.1, 2.0], oneToOne: true,
          invEq: 'f^{-1}(x) = \\sqrt[3]{x - 2}', inv: (t) => t * t * t + 2 },
        { name: 'f(x) = x^2', fn: (x) => x * x, dom: [-3, 3], oneToOne: false, restrict: [0, 3],
          invEq: 'f^{-1}(x) = \\sqrt{x}\\ (x\\ge 0)', inv: (t) => t * t }
    ];
    let current = 2;
    let restricted = false;

    function activeDomain() {
        const t = TYPES[current];
        return (t.restrict && restricted) ? t.restrict : t.dom;
    }
    function isOneToOne() {
        const t = TYPES[current];
        return t.oneToOne || (t.restrict && restricted);
    }

    // --- Graph, inverse and horizontal-test line ----------------------------
    board.create('functiongraph', [(x) => TYPES[current].fn(x), () => activeDomain()[0], () => activeDomain()[1]],
        { strokeColor: '#1565c0', strokeWidth: 3 });

    const invCurve = board.create('curve', [
        (t) => TYPES[current].inv(t),
        (t) => t,
        () => activeDomain()[0], () => activeDomain()[1]
    ], { strokeColor: '#c62828', strokeWidth: 3, visible: false });

    // draggable horizontal line (drag point H up and down)
    const H = board.create('point', [-6, 4], { name: 'drag', size: 4, strokeColor: '#ef6c00', fillColor: '#ef6c00' });
    const H2 = board.create('point', [() => H.X() + 1, () => H.Y()], { visible: false });
    board.create('line', [H, H2], { strokeColor: '#ef6c00', dash: 1, strokeWidth: 1.5 });

    function cutCount() {
        const h = H.Y(), dom = activeDomain(), lo = dom[0], hi = dom[1], f = TYPES[current].fn;
        let cuts = 0, prev = f(lo) - h;
        for (let x = lo + 0.02; x <= hi; x += 0.02) {
            const g = f(x) - h;
            if (prev === 0 || (prev < 0) !== (g < 0)) cuts++;
            prev = g;
        }
        return cuts;
    }

    // --- Readouts -----------------------------------------------------------
    function refresh() {
        invCurve.setAttribute({ visible: isOneToOne() });
        board.update();
    }
    board.create('text', [-8.4, 8, () => '\\(\\color{#1565c0}{' + TYPES[current].name + '}\\)'], { anchorX: 'left', fixed: true });
    board.create('text', [-8.4, -7.4, () => isOneToOne() ? 'One-to-one' : 'Many-to-one'],
        { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });
    board.create('text', [-3.0, -7.4, () => 'Line cuts graph: ' + cutCount() + '  →  HLT ' + (isOneToOne() ? 'passed' : 'failed')],
        { anchorX: 'left', fixed: true });
    board.create('text', [-8.4, -8.4, () => isOneToOne()
        ? '\\(\\color{#c62828}{' + TYPES[current].invEq + '}\\)'
        : '\\(\\text{Restrict the domain to form an inverse.}\\)'],
        { anchorX: 'left', fixed: true });

    // --- Control API for PreTeXt controls -----------------------------------
    window.ipSelect = function (i) {
        if (i < 0 || i >= TYPES.length) return;
        current = i;
        refresh();
    };
    window.ipRestrict = function (on) {
        restricted = !!on;
        refresh();
    };

    refresh();
}());
