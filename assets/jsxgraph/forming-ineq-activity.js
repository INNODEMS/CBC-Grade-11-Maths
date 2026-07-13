const board = JXG.JSXGraph.initBoard('jsx-forming-ineq-activity', {
    boundingbox: [-3, 6, 9, -3],
    axis: true,
    grid: true,
    keepAspectRatio: false,
    showNavigation: false,
    showCopyright: false
});

// ----------------------------------------------------
// Hide automatic zero labels
// ----------------------------------------------------

board.defaultAxes.x.defaultTicks.setAttribute({
    drawZero: false
});

board.defaultAxes.y.defaultTicks.setAttribute({
    drawZero: false
});

// ----------------------------------------------------
// Axis labels
// ----------------------------------------------------

board.defaultAxes.x.setAttribute({
    name: '',
    withLabel: false
});

board.defaultAxes.y.setAttribute({
    name: '',
    withLabel: false
});

// Custom axis labels positioned like the textbook

board.create('text', [8.7, -0.35, '<b>x</b>'], {
    fixed: true,
    highlight: false,
    fontSize: 16
});

board.create('text', [-0.35, 5.6, '<b>y</b>'], {
    fixed: true,
    highlight: false,
    fontSize: 16
});

// ----------------------------------------------------
// Origin label
// ----------------------------------------------------

board.create('text', [-0.22, -0.28, '0'], {
    fixed: true,
    highlight: false,
    fontSize: 14
});

// ----------------------------------------------------
// Draggable points
// ----------------------------------------------------

const A = board.create('point', [0, 2], {
    name: 'A',
    size: 4,
    strokeColor: 'black',
    fillColor: 'black',
    snapToGrid: true
});

const B = board.create('point', [4, 0], {
    name: 'B',
    size: 4,
    strokeColor: 'black',
    fillColor: 'black',
    snapToGrid: true
});

// ----------------------------------------------------
// Boundary line
// ----------------------------------------------------

const line = board.create('line', [A, B], {
    strokeColor: 'black',
    strokeWidth: 3,
    straightFirst: true,
    straightLast: true
});

// ----------------------------------------------------
// Shade region below the line
// ----------------------------------------------------

board.create('inequality', [line], {
    inverse: true,
    fillColor: '#1e90ff',
    fillOpacity: 0.25,
    strokeWidth: 0
});