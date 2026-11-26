/*
    Limits of Polynomial Functions — approaching from the left and the right
    A slider sets the value a that x approaches. "From the left" / "From the right"
    buttons animate a point sliding along the polynomial towards a. The current x
    and f(x) update as it moves, and the limit f(a) is shown for comparison, so
    learners see f(x) closing in on the same value from both sides.
*/

JXG.Options.text.useMathJax = true;
JXG.Options.text.fontSize = 15;

const board = JXG.JSXGraph.initBoard('jsx-polynomial-limits', {
    boundingbox: [-6, 8, 6, -8],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// --- Parameters -------------------------------------------------------------
const f = (x) => 0.2 * x * x * x - 0.6 * x * x - x + 2;   // fixed polynomial

board.create('functiongraph', [f, -5, 5], { strokeColor: '#1565c0', strokeWidth: 3 });

// --- Slider: the value being approached -------------------------------------
const a = board.create('slider', [[-5, 7], [-1.5, 7], [-3, 1, 3]], { name: 'a', snapWidth: 0.5, size: 5 });

// dashed vertical line x = a and the target point on the curve
const topPt = board.create('point', [() => a.Value(), 8], { visible: false });
const botPt = board.create('point', [() => a.Value(), -8], { visible: false });
board.create('line', [topPt, botPt], { strokeColor: '#9e9e9e', dash: 2, straightFirst: false, straightLast: false, strokeWidth: 1 });
board.create('point', [() => a.Value(), () => f(a.Value())],
    { name: '', size: 2, strokeColor: '#9e9e9e', fillColor: '#fff', fixed: true });

// --- Moving point -----------------------------------------------------------
let px = -1.8 + 1, timer = null;   // start to the left of the initial a = 1
const P = board.create('point', [() => px, () => f(px)], {
    name: 'P', size: 4, strokeColor: '#c62828', fillColor: '#c62828', fixed: true, label: { offset: [10, 8] }
});

function approach(side) {
    if (timer) { clearInterval(timer); timer = null; }
    const target = a.Value();
    px = side === 'left' ? target - 1.8 : target + 1.8;
    board.update();
    timer = setInterval(() => {
        px += (target - px) * 0.14;
        if (Math.abs(px - target) < 0.01) {
            px = target - (side === 'left' ? 0.0008 : -0.0008);
            clearInterval(timer); timer = null;
        }
        board.update();
    }, 55);
}
// When a new value of a is chosen, stop any animation and park P to the left
// of a, so the readouts never describe an approach to an old value of a.
a.on('drag', () => {
    if (timer) { clearInterval(timer); timer = null; }
    px = a.Value() - 1.8;
});
// Control API for native PreTeXt buttons.
window.limitFromLeft = () => approach('left');
window.limitFromRight = () => approach('right');

// --- Readouts ---------------------------------------------------------------
board.create('text', [-5.6, -5.1, () => '\\(x = ' + px.toFixed(3) + '\\)'], { anchorX: 'left', fixed: true });
board.create('text', [-5.6, -5.8, () => '\\(f(x) = ' + f(px).toFixed(3) + '\\)'], { anchorX: 'left', fixed: true });
board.create('text', [1.2, -5.1, () => '\\(\\lim_{x\\to ' + a.Value().toFixed(1) + '} f(x) = ' + f(a.Value()).toFixed(3) + '\\)'],
    { anchorX: 'left', fixed: true, cssStyle: 'font-weight:bold' });
