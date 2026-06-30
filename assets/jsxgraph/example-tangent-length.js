/*
 * Worked example: tangent length between two circles.
 * Converted from the tkz-euclide figure in the circles/chords/tangents chapter.
 *
 * Construction recipe (preserved from the tkz source):
 *   A, B          free base points (draggable)            A=(0,0), B=(17,0)
 *   circle(A,r)   small circle, r = 3
 *   circle(B,R)   large circle, R = 5
 *   I             midpoint(A,B)                            -> Thales circle on AB
 *   Q             intersection of circle(I,through B) and circle(B, r+R)
 *   Tp            where line QB meets circle(B,R), near Q  -> contact point on B
 *   tangent       perpendicular to radius B-Tp at Tp
 *   T             foot of perpendicular from A onto the tangent  -> contact on A
 *   M             line(through A, parallel to T-Tp) meets line(B,Tp)
 *
 * Interactivity model: A and B are draggable; everything downstream recomputes.
 * The radii r and R are kept as constants here (promote to sliders if desired).
 * Distance and tangent-length labels are DYNAMIC so they stay honest under drag.
 */

JXG.Options.text.useMathJax = true;

// Bounding box framed around A=(0,0)..B=(17,0) with the figure rising to y~7, plus margin.
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-3, 10, 20, -6],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// --- PARAMETERS ---
const r = 3;   // radius of circle A
const R = 5;   // radius of circle B

// --- FREE BASE POINTS (draggable) ---
const A = board.create('point', [0, 0], {
    name: 'A', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: { offset: [-14, -10] }
});
const B = board.create('point', [17, 0], {
    name: 'B', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0',
    label: { offset: [10, -10] }
});

// --- CONSTRUCTION (derived; tracks A, B) ---
const cA = board.create('circle', [A, r], { strokeWidth: 1, strokeColor: 'gray', fillColor: 'none' });
const cB = board.create('circle', [B, R], { strokeWidth: 1, strokeColor: 'gray', fillColor: 'none' });

// Helper circles for the tangent-point construction (not drawn).
const cBsum = board.create('circle', [B, r + R], { visible: false });
const I     = board.create('midpoint', [A, B], { visible: false });
const cI    = board.create('circle', [I, B], { visible: false });   // Thales circle on AB

// Q = upper intersection of cI and cBsum.
// Index VERIFIED (1) against the initial coordinates: index 1 = upper branch
// Q ~ (13.24, 7.06); index 0 gives the lower branch and breaks the figure.
const Q = board.create('intersection', [cI, cBsum, 1], { visible: false });

// Tp = contact point of the tangent on circle B: line QB meets cB, nearest to Q.
// Index VERIFIED (1): Tp ~ (14.65, 4.41), giving AT = r = 3 and tangent length L = 15.
const lineQB = board.create('line', [Q, B], { visible: false });
const Tp = board.create('intersection', [cB, lineQB, 1], {
    name: "T'", size: 3, strokeColor: '#222', fillColor: '#222',
    label: { offset: [10, -10] }
});

// Tangent at Tp = perpendicular to radius B-Tp, through Tp.
const radiusBTp = board.create('line', [B, Tp], { visible: false });
const tangent   = board.create('perpendicular', [radiusBTp, Tp], { visible: false });

// T = foot of perpendicular from A onto the tangent (contact point on circle A).
const T = board.create('orthogonalprojection', [A, tangent], {
    name: 'T', size: 3, strokeColor: '#222', fillColor: '#222',
    label: { offset: [-14, 8] }
});

// M = line through A parallel to T-Tp, meeting line B-Tp.
const lineTTp = board.create('line', [T, Tp], { visible: false });
const parA    = board.create('parallel', [lineTTp, A], { visible: false });
const lineBTp = board.create('line', [B, Tp], { visible: false });
const M = board.create('intersection', [parA, lineBTp], {
    name: 'M', size: 3, strokeColor: '#222', fillColor: '#222',
    label: { offset: [10, 8] }
});

// --- DRAWING ---
board.create('segment', [A, B], { strokeWidth: 1, strokeColor: 'gray', dash: 2 });
board.create('segment', [A, T], { strokeWidth: 1, strokeColor: '#333' });
board.create('segment', [B, M], { strokeWidth: 1, strokeColor: '#333' });
board.create('segment', [T, Tp], { strokeWidth: 3, strokeColor: '#000' });   // the tangent length
board.create('segment', [A, M], { strokeWidth: 1, strokeColor: '#333', dash: 2 });

// --- MARKS ---
board.create('angle', [A, M, B], { type: 'square', radius: 0.8, fillColor: '#999', fillOpacity: 0.4 });
board.create('angle', [Tp, T, A], { type: 'square', radius: 0.6, fillColor: '#999', fillOpacity: 0.4 });
board.create('angle', [T, Tp, B], { type: 'square', radius: 0.6, fillColor: '#999', fillOpacity: 0.4 });

// --- DYNAMIC LABELS (stay correct while dragging A or B) ---
function midText(P, Qd, text, offset) {
    return board.create('text', [
        () => (P.X() + Qd.X()) / 2,
        () => (P.Y() + Qd.Y()) / 2,
        text
    ], { anchorX: 'middle', anchorY: 'middle', offset: offset, fontSize: 13 });
}

midText(A, B, () => '\\(d = ' + A.Dist(B).toFixed(1) + '\\) cm', [0, -14]);
midText(T, Tp, () => '\\(L = ' + T.Dist(Tp).toFixed(1) + '\\) cm', [8, 8]);
midText(A, T, '\\(r = 3\\)', [-12, 0]);
midText(B, Tp, '\\(R = 5\\)', [12, 0]);
midText(Tp, M, '\\(r = 3\\)', [12, 0]);
