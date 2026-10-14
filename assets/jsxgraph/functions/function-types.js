/*
    Types of Functions — compare shapes on one set of axes
    Sliders a, b, c change the coefficients; the function type is chosen by native
    PreTeXt buttons that call window.ftSelect(i). The graph and the displayed name
    + equation update immediately so learners compare shapes.

    Expects: a surface="jsxboard" slate with id="jsx-function-types", and native
    PreTeXt buttons wired to the global ftSelect(0..5). An html slate with
    id="ftype_status" (optional) receives the current name + equation as text.
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 16;

    const board = JXG.JSXGraph.initBoard('jsx-function-types', {
        boundingbox: [-8, 9, 8, -9],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // --- Coefficient sliders ------------------------------------------------
    const a = board.create('slider', [[-7.5, 8], [-4, 8], [-3, 1, 3]], { name: 'a', snapWidth: 0.1, size: 4 });
    const b = board.create('slider', [[-7.5, 7], [-4, 7], [-3, 0, 3]], { name: 'b', snapWidth: 0.1, size: 4 });
    const c = board.create('slider', [[-7.5, 6], [-4, 6], [-3, 0, 3]], { name: 'c', snapWidth: 0.1, size: 4 });

    // --- Function-type definitions ------------------------------------------
    const num = (v) => v.toFixed(1);
    const TYPES = [
        { name: 'Linear',         fn: (x) => a.Value() * x + b.Value(),
          eq: () => 'f(x) = ' + num(a.Value()) + 'x + ' + num(b.Value()) },
        { name: 'Quadratic',      fn: (x) => a.Value() * x * x + b.Value() * x + c.Value(),
          eq: () => 'f(x) = ' + num(a.Value()) + 'x^2 + ' + num(b.Value()) + 'x + ' + num(c.Value()) },
        { name: 'Cubic',          fn: (x) => a.Value() * x * x * x + b.Value() * x + c.Value(),
          eq: () => 'f(x) = ' + num(a.Value()) + 'x^3 + ' + num(b.Value()) + 'x + ' + num(c.Value()) },
        { name: 'Reciprocal',     fn: (x) => (Math.abs(x) < 0.05 ? NaN : a.Value() / x + b.Value()),
          eq: () => 'f(x) = ' + num(a.Value()) + '/x + ' + num(b.Value()) },
        { name: 'Absolute value', fn: (x) => a.Value() * Math.abs(x) + b.Value(),
          eq: () => 'f(x) = ' + num(a.Value()) + '|x| + ' + num(b.Value()) },
        { name: 'Square root',    fn: (x) => (x < 0 ? NaN : a.Value() * Math.sqrt(x) + b.Value()),
          eq: () => 'f(x) = ' + num(a.Value()) + '\\sqrt{x} + ' + num(b.Value()) }
    ];

    let current = 1;   // start on quadratic

    // --- The graph (dispatches on the current type) -------------------------
    board.create('functiongraph', [(x) => TYPES[current].fn(x), -8, 8],
        { strokeColor: '#1565c0', strokeWidth: 3 });

    // --- Readout: name + equation (on the board) ----------------------------
    board.create('text', [7.5, 8, () => '\\(\\textbf{' + TYPES[current].name + ':}\\ ' + TYPES[current].eq() + '\\)'],
        { anchorX: 'right', fixed: true });

    // --- Control API for PreTeXt buttons ------------------------------------
    window.ftSelect = function (i) {
        if (i < 0 || i >= TYPES.length) return;
        current = i;
        board.update();
    };
}());
