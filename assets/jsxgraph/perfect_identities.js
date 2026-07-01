/* =========================================================
 *  PERFECT-SQUARE IDENTITIES  —  (a+b)²  and  (a-b)²
 *  Classical, fully reactive JSXGraph 1.12.2.
 *
 *  HTML only supplies an empty container:
 *      <div id="jsxgraph-perfect-identities" class="jxgbox"></div>
 *
 *  Every shape is defined ONCE as a function of the two
 *  sliders, so JSXGraph's own dependency graph redraws the
 *  figure whenever a slider is dragged. There is no manual
 *  clear/rebuild and no DOM coupling — the only HTML the
 *  library emits is the two mode buttons (board.create('button')),
 *  which is the standard JSXGraph control.
 * =========================================================*/

const board = JXG.JSXGraph.initBoard('jsxgraph-perfect-identities', {
    boundingbox: [-2.5, 13, 16, -4],   // [left, top, right, bottom]
    keepAspectRatio: true,
    axis: false,
    showNavigation: false,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const FRAME = 10;   // the dissection always fills a FRAME x FRAME square

/* ---------------------------------------------------------
 *  CONTROLS  (sliders are SVG; buttons are the one bit of
 *  emitted HTML — swap them for two slider stops if you want
 *  zero HTML at all.)
 * --------------------------------------------------------*/

const sa = board.create('slider', [[11, 11.5], [15.3, 11.5], [1, 3, 8]], {
    name: 'a', snapWidth: 1, precision: 0, label: { fontSize: 14 }
});
const sb = board.create('slider', [[11, 10], [15.3, 10], [1, 2, 7]], {
    name: 'b', snapWidth: 1, precision: 0, label: { fontSize: 14 }
});

let mode = 'plus';                       // 'plus' | 'minus'

/* ---------------------------------------------------------
 *  LIVE QUANTITIES  (functions, so they re-evaluate on drag)
 * --------------------------------------------------------*/

const A  = () => Math.round(sa.Value());                 // a
const B  = () => Math.round(sb.Value());                 // b
const Bm = () => Math.max(0, Math.min(B(), A() - 1));    // b clamped so (a-b)² is valid
const Cm = () => A() - Bm();                             // a - b
const Fp = () => FRAME / (A() + B());                    // scale, plus mode
const Fm = () => FRAME / A();                            // scale, minus mode

/* ---------------------------------------------------------
 *  ELEMENT FACTORIES
 *  Each builder takes coordinate/text *functions*; nothing
 *  stores snapshot values, so the dependency graph stays live.
 *  Elements are pushed into a group array purely so a mode
 *  switch can show/hide them in one call.
 * --------------------------------------------------------*/

// Filled quad. `cf` returns its four [x,y] board coords.
function quad(group, color, opacity, cf) {
    const pts = [0, 1, 2, 3].map(i => board.create('point', [
        () => cf()[i][0], () => cf()[i][1]
    ], { visible: false, withLabel: false, fixed: true, highlight: false }));

    const pg = board.create('polygon', pts, {
        fillColor: color,
        fillOpacity: opacity,
        borders: { strokeColor: '#555', strokeWidth: 1.5 },
        fixed: true, highlight: false,
        vertices: { visible: false }
    });
    group.push(pg);
    return pg;
}

function lbl(group, color, size, xf, yf, tf) {
    const t = board.create('text', [xf, yf, tf], {
        anchorX: 'middle', anchorY: 'middle',
        fontSize: size, strokeColor: color,
        fixed: true, highlight: false
    });
    group.push(t);
    return t;
}

function sgmt(group, color, width, x1, y1, x2, y2) {
    const s = board.create('segment', [[x1, y1], [x2, y2]], {
        strokeColor: color, strokeWidth: width, fixed: true, highlight: false
    });
    group.push(s);
    return s;
}

// Dimension bracket spanning x1..x2 (functions) at board height y, labelled above.
function bracket(group, color, x1, x2, y, tf) {
    sgmt(group, color, 1, x1, () => y, x2, () => y);
    sgmt(group, color, 1, x1, () => y, x1, () => y - 0.4);
    sgmt(group, color, 1, x2, () => y, x2, () => y - 0.4);
    lbl(group, color, 13, () => (x1() + x2()) / 2, () => y + 0.45, tf);
}

function show(group, vis) {
    group.forEach(el => {
        el.setAttribute({ visible: vis });
        if (el.borders) el.borders.forEach(bd => bd.setAttribute({ visible: vis }));
    });
}

/* ---------------------------------------------------------
 *  (a+b)²  GROUP
 * --------------------------------------------------------*/

const plus = [];

// scaled corner list from figure-unit corners
const sp = corners => corners.map(p => [p[0] * Fp(), p[1] * Fp()]);

// a²
quad(plus, '#B5D4F4', 0.80, () => { const a = A(), b = B(), s = a + b;
    return sp([[0, b], [a, b], [a, s], [0, s]]); });
lbl(plus, '#0C447C', 16, () => A() / 2 * Fp(), () => (B() + A() / 2) * Fp(), () => 'a²');

// ab (top)
quad(plus, '#C0DD97', 0.80, () => { const a = A(), b = B(), s = a + b;
    return sp([[a, b], [s, b], [s, s], [a, s]]); });
lbl(plus, '#27500A', 15, () => (A() + B() / 2) * Fp(), () => (B() + A() / 2) * Fp(), () => 'ab');

// ab (bottom)
quad(plus, '#C0DD97', 0.80, () => { const a = A(), b = B();
    return sp([[0, 0], [a, 0], [a, b], [0, b]]); });
lbl(plus, '#27500A', 15, () => A() / 2 * Fp(), () => B() / 2 * Fp(), () => 'ab');

// b²
quad(plus, '#FAC775', 0.85, () => { const a = A(), b = B(), s = a + b;
    return sp([[a, 0], [s, 0], [s, b], [a, b]]); });
lbl(plus, '#7A4700', 15, () => (A() + B() / 2) * Fp(), () => B() / 2 * Fp(), () => 'b²');

// partition lines
sgmt(plus, '#333', 1.5, () => A() * Fp(), () => 0, () => A() * Fp(), () => (A() + B()) * Fp());
sgmt(plus, '#333', 1.5, () => 0, () => B() * Fp(), () => (A() + B()) * Fp(), () => B() * Fp());

// side labels
lbl(plus, '#1565C0', 13, () => A() / 2 * Fp(), () => -0.7, () => 'a');
lbl(plus, '#8D5A00', 13, () => (A() + B() / 2) * Fp(), () => -0.7, () => 'b');
lbl(plus, '#1565C0', 13, () => -0.9, () => (B() + A() / 2) * Fp(), () => 'a');
lbl(plus, '#8D5A00', 13, () => -0.9, () => B() / 2 * Fp(), () => 'b');

// whole-side bracket + formula
bracket(plus, '#1565C0', () => 0, () => FRAME, FRAME + 0.6, () => '(a + b) = ' + (A() + B()));
lbl(plus, '#0D47A1', 15, () => FRAME / 2, () => -1.7, () => '(a+b)² = a² + 2ab + b²');
lbl(plus, '#0D47A1', 13, () => FRAME / 2, () => -2.4,
    () => A() + '² + 2(' + A() + ')(' + B() + ') + ' + B() + '²');
lbl(plus, '#0D47A1', 13, () => FRAME / 2, () => -3.1,
    () => { const a = A(), b = B(); return (a * a) + ' + ' + (2 * a * b) + ' + ' + (b * b) + ' = ' + ((a + b) * (a + b)); });

/* ---------------------------------------------------------
 *  (a-b)²  GROUP
 * --------------------------------------------------------*/

const minus = [];

const sm = corners => corners.map(p => [p[0] * Fm(), p[1] * Fm()]);

// faint background a² square
quad(minus, '#B5D4F4', 0.20, () => { const a = A();
    return sm([[0, 0], [a, 0], [a, a], [0, a]]); });

// remaining (a-b)² square
quad(minus, '#1565C0', 0.25, () => { const a = A(), b = Bm(), c = Cm();
    return sm([[0, b], [c, b], [c, a], [0, a]]); });
lbl(minus, '#0D47A1', 15, () => Cm() / 2 * Fm(), () => (Bm() + Cm() / 2) * Fm(),
    () => Cm() > 0 ? '(a-b)²' : '');

// right −ab strip
quad(minus, '#F28B82', 0.80, () => { const a = A(), b = Bm(), c = Cm();
    return sm([[c, b], [a, b], [a, a], [c, a]]); });
lbl(minus, '#7F1D1D', 14, () => (Cm() + Bm() / 2) * Fm(), () => (Bm() + Cm() / 2) * Fm(),
    () => (Bm() > 0 && Cm() > 0) ? '−ab' : '');

// bottom −ab strip
quad(minus, '#F28B82', 0.80, () => { const b = Bm(), c = Cm();
    return sm([[0, 0], [c, 0], [c, b], [0, b]]); });
lbl(minus, '#7F1D1D', 14, () => Cm() / 2 * Fm(), () => Bm() / 2 * Fm(),
    () => (Bm() > 0 && Cm() > 0) ? '−ab' : '');

// added-back +b² overlap
quad(minus, '#A5D6A7', 0.90, () => { const a = A(), b = Bm(), c = Cm();
    return sm([[c, 0], [a, 0], [a, b], [c, b]]); });
lbl(minus, '#1B5E20', 14, () => (Cm() + Bm() / 2) * Fm(), () => Bm() / 2 * Fm(),
    () => Bm() > 0 ? '+b²' : '');

// partition lines
sgmt(minus, '#333', 1.5, () => Cm() * Fm(), () => 0, () => Cm() * Fm(), () => A() * Fm());
sgmt(minus, '#333', 1.5, () => 0, () => Bm() * Fm(), () => A() * Fm(), () => Bm() * Fm());

// side labels
lbl(minus, '#1565C0', 13, () => Cm() / 2 * Fm(), () => -0.7, () => 'a-b');
lbl(minus, '#8D5A00', 13, () => (Cm() + Bm() / 2) * Fm(), () => -0.7, () => 'b');
lbl(minus, '#1565C0', 13, () => -0.9, () => (Bm() + Cm() / 2) * Fm(), () => 'a-b');
lbl(minus, '#8D5A00', 13, () => -0.9, () => Bm() / 2 * Fm(), () => 'b');

// whole-side bracket + formula
bracket(minus, '#1565C0', () => 0, () => FRAME, FRAME + 0.6, () => 'a = ' + A());
lbl(minus, '#B71C1C', 15, () => FRAME / 2, () => -1.7, () => '(a-b)² = a² − 2ab + b²');
lbl(minus, '#B71C1C', 13, () => FRAME / 2, () => -2.4,
    () => A() + '² − 2(' + A() + ')(' + Bm() + ') + ' + Bm() + '²');
lbl(minus, '#B71C1C', 13, () => FRAME / 2, () => -3.1,
    () => { const a = A(), b = Bm(), c = Cm(); return (a * a) + ' − ' + (2 * a * b) + ' + ' + (b * b) + ' = ' + (c * c); });

/* ---------------------------------------------------------
 *  MODE  (the only imperative action: flip a flag and toggle
 *  which group is visible — the geometry itself never rebuilds)
 * --------------------------------------------------------*/

board.create('text', [13.15, 12.4,
    () => mode === 'plus' ? 'Mode:  (a + b)²' : 'Mode:  (a − b)²'
], { anchorX: 'middle', fontSize: 15, fixed: true });

board.create('button', [11, 8.4, '(a+b)²', () => setMode('plus')]);
board.create('button', [13.4, 8.4, '(a-b)²', () => setMode('minus')]);

function setMode(m) {
    mode = m;
    show(plus, m === 'plus');
    show(minus, m === 'minus');
    board.update();
}

/* start in (a+b)² mode */
show(minus, false);
board.update();
