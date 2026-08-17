// =====================================================================
// Determinant "proof without words":
//   A = [[a, b], [c, d]]  =>  Area(D) = ad - bc
//
// Left  diagram: the original dissection (Ax and Ay are draggable).
// Right diagram: the same pieces rearranged to reveal ad - bc.
//
// The Play button is wired the same way as the other figures in this book:
// the script lives inside an IIFE (so its many top-level names cannot clash
// with other JSXGraph figures on the same page) and the one handler the
// button needs is exported on `window`. The PreTeXt slate calls it via
//   <input id="animate_det" ... onclick="playAnimation();">
// =====================================================================

(function () {
'use strict';

// ---------------------------------------------------------------------
// Font sizes.  JSXGraph text is sized in fixed pixels and does NOT scale
// with the slate, so when this figure is embedded in PreTeXt (narrower
// than the standalone preview) the text would otherwise look oversized.
// Adjust FONT_SCALE alone to grow/shrink every label together.
// ---------------------------------------------------------------------
const FONT_SCALE = 1.2;
const FS = (px) => Math.round(px * FONT_SCALE);

const FONT = {
    point: FS(11),    // draggable point labels (Ax, Ay)
    title: FS(13),    // "Original dissection" / "Rearrangement"
    matrix: FS(12),   // the A = (...) readout
    measure: FS(10),  // a / b / c / d bracket labels
    reveal: FS(11),   // a / d guides revealed after the animation
    dLabel: FS(15),   // the big D in each parallelogram
    piece: FS(12),    // ac / bd region labels
    pieceSmall: FS(11), // bc region labels
    cue: FS(12),      // "Drag Ax and Ay..."
    formula: FS(12)   // the final Area(D) = ad - bc line
};

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = FONT.point;
JXG.Options.label.autoPosition = false;

const board = JXG.JSXGraph.initBoard('jsx-det', {
    boundingbox: [-0.8, 8.8, 18.8, -1.8],
    keepaspectratio: true,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false
});

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
const INK = '#111111';      // primary stroke / fill colour
const LX = 0.9;             // x-origin of the left diagram
const RX = 10.2;             // x-origin of the right diagram
const TICK = 0.13;          // half-length of a measure-line end tick
const ANIM_DURATION = 1800; // rearrangement animation, in ms

// ---------------------------------------------------------------------
// Animation state
// ---------------------------------------------------------------------
const state = {
    t: 0,            // animation progress, 0 -> 1
    animating: false,
    done: false      // true once the rearrangement has played
};

// The PreTeXt slate uses id "animate_det"; the standalone preview uses
// "playBtn".  Accept either, and tolerate the button being absent.
const playBtn = document.getElementById('animate_det')
    || document.getElementById('playBtn');

// An <input type="button"> shows its label via .value, a <button> via its
// text content -- set both so this works in PreTeXt and in the preview.
function setButton(label, disabled) {
    if (!playBtn) return;
    playBtn.disabled = disabled;
    playBtn.value = label;
    playBtn.textContent = label;
}

// ---------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------
function lerp(u, v, t) {
    return (1 - t) * u + t * v;
}

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

function fmt(x) {
    const n = Math.abs(x) < 1e-9 ? 0 : x;
    return n.toFixed(1);
}

const hiddenAttr = {
    visible: false,
    fixed: true,
    name: ''
};

function hiddenPoint(xFn, yFn) {
    return board.create('point', [xFn, yFn], hiddenAttr);
}

// ---------------------------------------------------------------------
// Draggable matrix points.  Ax = (a, c), Ay = (b, d).
// ---------------------------------------------------------------------
const draggableAttr = {
    size: 1,
    strokeColor: INK,
    fillColor: INK
};

const Ax = board.create('point', [LX + 3.7, 2.0], {
    ...draggableAttr,
    name: '\\(Ax\\)',
    label: { offset: [5, -5] }
});

const Ay = board.create('point', [LX + 2.4, 3.4], {
    ...draggableAttr,
    name: '\\(Ay\\)',
    label: { offset: [-24, 12] }
});

// Matrix entries and the overall rectangle dimensions, derived from the
// draggable points.  W = a + b (full width), H = c + d (full height).
const aVal = () => Ax.X() - LX;
const bVal = () => Ay.X() - LX;
const cVal = () => Ax.Y();
const dVal = () => Ay.Y();
const W = () => aVal() + bVal();
const H = () => cVal() + dVal();

// ---------------------------------------------------------------------
// Keep Ax and Ay inside a sensible region while dragging.
//
// The upper bounds also stop the parallelogram from growing tall/wide
// enough to collide with the title row above or the right margin.
//
// Setting the point's coordinates directly (then updating the board) is
// what makes the clamp hold: moveTo() schedules an async animation that
// fights the active drag, so the constraint never sticks.
// ---------------------------------------------------------------------
function setPoint(point, x, y) {
    point.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
    board.update();
}

function clampAx() {
    const minA = Math.max(LX + 1.0, Ay.X()); // keep a >= b
    const maxC = Math.min(2.6, Ay.Y());      // keep c <= d, cap height
    setPoint(Ax, clamp(Ax.X(), minA, LX + 4.0), clamp(Ax.Y(), 0.8, maxC));
}

function clampAy() {
    const maxB = Math.min(LX + 3.5, Ax.X()); // keep b <= a
    const minD = Math.max(0.8, Ax.Y());      // keep d >= c
    setPoint(Ay, clamp(Ay.X(), LX + 0.8, maxB), clamp(Ay.Y(), minD, 3.6));
}

Ax.on('drag', clampAx);
Ay.on('drag', clampAy);

// Enforce the constraints once on load too.
clampAx();
clampAy();

// ---------------------------------------------------------------------
// Fill styles
// ---------------------------------------------------------------------
function fillStyle(color, opacity = 0.9) {
    return {
        fillColor: color,
        highlightFillColor: color,
        fillOpacity: opacity,
        borders: { strokeOpacity: 0, strokeWidth: 0 },
        vertices: { visible: false }
    };
}

const orangeStyle = fillStyle('#efc090');
const redStyle = fillStyle('#e57373');
const blueStyle = fillStyle('#64b5f6');

const dStyle = {
    fillColor: '#ffffff',
    highlightFillColor: '#ffffff',
    fillOpacity: 1,
    borders: { strokeColor: INK, strokeWidth: 2 },
    vertices: { visible: false }
};

const outlineStyle = {
    fillColor: 'none',
    borders: { strokeColor: '#444444', strokeWidth: 2 },
    vertices: { visible: false }
};

// ---------------------------------------------------------------------
// Measure lines (a bracket-style segment with end ticks and a label).
//   orientation: 'h' (horizontal) or 'v' (vertical)
//   from, to:    functions giving the start/end along the measured axis
//   level:       function giving the fixed position on the other axis
//   reveal:      if true, the line is hidden until the animation finishes
// ---------------------------------------------------------------------
function measureLine(orientation, from, to, level, label, { reveal = false, fontSize = FONT.measure } = {}) {
    const attr = { strokeColor: INK, strokeWidth: 1, highlight: false };
    if (reveal) {
        attr.visible = () => state.done;
    }

    const horizontal = orientation === 'h';
    const seg = (p1, p2) => board.create('segment', [p1, p2], attr);

    if (horizontal) {
        seg([() => from(), () => level()], [() => to(), () => level()]);
        seg([() => from(), () => level() - TICK], [() => from(), () => level() + TICK]);
        seg([() => to(), () => level() - TICK], [() => to(), () => level() + TICK]);
    } else {
        seg([() => level(), () => from()], [() => level(), () => to()]);
        seg([() => level() - TICK, () => from()], [() => level() + TICK, () => from()]);
        seg([() => level() - TICK, () => to()], [() => level() + TICK, () => to()]);
    }

    const labelX = horizontal ? () => (from() + to()) / 2 : () => level();
    const labelY = horizontal ? () => level() : () => (from() + to()) / 2;
    const content = reveal ? () => (state.done ? label : '') : label;

    board.create('text', [labelX, labelY, content], {
        anchorX: 'middle',
        anchorY: 'middle',
        fontSize,
        cssStyle: 'background-color: white; padding: 0 4px;',
        highlight: false
    });
}

function addOutlineMeasureLines(X) {
    // Perpendicular offset of each bracket from the figure.  The side
    // (c / d) brackets sit well clear so their labels don't jam against the
    // coloured pieces or the corner point labels; the top bracket stays
    // close so it does not run into the matrix readout above.
    const topY = () => H() + 0.34;
    const bottomY = () => -0.45;
    const leftX = () => X - 0.7;
    const rightX = () => X + W() + 0.7;

    measureLine('h', () => X, () => X + bVal(), topY, '\\(b\\)');
    measureLine('h', () => X + bVal(), () => X + W(), topY, '\\(a\\)');
    measureLine('h', () => X, () => X + aVal(), bottomY, '\\(a\\)');
    measureLine('h', () => X + aVal(), () => X + W(), bottomY, '\\(b\\)');

    measureLine('v', () => 0, () => dVal(), leftX, '\\(d\\)');
    measureLine('v', () => dVal(), () => H(), leftX, '\\(c\\)');
    measureLine('v', () => 0, () => cVal(), rightX, '\\(c\\)');
    measureLine('v', () => cVal(), () => H(), rightX, '\\(d\\)');
}

// ---------------------------------------------------------------------
// The 10-point lattice shared by both diagrams.
//   axPoint / ayPoint are the (a,c) and (b,d) corners; on the left these
//   are the draggable Ax/Ay, on the right they are recomputed copies.
// ---------------------------------------------------------------------
function makeLattice(X, axPoint, ayPoint) {
    return {
        O: hiddenPoint(() => X, () => 0),
        B0: hiddenPoint(() => X + aVal(), () => 0),
        L0: hiddenPoint(() => X, () => dVal()),
        Ax: axPoint,
        Ay: ayPoint,
        TM: hiddenPoint(() => X + bVal(), () => H()),
        RM: hiddenPoint(() => X + W(), () => cVal()),
        BR: hiddenPoint(() => X + W(), () => 0),
        TL: hiddenPoint(() => X, () => H()),
        T: hiddenPoint(() => X + W(), () => H())
    };
}

function addDLabel(X) {
    board.create('text', [() => X + W() / 2, () => H() / 2, '\\(D\\)'], {
        anchorX: 'middle',
        anchorY: 'middle',
        fontSize: FONT.dLabel
    });
}

const fixedPointAttr = {
    size: 1,
    fixed: true,
    strokeColor: INK,
    fillColor: INK
};

// ---------------------------------------------------------------------
// Left diagram: the original dissection.
// ---------------------------------------------------------------------
const L = makeLattice(LX, Ax, Ay);

board.create('polygon', [L.L0, L.Ay, L.TM, L.TL], orangeStyle);
board.create('polygon', [L.B0, L.BR, L.RM, L.Ax], orangeStyle);

board.create('polygon', [L.O, L.B0, L.Ax], redStyle);
board.create('polygon', [L.Ay, L.TM, L.T], redStyle);

board.create('polygon', [L.O, L.L0, L.Ay], blueStyle);
board.create('polygon', [L.Ax, L.RM, L.T], blueStyle);

board.create('polygon', [L.O, L.Ax, L.T, L.Ay], dStyle);
board.create('polygon', [L.O, L.BR, L.T, L.TL], outlineStyle);

addDLabel(LX);

// ---------------------------------------------------------------------
// Right diagram: the rearrangement.
// ---------------------------------------------------------------------
const R_Ax = hiddenPoint(() => RX + aVal(), () => cVal());
const R_Ay = hiddenPoint(() => RX + bVal(), () => dVal());
const R = makeLattice(RX, R_Ax, R_Ay);

board.create('polygon', [R.L0, R.Ay, R.TM, R.TL], orangeStyle);
board.create('polygon', [R.B0, R.BR, R.RM, R.Ax], orangeStyle);

board.create('polygon', [R.O, R.B0, R.Ax], redStyle);
board.create('polygon', [R.Ax, R.RM, R.T], blueStyle);

// Red triangle sliding into place during the animation.
const MR1 = hiddenPoint(() => RX + lerp(bVal(), 0, state.t), () => lerp(dVal(), 0, state.t));
const MR2 = hiddenPoint(() => RX + lerp(bVal(), 0, state.t), () => lerp(H(), cVal(), state.t));
const MR3 = hiddenPoint(() => RX + lerp(W(), aVal(), state.t), () => lerp(H(), cVal(), state.t));
board.create('polygon', [MR1, MR2, MR3], redStyle);

// Blue triangle sliding into place during the animation.
const MB1 = hiddenPoint(() => RX + lerp(0, aVal(), state.t), () => lerp(0, cVal(), state.t));
const MB2 = hiddenPoint(() => RX + lerp(0, aVal(), state.t), () => lerp(dVal(), H(), state.t));
const MB3 = hiddenPoint(() => RX + lerp(bVal(), W(), state.t), () => lerp(dVal(), H(), state.t));
board.create('polygon', [MB1, MB2, MB3], blueStyle);

board.create('point', [() => RX + aVal(), () => cVal()], {
    ...fixedPointAttr,
    name: '\\(Ax\\)',
    label: { offset: [5, -5] }
});

board.create('point', [() => RX + bVal(), () => dVal()], {
    ...fixedPointAttr,
    name: '\\(Ay\\)',
    label: { offset: [-24, 10] }
});

addDLabel(RX);
board.create('polygon', [R.O, R.BR, R.T, R.TL], outlineStyle);

// ---------------------------------------------------------------------
// Outline measure lines (both diagrams) and the revealed a-by-d guides.
// ---------------------------------------------------------------------
addOutlineMeasureLines(LX);
addOutlineMeasureLines(RX);

measureLine('h', () => RX, () => RX + aVal(), () => H() + 1, '\\(a\\)', { reveal: true, fontSize: FONT.reveal });
measureLine('v', () => H(), () => H() - dVal(), () => RX - 1.2, '\\(d\\)', { reveal: true, fontSize: FONT.reveal });

// ---------------------------------------------------------------------
// Matrix readout, titles and learner cue.
// ---------------------------------------------------------------------
board.create('text', [
    LX,
    9,
    () => '\\(A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=\\begin{pmatrix}'
        + fmt(aVal()) + '&' + fmt(bVal())
        + '\\\\'
        + fmt(cVal()) + '&' + fmt(dVal())
        + '\\end{pmatrix}\\)'
], {
    anchorX: 'left',
    anchorY: 'middle',
    fontSize: FONT.matrix
});

board.create('text', [LX, 7.8, '\\(\\textbf{Original dissection}\\)'], {
    anchorX: 'left',
    fontSize: FONT.title
});

board.create('text', [RX, 7.8, '\\(\\textbf{Rearrangement}\\)'], {
    anchorX: 'left',
    fontSize: FONT.title
});

// board.create('text', [() => LX, -1.1, '\\(\\text{Drag }Ax\\text{ and }Ay\\text{, then press Play.}\\)'], {
//     anchorX: 'left',
//     fontSize: FONT.cue
// });

// ---------------------------------------------------------------------
// Labels and the final area formula, revealed after the animation.
// ---------------------------------------------------------------------
function revealText(s) {
    return state.done ? s : '';
}

function revealLabel(xFn, yFn, label, fontSize = FONT.piece) {
    board.create('text', [xFn, yFn, () => revealText(label)], {
        anchorX: 'middle',
        anchorY: 'middle',
        fontSize
    });
}

revealLabel(() => RX + aVal() / 2, () => cVal() / 2, '\\(ac\\)');
revealLabel(() => RX + aVal() + bVal() / 2, () => cVal() + dVal() / 2, '\\(bd\\)');
revealLabel(() => RX + bVal() / 2, () => dVal() + cVal() / 2, '\\(bc\\)', FONT.pieceSmall);
revealLabel(() => RX + aVal() + bVal() / 2, () => cVal() / 2, '\\(bc\\)', FONT.pieceSmall);

board.create('text', [
    () => 9.6,
    -2,
    () => revealText(
        '\\(\\text{Area}(D)=ad - bc='
        + fmt(aVal()) + '\\cdot' + fmt(dVal()) + ' - '
        + fmt(bVal()) + '\\cdot' + fmt(cVal()) + '='
        + fmt(aVal() * dVal() - bVal() * cVal()) + '\\)'
    )
], {
    anchorX: 'middle',
    fontSize: FONT.formula
});

// ---------------------------------------------------------------------
// Animation: morph the right-hand pieces into the ad - bc arrangement.
// ---------------------------------------------------------------------
function playAnimation() {
    if (state.animating) return;

    state.t = 0;
    state.done = false;
    state.animating = true;
    setButton('Playing...', true);
    board.update();

    const start = performance.now();

    function step(now) {
        const u = Math.min(1, (now - start) / ANIM_DURATION);
        state.t = u;
        board.update();

        if (u < 1) {
            requestAnimationFrame(step);
        } else {
            state.t = 1;
            state.animating = false;
            state.done = true;
            setButton('Replay animation', false);
            board.update();
        }
    }

    requestAnimationFrame(step);
}

// Exported so the PreTeXt button's inline onclick="playAnimation();" works.
window.playAnimation = playAnimation;

board.update();

// MathJax typesets asynchronously, so the first board.update() above runs
// before the labels have their final size.  Once MathJax is ready, refresh
// the board so dynamic labels (the A matrix in particular) are measured at
// their true size up front -- otherwise they "snap" on the first drag.
function refreshWhenMathJaxReady() {
    if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(() => board.update());
    } else {
        setTimeout(refreshWhenMathJaxReady, 100);
    }
}

refreshWhenMathJaxReady();

})();
