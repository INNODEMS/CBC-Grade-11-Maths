/* ============================================================================
 * Constructing the Inscribed Circle of a Triangle — stepped animation
 * ----------------------------------------------------------------------------
 * Six steps revealed one at a time with "Back" / "Next" buttons, mirroring the
 * compass-and-straightedge construction in the section figures.
 *
 * Interactivity: A, B and C are FREE, draggable base points. The arc points P, Q
 * on the sides of angle A, the angle bisectors, the incentre I, the foot X of the
 * perpendicular to BC, the inradius and the inscribed circle are all DERIVED and
 * recompute live as you drag.
 *
 * Method: the incentre is equidistant from all three sides, so it lies on every
 * angle bisector. Bisect angles A and B; they meet at the incentre I. The distance
 * from I to any side is the inradius r, and the circle centre I radius r touches
 * all three sides.
 *
 * Expects a surface="jsxboard" slate id="box_incircle", an html caption element
 * id="caption_incircle", and Back/Next inputs (back_incircle / next_incircle)
 * wired to the globals incircleBack() / incircleNext().
 * ==========================================================================*/

(function () {
  'use strict';

  JXG.Options.text.useMathJax = true;

  const BOX_ID = 'box_incircle';
  const CAPTION_ID = 'caption_incircle';
  const BACK_ID = 'back_incircle';
  const NEXT_ID = 'next_incircle';
  const TOTAL_STEPS = 6;

  const TRI = '#333', RED = '#d32f2f', BIS = '#7b1fa2';
  const FREE = '#1565c0', CENTRE = '#000', CIRC = '#0d8e8e', SCAFF = '#9e9e9e';

  const board = JXG.JSXGraph.initBoard(BOX_ID, {
    boundingbox: [-1.7, 5.3, 6.9, -2.8],
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
  const C = board.create('point', [5, -1], {
    name: 'C', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [10, -8], anchorX: 'left', anchorY: 'top' }
  });

  const triangle = board.create('polygon', [A, B, C], {
    borders: { strokeColor: TRI, strokeWidth: 2, highlight: false },
    fillColor: 'none', highlight: false, vertices: { visible: false }
  });
  const lineBC = board.create('line', [B, C], { visible: false });

  // --- incentre (equidistant from the three sides) -------------------------
  // I = (a·A + b·B + c·C)/(a+b+c), with a=|BC|, b=|CA|, c=|AB|.
  const sides = () => ({ a: B.Dist(C), b: C.Dist(A), c: A.Dist(B) });
  const incX = () => { const { a, b, c } = sides(); return (a * A.X() + b * B.X() + c * C.X()) / (a + b + c); };
  const incY = () => { const { a, b, c } = sides(); return (a * A.Y() + b * B.Y() + c * C.Y()) / (a + b + c); };
  const I = board.create('point', [incX, incY], {
    name: 'I', size: 4, strokeColor: CENTRE, fillColor: CENTRE,
    label: { offset: [9, 4], anchorX: 'left', anchorY: 'middle' }
  });

  // --- Step 2: arc from A crossing AB at P and AC at Q ----------------------
  const rho = () => 0.36 * Math.min(A.Dist(B), A.Dist(C));
  const Ppt = board.create('point', [
    () => A.X() + rho() * (B.X() - A.X()) / A.Dist(B),
    () => A.Y() + rho() * (B.Y() - A.Y()) / A.Dist(B)
  ], { name: 'P', size: 3, strokeColor: RED, fillColor: '#fff', label: { offset: [-10, 0], anchorX: 'right', anchorY: 'middle' } });
  const Qpt = board.create('point', [
    () => A.X() + rho() * (C.X() - A.X()) / A.Dist(C),
    () => A.Y() + rho() * (C.Y() - A.Y()) / A.Dist(C)
  ], { name: 'Q', size: 3, strokeColor: RED, fillColor: '#fff', label: { offset: [10, 0], anchorX: 'left', anchorY: 'middle' } });
  const arcA = board.create('arc', [A, Ppt, Qpt], { strokeColor: RED, strokeWidth: 1.3, dash: 2, highlight: false });

  // --- Step 3: crossing arcs from P and Q meet at D; ray A–D bisects angle A.
  // D = P + Q - A (rhombus APDQ) lies on the bisector of angle A.
  const D = board.create('point', [() => Ppt.X() + Qpt.X() - A.X(), () => Ppt.Y() + Qpt.Y() - A.Y()], { visible: false, name: '' });
  const arcP = board.create('arc', [Ppt, D, A], { strokeColor: RED, strokeWidth: 1.1, dash: 2, highlight: false });
  const arcQ = board.create('arc', [Qpt, A, D], { strokeColor: RED, strokeWidth: 1.1, dash: 2, highlight: false });
  const bisA = board.create('line', [A, I], { visible: false });
  const M_A = board.create('intersection', [bisA, lineBC, 0], { name: '', size: 2, strokeColor: SCAFF, fillColor: SCAFF, withLabel: false, visible: false});
  const rayA = board.create('segment', [A, M_A], { strokeColor: BIS, strokeWidth: 1.6, dash: 1, highlight: false });

  // --- Step 4: bisector from B; meets bisector of A at the incentre I -------
  const M_B = board.create('intersection', [board.create('line', [B, I], { visible: false }), board.create('line', [A, C], { visible: false }), 0], { visible: false, name: '' });
  const rayB = board.create('segment', [B, M_B], { strokeColor: BIS, strokeWidth: 1.6, dash: 1, highlight: false });

  // --- Step 5: perpendicular from I to BC, foot X, inradius r --------------
  const X = board.create('orthogonalprojection', [I, lineBC], {
    name: 'X', size: 3, strokeColor: CIRC, fillColor: '#fff',
    label: { offset: [4, -12], anchorX: 'left', anchorY: 'top' }
  });
  const perpIX = board.create('segment', [I, X], { strokeColor: '#777', strokeWidth: 1.4, dash: 2, highlight: false });
  const rtX = board.create('angle', [I, X, B], { type: 'square', radius: 0.3, strokeColor: '#777', fillColor: '#777', fillOpacity: 0.18, name: '', highlight: false, label: { visible: false } });
  const rLabel = board.create('text', [() => (I.X() + X.X()) / 2 + 0.12, () => (I.Y() + X.Y()) / 2, '\\(r\\)'], { fontSize: 15, strokeColor: CIRC, anchorX: 'left', anchorY: 'middle', highlight: false });

  // --- Step 6: the inscribed circle ----------------------------------------
  const incircle = board.create('circle', [I, X], { strokeColor: CIRC, strokeWidth: 2.4, fillColor: 'none', highlight: false });

  // ===== STEP VISIBILITY ====================================================
  const staged = [
    { o: Ppt, from: 2 }, { o: Qpt, from: 2 }, { o: arcA, from: 2 },
    { o: arcP, only: 3 }, { o: arcQ, only: 3 }, { o: rayA, from: 3 },
    { o: rayB, from: 4 }, { o: I, from: 4 },
    { o: perpIX, from: 5 }, { o: X, from: 5 }, { o: rtX, from: 5 }, { o: rLabel, from: 5 },
    { o: incircle, from: 6 }
  ];

  const CAPTIONS = [
    'Step 1 of 6 — Draw the triangle ABC.',
    'Step 2 of 6 — With the compass point at A, draw an arc crossing side AB at P and side AC at Q.',
    'Step 3 of 6 — Keeping the same width, draw crossing arcs from P and Q, marking their intersection. Connect A to the intersection.',
    'Step 4 of 6 — Repeat for angle B. The two bisectors meet at the incentre I.',
    'Step 5 of 6 — Drop a perpendicular from I to side BC. The foot is X, and IX is the inradius r.',
    'Step 6 of 6 — Draw the circle centre I, radius r = IX: the inscribed circle, tangent to all three sides.'
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
  function incircleBack() { if (step > 1) { step--; render(); } }
  function incircleNext() { if (step < TOTAL_STEPS) { step++; render(); } }
  window.incircleBack = incircleBack;
  window.incircleNext = incircleNext;

  render();
})();
