/* ============================================================================
 * Alternate Segment Theorem — proof figure (interactive)
 * ----------------------------------------------------------------------------
 * The angle between the tangent PT and the chord TQ equals the angle that TQ
 * subtends in the alternate segment (at M and at S). All three shaded angles
 * are α.
 *
 * Interactivity: T, Q and S are draggable gliders on a FIXED-radius circle.
 * M is DERIVED — the point of the circle diametrically opposite T (so TM is a
 * diameter and angle TQM is a right angle, the key step in the proof). The
 * tangent, chords, right angle and all three α-angles recompute automatically.
 *
 * Expects a container div with id="jxgbox".
 * ==========================================================================*/

(function () {
  'use strict';

  JXG.Options.text.useMathJax = true;

  const R = 2.5;                 // fixed circle radius
  const FREE = '#1565c0';        // draggable points
  const DERIVED = '#444';        // derived points
  const CHORD = '#222';
  const DIAM = '#999';           // dashed diameter lines
  const FILL = '#3a6fd6';        // α sector fill (blue!20-ish)

  const board = JXG.JSXGraph.initBoard('jsx-ast', {
    boundingbox: [-3.7, 3.4, 4.0, -3.7],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { wheel: false }
  });

  // ---- Centre and fixed circle --------------------------------------------
  const O = board.create('point', [0, 0], {
    name: 'O', size: 2, fixed: true, strokeColor: '#000', fillColor: '#000',
    label: { offset: [10, 0], anchorX: 'left', anchorY: 'middle' }
  });
  const circle = board.create('circle', [O, R], {
    strokeColor: '#0d8e8e', strokeWidth: 2, fillColor: 'none',
    fixed: true, highlight: false
  });

  // ---- Three draggable points on the circle (gliders) ----------------------
  const deg = d => [R * Math.cos(d * Math.PI / 180), R * Math.sin(d * Math.PI / 180)];

  const T = board.create('glider', [...deg(270), circle], {
    name: 'T', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [0, -12], anchorX: 'middle', anchorY: 'top' }
  });
  const Q = board.create('glider', [...deg(10), circle], {
    name: 'Q', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [12, 0], anchorX: 'left', anchorY: 'middle' }
  });
  const S = board.create('glider', [...deg(155), circle], {
    name: 'S', size: 4, strokeColor: FREE, fillColor: FREE,
    label: { offset: [-12, 0], anchorX: 'right', anchorY: 'middle' }
  });

  // ---- M = point diametrically opposite T (derived) ------------------------
  // Reflecting T through the centre O lands on the circle (|OM| = |OT| = R).
  const M = board.create('mirrorelement', [T, O], {
    name: 'M', size: 3, strokeColor: DERIVED, fillColor: '#fff',
    label: { offset: [0, 12], anchorX: 'middle', anchorY: 'bottom' }
  });

  // ---- Tangent at T, and a point P on it toward the chord side -------------
  const tangent = board.create('tangent', [T], {
    strokeColor: '#333', strokeWidth: 2, highlight: false
  });
  // Unit tangent direction at T, oriented toward Q so that angle PTQ is the
  // tangent–chord angle on the chord's side.
  function tdir() {
    let ux = -(T.Y() - O.Y()), uy = (T.X() - O.X());
    const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L;
    if (ux * (Q.X() - T.X()) + uy * (Q.Y() - T.Y()) < 0) { ux = -ux; uy = -uy; }
    return [ux, uy];
  }
  const P = board.create('point', [
    () => T.X() + 2.4 * tdir()[0],
    () => T.Y() + 2.4 * tdir()[1]
  ], {
    name: 'P', size: 1, strokeColor: '#333', fillColor: '#333',
    label: { offset: [8, -10], anchorX: 'left', anchorY: 'top' }
  });

  // ---- Chords and the dashed diameter pieces -------------------------------
  board.create('segment', [T, Q], { strokeColor: CHORD, strokeWidth: 1.6, highlight: false });
  board.create('segment', [T, S], { strokeColor: CHORD, strokeWidth: 1.6, highlight: false });
  board.create('segment', [S, Q], { strokeColor: CHORD, strokeWidth: 1.6, highlight: false });
  board.create('segment', [T, M], { strokeColor: DIAM, strokeWidth: 1.4, dash: 2, highlight: false });
  board.create('segment', [Q, M], { strokeColor: DIAM, strokeWidth: 1.4, dash: 2, highlight: false });

  // ---- Right angle at Q (angle in a semicircle) ----------------------------
  board.create('angle', [M, Q, T], {
    type: 'square', radius: 0.32,
    strokeColor: DERIVED, fillColor: DERIVED, fillOpacity: 0.18,
    name: '', highlight: false, label: { visible: false }
  });

  // ---- The three equal angles α --------------------------------------------
  function alpha(A, V, B) {
    return board.create('angle', [A, V, B], {
      type: 'sector', selection: 'minor', radius: 0.6,
      strokeColor: FILL, strokeWidth: 1.4,
      fillColor: FILL, fillOpacity: 0.3,
      name: '\\(\\alpha\\)', withLabel: true,
      label: { fontSize: 16, strokeColor: FILL }, highlight: false
    });
  }
  alpha(P, T, Q);   // tangent–chord angle
  alpha(T, M, Q);   // alternate segment, at M
  alpha(T, S, Q);   // alternate segment, at S

  // bring draggable points to front
  [T, Q, S].forEach(p => p.toFront && p.toFront());
})();