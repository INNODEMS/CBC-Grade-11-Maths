// ============================================================
// BOARD SETUP
// ============================================================
const board = JXG.JSXGraph.initBoard('jsxgraph-limit-approach', {
    boundingbox: [-4, 15, 17, -4],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// ============================================================
// STATE (the only mutable things in this whole app)
// ============================================================
const target = 3;
function f(x) { return x * x - 2 * x + 3; }
const targetY = f(target);

let mode = 'left';         // 'left' | 'right' | 'free'
let animating = false;
let animTimer = null;
let traceHistory = [];     // most recent first, max 8 entries

// ============================================================
// GRAPH
// ============================================================
const curve = board.create('functiongraph', [f, -3, 9], {
    strokeColor: '#2563eb', strokeWidth: 3
});

board.create('text', [3, 14.3, 'f(x) = x\u00B2 \u2212 2x + 3'], {
    fontSize: 18, anchorX: 'middle', cssClass: 'font-bold', color: '#1e3a8a'
});

// ============================================================
// MOVING POINT (a glider so Free Drag mode "just works")
// ============================================================
function pointColor() {
    const diff = Math.abs(P.X() - target);
    if (diff >= 1) return '#dc2626';
    if (diff >= 0.2) return '#f59e0b';
    return '#16a34a';
}

const P = board.create('glider', [0, f(0), curve], {
    name: '', size: 6, fixed: true,
    fillColor: () => pointColor(),
    strokeColor: () => pointColor()
});

// ============================================================
// GUIDES (always exist, always read P's live position)
// ============================================================
board.create('segment', [
    [() => P.X(), 0], [() => P.X(), () => P.Y()]
], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });

board.create('segment', [
    [() => P.X(), () => P.Y()], [0, () => P.Y()]
], { strokeColor: '#94a3b8', dash: 2, strokeWidth: 1 });

// ============================================================
// LIMIT POINT (3, 6) with a soft glow
// ============================================================
board.create('point', [target, targetY], {
    name: '', size: 16, fillColor: '#16a34a', fillOpacity: 0.2,
    strokeColor: 'none', fixed: true
});
board.create('point', [target, targetY], {
    name: '(3, 6)', size: 6, fillColor: '#16a34a', strokeColor: '#166534',
    fixed: true, label: { offset: [10, 10], cssClass: 'font-bold' }
});

// ============================================================
// TRACE (fading dots, fixed count, positions read from state)
// ============================================================
const TRACE_LENGTH = 8;
for (let i = 0; i < TRACE_LENGTH; i++) {
    board.create('point', [
        () => (traceHistory[i] ? traceHistory[i].x : -100),
        () => (traceHistory[i] ? traceHistory[i].y : -100)
    ], {
        name: '', size: 3, fixed: true,
        fillColor: '#16a34a', strokeColor: '#16a34a',
        fillOpacity: Math.max(0.05, 0.75 - i * 0.09),
        strokeOpacity: Math.max(0.05, 0.75 - i * 0.09),
        visible: () => !!traceHistory[i]
    });
}

function recordTrace(x, y) {
    traceHistory.unshift({ x, y });
    if (traceHistory.length > TRACE_LENGTH) traceHistory.pop();
}

// ============================================================
// RIGHT PANEL — live values
// ============================================================
board.create('polygon', [[9.5, 13.5], [16.5, 13.5], [16.5, -2], [9.5, -2]], {
    fillColor: '#f8fafc', fillOpacity: 0.95,
    borders: { strokeColor: '#cbd5e1', strokeWidth: 1 },
    vertices: { visible: false }
});

board.create('text', [9.9, 12.8, 'LIVE VALUES'], {
    fontSize: 13, cssClass: 'font-bold', color: '#0f172a'
});
board.create('text', [9.9, 11.6, () => 'Current x = ' + P.X().toFixed(3)], {
    fontSize: 14, color: '#1e3a8a'
});
board.create('text', [9.9, 10.6, () => 'Current f(x) = ' + P.Y().toFixed(4)], {
    fontSize: 14, color: '#1e3a8a'
});
board.create('text', [9.9, 9.6, () => 'Distance from 3 = ' + Math.abs(P.X() - target).toFixed(3)], {
    fontSize: 14, color: '#92400e'
});
board.create('text', [9.9, 8.4, 'Limit = 6'], {
    fontSize: 15, cssClass: 'font-bold', color: '#166534'
});

board.create('text', [9.9, 7.0, 'EPSILON: |x \u2212 3|'], {
    fontSize: 12, color: '#475569'
});
board.create('text', [9.9, 6.0, () => '|x \u2212 3| = ' + Math.abs(P.X() - target).toFixed(4)], {
    fontSize: 14, cssClass: 'font-bold', color: '#7c3aed'
});

board.create('text', [9.9, 4.6, () => {
    const diff = Math.abs(P.X() - target);
    if (diff >= 1) return 'Far away...';
    if (diff >= 0.3) return 'Getting closer...';
    if (diff >= 0.02) return 'Very close...';
    return 'f(x) is approaching 6.';
}], {
    fontSize: 15, cssClass: 'font-bold',
    color: () => {
        const diff = Math.abs(P.X() - target);
        if (diff >= 1) return '#dc2626';
        if (diff >= 0.3) return '#f59e0b';
        return '#16a34a';
    }
});

// ============================================================
// ANIMATION TIMER (easing — the point naturally slows down)
// ============================================================
function stepTick() {
    const x = P.X();
    const newX = x + (target - x) * 0.08;
    P.setPosition(JXG.COORDS_BY_USER, [newX, f(newX)]);
    recordTrace(newX, f(newX));
    board.update();
    if (Math.abs(target - newX) < 0.001) stopAnimation();
}

function startAnimation() {
    if (mode === 'free' || animating) return;
    animating = true;
    animTimer = setInterval(stepTick, 30);
}

function stopAnimation() {
    animating = false;
    if (animTimer) { clearInterval(animTimer); animTimer = null; }
}

function resetAnimation() {
    stopAnimation();
    traceHistory = [];
    const startX = mode === 'right' ? 6.5 : 0;
    P.setPosition(JXG.COORDS_BY_USER, [startX, f(startX)]);
    board.update();
}

// ============================================================
// MODE SWITCHING (Left / Right / Free Drag)
// ============================================================
function setMode(newMode) {
    mode = newMode;
    stopAnimation();
    traceHistory = [];
    if (mode === 'left') {
        P.setAttribute({ fixed: true });
        P.setPosition(JXG.COORDS_BY_USER, [0, f(0)]);
    } else if (mode === 'right') {
        P.setAttribute({ fixed: true });
        P.setPosition(JXG.COORDS_BY_USER, [6.5, f(6.5)]);
    } else {
        P.setAttribute({ fixed: false }); // draggable along the curve
    }
    board.update();
}

P.on('drag', () => {
    recordTrace(P.X(), P.Y());
    board.update();
});

// ============================================================
// CONTROLS
// ============================================================
board.create('button', [-3, -2.3, 'Approach from Left', () => setMode('left')], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [0.9, -2.3, 'Approach from Right', () => setMode('right')], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [4.9, -2.3, 'Free Drag', () => setMode('free')], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});

board.create('button', [-3, -3.4, 'Play \u25B6', startAnimation], {
    fixed: true, cssStyle: 'padding: 6px 14px; cursor: pointer;'
});
board.create('button', [-0.3, -3.4, 'Pause \u23F8', stopAnimation], {
    fixed: true, cssStyle: 'padding: 6px 14px; cursor: pointer;'
});
board.create('button', [2.4, -3.4, 'Reset \u21BA', resetAnimation], {
    fixed: true, cssStyle: 'padding: 6px 14px; cursor: pointer;'
});

// ============================================================
// INITIAL STATE
// ============================================================
setMode('left');