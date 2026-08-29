(function () {
    JXG.Options.text.useMathJax = true;

    var board = JXG.JSXGraph.initBoard('jsxgraph-growing-square', {
        boundingbox: [-0.6, 7.8, 7.8, -1.6],
        axis: false,
        showNavigation: false,
        showCopyright: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // ── Sliders ──────────────────────────────────────────────────────────────
    var sx = board.create('slider', [[0.2, 7.3], [5.0, 7.3], [0.5, 2.5, 4.5]], {
        name: '\\(x\\)',
        snapWidth: 0.05,
        label: { fontSize: 14, color: '#2255aa' },
        baseline: { strokeColor: '#aaa' },
        highline: { strokeColor: '#2255aa', strokeWidth: 3 },
        fillColor: '#2255aa',
        strokeColor: '#2255aa'
    });

    var sdx = board.create('slider', [[0.2, 6.7], [5.0, 6.7], [0, 0.8, 2.0]], {
        name: '\\(\\Delta x\\)',
        snapWidth: 0.05,
        label: { fontSize: 14, color: '#cc6600' },
        baseline: { strokeColor: '#aaa' },
        highline: { strokeColor: '#cc6600', strokeWidth: 3 },
        fillColor: '#cc6600',
        strokeColor: '#cc6600'
    });

    // ── Shapes ───────────────────────────────────────────────────────────────

    // Original square x² (blue)
    board.create('polygon', [
        function () { return [0, 0]; },
        function () { return [sx.Value(), 0]; },
        function () { return [sx.Value(), sx.Value()]; },
        function () { return [0, sx.Value()]; }
    ], {
        fillColor: '#4472C4',
        fillOpacity: 0.22,
        strokeColor: '#4472C4',
        strokeWidth: 2,
        vertices: { visible: false },
        borders: { strokeColor: '#4472C4', strokeWidth: 2 }
    });

    // Right strip: x to x+Δx, 0 to x  (orange, one of the x·Δx rectangles)
    board.create('polygon', [
        function () { return [sx.Value(), 0]; },
        function () { return [sx.Value() + sdx.Value(), 0]; },
        function () { return [sx.Value() + sdx.Value(), sx.Value()]; },
        function () { return [sx.Value(), sx.Value()]; }
    ], {
        fillColor: '#ED7D31',
        fillOpacity: 0.55,
        strokeColor: '#ED7D31',
        strokeWidth: 1,
        vertices: { visible: false },
        borders: { strokeColor: '#ED7D31', strokeWidth: 1 }
    });

    // Top strip: 0 to x, x to x+Δx  (orange, the other x·Δx rectangle)
    board.create('polygon', [
        function () { return [0, sx.Value()]; },
        function () { return [sx.Value(), sx.Value()]; },
        function () { return [sx.Value(), sx.Value() + sdx.Value()]; },
        function () { return [0, sx.Value() + sdx.Value()]; }
    ], {
        fillColor: '#ED7D31',
        fillOpacity: 0.55,
        strokeColor: '#ED7D31',
        strokeWidth: 1,
        vertices: { visible: false },
        borders: { strokeColor: '#ED7D31', strokeWidth: 1 }
    });

    // Corner square: x to x+Δx, x to x+Δx  (red, the (Δx)² piece)
    board.create('polygon', [
        function () { return [sx.Value(), sx.Value()]; },
        function () { return [sx.Value() + sdx.Value(), sx.Value()]; },
        function () { return [sx.Value() + sdx.Value(), sx.Value() + sdx.Value()]; },
        function () { return [sx.Value(), sx.Value() + sdx.Value()]; }
    ], {
        fillColor: '#C00000',
        fillOpacity: 0.55,
        strokeColor: '#C00000',
        strokeWidth: 1,
        vertices: { visible: false },
        borders: { strokeColor: '#C00000', strokeWidth: 1 }
    });

    // ── Strip labels ─────────────────────────────────────────────────────────

    board.create('text', [
        function () { return sx.Value() + sdx.Value() / 2; },
        function () { return sx.Value() / 2; },
        function () { return sdx.Value() > 0.3 ? '\\(x\\,\\Delta x\\)' : ''; }
    ], { fontSize: 13, color: '#7f3305', anchorX: 'middle', anchorY: 'middle', fixed: true });

    board.create('text', [
        function () { return sx.Value() / 2; },
        function () { return sx.Value() + sdx.Value() / 2; },
        function () { return sdx.Value() > 0.3 ? '\\(x\\,\\Delta x\\)' : ''; }
    ], { fontSize: 13, color: '#7f3305', anchorX: 'middle', anchorY: 'middle', fixed: true });

    board.create('text', [
        function () { return sx.Value() + sdx.Value() / 2; },
        function () { return sx.Value() + sdx.Value() / 2; },
        function () { return sdx.Value() > 0.55 ? '\\((\\Delta x)^2\\)' : ''; }
    ], { fontSize: 12, color: '#7f0000', anchorX: 'middle', anchorY: 'middle', fixed: true });

    // ── Dimension labels below squares ───────────────────────────────────────

    board.create('text', [
        function () { return sx.Value() / 2; },
        -0.55,
        function () { return '\\(x = ' + sx.Value().toFixed(2) + '\\)'; }
    ], { fontSize: 13, color: '#2255aa', anchorX: 'middle', fixed: true });

    board.create('text', [
        function () { return sx.Value() + sdx.Value() / 2; },
        -0.55,
        function () { return sdx.Value() > 0.05 ? '\\(\\Delta x = ' + sdx.Value().toFixed(2) + '\\)' : ''; }
    ], { fontSize: 13, color: '#cc6600', anchorX: 'middle', fixed: true });

    // ── Information panel ─────────────────────────────────────────────────────

    board.create('text', [0.15, 6.0, function () {
        var x = sx.Value(), dx = sdx.Value();
        var dA = 2 * x * dx + dx * dx;
        return '\\(\\Delta A = (x+\\Delta x)^2 - x^2 = 2x\\,\\Delta x + (\\Delta x)^2 = ' + dA.toFixed(3) + '\\)';
    }], { fontSize: 13, color: '#333', fixed: true });

    board.create('text', [0.15, 5.45, function () {
        var x = sx.Value(), dx = sdx.Value();
        if (dx < 0.01) return 'Move the \\(\\Delta x\\) slider to see \\(\\Delta A/\\Delta x\\)';
        var rate = (2 * x * dx + dx * dx) / dx;
        return '\\(\\Delta A/\\Delta x = 2x + \\Delta x = ' + rate.toFixed(3) + '\\)';
    }], { fontSize: 13, color: '#333', fixed: true });

    board.create('text', [0.15, 4.90, function () {
        var x = sx.Value();
        return 'As \\(\\Delta x \\to 0\\):  \\(dA/dx = 2x = ' + (2 * x).toFixed(2) + '\\)';
    }], { fontSize: 14, color: '#1a6b1a', fixed: true });
})();
