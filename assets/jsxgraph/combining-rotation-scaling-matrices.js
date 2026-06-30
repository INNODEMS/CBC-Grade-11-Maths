// =====================================================================
// Matrix multiplication as combined transformations — the cat demo.
//
//   A cat image sits centred on the origin. Two families of sliders set
//     R = [[cos t, -sin t],[sin t, cos t]]   (rotation by t degrees)
//     S = [[s_x, 0],[0, s_y]]                 (stretch by s_x, s_y)
//
//   Five handlers (exported for PreTeXt / preview buttons) left-multiply
//   the cat's current matrix M and animate the change:
//     applyRotation()     ->  M := R · M           (just turn the cat)
//     applyScaling()      ->  M := S · M           (just stretch the cat)
//     rotateThenScale()   ->  rotate, then stretch ->  M := (S R) · M
//     scaleThenRotate()   ->  stretch, then rotate ->  M := (R S) · M
//     resetTransform()    ->  M := I               (back to the start)
//
//   The point of the figure (Multiplying Matrices II): doing one
//   transformation after another is the SAME as multiplying their
//   matrices, and the single product matrix does the whole job in one
//   step. Because S is a NON-uniform stretch (s_x != s_y), the two orders
//   give different pictures and different products:  S R  !=  R S.
//   Both products are shown live on the right so students can compare.
//
// House-style notes (mirrors det.js / inverse-rotation-scaling):
//   * Everything is wrapped in an IIFE so the many top-level names cannot
//     clash with other JSXGraph figures sharing the page.
//   * The button handlers are exported on `window` so a PreTeXt slate can
//     call them via inline onclick="rotateThenScale();" etc.
//   * The cat image path is the single constant IMG_URL below.
// =====================================================================

