// Initialize a wide board perfect for a number line setup
const board = JXG.JSXGraph.initBoard('jsxgraph-rational-irrational', {
    boundingbox: [-1, 5, 5, -1],
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Draw a stylized horizontal number line (from x = -0.5 to x = 4.5)
const axisLine = board.create('axis', [[0, 2], [1, 2]], {
    ticks: {
        drawZero: true,
        ticksDistance: 1,
        insertFirst: false,
        majorHeight: 15,
        minorTicks: 4,
        label: { offset: [-5, -20], fontSize: 14 }
    },
    strokeColor: '#333333',
    strokeWidth: 2
});

// Create an interactive Glider constrained to our number line
const P = board.create('glider', [1.414, 2, axisLine], {
    name: 'P',
    color: '#FF4500',
    size: 5,
    label: { visible: false }
});

// Define target interactive numbers for the snap buttons
const constants = {
    'half': { val: 0.5, label: '1/2', type: 'Rational (Terminating)' },
    'two_thirds': { val: 2/3, label: '2/3', type: 'Rational (Repeating)' },
    'sqrt2': { val: Math.sqrt(2), label: '√2', type: 'Irrational' },
    'pi': { val: Math.PI, label: 'π', type: 'Irrational' },
    'three': { val: 3.0, label: '3', type: 'Rational (Integer)' }
};

// Interactive dynamic readout text box
board.create('text', [0, 4, function() {
    let x = P.X();
    
    // Check if the glider is snapped close to one of our special constants
    let activeType = 'Custom Position';
    for (let key in constants) {
        if (Math.abs(x - constants[key].val) < 0.005) {
            x = constants[key].val; // Snap exactly for text rendering
            activeType = constants[key].type;
            break;
        }
    }

    // Format output string safely
    let decimalStr = x.toFixed(7);
    if (activeType.includes('Irrational') || activeType === 'Custom Position') {
        decimalStr += '...';
    }

    return `<strong>Position of P:</strong> ${x.toFixed(4)}<br>` +
           `<strong>Decimal Approximation:</strong> ${decimalStr}<br>` +
           `<strong>Classification:</strong> <span style="color:#FF4500;">${activeType}</span>`;
}], { fontSize: 15, fixed: true });

// Helper function to dynamically create snap buttons on the board canvas
function createSnapButton(xPos, yPos, config) {
    let btn = board.create('button', [xPos, yPos, config.label, function() {
        P.moveTo([config.val, 2], 300); // Smooth animation slide to target point
    }], { fixed: true });
}

// Render the interactive buttons for learners to experiment with
createSnapButton(0, 0.5, constants['half']);
createSnapButton(0.8, 0.5, constants['two_thirds']);
createSnapButton(1.7, 0.5, constants['sqrt2']);
createSnapButton(2.5, 0.5, constants['pi']);
createSnapButton(3.2, 0.5, constants['three']);