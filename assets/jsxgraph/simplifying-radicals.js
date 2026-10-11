// Initialize the JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgbox-simplify', {
    boundingbox: [-10, 8, 10, -8],
    keepaspectratio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Configure options for text rendering
JXG.Options.text.useMathJax = false; 
JXG.Options.text.fontSize = 18;

// -----------------------------------------------------------------------------
// UI Controls (Slider at the Top)
// -----------------------------------------------------------------------------
const radicandSlider = board.create('slider', [[-8, 6], [2, 6], [8, 12, 50]], {
    name: 'Radicand (n)', snapWidth: 1, precision: 0, size: 4, strokeColor: '#1565c0', fillColor: '#1565c0'
});

// Helper function to find the largest perfect square factor
function getSimplificationParts(n) {
    let largestSquare = 1;
    let remainder = n;
    
    for (let i = 2; i * i <= n; i++) {
        if (n % (i * i) === 0) {
            largestSquare = i * i;
            remainder = n / largestSquare;
        }
    }
    return {
        square: largestSquare,
        rootSquare: Math.sqrt(largestSquare),
        leftover: remainder
    };
}

// -----------------------------------------------------------------------------
// Vertical Flow Layout (Stacked sequentially downwards)
// -----------------------------------------------------------------------------

// Step 1: Original Problem
board.create('text', [-8, 4.0, function () {
    return 'Original Expression:  √' + radicandSlider.Value();
}], { fixed: true, fontUnit: 'px', fontSize: 18 });

// Down Arrow 1
board.create('text', [-7.5, 3.1, '↓'], { fixed: true, fontUnit: 'px', fontSize: 20, strokeColor: '#555555' });

// Step 2: Factoring into a Perfect Square
board.create('text', [-8, 2.2, function () {
    const n = radicandSlider.Value();
    const parts = getSimplificationParts(n);
    return 'Factor Out Square:    √( ' + parts.square + ' × ' + parts.leftover + ' )';
}], { fixed: true, fontUnit: 'px', fontSize: 18, color: '#e65100' });

// Down Arrow 2
board.create('text', [-7.5, 1.3, '↓'], { fixed: true, fontUnit: 'px', fontSize: 20, strokeColor: '#555555' });

// Step 3: Final Answer
board.create('text', [-8, 0.4, function () {
    const n = radicandSlider.Value();
    const parts = getSimplificationParts(n);
    if (parts.square === 1) {
        return 'Simplified Form:       √' + n;
    }
    return 'Simplified Form:       ' + parts.rootSquare + '√' + parts.leftover;
}], { fixed: true, fontUnit: 'px', fontSize: 18, color: '#2e7d32' });

// -----------------------------------------------------------------------------
// Shortened Conceptual Note
// -----------------------------------------------------------------------------
board.create('text', [-8, -1.5, function () {
    const n = radicandSlider.Value();
    const parts = getSimplificationParts(n);
    if (parts.square === 1) {
        return 'Note: Already fully simplified.';
    }
    return 'Note: Since √' + parts.square + ' = ' + parts.rootSquare + ', it moves outside the radical.';
}], { fixed: true, fontUnit: 'px', fontSize: 16, color: '#455a64' });