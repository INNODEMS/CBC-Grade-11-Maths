/*
 * excircles-right-triangle.js
 * Converted from the tkz-euclide "all three excircles of the 3-4-5 right triangle"
 * figure (fig-excircle-ex2). Expects a div with id="jxgbox".
 *
 * The figure is a CONSTRUCTION, not a tracing: set the two legs (la = side a = BC,
 * lb = side b = CA) and the right angle at C; the hypotenuse, the three excentres
 * J_a/J_b/J_c, their radii and the bounding box are all derived. Change LA / LB to
 * redraw any right triangle (defaults reproduce the 3-4-5 original).
 *
 * Note: the excircle radii are deliberately NOT labelled (this figure also backs a
 * STACK question that asks the student to find them).
 */
(function () {
  var LA = 3;   // side a = BC, opposite A  (horizontal leg)
  var LB = 4;   // side b = CA, opposite B  (vertical leg)

  var la = LA, lb = LB;
  var lc = Math.sqrt(la * la + lb * lb);          // hypotenuse c = AB
  var Ax = 0, Ay = lb, Bx = la, By = 0, Cx = 0, Cy = 0;   // right angle at C

  // Excentre opposite a vertex = weighted average of vertices, opposite side negated.
  function exc(wA, wB, wC) {
    var d = wA + wB + wC;
    return [(wA * Ax + wB * Bx + wC * Cx) / d, (wA * Ay + wB * By + wC * Cy) / d];
  }
  var JA = exc(-la, lb, lc);   // opposite A, tangent to side a (BC)
  var JB = exc(la, -lb, lc);   // opposite B, tangent to side b (CA)
  var JC = exc(la, lb, -lc);   // opposite C, tangent to hypotenuse c (AB)
  var rA = Math.abs(JA[1]);    // distance from JA to line BC (the x-axis)
  var rB = Math.abs(JB[0]);    // distance from JB to line CA (the y-axis)
  var rC = Math.abs((Bx - Ax) * (Ay - JC[1]) - (Ax - JC[0]) * (By - Ay)) / lc;

  // Bounding box from every circle extent + the vertices, padded ~10%.
  var xs = [Cx, Bx, Ax, JA[0] - rA, JA[0] + rA, JB[0] - rB, JB[0] + rB, JC[0] - rC, JC[0] + rC];
  var ys = [Cy, By, Ay, JA[1] - rA, JA[1] + rA, JB[1] - rB, JB[1] + rB, JC[1] - rC, JC[1] + rC];
  var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
  var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
  var pX = 0.1 * (xmax - xmin), pY = 0.1 * (ymax - ymin);

  var board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [xmin - pX, ymax + pY, xmax + pX, ymin - pY],
    keepaspectratio: true, axis: false, showCopyright: false, showNavigation: false
  });

  // --- vertices & triangle ---
  var A = board.create('point', [Ax, Ay], { fixed: true, highlight: false, name: 'A', size: 2, label: { offset: [-12, 4] } });
  var B = board.create('point', [Bx, By], { fixed: true, highlight: false, name: 'B', size: 2, label: { offset: [10, -8] } });
  var C = board.create('point', [Cx, Cy], { fixed: true, highlight: false, name: 'C', size: 2, label: { offset: [-12, -10] } });
  board.create('polygon', [A, B, C], {
    fixed: true, highlight: false, fillOpacity: 0,
    borders: { strokeColor: '#222', strokeWidth: 2, highlight: false, fixed: true },
    vertices: { visible: false }
  });
  board.create('angle', [A, C, B], { type: 'square', radius: Math.min(la, lb) * 0.18, fixed: true, highlight: false });

  // --- dashed side extensions (external tangency reads clearly) ---
  var ext = { straightFirst: true, straightLast: true, dash: 2, strokeColor: '#999', strokeWidth: 1, fixed: true, highlight: false };
  board.create('line', [B, C], ext);
  board.create('line', [C, A], ext);
  board.create('line', [A, B], ext);

  // --- the three excircles + their centres ---
  var co = { strokeColor: '#1565c0', strokeWidth: 1.5, fillColor: 'none', fixed: true, highlight: false };
  board.create('circle', [JA, rA], co);
  board.create('circle', [JB, rB], co);
  board.create('circle', [JC, rC], co);
  board.create('point', JA, { fixed: true, highlight: false, name: 'J_a', size: 1, strokeColor: '#1565c0', fillColor: '#1565c0', label: { offset: [-6, -10] } });
  board.create('point', JB, { fixed: true, highlight: false, name: 'J_b', size: 1, strokeColor: '#1565c0', fillColor: '#1565c0', label: { offset: [-8, 0] } });
  board.create('point', JC, { fixed: true, highlight: false, name: 'J_c', size: 1, strokeColor: '#1565c0', fillColor: '#1565c0', label: { offset: [8, 0] } });

  // --- side-length labels ---
  var sl = { fixed: true, highlight: false, fontSize: 15, anchorX: 'middle', anchorY: 'middle' };
  board.create('text', [(Bx + Cx) / 2, (By + Cy) / 2 - 0.06 * (ymax - ymin), 'a = ' + la], sl);
  board.create('text', [(Ax + Cx) / 2 - 0.06 * (xmax - xmin), (Ay + Cy) / 2, 'b = ' + lb], sl);
  board.create('text', [(Ax + Bx) / 2 + 0.04 * (xmax - xmin), (Ay + By) / 2, 'c = ' + lc], sl);
})();
