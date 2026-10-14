/*
    Types of Relations — is it a function?
    The student clicks a left object then a right object to draw a mapping arrow
    (click an arrow to remove it). The figure classifies the relation
    (one-to-one, one-to-many, many-to-one, many-to-many), reports whether it is a
    function, counts the arrows, and highlights any left object with more than one
    output. A Clear control is exposed as window.clearRelation() for PreTeXt.
*/

JXG.Options.text.fontSize = 16;

const board = JXG.JSXGraph.initBoard('jsx-relation-types', {
    boundingbox: [-7, 6, 7, -7],
    keepaspectratio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Parameters -------------------------------------------------------------
const LEFT_X = -4;
const RIGHT_X = 4;
const YS = [2.6, 0, -2.6];                 // three rows in each group
const LEFT_NAMES = ['a', 'b', 'c'];
const RIGHT_NAMES = ['1', '2', '3'];
const BLUE = '#1565c0';
const GREEN = '#2e7d32';
const RED = '#c62828';
const ORANGE = '#ef6c00';

// --- Group outlines ---------------------------------------------------------
function groupOutline(cx) {
    board.create('curve', [
        (t) => cx + 1.4 * Math.cos(t),
        (t) => 3.9 * Math.sin(t),
        0, 2 * Math.PI
    ], { strokeColor: '#90a4ae', strokeWidth: 2, fillColor: '#eceff1', fillOpacity: 0.5, fixed: true, highlight: false });
}
groupOutline(LEFT_X);
groupOutline(RIGHT_X);
board.create('text', [LEFT_X, 4.4, 'Set A'], { anchorX: 'middle', fixed: true, cssStyle: 'font-weight:bold' });
board.create('text', [RIGHT_X, 4.4, 'Set B'], { anchorX: 'middle', fixed: true, cssStyle: 'font-weight:bold' });

// --- Objects (fixed but clickable) ------------------------------------------
const leftPts = YS.map((y, i) => board.create('point', [LEFT_X, y], {
    name: LEFT_NAMES[i], size: 6, strokeColor: BLUE, fillColor: BLUE,
    fixed: true, label: { offset: [-14, 0], anchorX: 'right' }
}));
const rightPts = YS.map((y, i) => board.create('point', [RIGHT_X, y], {
    name: RIGHT_NAMES[i], size: 6, strokeColor: GREEN, fillColor: GREEN,
    fixed: true, label: { offset: [14, 0], anchorX: 'left' }
}));

// --- State ------------------------------------------------------------------
let arrows = [];          // { obj, from, to }
let selected = null;      // index of currently selected left point

function outDegrees() {
    const d = [0, 0, 0];
    arrows.forEach(a => d[a.from]++);
    return d;
}
function inDegrees() {
    const d = [0, 0, 0];
    arrows.forEach(a => d[a.to]++);
    return d;
}

function relationType() {
    if (arrows.length === 0) return '—';
    const out = outDegrees(), inn = inDegrees();
    const maxOut = Math.max(...out), maxIn = Math.max(...inn);
    if (maxOut <= 1 && maxIn <= 1) return 'one-to-one';
    if (maxOut > 1 && maxIn <= 1) return 'one-to-many';
    if (maxOut <= 1 && maxIn > 1) return 'many-to-one';
    return 'many-to-many';
}

// A function: every object in Set A has exactly one arrow leaving it.
function functionState() {
    if (arrows.length === 0) return { ok: false, msg: 'Draw arrows to begin.' };
    const out = outDegrees();
    const tooMany = out.some(d => d > 1);
    const missing = out.some(d => d === 0);
    if (tooMany) return { ok: false, msg: 'Not a function: an input has more than one output.' };
    if (missing) return { ok: false, msg: 'Not a function yet: every input needs exactly one output.' };
    return { ok: true, msg: 'This is a function: every input has exactly one output.' };
}

// --- Highlight left objects with more than one output -----------------------
function refresh() {
    const out = outDegrees();
    leftPts.forEach((p, i) => {
        const colour = (i === selected) ? ORANGE : (out[i] > 1 ? RED : BLUE);
        p.setAttribute({ strokeColor: colour, fillColor: colour });
    });
    board.update();
}

// --- Arrow management -------------------------------------------------------
function addArrow(i, j) {
    if (arrows.some(a => a.from === i && a.to === j)) return;   // no duplicates
    const obj = board.create('arrow', [leftPts[i], rightPts[j]], {
        strokeColor: '#455a64', strokeWidth: 2.5, lastArrow: { type: 1, size: 6 },
        highlightStrokeColor: RED, highlightStrokeWidth: 3.5
    });
    const rec = { obj, from: i, to: j };
    obj.on('down', (e) => { e.stopPropagation(); removeArrow(rec); });
    arrows.push(rec);
    refresh();
}
function removeArrow(rec) {
    board.removeObject(rec.obj);
    arrows = arrows.filter(a => a !== rec);
    refresh();
}

// Exposed for a PreTeXt "Clear" button (chrome belongs in PreTeXt, not here).
window.clearRelation = function () {
    arrows.forEach(a => board.removeObject(a.obj));
    arrows = [];
    selected = null;
    refresh();
};

// --- Click-to-connect interaction -------------------------------------------
leftPts.forEach((p, i) => p.on('down', () => {
    selected = (selected === i) ? null : i;
    refresh();
}));
rightPts.forEach((p, j) => p.on('down', () => {
    if (selected !== null) {
        addArrow(selected, j);
        selected = null;
        refresh();
    }
}));

// --- Instructions + dynamic readouts ----------------------------------------
board.create('text', [0, 5.4,
    'Click an object in Set A, then one in Set B, to draw an arrow. Click an arrow to remove it.'],
    { anchorX: 'middle', fixed: true, cssStyle: 'color:#555' });

board.create('text', [-6.6, -5.0, () => 'Arrows drawn: ' + arrows.length],
    { anchorX: 'left', fixed: true });
board.create('text', [-6.6, -5.7, () => 'Type of relation: ' + relationType()],
    { anchorX: 'left', fixed: true });
board.create('text', [-6.6, -6.4, () => {
    const f = functionState();
    return 'Function? ' + (f.ok ? 'Yes' : 'No') + '  —  ' + f.msg;
}], { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });

refresh();