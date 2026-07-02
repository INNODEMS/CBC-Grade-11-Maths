// 1. Initialize the board
const board = JXG.JSXGraph.initBoard('jsxgraph-even-odd', {
    boundingbox: [-7, 7, 7, -7],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Example functions to explore
const functions = [
    {
        label: 'f(x) = x\u00B2 \u2212 1  (Even Function)',
        fn: (x) => x * x - 1,
        xMin: -3.2, xMax: 3.2,
        color: '#2563eb'
    },
    {
        label: 'f(x) = x\u00B3 / 3  (Odd Function)',
        fn: (x) => (x * x * x) / 3,
        xMin: -2.6, xMax: 2.6,
        color: '#dc2626'
    }
];

let currentIndex = 0;
let sceneObjects = [];

function clearScene() {
    board.removeObject(sceneObjects);
    sceneObjects = [];
}

// 3. Build the entire scene fresh for a given function index
function buildScene(index) {
    clearScene();
    currentIndex = index;
    const f = functions[index];

    // Curve must exist BEFORE the glider is created on it
    const curve = board.create('functiongraph', [f.fn, f.xMin, f.xMax], {
        strokeColor: f.color, strokeWidth: 3
    });
    sceneObjects.push(curve);

    const label = board.create('text', [0, 6.6, f.label], {
        fontSize: 16, anchorX: 'middle', cssClass: 'font-bold', color: f.color
    });
    sceneObjects.push(label);

    // Glider point P, now correctly attached to the curve
    const P = board.create('glider', [1.5, f.fn(1.5), curve], {
        name: 'P', size: 5, color: '#0f172a'
    });
    sceneObjects.push(P);

    // Mirror point Q(-x, f(-x))
    const Q = board.create('point', [
        () => -P.X(),
        () => f.fn(-P.X())
    ], { name: 'Q', size: 5, color: '#16a34a', fixed: true });
    sceneObjects.push(Q);

    const dashLine = board.create('segment', [P, Q], {
        strokeColor: '#64748b', dash: 2, strokeWidth: 2
    });
    sceneObjects.push(dashLine);

    // Live calculation panel (top-left)
    const panelBg = board.create('polygon', [
        [-6.8, 6.4], [-1.4, 6.4], [-1.4, 4.2], [-6.8, 4.2]
    ], {
        fillColor: '#f1f5f9', fillOpacity: 0.9,
        borders: { strokeColor: '#94a3b8', strokeWidth: 1 },
        vertices: { visible: false }
    });
    sceneObjects.push(panelBg);

    const calcP = board.create('text', [-6.6, 6.0,
        () => 'P: (x, f(x)) = (' + P.X().toFixed(2) + ', ' + P.Y().toFixed(2) + ')'
    ], { fontSize: 13, color: '#1e3a8a' });
    sceneObjects.push(calcP);

    const calcQ = board.create('text', [-6.6, 5.5,
        () => 'Q: (\u2212x, f(\u2212x)) = (' + Q.X().toFixed(2) + ', ' + Q.Y().toFixed(2) + ')'
    ], { fontSize: 13, color: '#166534' });
    sceneObjects.push(calcQ);

    const calcVerdict = board.create('text', [-6.6, 4.6, () => {
        const py = P.Y(), qy = Q.Y();
        if (Math.abs(py - qy) < 0.01) return 'f(\u2212x) = f(x)  \u2192  EVEN';
        if (Math.abs(py + qy) < 0.01) return 'f(\u2212x) = \u2212f(x)  \u2192  ODD';
        return 'matches neither pattern';
    }], { fontSize: 13, color: '#dc2626', cssClass: 'font-bold' });
    sceneObjects.push(calcVerdict);

    board.update();
}

// 4. Buttons at the bottom of the graph
board.create('button', [-3, -6.3, 'Even Function', () => buildScene(0)], {
    fixed: true, cssStyle: 'padding: 8px 12px; cursor: pointer;'
});
board.create('button', [1, -6.3, 'Odd Function', () => buildScene(1)], {
    fixed: true, cssStyle: 'padding: 8px 12px; cursor: pointer;'
});

// 5. Initial scene
buildScene(0);