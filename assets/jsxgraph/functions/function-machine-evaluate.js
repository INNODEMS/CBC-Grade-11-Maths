// 1. Initialize the board
const board = JXG.JSXGraph.initBoard('jsxgraph-function-machine', {
    boundingbox: [-7, 6, 7, -6],
    axis: false,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Draw the function machine box
const boxP1 = board.create('point', [-1.8, 1.5], { visible: false, fixed: true });
const boxP2 = board.create('point', [1.8, 1.5], { visible: false, fixed: true });
const boxP3 = board.create('point', [1.8, -1.5], { visible: false, fixed: true });
const boxP4 = board.create('point', [-1.8, -1.5], { visible: false, fixed: true });

board.create('polygon', [boxP1, boxP2, boxP3, boxP4], {
    fillColor: '#dbeafe', fillOpacity: 0.7,
    borders: { strokeColor: '#2563eb', strokeWidth: 3 },
    vertices: { visible: false }
});

board.create('text', [0, 2.3, 'f(x) = 4x \u2212 7'], {
    fontSize: 20, anchorX: 'middle', cssClass: 'font-bold', color: '#1e3a8a'
});
board.create('text', [0, 0.3, 'FUNCTION'], {
    fontSize: 16, anchorX: 'middle', color: '#1e40af', cssClass: 'font-bold'
});
board.create('text', [0, -0.4, 'MACHINE'], {
    fontSize: 16, anchorX: 'middle', color: '#1e40af', cssClass: 'font-bold'
});

// 3. Input slider (the value the learner controls)
const xSlider = board.create('slider', [[-6, -3.5], [-6, 3.5], [-10, 3, 10]], {
    name: 'x', snapWidth: 1, size: 6,
    label: { fontSize: 16, cssClass: 'font-bold' }
});

board.create('text', [-6, 4.3, () => 'Input: x = ' + xSlider.Value()], {
    fontSize: 16, anchorX: 'middle', cssClass: 'font-bold', color: '#0f172a'
});

board.create('text', [6, -0.5, 'Output'], {
    fontSize: 16, anchorX: 'middle', color: '#166534', cssClass: 'font-bold'
});

// 4. Animation logic
let animatedObjects = [];

function clearAnimation() {
    board.removeObject(animatedObjects);
    animatedObjects = [];
}

function evaluateFunction() {
    clearAnimation();
    const xVal = xSlider.Value();
    const fVal = 4 * xVal - 7;
    const yPos = xSlider.Y();

    // Step 1: input value flies into the machine
    let inputPt = board.create('point', [-6, yPos], { visible: false });
    animatedObjects.push(inputPt);
    let arrowIn = board.create('arrow', [[-6, yPos], inputPt], {
        strokeColor: '#2563eb', strokeWidth: 3, lastArrow: { type: 1, size: 6 }
    });
    animatedObjects.push(arrowIn);
    inputPt.moveTo([-1.8, 0], 800);

    // Step 2: substitution step appears
    setTimeout(() => {
        let subText = board.create('text', [0, -2.3, 'f(' + xVal + ') = 4(' + xVal + ') \u2212 7'], {
            fontSize: 16, anchorX: 'middle', color: '#1e3a8a', cssClass: 'font-bold'
        });
        animatedObjects.push(subText);
    }, 900);

    // Step 3: output flies out of the machine
    setTimeout(() => {
        let outputPt = board.create('point', [1.8, 0], { visible: false });
        animatedObjects.push(outputPt);
        let arrowOut = board.create('arrow', [[1.8, 0], outputPt], {
            strokeColor: '#16a34a', strokeWidth: 3, lastArrow: { type: 1, size: 6 }
        });
        animatedObjects.push(arrowOut);
        outputPt.moveTo([6, 0], 800);
    }, 1800);

    // Step 4: final answer is revealed
    setTimeout(() => {
        let outText = board.create('text', [6, 0.8, 'f(' + xVal + ') = ' + fVal], {
            fontSize: 18, anchorX: 'middle', color: '#166534', cssClass: 'font-bold'
        });
        animatedObjects.push(outText);
    }, 2700);
}

// 5. Buttons
board.create('button', [-2.5, -5, 'Evaluate f(x)', evaluateFunction], {
    fixed: true, cssStyle: 'padding: 10px; cursor: pointer;'
});

board.create('button', [1.5, -5, 'Clear', clearAnimation], {
    fixed: true, cssStyle: 'padding: 10px; cursor: pointer;'
});