(function () {
'use strict';

// ---------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------
// Served path to the cat image. In the PreTeXt build the interactive runs in
// an iframe at the output root and assets are copied to external/, so the cat
// (which lives in the project at assets/images/) resolves here. The preview
// folder mirrors this same external/images/ path so one constant works for both.
const IMG_URL = 'external/images/Cat_November_2010-1a.jpg';
const FONT_SCALE = 0.8;
const FS = (px) => Math.round(px * FONT_SCALE);
const ANIM_STEP = 900;         // ms per single rotation/scaling step
const IMG_W = 3.6 * 1.2;       // cat width  in board units
const IMG_H = 4.8 * 1.2;       // cat height in board units (~ portrait ratio)

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = FS(16);
JXG.Options.label.autoPosition = false;

const board = JXG.JSXGraph.initBoard('jsx-combine-rot-scale', {
    boundingbox: [-10.5, 9.2, 10.5, -5],   // [left, top, right, bottom] ~3:2
    keepaspectratio: true,
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

// ---------------------------------------------------------------------
// 2x2 matrix helpers (plain arrays [[a,b],[c,d]])
// ---------------------------------------------------------------------
const I2 = [[1, 0], [0, 1]];

function matMul(P, Q) {
    return [
        [P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]],
        [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]]
    ];
}
function lerpMat(P, Q, u) {
    return [
        [P[0][0] + (Q[0][0] - P[0][0]) * u, P[0][1] + (Q[0][1] - P[0][1]) * u],
        [P[1][0] + (Q[1][0] - P[1][0]) * u, P[1][1] + (Q[1][1] - P[1][1]) * u]
    ];
}
function rotMat(deg) {
    const r = deg * Math.PI / 180;
    return [[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]];
}
function scaleMat(sx, sy) {
    return [[sx, 0], [0, sy]];
}
function fmt(x) {
    const n = Math.abs(x) < 1e-9 ? 0 : x;
    return n.toFixed(2);
}
// A 2x2 matrix as a MathJax pmatrix body (no delimiters/name).
function pmat(M) {
    return '\\begin{pmatrix}' + fmt(M[0][0]) + ' & ' + fmt(M[0][1])
        + '\\\\ ' + fmt(M[1][0]) + ' & ' + fmt(M[1][1]) + '\\end{pmatrix}';
}

// ---------------------------------------------------------------------
// Sliders: rotation angle (degrees) and the two stretch factors.
// ---------------------------------------------------------------------
// Sliders stack in the top-left corner: rotation angle, x-stretch, y-stretch.
// Independent s_x and s_y mean S is not a multiple of the identity, so in
// general R S != S R — the order in which the cat is transformed matters.
const thetaSlider = board.create('slider', [[-10, 8], [-5, 8], [-180, 90, 180]], {
    name: '\\(\\theta\\,(^\\circ)\\)',
    snapWidth: 5,
    size: 5,
    fillColor: '#1565c0',
    strokeColor: '#1565c0',
    label: { fontSize: FS(18), strokeColor: '#1565c0' }
});
const sxSlider = board.create('slider', [[-10, 6.9], [-5, 6.9], [0.25, 1.5, 2]], {
    name: '\\(s_x\\)',
    snapWidth: 0.05,
    size: 5,
    fillColor: '#c62828',
    strokeColor: '#c62828',
    label: { fontSize: FS(18), strokeColor: '#c62828' }
});
const sySlider = board.create('slider', [[-10, 5.8], [-5, 5.8], [0.25, 0.8, 2]], {
    name: '\\(s_y\\)',
    snapWidth: 0.05,
    size: 5,
    fillColor: '#c62828',
    strokeColor: '#c62828',
    label: { fontSize: FS(18), strokeColor: '#c62828' }
});

const theta = () => thetaSlider.Value();
const sclX = () => sxSlider.Value();
const sclY = () => sySlider.Value();

// ---------------------------------------------------------------------
// Animation state. `M` is the cat's committed cumulative matrix; during an
// animation `frame(u)` supplies the matrix shown at progress u in [0,1].
// ---------------------------------------------------------------------
const state = {
    M: I2,
    M0: I2,            // M at the moment the current animation started
    frame: null,       // u -> 2x2 matrix
    u: 0,
    animating: false
};

function liveMatrix() {
    return state.animating ? state.frame(state.u) : state.M;
}

// ---------------------------------------------------------------------
// The cat image, transformed by the live matrix about the origin.
// A 'generic' transform takes the 3x3 homogeneous matrix acting on
// [1, x, y]; for a pure linear map [[a,b],[c,d]] about O that is
//   [[1,0,0],
//    [0,a,b],
//    [0,c,d]].
// Each of the nine parameters may be a function, so the transform
// re-evaluates against liveMatrix() on every board update.
// ---------------------------------------------------------------------
const tLive = board.create('transform', [
    () => 1, () => 0, () => 0,
    () => 0, () => liveMatrix()[0][0], () => liveMatrix()[0][1],
    () => 0, () => liveMatrix()[1][0], () => liveMatrix()[1][1]
], { type: 'generic' });

const cat = board.create('image', [IMG_URL, [-IMG_W / 2, -IMG_H / 2], [IMG_W, IMG_H]], {
    fixed: true,
    attractors: [],
    highlight: false,
    layer: 0           // keep below the white readout panels
});
tLive.bindTo(cat);

// A light frame around the cat (the image's bounding rectangle) so the
// deformation is visible even where the photo is pale, and so the
// transform has concrete points the verifier can report.
const baseCorners = [
    [-IMG_W / 2, -IMG_H / 2],
    [ IMG_W / 2, -IMG_H / 2],
    [ IMG_W / 2,  IMG_H / 2],
    [-IMG_W / 2,  IMG_H / 2]
].map((c) => board.create('point', c, { visible: false, fixed: true, name: '' }));

const frameCorners = baseCorners.map((bp, i) =>
    board.create('point', [bp, tLive], {
        visible: false, name: '', withLabel: false,
        id: 'corner' + i     // expose for the verifier
    })
);
board.create('polygon', frameCorners, {
    fillColor: 'none',
    borders: { strokeColor: '#1565c0', strokeWidth: 1.5, dash: 0 },
    vertices: { visible: false },
    highlight: false
});

// Origin marker (the centre of rotation / scaling).
board.create('point', [0, 0], {
    name: 'O', size: 2, fixed: true,
    strokeColor: '#222', fillColor: '#222',
    label: { offset: [6, -12], fontSize: FS(14) }
});

// ---------------------------------------------------------------------
// Semi-opaque white panels behind the sliders (top-left) and the matrix
// readouts (top-right), so both stay legible over the cat. Drawn above the
// image (layer 0) but below the text/sliders.
// ---------------------------------------------------------------------
function panel(x1, y1, x2, y2) {
    board.create('polygon', [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], {
        fillColor: '#ffffff', fillOpacity: 0.8,
        borders: { visible: false, strokeOpacity: 0 },
        vertices: { visible: false, fixed: true },
        fixed: true, highlight: false, hasInnerPoints: false, layer: 4
    });
}
panel(-10.2, 8.8, -1, 5.0);    // behind the three sliders
panel(0.5, 8.8, 13.4, 4.4);    // behind the 2x2 matrix grid

// ---------------------------------------------------------------------
// Readouts (top-right), 2x2 grid:   R    S
//                                   SR   RS
//   R is written symbolically in cos/sin so the link to the angle is clear;
//   S uses the independent x/y stretch factors. The bottom row shows the two
//   PRODUCTS, computed live: S R is "rotate, then stretch"; R S is "stretch,
//   then rotate". Seeing them side by side makes S R != R S concrete.
// ---------------------------------------------------------------------
const ang = () => theta().toFixed(0) + '^\\circ';
const COL_R = 0.1;     // left column
const COL_S = 6;     // right column
const ROW_TOP = 8;     // R / S
const ROW_BOT = 6.1;   // SR / RS (with an under-label, so a little higher)

board.create('text', [COL_R, ROW_TOP, () =>
    '\\(R=\\begin{pmatrix}\\cos ' + ang() + ' & -\\sin ' + ang()
    + '\\\\ \\sin ' + ang() + ' & \\cos ' + ang() + '\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(12), strokeColor: '#1565c0' });

board.create('text', [COL_S, ROW_TOP, () =>
    '\\(S=\\begin{pmatrix}' + fmt(sclX()) + ' & 0\\\\ 0 & ' + fmt(sclY()) + '\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(12), strokeColor: '#c62828' });

// Bottom-left: S R  (rotate first, then stretch).
board.create('text', [COL_R, ROW_BOT-0.2, () =>
    '\\(SR=' + pmat(matMul(scaleMat(sclX(), sclY()), rotMat(theta()))) + '\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(12), strokeColor: '#6a1b9a' });

// Bottom-right: R S  (stretch first, then rotate).
board.create('text', [COL_S, ROW_BOT-0.2, () =>
    '\\(RS=' + pmat(matMul(rotMat(theta()), scaleMat(sclX(), sclY()))) + '\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(12), strokeColor: '#00695c' });

// ---------------------------------------------------------------------
// Animation engine and the exported button handlers.
// ---------------------------------------------------------------------
const BUTTON_IDS = [
    'apply_rotation', 'apply_scaling',
    'rotate_then_scale', 'scale_then_rotate',
    'reset_transform'
];
function setButtonsDisabled(disabled) {
    BUTTON_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.disabled = disabled;
    });
}

function animate(frameFn, duration) {
    if (state.animating) return;
    state.M0 = state.M;
    state.frame = frameFn;
    state.u = 0;
    state.animating = true;
    setButtonsDisabled(true);

    const start = performance.now();
    function step(now) {
        const u = Math.min(1, (now - start) / duration);
        state.u = u;
        board.update();
        if (u < 1) {
            requestAnimationFrame(step);
        } else {
            state.u = 1;
            state.M = frameFn(1);
            state.animating = false;
            setButtonsDisabled(false);
            board.update();
        }
    }
    requestAnimationFrame(step);
}

// --- Single steps: left-multiply the committed matrix by R or S, sweeping
//     the operation's parameter from "nothing" to its full value so the
//     motion is a true rotation / stretch rather than a blend of entries.
function applyRotation() {
    const t = theta();
    animate((u) => matMul(rotMat(t * u), state.M0), ANIM_STEP);
}
function applyScaling() {
    const sx = sclX(), sy = sclY();
    animate((u) => matMul(scaleMat(1 + (sx - 1) * u, 1 + (sy - 1) * u), state.M0), ANIM_STEP);
}

// --- Combined steps: two phases in one press. The cat performs the first
//     transformation, then the second; the committed matrix ends at the
//     single product. This is the heart of the figure: a sequence of
//     transformations equals one matrix multiplication.
//
// Rotate THEN stretch:  S (R x) = (S R) x.  End matrix = S R · M0.
function rotateThenScale() {
    const t = theta(), sx = sclX(), sy = sclY();
    // Note: read state.M0 INSIDE the frame — animate() sets it to the committed
    // matrix when the run starts, so the intermediate must be derived from it.
    // Computing the intermediate up front captures a stale M0 and makes the cat
    // snap to a different spot at the u=0.5 hand-off between the two phases.
    animate((u) => {
        if (u <= 0.5) {
            const v = u / 0.5;
            return matMul(rotMat(t * v), state.M0);
        }
        const v = (u - 0.5) / 0.5;
        const afterRot = matMul(rotMat(t), state.M0);
        return matMul(scaleMat(1 + (sx - 1) * v, 1 + (sy - 1) * v), afterRot);
    }, 2 * ANIM_STEP);
}
// Stretch THEN rotate:  R (S x) = (R S) x.  End matrix = R S · M0.
function scaleThenRotate() {
    const t = theta(), sx = sclX(), sy = sclY();
    animate((u) => {
        if (u <= 0.5) {
            const v = u / 0.5;
            return matMul(scaleMat(1 + (sx - 1) * v, 1 + (sy - 1) * v), state.M0);
        }
        const v = (u - 0.5) / 0.5;
        const afterScl = matMul(scaleMat(sx, sy), state.M0);
        return matMul(rotMat(t * v), afterScl);
    }, 2 * ANIM_STEP);
}

function resetTransform() {
    animate((u) => lerpMat(state.M0, I2, u), ANIM_STEP);
}

// Exported so inline onclick handlers (preview + PreTeXt) can reach them.
window.applyRotation = applyRotation;
window.applyScaling = applyScaling;
window.rotateThenScale = rotateThenScale;
window.scaleThenRotate = scaleThenRotate;
window.resetTransform = resetTransform;

board.update();

// MathJax typesets asynchronously; refresh once it is ready so the matrix
// readouts are measured at their true size and do not "snap" on first use.
function refreshWhenMathJaxReady() {
    if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(() => board.update());
    } else {
        setTimeout(refreshWhenMathJaxReady, 100);
    }
}
refreshWhenMathJaxReady();

})();
