// Initialize the JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgbox-diameter-theorem', {
    boundingbox: [-7, 7, 7, -7],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Configure options for text rendering
JXG.Options.text.useMathJax = false;
JXG.Options.text.fontSize = 16;

// -----------------------------------------------------------------------------
// Parameters & Circle Components
// -----------------------------------------------------------------------------
const CENTER = [0, 0];
const RADIUS = 4.5;

// Center point O
const O = board.create('point', CENTER, {
    name: 'O',
    fixed: true,
    size: 3,
    strokeColor: '#222222',
    fillColor: '#222222',
    label: { offset: [-10, -15] }
});

// Main geometry circle
const circle = board.create('circle', [O, RADIUS], {
    strokeWidth: 2,
    strokeColor: '#444444',
    fillColor: 'none'
});

// -----------------------------------------------------------------------------
// Points defining the Diameter (A and B)
// -----------------------------------------------------------------------------
// Fixed opposite points to create a true horizontal diameter baseline
const A = board.create('point', [-RADIUS, 0], {
    name: 'A',
    fixed: true,
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0',
    label: { offset: [-15, 5] }
});

const B = board.create('point', [RADIUS, 0], {
    name: 'B',
    fixed: true,
    size: 4,
    strokeColor: '#1565c0',
    fillColor: '#1565c0',
    label: { offset: [10, 5] }
});

// The Diameter line segment
const diameter = board.create('segment', [A, B], {
    strokeColor: '#1565c0',
    strokeWidth: 3,
    name: 'Diameter'
});

// -----------------------------------------------------------------------------
// Draggable Boundary Point (P)
// -----------------------------------------------------------------------------
// Glider point P restricted to movement along the circumference
const P = board.create('glider', [
    RADIUS * Math.cos(1.0),
    RADIUS * Math.sin(1.0),
    circle
], {
    name: 'P',
    size: 5,
    strokeColor: '#c62828',
    fillColor: '#c62828',
    label: { offset: [0, 15] }
});

// -----------------------------------------------------------------------------
// Chords forming the Inscribed Angle
// -----------------------------------------------------------------------------
const chordAP = board.create('segment', [A, P], {
    strokeColor: '#78909c',
    strokeWidth: 2
});

const chordBP = board.create('segment', [B, P], {
    strokeColor: '#78909c',
    strokeWidth: 2
});

// -----------------------------------------------------------------------------
// Angle Visualization (Dynamic Right-Angle display)
// -----------------------------------------------------------------------------
const inscribedAngle = board.create('angle', [B, P, A], {
    radius: 0.8,
    type: 'sector',
    orthoType: 'square', // Forces a right-angle square visual when it hits 90°
    fillColor: '#ffe082',
    highlightFillColor: '#ffe082',
    fillOpacity: 0.5,
    strokeColor: '#ffb300',
    strokeWidth: 2,
    withLabel: true,
    name: function() {
        // Rounds dynamically to ensure clean numerical feedback during drag
        return JXG.Math.Geometry.trueAngle(B, P, A).toFixed(0) + '°';
    }
});

// -----------------------------------------------------------------------------
// Dynamic Explanatory Text Box (Stacked below the circle)
// -----------------------------------------------------------------------------
board.create('text', [-6, -5.5, function() {
    return 'Inscribed Angle ∠APB = ' + JXG.Math.Geometry.trueAngle(B, P, A).toFixed(1) + '°';
}], { fontUnit: 'px', fontSize: 18, color: '#2e7d32', fixed: true });

board.create('text', [-6, -6.3, function() {
    return 'Observation: No matter where you drag point P, the angle remains exactly 90°.';
}], { fontUnit: 'px', fontSize: 14, color: '#455a64', fixed: true });