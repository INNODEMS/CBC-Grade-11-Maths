// Dynamic PreTeXt board hook configuration
const board = JXG.JSXGraph.initBoard('jsx-positive-slope-exercise', {
    boundingbox: [-1, 6, 5, -1],
    axis: true,
    grid: true,
    showNavigation: false,
    showCopyright: false
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

// Custom axis labels

board.create('text', [4.7, -0.15, 'x'], {
    fixed: true,
    highlight: false,
    fontSize: 16
});

board.create('text', [-0.15, 5.6, 'y'], {
    fixed: true,
    highlight: false,
    fontSize: 16
});

// ----------------------------------------------------
// Prevent duplicate zero labels
// ----------------------------------------------------

board.defaultAxes.x.defaultTicks.setAttribute({
    drawZero: false
});

board.defaultAxes.y.defaultTicks.setAttribute({
    drawZero: false
});

// ----------------------------------------------------
// Render clean origin
// ----------------------------------------------------

board.create('text', [-0.18, -0.22, '0'], {
    fixed: true,
    fontSize: 12,
    highlight: false
});

// ----------------------------------------------------
// Draggable snapping reference coordinates
// ----------------------------------------------------

const A = board.create('point', [0, 0], {
    name: 'A',
    size: 4,
    strokeColor: 'black',
    fillColor: 'black',
    snapToGrid: true
});

const B = board.create('point', [2, 4], {
    name: 'B',
    size: 4,
    strokeColor: 'black',
    fillColor: 'black',
    snapToGrid: true
});

// ----------------------------------------------------
// Keep points inside the visible board
// ----------------------------------------------------

function constrainPoint(P) {
    P.on('drag', function () {

        const bb = board.getBoundingBox();

        const x = Math.max(bb[0], Math.min(bb[2], this.X()));
        const y = Math.max(bb[3], Math.min(bb[1], this.Y()));

        this.setPosition(JXG.COORDS_BY_USER, [x, y]);
        board.update();

    });
}

constrainPoint(A);
constrainPoint(B);

// ----------------------------------------------------
// Continuous solid boundary line
// ----------------------------------------------------

const line = board.create('line', [A, B], {
    strokeColor: 'black',
    strokeWidth: 3,
    straightFirst: true,
    straightLast: true
});

// ----------------------------------------------------
// Shade the region below/right of the positive slope line
// ----------------------------------------------------

board.create('inequality', [line], {
    inverse: true,
    fillColor: '#800080',
    fillOpacity: 0.18,
    strokeWidth: 0
});