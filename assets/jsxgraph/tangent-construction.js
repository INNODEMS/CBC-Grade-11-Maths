/* ============================================================================
 * Constructing a Tangent at a Point on a Circle — stepped JSXGraph animation
 * ----------------------------------------------------------------------------
 * A compass-and-straightedge construction revealed one step at a time with
 * "Back" / "Next" buttons. O and P are free, draggable base points; everything
 * else (Q, the perpendicular-bisector arcs, X, Y, the tangent) is DERIVED, so
 * the whole construction stays correct while you drag.
 *
 * PreTeXt wiring (no DOM injection — avoids the scroll bars that appear when
 * extra nodes are squeezed into a slate's reserved aspect box):
 *   - The board renders into a  surface="jsxboard"  slate with id  box_tangent.
 *   - The step caption renders into a  surface="html"  slate that contains an
 *     element with id  caption_tangent.
 *   - The Back / Next buttons live in their own  surface="html"  slates and
 *     call the globals  tangentBack()  /  tangentNext()  via onclick.
 * See the matching <figure> in the .ptx source for the exact slate layout.
 *
 * Five steps (matching the PreTeXt figure):
 *   1. Circle, centre O, with point P on it.
 *   2. Radius OP drawn and extended beyond P.
 *   3. Q marked on the line so PQ = OP  (P becomes the midpoint of OQ).
 *   4. Equal arcs from O and from Q crossing at X and Y.
 *   5. Line XY = the tangent to the circle at P (perpendicular to OP).
 * ==========================================================================*/


const BOX_ID = 'box_tangent';          // surface="jsxboard" slate id
const CAPTION_ID = 'caption_tangent';  // element inside the html caption slate
const BACK_ID = 'back_tangent';        // Back button id   (in its own html slate)
const NEXT_ID = 'next_tangent';        // Next button id   (in its own html slate)

const TOTAL_STEPS = 5;
const TEAL = '#0d8e8e';
const ACCENT = '#1565c0';
const TANGENT_COL = '#1f4ed8';
const ARC_COL = '#888';

// ---- Board ---------------------------------------------------------------
const board = JXG.JSXGraph.initBoard(BOX_ID, {
boundingbox: [-3.4, 3.3, 7.4, -3.3],
keepaspectratio: true,
axis: false,
showCopyright: false,
showNavigation: false,
pan: { enabled: false },
zoom: { wheel: false }
});

// ---- CONSTRUCTION --------------------------------------------------------
// Free base points (draggable).
const O = board.create('point', [0, 0], {
name: 'O', size: 4, strokeColor: ACCENT, fillColor: ACCENT,
label: { offset: [-10, -12], anchorX: 'right', anchorY: 'top' }
});
const P = board.create('point', [2, 0], {
name: 'P', size: 4, strokeColor: ACCENT, fillColor: ACCENT,
label: { offset: [10, -12], anchorX: 'left', anchorY: 'top' }
});

// The circle, centre O through P.
const circle = board.create('circle', [O, P], {
strokeColor: TEAL, strokeWidth: 2, fillColor: 'none'
});

// Ray from O through P, extended beyond P (radius + extension in one).
const rayOP = board.create('line', [O, P], {
straightFirst: false, straightLast: true,
strokeColor: '#333', strokeWidth: 1.5
});

// Q = reflection of O through P  ⇒  PQ = OP and P is the midpoint of OQ.
const Q = board.create('mirrorelement', [O, P], {
name: 'Q', size: 4, strokeColor: '#444', fillColor: '#444',
label: { offset: [6, -14], anchorX: 'left', anchorY: 'top' }
});

// Equal compass setting for the two arcs: anything > half of OQ ( = OP ).
const arcR = () => 1.25 * O.Dist(P);
const cO = board.create('circle', [O, arcR], { visible: false });
const cQ = board.create('circle', [Q, arcR], { visible: false });

// Arc crossings: X above the line, Y below. (Indices verified headlessly.)
const X = board.create('intersection', [cO, cQ, 1], {
name: 'X', size: 3, strokeColor: '#444', fillColor: '#fff',
label: { offset: [8, 6], anchorX: 'left', anchorY: 'bottom' }
});
const Y = board.create('intersection', [cO, cQ, 0], {
name: 'Y', size: 3, strokeColor: '#444', fillColor: '#fff',
label: { offset: [8, -6], anchorX: 'left', anchorY: 'top' }
});

