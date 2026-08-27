/* ============================================================================
 * Constructing the Escribed Circle (Excircle) Opposite A — stepped animation
 * ----------------------------------------------------------------------------
 * Five steps revealed one at a time with "Back" / "Next" buttons, mirroring the
 * compass-and-straightedge construction in the section figures.
 *
 * Interactivity: A, B and C are FREE, draggable base points. The extensions of
 * AB and AC, the external bisectors at B and C, the excenter J_a, the foot X of
 * the perpendicular to BC, the exradius r_a and the excircle are all DERIVED and
 * recompute live as you drag.
 *
 * Method: the excircle opposite A is tangent to side BC and to the extensions of
 * AB and AC. Its centre, the excenter J_a, lies on the EXTERNAL bisectors of the
 * angles at B and C (and the internal bisector of A). Those two external bisectors
 * meet at J_a; the distance from J_a to BC is the exradius r_a.
 *
 * Excenter formula (opposite A): J_a = (-a·A + b·B + c·C)/(-a + b + c),
 * with a = |BC|, b = |CA|, c = |AB|. The drawn rays B–J_a and C–J_a ARE the
 * external bisectors at B and C, so the construction stays a true construction.
 *
 * Expects a surface="jsxboard" slate id="box_excircle", an html caption element
 * id="caption_excircle", and Back/Next inputs (back_excircle / next_excircle)
 * wired to the globals excircleBack() / excircleNext().
 * ==========================================================================*/

(function () {
  'use strict';

  JXG.Options.text.useMathJax = true;

  const BOX_ID = 'box_excircle';
  const CAPTION_ID = 'caption_excircle';
  const BACK_ID = 'back_excircle';
  const NEXT_ID = 'next_excircle';
  const TOTAL_STEPS = 5;

  const TRI = '#333', EXT = '#555', BIS = '#1565c0', RAD = '#d32f2f';
  const FREE = '#1565c0', CENTRE = '#000', CIRC = '#1565c0';

  const board = JXG.JSXGraph.initBoard(BOX_ID, {
    boundingbox: [-2.7, 4.9, 8.7, -10.3],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { wheel: false }
  });

  // ===== CONSTRUCTION =======================================================

  // --- Free vertices (draggable) -------------------------------------------
  const A = board.create('point', [1.5, 3.5], {
    name: 'A', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [0, 12], anchorX: 'middle', anchorY: 'bottom' }
  });
  const B = board.create('point', [0, 0], {
    name: 'B', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [-10, 6], anchorX: 'right', anchorY: 'bottom' }
  });
  const C = board.create('point', [5, 0], {
    name: 'C', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [10, 6], anchorX: 'left', anchorY: 'bottom' }
  });

  const triangle = board.create('polygon', [A, B, C], {
    borders: { strokeColor: TRI, strokeWidth: 2, highlight: false },
    fillColor: 'none', highlight: false, vertices: { visible: false }
  });
  const lineBC = board.create('line', [B, C], { visible: false });

  // --- Step 1: dashed extensions of AB beyond B and AC beyond C ------------
  const extAB = board.create('line', [A, B], { straightFirst: false, straightLast: true, strokeColor: EXT, strokeWidth: 1.4, dash: 2, highlight: false });
  const extAC = board.create('line', [A, C], { straightFirst: false, straightLast: true, strokeColor: EXT, strokeWidth: 1.4, dash: 2, highlight: false });

  // --- Excenter opposite A (external bisectors at B and C meet here) --------
  const sides = () => ({ a: B.Dist(C), b: C.Dist(A), c: A.Dist(B) });
  const exX = () => { const { a, b, c } = sides(); return (-a * A.X() + b * B.X() + c * C.X()) / (-a + b + c); };
  const exY = () => { const { a, b, c } = sides(); return (-a * A.Y() + b * B.Y() + c * C.Y()) / (-a + b + c); };
  const Ja = board.create('point', [exX, exY], {
    name: 'J_a', size: 4, strokeColor: CENTRE, fillColor: CENTRE,
    label: { offset: [10, 0], anchorX: 'left', anchorY: 'middle' }
  });

  // --- Steps 2 & 3: the two external bisectors (rays B–J_a and C–J_a) -------
  const bisB = board.create('segment', [B, Ja], { strokeColor: BIS, strokeWidth: 1.8, highlight: false });
  const bisC = board.create('segment', [C, Ja], { strokeColor: BIS, strokeWidth: 1.8, highlight: false });

  // --- Step 4: perpendicular from J_a to BC, foot X, exradius r_a ----------
  const X = board.create('orthogonalprojection', [Ja, lineBC], {
    name: 'X', size: 3, strokeColor: RAD, fillColor: '#fff',
    label: { offset: [0, -12], anchorX: 'middle', anchorY: 'top' }
  });
  const radSeg = board.create('segment', [Ja, X], { strokeColor: RAD, strokeWidth: 1.8, highlight: false });
  const rtX = board.create('angle', [Ja, X, B], { type: 'square', radius: 0.32, strokeColor: RAD, fillColor: RAD, fillOpacity: 0.18, name: '', highlight: false });
  const raLabel = board.create('text', [() => (Ja.X() + X.X()) / 2 + 0.15, () => (Ja.Y() + X.Y()) / 2, '\\(r_a\\)'], { fontSize: 15, strokeColor: RAD, anchorX: 'left', anchorY: 'middle', highlight: false });

  // --- Step 5: the excircle -------------------------------------------------
  const excircle = board.create('circle', [Ja, X], { strokeColor: CIRC, strokeWidth: 2.4, fillColor: 'none', highlight: false });

  // ===== STEP VISIBILITY ====================================================
  const staged = [
    { o: extAB, from: 1 }, { o: extAC, from: 1 },
    { o: bisB, from: 2 },
    { o: bisC, from: 3 }, { o: Ja, from: 3 },
    { o: radSeg, from: 4 }, { o: X, from: 4 }, { o: rtX, from: 4 }, { o: raLabel, from: 4 },
    { o: excircle, from: 5 }
  ];

  const CAPTIONS = [
    'Step 1 of 5 — Draw the triangle ABC, and extend side AB beyond B and side AC beyond C (dashed rays).',
    'Step 2 of 5 — Bisect the exterior angle at B and draw the bisector as a ray from B.',
    'Step 3 of 5 — Bisect the exterior angle at C in the same way. The two external bisectors meet at the excenter J_a.',
    'Step 4 of 5 — Drop a perpendicular from J_a to side BC. The foot is X, and J_aX is the exradius r_a.',
    'Step 5 of 5 — Draw the circle centre J_a, radius r_a: the excircle opposite A, tangent to BC and to the extensions of AB and AC.'
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
  function excircleBack() { if (step > 1) { step--; render(); } }
  function excircleNext() { if (step < TOTAL_STEPS) { step++; render(); } }
  window.excircleBack = excircleBack;
  window.excircleNext = excircleNext;

  render();
})();
