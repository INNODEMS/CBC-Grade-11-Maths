// 1. Initialize the board
const board = JXG.JSXGraph.initBoard('jsxgraph-range-sweep', {
    boundingbox: [-8, 8, 8, -8],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Define function types matching table-range-rules
const functions = [
    {
        label: 'f(x) = x\u00B2 + 1  (quadratic, opens up)',
        fn: (x) => x * x / 3 + 1,
        rangeText: 'Range: y \u2265 1',
        xMin: -4.5, xMax: 4.5,
        color: '#2563eb'
    },
    {
        label: 'f(x) = \u221Ax  (square root)',
        fn: (x) => (x >= 0 ? Math.sqrt(x) * 1.8 : NaN),
        rangeText: 'Range: y \u2265 0',
        xMin: 0, xMax: 6,
        color: '#16a34a'
    },
    {
        label: 'f(x) = 2\u02E3  (exponential)',
        fn: (x) => Math.pow(2, x * 0.8) - 4,
        rangeText: 'Range: y \u2192 -4 (never reached)',
        xMin: -6, xMax: 3.2,
        color: '#ea580c'
    },
    {
        label: 'f(x) = 1/x + 1  (rational, asymptote)',
        fn: (x) => (Math.abs(x) < 0.3 ? NaN : 1 / x + 1),
        rangeText: 'Range: y \u2260 1',
        xMin: -6, xMax: 6,
        color: '#9333ea'
    }
];

let currentIndex = 0;
let curveObj = null;
let labelText = null;
let rangeDescText = null;
let dynObjects = [];
let sweepInterval = null;
let hitsY = []; // recorded output values as we sweep

function clearDynamic() {
    board.removeObject(dynObjects);
    dynObjects = [];
}

// 3. Slider that also drives manual dragging
const xSlider = board.create('slider', [[-7, -6.3], [7, -6.3], [-7, -7, 7]], {
    name: 'x', snapWidth: 0.1, size: 6,
    label: { fontSize: 16, cssClass: 'font-bold' }
});

// 4. Draw a projector line + point + running band on the y-axis
function updateProjection() {
    // remove old projector graphics but keep the persistent range band
    let toRemove = dynObjects.filter(o => o.isProjector);
    board.removeObject(toRemove);
    dynObjects = dynObjects.filter(o => !o.isProjector);

    const f = functions[currentIndex];
    const x = xSlider.Value();

    if (x < f.xMin || x > f.xMax) return;
    const y = f.fn(x);
    if (!isFinite(y) || isNaN(y)) return;

    hitsY.push(y);
    const yMin = Math.min(...hitsY);
    const yMax = Math.max(...hitsY);

    // Point on the curve
    let pt = board.create('point', [x, y], { name: '', size: 4, color: f.color, fixed: true });
    pt.isProjector = true;
    dynObjects.push(pt);

    // Horizontal projector line to y-axis
    let proj = board.create('segment', [[x, y], [0, y]], {
        strokeColor: '#94a3b8', dash: 2, strokeWidth: 1
    });
    proj.isProjector = true;
    dynObjects.push(proj);

    // Marker on y-axis
    let axisMark = board.create('point', [0, y], { name: '', size: 3, color: '#dc2626', fixed: true });
    axisMark.isProjector = true;
    dynObjects.push(axisMark);

    // Growing shaded band showing accumulated range so far
    let band = board.create('segment', [[-0.15, yMin], [-0.15, yMax]], {
        strokeColor: '#16a34a', strokeWidth: 8, strokeOpacity: 0.5
    });
    band.isProjector = true;
    dynObjects.push(band);

    // Live readout
    let readout = board.create('text', [0, -7.3,
        () => 'Outputs seen so far: ' + yMin.toFixed(1) + ' \u2264 y \u2264 ' + yMax.toFixed(1)
    ], { fontSize: 15, anchorX: 'middle', color: '#166534', cssClass: 'font-bold' });
    readout.isProjector = true;
    dynObjects.push(readout);
}

xSlider.on('drag', updateProjection);

// 5. Auto-sweep animation across the full domain
function sweep() {
    stopSweep();
    hitsY = [];
    clearDynamic();
    const f = functions[currentIndex];
    let x = f.xMin;
    const step = (f.xMax - f.xMin) / 60;

    sweepInterval = setInterval(() => {
        if (x > f.xMax) {
            clearInterval(sweepInterval);
            return;
        }
        xSlider.setValue(x);
        board.update();
        updateProjection();
        x += step;
    }, 40);
}

function stopSweep() {
    if (sweepInterval) clearInterval(sweepInterval);
}

// 6. Switch function type
function switchFunction(index) {
    stopSweep();
    currentIndex = index;
    hitsY = [];
    const f = functions[index];

    if (curveObj) board.removeObject(curveObj);
    if (labelText) board.removeObject(labelText);
    if (rangeDescText) board.removeObject(rangeDescText);
    clearDynamic();

    curveObj = board.create('functiongraph', [f.fn, f.xMin, f.xMax], {
        strokeColor: f.color, strokeWidth: 3
    });

    labelText = board.create('text', [0, 7.3, f.label], {
        fontSize: 16, anchorX: 'middle', cssClass: 'font-bold', color: f.color
    });

    rangeDescText = board.create('text', [0, 6.4, f.rangeText], {
        fontSize: 14, anchorX: 'middle', color: '#334155'
    });

    xSlider.setValue(f.xMin);
    board.update();
}

// 7. Buttons: function types
board.create('button', [-7, 4.3, 'Quadratic', () => switchFunction(0)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 3.5, 'Square Root', () => switchFunction(1)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 2.7, 'Exponential', () => switchFunction(2)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 1.9, 'Rational', () => switchFunction(3)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});

// 8. Sweep control
board.create('button', [4.5, 4.3, 'Sweep', sweep], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [4.5, 3.5, 'Stop', stopSweep], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});

// 9. Load the first function on start
switchFunction(0);