// Visible compass arcs (dashed), drawn only across the crossing region.
const arcFromO = board.create('arc', [O, Y, X], {
strokeColor: ARC_COL, strokeWidth: 1.3, dash: 2, highlight: false
});
const arcFromQ = board.create('arc', [Q, X, Y], {
strokeColor: ARC_COL, strokeWidth: 1.3, dash: 2, highlight: false
});

// The tangent: the line through X and Y (perpendicular bisector of OQ),
// which passes through P at right angles to OP.
const tangent = board.create('line', [X, Y], {
strokeColor: TANGENT_COL, strokeWidth: 2.5
});
const tangentLabel = board.create('text', [
() => X.X() + 0.35, () => X.Y() + 0.55, 'tangent'
], { fontSize: 14, strokeColor: TANGENT_COL, anchorX: 'left', highlight: false });

// Right-angle mark between PO and PX, sitting at P.
const rightAngle = board.create('angle', [O, P, X], {
type: 'square', radius: 0.2,
strokeColor: TANGENT_COL, fillColor: TANGENT_COL, fillOpacity: 0.25,
name: '', highlight: false, label: { visible: false }
});

// ---- Congruence tick marks (PQ = OP) ------------------------------------
// JSXGraph has no native congruence tick, so overlay a short perpendicular
// dash at the midpoint of each segment; both stay live under dragging.
function tickMark(A, B) {
const mx = () => (A.X() + B.X()) / 2;
const my = () => (A.Y() + B.Y()) / 2;
const nx = () => { const dx = B.X() - A.X(), dy = B.Y() - A.Y(), L = Math.hypot(dx, dy) || 1; return -dy / L; };
const ny = () => { const dx = B.X() - A.X(), dy = B.Y() - A.Y(), L = Math.hypot(dx, dy) || 1; return dx / L; };
const e1 = board.create('point', [() => mx() - 0.14 * nx(), () => my() - 0.14 * ny()], { visible: false, name: '' });
const e2 = board.create('point', [() => mx() + 0.14 * nx(), () => my() + 0.14 * ny()], { visible: false, name: '' });
return board.create('segment', [e1, e2], { strokeColor: '#333', strokeWidth: 2, highlight: false });
}
const tickOP = tickMark(O, P);
const tickPQ = tickMark(P, Q);

// ---- STEP VISIBILITY -----------------------------------------------------
// Each entry: the object appears from the listed step onward.
const staged = [
{ o: rayOP, from: 2 },
{ o: Q, from: 3 },
{ o: tickOP, from: 3 },
{ o: tickPQ, from: 3 },
{ o: arcFromO, from: 4 },
{ o: arcFromQ, from: 4 },
{ o: X, from: 4 },
{ o: Y, from: 4 },
{ o: tangent, from: 5 },
{ o: tangentLabel, from: 5 },
{ o: rightAngle, from: 5 }
];

const CAPTIONS = [
'Step 1 of 5 — Draw a circle with centre O and mark the point P on it.',
'Step 2 of 5 — Draw the radius OP and extend the line beyond P.',
'Step 3 of 5 — With the compasses set to OP, mark Q on the line so that PQ = OP. Now P is the midpoint of OQ.',
'Step 4 of 5 — Open the compasses wider than half of OQ. Draw equal arcs from O and from Q; they cross at X and Y.',
'Step 5 of 5 — Draw the line through X and Y. It passes through P at a right angle to OP: the tangent at P.'
];

let step = 1;

function render() {
staged.forEach(({ o, from }) => o.setAttribute({ visible: step >= from }));
board.update();

const captionEl = document.getElementById(CAPTION_ID);
if (captionEl) captionEl.textContent = CAPTIONS[step - 1];

const backBtn = document.getElementById(BACK_ID);
if (backBtn) backBtn.disabled = step === 1;

const nextBtn = document.getElementById(NEXT_ID);
if (nextBtn) nextBtn.disabled = step === TOTAL_STEPS;
}

// ---- CONTROLS (called from the PreTeXt html-surface button slates) -------
// Exposed as globals so the <input type="button" onclick="..."> handlers in
// the .ptx source can reach them.
function tangentBack() { if (step > 1) { step--; render(); } }
function tangentNext() { if (step < TOTAL_STEPS) { step++; render(); } }
window.tangentBack = tangentBack;
window.tangentNext = tangentNext;

render();