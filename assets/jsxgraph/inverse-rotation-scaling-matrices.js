// =====================================================================
// Inverse of a 2x2 matrix — rotation and scaling "undo" demonstration.
//
//   A cat image sits centred on the origin. Two sliders set
//     R = [[cos t, -sin t],[sin t, cos t]]   (rotation by t degrees)
//     S = [[s, 0],[0, s]]                     (uniform scaling by s)
//
//   Five handlers (exported for PreTeXt / preview buttons) left-multiply
//   the cat's current matrix M and animate the change:
//     applyRotation()        ->  M := R  · M       (turn the cat)
//     applyInverseRotation() ->  M := R⁻¹· M       (turn it back)
//     applyScaling()         ->  M := S  · M       (grow/shrink)
//     applyInverseScaling()  ->  M := S⁻¹· M       (undo the scaling)
//     resetTransform()       ->  M := I            (back to the start)
//
//   The point of the figure: applying a matrix and then its inverse
//   returns the cat exactly to where it started, because M⁻¹M = I.
//   The R/S matrices and their inverses are shown live on the right.
//
// House-style notes (mirrors det.js):
//   * Everything is wrapped in an IIFE so the many top-level names cannot
//     clash with other JSXGraph figures sharing the page.
//   * The button handlers are exported on `window` so a PreTeXt slate can
//     call them via inline onclick="applyRotation();" etc.
//   * The cat image path is the single constant IMG_URL below — set it to
//     wherever the published page serves the image from.
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
const ANIM_DURATION = 900;     // ms per apply/undo animation
const IMG_W = 3.6*1.2;             // cat width  in board units
const IMG_H = 4.8*1.2;             // cat height in board units (~ portrait ratio)

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = FS(16);
JXG.Options.label.autoPosition = false;

const board = JXG.JSXGraph.initBoard('jsx-inv-rot-scale', {
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

// ---------------------------------------------------------------------
// Sliders: rotation angle (degrees) and scale factor.
// ---------------------------------------------------------------------
// Sliders stack in the top-left corner: rotation angle, x-scale, y-scale.
// Independent sx and sy mean S is no longer a multiple of the identity, so
// in general RS != SR — the order of "apply" presses now matters.
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
const sySlider = board.create('slider', [[-10, 5.8], [-5, 5.8], [0.25, 1, 2]], {
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
// ---------------------------------------------------------------------
// A 'generic' transform wants nine parameters (row-major), each of which may
// be a function — so it re-evaluates against liveMatrix() on every update.
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
        // expose for the verifier
        id: 'corner' + i
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
panel(0.5, 8.8, 13.4, 5.0);    // behind the 2x2 matrix grid

// ---------------------------------------------------------------------
// Readouts (top-right), 2x2 grid:   R   S
//                                   R⁻¹ S⁻¹
//   R is written symbolically in cos/sin so the link to the angle is clear;
//   R⁻¹ is the same entries with the signs swapped (i.e. R(-θ)).
//   S uses the independent x/y factors; S⁻¹ shows their reciprocals.
// ---------------------------------------------------------------------
const ang = () => theta().toFixed(0) + '^\\circ';
const COL_R = 0.5;     // left column (rotation, blue)
const COL_S = 6.2;     // right column (scaling, red)
const ROW_TOP = 8;   // R / S
const ROW_BOT = 6;   // R⁻¹ / S⁻¹

board.create('text', [COL_R, ROW_TOP, () =>
    '\\(R=\\begin{pmatrix}\\cos ' + ang() + ' & -\\sin ' + ang()
    + '\\\\ \\sin ' + ang() + ' & \\cos ' + ang() + '\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(13), strokeColor: '#1565c0' });

board.create('text', [COL_R, ROW_BOT, () =>
    '\\(R^{-1}=\\begin{pmatrix}\\cos ' + ang() + ' & \\sin ' + ang()
    + '\\\\ -\\sin ' + ang() + ' & \\cos ' + ang() + '\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(13), strokeColor: '#1565c0' });

board.create('text', [COL_S, ROW_TOP-0.2, () =>
    '\\(S=\\begin{pmatrix}' + fmt(sclX()) + ' & 0\\\\ 0 & ' + fmt(sclY()) + '\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(13), strokeColor: '#c62828' });

board.create('text', [COL_S, ROW_BOT-0.2, () =>
    '\\(S^{-1}=\\begin{pmatrix}\\tfrac{1}{' + fmt(sclX()) + '} & 0\\\\ 0 & \\tfrac{1}{'
    + fmt(sclY()) + '}\\end{pmatrix}\\)'
], { anchorX: 'left', anchorY: 'middle', fontSize: FS(13), strokeColor: '#c62828' });

// ---------------------------------------------------------------------
// Animation engine and the exported button handlers.
// ---------------------------------------------------------------------
const BUTTON_IDS = [
    'apply_rotation', 'apply_inverse_rotation',
    'apply_scaling', 'apply_inverse_scaling',
    'reset_transform'
];
function setButtonsDisabled(disabled) {
    BUTTON_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.disabled = disabled;
    });
}

function animate(frameFn) {
    if (state.animating) return;
    state.M0 = state.M;
    state.frame = frameFn;
    state.u = 0;
    state.animating = true;
    setButtonsDisabled(true);

    const start = performance.now();
    function step(now) {
        const u = Math.min(1, (now - start) / ANIM_DURATION);
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

// Compose a fresh operation onto the committed matrix: show op(u)·M0,
// sweeping the operation's parameter from "nothing" to its full value so
// the motion is a true rotation / scaling rather than a blend of entries.
function applyRotation() {
    const t = theta();
    animate((u) => matMul(rotMat(t * u), state.M0));
}
function applyInverseRotation() {
    const t = theta();
    animate((u) => matMul(rotMat(-t * u), state.M0));
}
function applyScaling() {
    const sx = sclX(), sy = sclY();
    animate((u) => matMul(scaleMat(1 + (sx - 1) * u, 1 + (sy - 1) * u), state.M0));
}
function applyInverseScaling() {
    const ix = 1 / sclX(), iy = 1 / sclY();
    animate((u) => matMul(scaleMat(1 + (ix - 1) * u, 1 + (iy - 1) * u), state.M0));
}
function resetTransform() {
    animate((u) => lerpMat(state.M0, I2, u));
}

// Exported so inline onclick handlers (preview + PreTeXt) can reach them.
window.applyRotation = applyRotation;
window.applyInverseRotation = applyInverseRotation;
window.applyScaling = applyScaling;
window.applyInverseScaling = applyInverseScaling;
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
