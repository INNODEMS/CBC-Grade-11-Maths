/* ============================================================================
 * Constructing the Circumscribed Circle of a Triangle — stepped animation
 * ----------------------------------------------------------------------------
 * Five steps revealed one at a time with "Back" / "Next" buttons, mirroring the
 * compass-and-straightedge construction in the section figures.
 *
 * Interactivity: A, B and C (the triangle's vertices) are FREE, draggable base
 * points. Everything else — the two perpendicular bisectors (with their compass
 * arcs), the circumcenter O, the equal radii OA = OB = OC and the circumscribed
 * circle — is DERIVED and recomputes live as you drag.
 *
 * Method: the centre must be equidistant from all three vertices, so it lies on
 * the perpendicular bisector of every side. Construct the bisectors of AB and BC;
 * they meet at the circumcenter O. The circle centre O radius OA passes through
 * all three vertices.
 *
 * Expects a surface="jsxboard" slate with id="box_circum", an html caption
 * element id="caption_circum", and Back/Next button inputs (ids back_circum /
 * next_circum) wired to the globals circumBack() / circumNext().
 * ==========================================================================*/

(function () {
  'use strict';

  JXG.Options.text.useMathJax = true;

  const BOX_ID = 'box_circum';
  const CAPTION_ID = 'caption_circum';
  const BACK_ID = 'back_circum';
  const NEXT_ID = 'next_circum';
  const TOTAL_STEPS = 5;

  const TRI = '#333', RED = '#d32f2f', BLUE = '#1565c0';
  const FREE = '#1565c0', CENTRE = '#000', CIRC = '#0d8e8e', SCAFF = '#9e9e9e';

  const board = JXG.JSXGraph.initBoard(BOX_ID, {
    boundingbox: [-1.8, 5.4, 6.9, -2.6],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { wheel: false }
  });

  // ===== CONSTRUCTION =======================================================

  // --- Free vertices (draggable) -------------------------------------------
  const A = board.create('point', [1.5, 4], {
    name: 'A', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [0, 12], anchorX: 'middle', anchorY: 'bottom' }
  });
  const B = board.create('point', [0, 0], {
    name: 'B', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [-10, -10], anchorX: 'right', anchorY: 'top' }
  });
  const C = board.create('point', [5, 0], {
    name: 'C', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [10, -10], anchorX: 'left', anchorY: 'top' }
  });

  const triangle = board.create('polygon', [A, B, C], {
    borders: { strokeColor: TRI, strokeWidth: 2, highlight: false },
    fillColor: 'none', highlight: false, vertices: { visible: false }
  });

  // --- Perpendicular-bisector helper (compass-and-straightedge style) ------
  // Returns the bisector line of segment PQ plus its compass-arc scaffolding.
  function perpBisector(P, Q, colour) {
    const rad = () => 0.62 * P.Dist(Q);
    const cP = board.create('circle', [P, rad], { visible: false });
    const cQ = board.create('circle', [Q, rad], { visible: false });
    const i1 = board.create('intersection', [cP, cQ, 0], { name: '', size: 1, strokeColor: SCAFF, fillColor: SCAFF, withLabel: false });
    const i2 = board.create('intersection', [cP, cQ, 1], { name: '', size: 1, strokeColor: SCAFF, fillColor: SCAFF, withLabel: false });
    const mid = board.create('midpoint', [P, Q], { visible: false, name: '' });
    const arcP = board.create('arc', [P, i1, i2], { strokeColor: colour, strokeWidth: 1.2, dash: 2, highlight: false });
    const arcQ = board.create('arc', [Q, i2, i1], { strokeColor: colour, strokeWidth: 1.2, dash: 2, highlight: false });
    const line = board.create('line', [i1, i2], { strokeColor: colour, strokeWidth: 2, highlight: false });
    const rt = board.create('angle', [P, mid, i1], { type: 'square', radius: 0.32, strokeColor: colour, fillColor: colour, fillOpacity: 0.18, name: '', highlight: false , label: { visible: false } });
    return { line, scaffold: [cP, cQ, i1, i2, arcP, arcQ, rt], arcs: [arcP, arcQ, i1, i2, rt] };
  }

  const bisAB = perpBisector(A, B, RED);
  const bisBC = perpBisector(B, C, BLUE);

  // --- Circumcenter O = intersection of the two bisectors -------------------
  const O = board.create('intersection', [bisAB.line, bisBC.line], {
    name: 'O', size: 4, strokeColor: CENTRE, fillColor: CENTRE,
    label: { offset: [8, -6], anchorX: 'left', anchorY: 'top' }
  });

  // --- Equal radii OA = OB = OC (dotted) ------------------------------------
  const oa = board.create('segment', [O, A], { strokeColor: '#777', strokeWidth: 1.3, dash: 1, highlight: false });
  const ob = board.create('segment', [O, B], { strokeColor: '#777', strokeWidth: 1.3, dash: 1, highlight: false });
  const oc = board.create('segment', [O, C], { strokeColor: '#777', strokeWidth: 1.3, dash: 1, highlight: false });

  // --- The circumscribed circle, with radius label R ------------------------
  const circum = board.create('circle', [O, A], { strokeColor: CIRC, strokeWidth: 2.4, fillColor: 'none', highlight: false });
  const radSeg = board.create('segment', [O, A], { strokeColor: CIRC, strokeWidth: 1.6, highlight: false });
  const radLabel = board.create('text', [
    () => (O.X() + A.X()) / 2 - 0.15, () => (O.Y() + A.Y()) / 2, '\\(R\\)'
  ], { fontSize: 15, strokeColor: CIRC, anchorX: 'right', anchorY: 'middle', highlight: false });

  // ===== STEP VISIBILITY ====================================================
  const staged = [
    { o: bisAB.line, from: 2 },
    ...bisAB.arcs.map(o => ({ o, only: 2 })),
    { o: bisBC.line, from: 3 },
    ...bisBC.arcs.map(o => ({ o, only: 3 })),
    { o: O, from: 4 }, { o: oa, from: 4 }, { o: ob, from: 4 }, { o: oc, from: 4 },
    { o: circum, from: 5 }, { o: radSeg, from: 5 }, { o: radLabel, from: 5 }
  ];

  const CAPTIONS = [
    'Step 1 of 5 — Draw the triangle ABC accurately with a ruler.',
    'Step 2 of 5 — Draw the perpendicular bisector of AB by drawing arcs from A and B',
    'Step 3 of 5 — In the same way, construct the perpendicular bisector of BC (blue).',
    'Step 4 of 5 — The two bisectors meet at the circumcenter O. Since O lies on both bisectors, OA = OB = OC.',
    'Step 5 of 5 — Set the compasses to OA and draw the circle: the circumscribed circle through all three vertices.'
  ];

  // ===== STEP STATE + CAPTION ==============================================
  let step = 1;
  function render() {
    staged.forEach(({ o, from, only }) => {
      const vis = only != null ? step === only : step >= from;
      o.setAttribute({ visible: vis });
    });
    board.update();
    const cap = document.getElementById(CAPTION_ID);
    if (cap) cap.textContent = CAPTIONS[step - 1];
    const backBtn = document.getElementById(BACK_ID);
    if (backBtn) backBtn.disabled = step === 1;
    const nextBtn = document.getElementById(NEXT_ID);
    if (nextBtn) nextBtn.disabled = step === TOTAL_STEPS;
  }

  // ===== CONTROLS ===========================================================
  function circumBack() { if (step > 1) { step--; render(); } }
  function circumNext() { if (step < TOTAL_STEPS) { step++; render(); } }
  window.circumBack = circumBack;
  window.circumNext = circumNext;

  render();
})();
