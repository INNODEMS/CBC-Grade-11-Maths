/*
    Even and Odd Functions — compare with a reflection and a rotation
    The function rule is chosen by native PreTeXt buttons that call
    window.eoSelect(i). Three graphs are drawn: the original, its reflection in the
    y-axis  g(x)=f(-x), and its rotation about the origin  h(x)=-f(-x). The
    reflection is highlighted when the function is even, the rotation when it is
    odd. A readout names the function and its classification.

    Expects: a surface="jsxboard" slate with id="jsx-even-odd-functions", and
    native PreTeXt buttons wired to the global eoSelect(0..4).

    NOTE: this replaces an earlier even-odd-functions.js that used a single
    mirror-point design. See PROGRESS.md.
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 15;

    const board = JXG.JSXGraph.initBoard('jsx-even-odd-functions', {
        boundingbox: [-7, 8, 7, -8],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // --- Function list ------------------------------------------------------
    const TYPES = [
        { name: 'f(x) = x^2',     fn: (x) => x * x },
        { name: 'f(x) = x^3',     fn: (x) => x * x * x / 2 },
        { name: 'f(x) = |x|',     fn: (x) => Math.abs(x) },
        { name: 'f(x) = 2x',      fn: (x) => 2 * x },
        { name: 'f(x) = x^2 + x', fn: (x) => x * x + x }
    ];
    let current = 0;

    // --- Classify by sampling -----------------------------------------------
    function classify(f) {
        let even = true, odd = true;
        for (let x = -3; x <= 3; x += 0.25) {
            if (Math.abs(f(-x) - f(x)) > 1e-6) even = false;
            if (Math.abs(f(-x) + f(x)) > 1e-6) odd = false;
        }
        return even ? 'even' : (odd ? 'odd' : 'neither');
    }

    // --- Three graphs (created once; functions dispatch on `current`) -------
    board.create('functiongraph', [(x) => TYPES[current].fn(x), -6, 6],
        { strokeColor: '#1565c0', strokeWidth: 3 });
    const refl = board.create('functiongraph', [(x) => TYPES[current].fn(-x), -6, 6],
        { strokeColor: '#2e7d32', strokeWidth: 2, dash: 2 });   // reflection in y-axis
    const rot = board.create('functiongraph', [(x) => -TYPES[current].fn(-x), -6, 6],
        { strokeColor: '#8e24aa', strokeWidth: 2, dash: 2 });   // rotation about origin

    // --- Legend -------------------------------------------------------------
    board.create('text', [-6.7, -6.4, '\\(\\color{#1565c0}{\\text{original } f(x)}\\)'], { anchorX: 'left', fixed: true });
    board.create('text', [-6.7, -7.1, '\\(\\color{#2e7d32}{\\text{reflection } f(-x)}\\)'], { anchorX: 'left', fixed: true });
    board.create('text', [-6.7, -7.8, '\\(\\color{#8e24aa}{\\text{rotation } -f(-x)}\\)'], { anchorX: 'left', fixed: true });

    // --- Highlight the matching comparison graph ----------------------------
    function applyHighlight() {
        const kind = classify(TYPES[current].fn);
        refl.setAttribute({ strokeWidth: kind === 'even' ? 5 : 2, strokeOpacity: kind === 'even' ? 1 : 0.6 });
        rot.setAttribute({ strokeWidth: kind === 'odd' ? 5 : 2, strokeOpacity: kind === 'odd' ? 1 : 0.6 });
        board.update();
    }

    // --- Readout ------------------------------------------------------------
    board.create('text', [6.7, 7.4, () => {
        const kind = classify(TYPES[current].fn);
        return '\\(' + TYPES[current].name.replace('f(x) = ', 'f(x)=') + '\\):  \\textbf{' + kind + '}';
    }], { anchorX: 'right', fixed: true });

    // --- Control API for PreTeXt buttons ------------------------------------
    window.eoSelect = function (i) {
        if (i < 0 || i >= TYPES.length) return;
        current = i;
        applyHighlight();
    };

    applyHighlight();
}());
