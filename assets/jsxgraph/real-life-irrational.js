// Initialize the JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgbox-real-life', {
    boundingbox: [-10, 8, 10, -8],
    keepaspectratio: true,
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Configure options for text rendering
JXG.Options.text.useMathJax = false; 
JXG.Options.text.fontSize = 16;

// -----------------------------------------------------------------------------
// UI Controls (Growth Factor Slider)
// -----------------------------------------------------------------------------

// Slider to switch between Rational fractions and the Golden Ratio (Irrational)
// Default value is set close to the golden ratio value: (1 + sqrt(5)) / 2
const sliderPhi = board.create('slider', [[-9, 6.5], [-3, 6.5], [1.0, 1.618, 2.0]], {
    name: 'Scale Factor', snapWidth: 0.001, precision: 3, size: 5, strokeColor: '#e65100', fillColor: '#e65100'
});

// -----------------------------------------------------------------------------
// Real-Life Geometric Application: Proportional Growth Boxes
// -----------------------------------------------------------------------------

// Base anchor points for nesting geometry
const p0 = board.create('point', [-4, -4], { visible: false });

// Dynamic box generation based on the selected scale factor
const p1 = board.create('point', [function() { return -4 + (3 * sliderPhi.Value()); }, -4], { visible: false });
const p2 = board.create('point', [
    function() { return -4 + (3 * sliderPhi.Value()); }, 
    function() { return -4 + 3; }
], { visible: false });
const p3 = board.create('point', [-4, function() { return -4 + 3; }], { visible: false });

// Outer frame polygon
const goldenRect = board.create('polygon', [p0, p1, p2, p3], {
    fillColor: '#fff9c4', fillOpacity: 0.4, strokeColor: '#fbc02d', strokeWidth: 3, withLines: true
});

// Segment separating the perfect square from the remaining proportional area
const dividerX = board.create('segment', [[-1, -4], [-1, -1]], {
    strokeColor: '#795548', strokeWidth: 2, dash: 2
});

// Decorative Spiral Curve path mirroring growth in nature (seashells/sunflowers)
const spiral = board.create('curve', [
    function(t) { 
        let growth = Math.pow(sliderPhi.Value(), t / (Math.PI * 2));
        return -1 + growth * Math.cos(t); 
    },
    function(t) { 
        let growth = Math.pow(sliderPhi.Value(), t / (Math.PI * 2));
        return -2.5 + growth * Math.sin(t); 
    },
    0, 8
], { strokeColor: '#00796b', strokeWidth: 3 });

// -----------------------------------------------------------------------------
// Labels & Explanatory Context
// -----------------------------------------------------------------------------

board.create('text', [-9, 4.8, function () {
    const val = sliderPhi.Value();
    let label = 'Current Factor: ' + val.toFixed(3);
    if (Math.abs(val - 1.618) < 0.01) {
        label += ' (The Golden Ratio! Φ)';
    }
    return label;
}], { fontUnit: 'px', fontSize: 18, fixed: true });

board.create('text', [-9, 3.2, function () {
    const val = sliderPhi.Value();
    if (Math.abs(val - 1.618) < 0.01) {
        return 'Real-Life Impact:\nBecause this number is truly irrational, its pattern never cleanly\nrepeats. In nature (like sunflower seeds), this exact layout\nprevents gaps and creates the most efficient packing possible!';
    } else {
        return 'Real-Life Impact:\nUsing a standard terminating or repeating decimal value creates\nnoticeable alignments, leaving empty gaps in biological structures.';
    }
}], { fontUnit: 'px', fontSize: 14, color: '#333333', fixed: true });

// Visual dimension markers
board.create('text', [function() { return (-4 + (-4 + 3 * sliderPhi.Value())) / 2; }, -4.6, 'Total Length'], { anchorX: 'middle', color: '#555555' });
board.create('text', [-4.8, -2.5, 'Height'], { anchorY: 'middle', color: '#555555' });