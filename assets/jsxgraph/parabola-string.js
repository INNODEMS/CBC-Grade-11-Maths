/**
 * Parabola from a String — Interactive Construction
 *
 * Demonstrates how a fixed-length string OPH traces a parabola:
 *   - O is the focus (draggable)
 *   - A vertical "ruler" slides left/right; drag the blue segment to move it.
 *     Its top H is positioned so that |OP| + |PH| = L at all times.
 *   - As the vertical slides, P traces the parabola f(x) = x²/2a − a/2.
 *   - The parabola and the ruler are clamped so they never exceed the string length.
 *
 * Closed-form clamp: |OP| = L exactly when |k − ox| = √(10L − 25),
 * derived by solving the quartic analytically (with A = 5).
 *
 * Users can:
 *   • Drag the blue vertical segment left / right
 *   • Drag O to reposition the focus
 *   • Use the "String length" slider to change L
 */

(function () {
    'use strict';

    /* ─── Board ─────────────────────────────────────────────────── */
    const board = JXG.JSXGraph.initBoard('jsxgraph-parabola-string', {
        boundingbox: [-10, 10, 10, -10],
        axis: true,
        grid: true,
        keepAspectRatio: false,
        showNavigation: false,
        showCopyright: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    /* ─── Parameters & helpers ───────────────────────────────────── */
    const A = 5;   // focus-to-directrix half-distance; directrix sits A units below O

    // Parabola y-value for a given absolute x, given focus O at (ox, oy)
    function parabolaY(ox, oy, x) {
        const rel = x - ox;
        return oy + (rel * rel) / (2 * A) - A / 2;
    }

    // Maximum |k − ox| before the string runs out: √(10L − 25)
    // Derived from solving |OP|² = L² analytically for A = 5.
    function maxRel(L) {
        return Math.sqrt(Math.max(10 * L - 25, 0));
    }

    // Clamp k to [ox − maxRel, ox + maxRel]
    function clampK(rawK) {
        const lim = maxRel(sliderL.Value());
        return Math.max(O.X() - lim, Math.min(O.X() + lim, rawK));
    }

    /* ─── String-length slider ───────────────────────────────────── */
    const sliderL = board.create('slider', [
        [-6, -7.5], [-0.5, -7.5],
        [5, 10, 12]
    ], {
        name: 'String length L',
        snapWidth: 0.1,
        label: { fontSize: 15 },
        baseline: { strokeColor: '#555' },
        highline: { strokeColor: '#e63946' },
        face: 'o',
        size: 5,
        strokeColor: '#e63946',
        fillColor: '#e63946',
        layer: 10
    });

    /* ─── Focus O (draggable) ────────────────────────────────────── */
    const O = board.create('point', [0, 0], {
        name: 'O',
        color: '#e63946',
        size: 6,
        label: { fontSize: 16, offset: [-15, -15] }
    });

    /* ─── Directrix ──────────────────────────────────────────────── */
    board.create('line', [
        [function () { return O.X() - 1; }, function () { return O.Y() - A; }],
        [function () { return O.X() + 1; }, function () { return O.Y() - A; }]
    ], {
        strokeColor: '#353a3d',
        strokeWidth: 3,
        straightFirst: true,
        straightLast: true,
        withLabel: false
    });

    /* ─── Control point — drives the vertical's x-position ──────── */
    // A free point; we constrain its y via setPosition in the drag handler,
    // and clamp its x to the valid string range.
    // It lives on the segment visually (at the midpoint height) so the user
    // can grab the segment to drag it.
    const kCtrl = board.create('point', [4, 0], {
        name: '',
        color: '#457b9d',
        size: 0,        // invisible — the segment itself is the drag handle
        fixed: false,
        highlight: false,
        layer: 10
    });

    // After every drag, snap x into the valid range and fix y to the midpoint
    // of the segment so the point stays on it (makes dragging feel natural).
    kCtrl.on('drag', function () {
        const clamped = clampK(kCtrl.X());
        // midpoint y between directrix foot and H
        const py   = parabolaY(O.X(), O.Y(), clamped);
        const L    = sliderL.Value();
        const OP   = Math.sqrt(Math.pow(clamped - O.X(), 2) + Math.pow(py - O.Y(), 2));
        const hy   = py + Math.max(L - OP, 0);
        const midy = (O.Y() - A + hy) / 2;
        kCtrl.setPosition(JXG.COORDS_BY_USER, [clamped, midy]);
        board.update();
    });

    /* ─── Derived points: P and H ────────────────────────────────── */
    const P = board.create('point', [
        function () { return clampK(kCtrl.X()); },
        function () { return parabolaY(O.X(), O.Y(), clampK(kCtrl.X())); }
    ], {
        name: 'P',
        color: '#6a4c93',
        size: 6,
        fixed: true,
        label: { fontSize: 16, offset: [8, -18] }
    });

    const H = board.create('point', [
        function () { return clampK(kCtrl.X()); },
        function () {
            const OP = Math.sqrt(Math.pow(P.X() - O.X(), 2) + Math.pow(P.Y() - O.Y(), 2));
            return P.Y() + Math.max(sliderL.Value() - OP, 0);
        }
    ], {
        name: 'H',
        color: '#1d1d1b',
        size: 6,
        fixed: true,
        label: { fontSize: 16, offset: [8, 5] }
    });

    /* ─── Vertical segment (the draggable "ruler") ───────────────── */
    const foot = board.create('point', [
        function () { return clampK(kCtrl.X()); },
        function () { return O.Y() - A; }
    ], { visible: false, fixed: true });

    const ruler = board.create('segment', [foot, H], {
        strokeColor: '#457b9d',
        strokeWidth: 6,          // thick so it's easy to grab
        layer: 3,
        highlight: true,
        highlightStrokeColor: '#1d6fa4',
        highlightStrokeWidth: 8
    });

    // Forward drag events on the segment to kCtrl
    ruler.on('drag', function (e) {
        const coords = board.getUsrCoordsOfMouse(e);
        kCtrl.setPosition(JXG.COORDS_BY_USER, [coords[0], coords[1]]);
        const clamped = clampK(kCtrl.X());
        const py   = parabolaY(O.X(), O.Y(), clamped);
        const OP   = Math.sqrt(Math.pow(clamped - O.X(), 2) + Math.pow(py - O.Y(), 2));
        const hy   = py + Math.max(sliderL.Value() - OP, 0);
        const midy = (O.Y() - A + hy) / 2;
        kCtrl.setPosition(JXG.COORDS_BY_USER, [clamped, midy]);
        board.update();
    });

    /* ─── String segments O→P and P→H ───────────────────────────── */
    board.create('segment', [O, P], {
        strokeColor: '#e63946',
        strokeWidth: 2.5,
        layer: 4
    });

    board.create('segment', [P, H], {
        strokeColor: '#e63946',
        strokeWidth: 2.5,
        layer: 4
    });

    /* ─── Parabola — clipped to the reachable range ──────────────── */
    board.create('functiongraph', [
        function (x) { return parabolaY(O.X(), O.Y(), x); },
        function ()  { return O.X() - maxRel(sliderL.Value()); },   // minX
        function ()  { return O.X() + maxRel(sliderL.Value()); }    // maxX
    ], {
        strokeColor: '#2a9d8f',
        strokeWidth: 2.5,
        layer: 2
    });

    /* ─── Info panel ─────────────────────────────────────────────── */
    const _b1 = board.create('point', [-6.2,  -6.2], { visible: false, fixed: true });
    const _b2 = board.create('point', [-6.2,  -8.2], { visible: false, fixed: true });
    const _b3 = board.create('point', [6.2,  -8.2], { visible: false, fixed: true });
    const _b4 = board.create('point', [6.2,  -6.2], { visible: false, fixed: true });
    board.create('polygon', [_b1, _b2, _b3, _b4], {
        fillColor: '#ffffff', fillOpacity: 0.8, strokeColor: '#ffffff',
        fixed: true, highlight: false, layer: 8
    });

    board.create('text', [0, -6.25, function () {
        const L  = sliderL.Value().toFixed(1);
        const OP = Math.sqrt(Math.pow(P.X() - O.X(), 2) + Math.pow(P.Y() - O.Y(), 2)).toFixed(2);
        const PH = Math.max(sliderL.Value() - parseFloat(OP), 0).toFixed(2);
        return 'L = ' + L + '   |OP| = ' + OP + '   |PH| = ' + PH;
    }], {
        fontSize: 14, fixed: true, layer: 8, anchorX: 'middle', anchorY: 'top', color: '#1d1d1b'
    });

})();
