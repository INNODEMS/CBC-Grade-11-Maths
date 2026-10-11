// Initialize the JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-10, 8, 10, -8],
    keepaspectratio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Configure options for text rendering
JXG.Options.text.useMathJax = false; // Turn off external wrapper engine to prevent raw code leaks
JXG.Options.text.fontSize = 16;

// -----------------------------------------------------------------------------
// UI Controls (Sliders & Switches)
// -----------------------------------------------------------------------------

// Sliders for Term 1: a * sqrt(x)
const sliderA = board.create('slider', [[-9, 6], [-5, 6], [-5, 2, 5]], {
    name: 'a', snapWidth: 1, precision: 0, size: 4, strokeColor: '#1565c0', fillColor: '#1565c0'
});
const sliderX = board.create('slider', [[-9, 5], [-5, 5], [2, 3, 7]], {
    name: 'x', snapWidth: 1, precision: 0, size: 4, strokeColor: '#1565c0', fillColor: '#1565c0'
});

// Add/Subtract Toggle Button Switch (-1 for subtract, 1 for add)
let operation = 1; 
const btnOp = board.create('button', [-3.5, 5.5, function() {
    return operation === 1 ? '  +  ' : '  -  ';
}, function() {
    operation *= -1;
    board.update();
}], { fontSize: 18 });

// Sliders for Term 2: b * sqrt(y)
const sliderB = board.create('slider', [[-1, 6], [3, 6], [-5, 3, 5]], {
    name: 'b', snapWidth: 1, precision: 0, size: 4, strokeColor: '#c62828', fillColor: '#c62828'
});
const sliderY = board.create('slider', [[-1, 5], [3, 5], [2, 3, 7]], {
    name: 'y', snapWidth: 1, precision: 0, size: 4, strokeColor: '#c62828', fillColor: '#c62828'
});

// -----------------------------------------------------------------------------
// Geometry / Number Line Setup
// -----------------------------------------------------------------------------

// Draw horizontal number line baseline
const numLine = board.create('axis', [[-9, -2], [9, -2]], {
    ticks: { scale: 1, drawLabels: true, label: {offset: [-5, -15]} }
});

// Calculate numerical values of terms dynamically
const val1 = () => sliderA.Value() * Math.sqrt(sliderX.Value());
const val2 = () => operation * sliderB.Value() * Math.sqrt(sliderY.Value());
const totalVal = () => val1() + val2();

// Vector 1: Arrow representing Term 1 starting from 0
const pStart1 = board.create('point', [0, -1], { visible: false });
const pEnd1 = board.create('point', [val1, -1], { visible: false });
const vec1 = board.create('arrow', [pStart1, pEnd1], {
    strokeColor: '#1565c0', strokeWidth: 4, name: 'Term 1', withLabel: false
});

// Vector 2: Arrow representing Term 2 starting from the end of Vector 1
const pStart2 = board.create('point', [val1, 0], { visible: false });
const pEnd2 = board.create('point', [totalVal, 0], { visible: false });
const vec2 = board.create('arrow', [pStart2, pEnd2], {
    strokeColor: '#c62828', strokeWidth: 4, name: 'Term 2', withLabel: false
});

// Result Indicator line falling down to the axis
const resultLine = board.create('segment', [pEnd2, [totalVal, -2]], {
    strokeColor: '#2e7d32', strokeWidth: 1.5, dash: 2
});

const pFinal = board.create('point', [totalVal, -2], {
    name: '', size: 3, strokeColor: '#2e7d32', fillColor: '#2e7d32'
});

// -----------------------------------------------------------------------------
// Dynamic Text Explanations (Clean Text Rendering using Standard Symbols)
// -----------------------------------------------------------------------------

// Display the interactive input equation
board.create('text', [-9, 2.5, function () {
    const a = sliderA.Value();
    const x = sliderX.Value();
    const b = sliderB.Value();
    const y = sliderY.Value();
    const opSign = operation === 1 ? '+' : '-';
    
    return 'Expression: ' + a + '√' + x + ' ' + opSign + ' ' + b + '√' + y;
}], { fixed: true, fontUnit: 'px', fontSize: 18 });

// Display the step-by-step simplification logic
board.create('text', [-9, 1.2, function () {
    const a = sliderA.Value();
    const x = sliderX.Value();
    const b = sliderB.Value();
    const y = sliderY.Value();
    const opSign = operation === 1 ? '+' : '-';
    const combinedCoef = operation === 1 ? (a + b) : (a - b);

    if (x === y) {
        return 'Simplification: (' + a + ' ' + opSign + ' ' + b + ')√' + x + ' = ' + combinedCoef + '√' + x + ' ≈ ' + totalVal().toFixed(3);
    } else {
        return 'Simplification: Unlike radicals. Cannot be combined further. ≈ ' + totalVal().toFixed(3);
    }
}], { fixed: true, fontUnit: 'px', fontSize: 16 });

// Label the vectors on the graph area
board.create('text', [function() { return val1() / 2; }, -0.7, function() {
    return sliderA.Value() + '√' + sliderX.Value();
}], { color: '#1565c0', anchorX: 'middle', fontUnit: 'px', fontSize: 14 });

board.create('text', [function() { return val1() + (val2() / 2); }, 0.3, function() {
    const b = sliderB.Value();
    const y = sliderY.Value();
    return operation === 1 ? '+' + b + '√' + y : '-' + b + '√' + y;
}], { color: '#c62828', anchorX: 'middle', fontUnit: 'px', fontSize: 14 });