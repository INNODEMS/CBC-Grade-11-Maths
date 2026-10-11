/*
    Growing cube — the power rule for V = x³  (Power Rule, Part B)
    -------------------------------------------------------------
    A cube of side x grows by Δx on each dimension. The blue cube is the original
    x³; the three orange slabs are the dominant part of the growth, together
    ≈ 3x²Δx. Two sliders control x and Δx.

    NOTE: drawn as a 2D oblique (cabinet) projection with filled polygons, NOT with
    JSXGraph's 3D module — JSXGraph 1.8.0 ships view3d/point3d but has NO polygon3d
    (no fillable 3D face), so the old view3d/polygon3d version rendered axes but no
    cube. This 2D projection is reliable across browsers and needs no 3D module.
*/

(function () {
    JXG.Options.text.useMathJax = true;

    var board = JXG.JSXGraph.initBoard('jsxgraph-growing-cube', {
        boundingbox: [-8, 8.5, 8, -5],
        axis: false,
        showNavigation: false,
        showCopyright: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // ── Sliders (2D board space, right of the drawing) ───────────────────────
    var sx = board.create('slider', [[2.2, 7.0], [7.5, 7.0], [0.5, 2.0, 3.5]], {
        name: '\\(x\\)', snapWidth: 0.05,
        label: { fontSize: 14, color: '#2255aa' },
        baseline: { strokeColor: '#aaa' }, highline: { strokeColor: '#2255aa', strokeWidth: 3 },
        fillColor: '#2255aa', strokeColor: '#2255aa'
    });
    var sdx = board.create('slider', [[2.2, 6.2], [7.5, 6.2], [0, 0.6, 1.4]], {
        name: '\\(\\Delta x\\)', snapWidth: 0.05,
        label: { fontSize: 14, color: '#cc6600' },
        baseline: { strokeColor: '#aaa' }, highline: { strokeColor: '#cc6600', strokeWidth: 3 },
        fillColor: '#cc6600', strokeColor: '#cc6600'
    });
    function S()  { return sx.Value(); }
    function SD() { return sx.Value() + sdx.Value(); }
    function D()  { return sdx.Value(); }
    function slabVisible() { return D() > 0.01; }

    // ── Oblique (cabinet) projection: 3D (x,y,z) -> 2D board point ────────────
    var OX = -7, OY = -4, DY = 0.62, DZ = 0.40;   // origin + depth foreshortening
    function proj(x, y, z) { return [OX + x + DY * y, OY + z + DZ * y]; }

    // One filled quad face (curve) whose corners recompute from the sliders.
    function addFace(getCorners, color, opacity, visFn) {
        var c = board.create('curve', [[], []], {
            strokeColor: color, strokeWidth: 1.2, strokeOpacity: 0.85,
            fillColor: color, fillOpacity: opacity,
            highlight: false, fixed: true, visible: visFn || true, name: ''
        });
        c.updateDataArray = function () {
            var P = getCorners(), xs = [], ys = [], i, s;
            for (i = 0; i < P.length; i++) { s = proj(P[i][0], P[i][1], P[i][2]); xs.push(s[0]); ys.push(s[1]); }
            s = proj(P[0][0], P[0][1], P[0][2]); xs.push(s[0]); ys.push(s[1]);   // close
            this.dataX = xs; this.dataY = ys;
        };
        return c;
    }

    // The 3 visible faces (top, right, front) of an axis-aligned box.
    // getB() -> [x0, x1, y0, y1, z0, z1]; corner code indexes into it.
    function addBox(getB, color, opacity, visFn) {
        function face(idxs) {
            addFace(function () {
                var b = getB();
                return idxs.map(function (c) { return [b[c[0]], b[c[1]], b[c[2]]]; });
            }, color, opacity, visFn);
        }
        face([[0, 2, 5], [1, 2, 5], [1, 3, 5], [0, 3, 5]]);   // top   (z = z1)
        face([[1, 2, 4], [1, 3, 4], [1, 3, 5], [1, 2, 5]]);   // right (x = x1)
        face([[0, 2, 4], [1, 2, 4], [1, 2, 5], [0, 2, 5]]);   // front (y = y0)
    }

    // The 8 pieces of (x+Δx)³. Painter's order: the depth axis (y) is the only
    // receding axis in this projection, so draw all FAR pieces (y ∈ [x, x+Δx])
    // first, then the NEAR pieces (y ∈ [0, x]) on top.
    //   x³        original cube (blue)
    //   3x²Δx     three face slabs (orange)
    //   3x(Δx)²   three edge bars (green)
    //   (Δx)³     one corner cube (purple)
    var GREEN = '#37a24a', PURPLE = '#7b1fa2';
    // ── far layer (y = [x, x+Δx]) ──
    addBox(function () { return [0, S(),  S(),  SD(), 0,   S()];  }, '#ED7D31', 0.60, slabVisible); // depth slab  x²Δx
    addBox(function () { return [0, S(),  S(),  SD(), S(), SD()]; }, GREEN,     0.72, slabVisible); // back-top bar   x(Δx)²
    addBox(function () { return [S(), SD(), S(), SD(), 0,  S()];  }, GREEN,     0.72, slabVisible); // back-right bar x(Δx)²
    addBox(function () { return [S(), SD(), S(), SD(), S(), SD()]; }, PURPLE,   0.85, slabVisible); // corner       (Δx)³
    // ── near layer (y = [0, x]) ──
    addBox(function () { return [0, S(),  0, S(),  0,   S()];  },   '#4472C4', 0.25);               // original cube x³
    addBox(function () { return [S(), SD(), 0, S(), 0,   S()];  },  '#ED7D31', 0.60, slabVisible);  // right slab   x²Δx
    addBox(function () { return [0, S(),  0, S(),  S(), SD()]; },   '#ED7D31', 0.60, slabVisible);  // top slab     x²Δx
    addBox(function () { return [S(), SD(), 0, S(), S(), SD()]; },  GREEN,     0.72, slabVisible);  // front-top bar x(Δx)²
    board.update();

    // ── Labels on the blocks (ride along with the sliders) ───────────────────
    function lbl(xf, yf, txt, color, size, visFn) {
        board.create('text', [xf, yf, txt], {
            fontSize: size, color: color, fixed: true,
            anchorX: 'middle', anchorY: 'middle', highlight: false,
            visible: visFn || true, cssStyle: 'font-weight:bold'
        });
    }
    // Original cube: label 'x³' on its front face centre
    lbl(function () { return OX + S() / 2; },
        function () { return OY + S() / 2; }, '\\(x^3\\)', '#1f3a63', 15);
    // Top slab: 'x²Δx' on its top face centre
    lbl(function () { return OX + S() / 2 + DY * S() / 2; },
        function () { return OY + SD() + DZ * S() / 2; }, '\\(x^2\\Delta x\\)', '#8a4b0a', 12, slabVisible);
    // Right slab: 'x²Δx' on its outer face centre
    lbl(function () { return OX + SD() + DY * S() / 2; },
        function () { return OY + S() / 2 + DZ * S() / 2; }, '\\(x^2\\Delta x\\)', '#8a4b0a', 12, slabVisible);
    // Front-top green bar: 'x(Δx)²' on its front face centre
    lbl(function () { return OX + (S() + SD()) / 2; },
        function () { return OY + (S() + SD()) / 2; }, '\\(x(\\Delta x)^2\\)', '#1e6b2a', 11, slabVisible);
    // Purple corner: '(Δx)³' on its top face centre
    lbl(function () { return OX + (S() + SD()) / 2 + DY * (S() + SD()) / 2; },
        function () { return OY + SD() + DZ * (S() + SD()) / 2; }, '\\((\\Delta x)^3\\)', '#6a1b9a', 11, slabVisible);

    // ── Text panel (top-left) ────────────────────────────────────────────────
    var LX = -7.8;
    board.create('text', [LX, 8.0, 'blue \\(x^3\\) · orange \\(x^2\\Delta x\\) · green \\(x(\\Delta x)^2\\) · purple \\((\\Delta x)^3\\)'],
        { fontSize: 11, color: '#555', fixed: true, anchorX: 'left' });
    board.create('text', [LX, 7.1, '\\(\\Delta V = (x+\\Delta x)^3 - x^3\\)'],
        { fontSize: 13, color: '#333', fixed: true, anchorX: 'left' });
    board.create('text', [LX + 0.5, 6.4, '\\(= 3x^2\\Delta x + 3x(\\Delta x)^2 + (\\Delta x)^3\\)'],
        { fontSize: 13, color: '#333', fixed: true, anchorX: 'left' });
    board.create('text', [LX, 5.6, '\\(\\Delta V/\\Delta x = 3x^2 + 3x\\Delta x + (\\Delta x)^2\\)'],
        { fontSize: 13, color: '#333', fixed: true, anchorX: 'left' });
    board.create('text', [LX, 4.8, function () {
        var s = S();
        return 'As \\(\\Delta x \\to 0\\):  \\(dV/dx = 3x^2 = ' + (3 * s * s).toFixed(2) + '\\)';
    }], { fontSize: 14, color: '#1a6b1a', fixed: true, anchorX: 'left' });
})();
