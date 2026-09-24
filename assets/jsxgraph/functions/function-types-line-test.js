// 1. Initialize the board
const board = JXG.JSXGraph.initBoard('jsxgraph-function-types-line-test', {
    boundingbox: [-8, 8, 8, -8],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Define the four function types from the insight block
const functions = [
    {
        label: 'f(x) = 1.5x + 1  (Linear)',
        fn: (x) => 1.5 * x + 1,
        xMin: -6, xMax: 6,
        color: '#2563eb',
        note: 'A straight line always passes the horizontal line test.'
    },
    {
        label: 'f(x) = 0.4x\u00B2 - 1  (Quadratic)',
        fn: (x) => 0.4 * x * x - 1,
        xMin: -6, xMax: 6,
        color: '#dc2626',
        note: 'A parabola fails the test above its vertex height.'
    },
    {
        label: 'f(x) = 0.08x\u00B3 \u2212 0.6x  (Cubic Polynomial)',
        fn: (x) => 0.08 * x * x * x - 0.6 * x,
        xMin: -6.5, xMax: 6.5,
        color: '#9333ea',
        note: 'This cubic wiggles, so some heights cross it three times.'
    },
    {
        label: 'f(x) = 3sin(x)  (Trigonometric)',
        fn: (x) => 3 * Math.sin(x),
        xMin: -7.5, xMax: 7.5,
        color: '#16a34a',
        note: 'The repeating wave crosses most heights many times.'
    }
];

let currentIndex = 0;
let curveObj = null;
let labelText = null;
let noteText = null;
let dynObjects = [];

function clearDynamic() {
    board.removeObject(dynObjects);
    dynObjects = [];
}

// 3. Draggable horizontal test line, controlled by a vertical slider
const ySlider = board.create('slider', [[-7, -6], [-7, 6], [-6, 0, 6]], {
    name: 'y', snapWidth: 0.05, size: 6,
    label: { fontSize: 14, cssClass: 'font-bold' }
});

// 4. Find approximate intersection points between the curve and the test line
function findIntersections(f, yLevel) {
    const hits = [];
    const steps = 800;
    const dx = (f.xMax - f.xMin) / steps;
    let prevX = f.xMin;
    let prevVal = f.fn(prevX) - yLevel;

    for (let i = 1; i <= steps; i++) {
        const x = f.xMin + i * dx;
        const val = f.fn(x) - yLevel;
        if (prevVal === 0) {
            hits.push(prevX);
        } else if (prevVal * val < 0) {
            // linear interpolation for a cleaner crossing point
            const t = prevVal / (prevVal - val);
            hits.push(prevX + t * dx);
        }
        prevX = x;
        prevVal = val;
    }
    return hits;
}

// 5. Update the test line, intersection markers, and verdict text
function updateTest() {
    clearDynamic();
    const f = functions[currentIndex];
    const yLevel = ySlider.Value();

    let line = board.create('segment', [[f.xMin - 1, yLevel], [f.xMax + 1, yLevel]], {
        strokeColor: '#334155', strokeWidth: 2, dash: 1
    });
    dynObjects.push(line);

    const hits = findIntersections(f, yLevel);
    hits.forEach((hx) => {
        let pt = board.create('point', [hx, yLevel], {
            name: '', size: 5, color: '#f59e0b', fixed: true
        });
        dynObjects.push(pt);
    });

    let verdict, color;
    if (hits.length <= 1) {
        verdict = 'This height crosses the graph ' + hits.length + ' time(s) \u2014 no repeated output here.';
        color = '#166534';
    } else {
        verdict = 'This height crosses the graph ' + hits.length + ' times \u2014 ' + hits.length + ' different inputs share this output!';
        color = '#dc2626';
    }

    let verdictText = board.create('text', [0, -7.3, verdict], {
        fontSize: 14, anchorX: 'middle', color: color, cssClass: 'font-bold'
    });
    dynObjects.push(verdictText);
}

ySlider.on('drag', updateTest);

// 6. Switch which function type is being tested
function switchFunction(index) {
    currentIndex = index;
    const f = functions[index];

    if (curveObj) board.removeObject(curveObj);
    if (labelText) board.removeObject(labelText);
    if (noteText) board.removeObject(noteText);

    curveObj = board.create('functiongraph', [f.fn, f.xMin, f.xMax], {
        strokeColor: f.color, strokeWidth: 3
    });

    labelText = board.create('text', [0, 7.3, f.label], {
        fontSize: 16, anchorX: 'middle', cssClass: 'font-bold', color: f.color
    });

    noteText = board.create('text', [0, 6.4, f.note], {
        fontSize: 13, anchorX: 'middle', color: '#334155'
    });

    ySlider.setValue(0);
    board.update();
    updateTest();
}

// 7. Buttons to choose the function type
board.create('button', [-7.5, 5.3, 'Linear', () => switchFunction(0)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7.5, 4.5, 'Quadratic', () => switchFunction(1)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7.5, 3.7, 'Polynomial', () => switchFunction(2)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7.5, 2.9, 'Trigonometric', () => switchFunction(3)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});

// 8. Load the first function on start
switchFunction(0);