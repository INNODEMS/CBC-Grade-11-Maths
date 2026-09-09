// Initialize the JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgbox-mult-div', {
    boundingbox: [-10, 8, 10, -8],
    keepaspectratio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Configure options for text rendering
JXG.Options.text.useMathJax = false; // Prevents raw code leaking
JXG.Options.text.fontSize = 16;

// -----------------------------------------------------------------------------
// UI Controls (Sliders & Switches)
// -----------------------------------------------------------------------------

// Sliders for Term 1: a * sqrt(x)
const sliderA = board.create('slider', [[-9, 6], [-5, 6], [1, 4, 8]], {
    name: 'a', snapWidth: 1, precision: 0, size: 4, strokeColor: '#1565c0', fillColor: '#1565c0'
});
const sliderX = board.create('slider', [[-9, 5], [-5, 5], [2, 3, 12]], {
    name: 'x', snapWidth: 1, precision: 0, size: 4, strokeColor: '#1565c0', fillColor: '#1565c0'
});

// Multiplication/Division Toggle Button (1 for multiply, -1 for divide)
let isMultiply = 1; 
const btnOp = board.create('button', [-3.5, 5.5, function() {
    return isMultiply === 1 ? '  ×  ' : '  ÷  ';
}, function() {
    isMultiply = isMultiply === 1 ? -1 : 1;
    board.update();
}], { fontSize: 18 });

// Sliders for Term 2: b * sqrt(y)
const sliderB = board.create('slider', [[-1, 6], [3, 6], [1, 2, 6]], {
    name: 'b', snapWidth: 1, precision: 0, size: 4, strokeColor: '#c62828', fillColor: '#c62828'
});
const sliderY = board.create('slider', [[-1, 5], [3, 5], [2, 2, 8]], {
    name: 'y', snapWidth: 1, precision: 0, size: 4, strokeColor: '#c62828', fillColor: '#c62828'
});

// -----------------------------------------------------------------------------
// Geometry / Area Visualization Setup
// -----------------------------------------------------------------------------
// For multiplication, it renders a dynamic grid rectangle representing the area (val1 * val2).
// For division, it visually shows a scaling bar model comparison.

const val1 = () => sliderA.Value() * Math.sqrt(sliderX.Value());
const val2 = () => sliderB.Value() * Math.sqrt(sliderY.Value());
const totalVal = () => isMultiply === 1 ? val1() * val2() : val1() / val2();

// Visual Area/Relationship Polygon
const p0 = board.create('point', [-8, -4], { visible: false });
const p1 = board.create('point', [function() { return -8 + val1(); }, -4], { visible: false });
const p2 = board.create('point', [
    function() { return -8 + val1(); }, 
    function() { return isMultiply === 1 ? -4 + val2() : -4 + 1.5; }
], { visible: false });
const p3 = board.create('point', [
    -8, 
    function() { return isMultiply === 1 ? -4 + val2() : -4 + 1.5; }
], { visible: false });

const visualArea = board.create('polygon', [p0, p1, p2, p3], {
    fillColor: function() { return isMultiply === 1 ? '#e8f5e9' : '#eceff1'; },
    fillOpacity: 0.6,
    strokeColor: '#2e7d32',
    strokeWidth: 2,
    withLines: true
});

// Width Label (Term 1)
board.create('text', [function() { return -8 + (val1() / 2); }, -4.5, function() {
    return sliderA.Value() + '√' + sliderX.Value();
}], { color: '#1565c0', anchorX: 'middle' });

// Height Label (Term 2 / Scale factor indicator)
board.create('text', [-9, function() { return isMultiply === 1 ? -4 + (val2() / 2) : -3.25; }, function() {
    return isMultiply === 1 ? sliderB.Value() + '√' + sliderY.Value() : 'Scale (÷)';
}], { color: '#c62828', anchorX: 'middle' });

// -----------------------------------------------------------------------------
// Dynamic Text Explanations
// -----------------------------------------------------------------------------

// Display the interactive input equation
board.create('text', [-9, 2.8, function () {
    const a = sliderA.Value();
    const x = sliderX.Value();
    const b = sliderB.Value();
    const y = sliderY.Value();
    const opSign = isMultiply === 1 ? '×' : '÷';
    
    return 'Expression: (' + a + '√' + x + ') ' + opSign + ' (' + b + '√' + y + ')';
}], { fixed: true, fontUnit: 'px', fontSize: 18, strokeColor: '#333333' });

// Display the step-by-step simplification logic
board.create('text', [-9, 1.4, function () {
    const a = sliderA.Value();
    const x = sliderX.Value();
    const b = sliderB.Value();
    const y = sliderY.Value();

    if (isMultiply === 1) {
        const coef = a * b;
        const rad = x * y;
        return 'Simplification:\n= (' + a + ' × ' + b + ')√( ' + x + ' × ' + y + ' )\n= ' + coef + '√' + rad + ' ≈ ' + totalVal().toFixed(3);
    } else {
        const coefVal = (a / b).toFixed(2);
        const radVal = (x / y).toFixed(2);
        return 'Simplification:\n= (' + a + ' ÷ ' + b + ')√( ' + x + ' ÷ ' + y + ' )\n≈ ' + coefVal + '√' + radVal + ' ≈ ' + totalVal().toFixed(3);
    }
}], { fixed: true, fontUnit: 'px', fontSize: 16 });