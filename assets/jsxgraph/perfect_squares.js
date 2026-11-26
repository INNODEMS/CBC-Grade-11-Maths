/*=========================================================
    PERFECT SQUARE EXPLORER
    Drag the slider to choose N unit squares. The tiles fill
    the smallest square frame that can hold them; the message
    under the grid says whether N is a perfect square.
=========================================================*/

const board = JXG.JSXGraph.initBoard('jsxgraph-perfect-squares', {
    boundingbox: [-1, 10, 10, -2.2],
    axis: false,
    showNavigation: false,
    showCopyright: false,
    keepAspectRatio: true,
    pan: { enabled: false },
    zoom: { enabled: false }
});

/*=========================================================
    SLIDER
=========================================================*/

const slider = board.create(
    'slider',
    [[0.5, 9.2], [7.5, 9.2], [1, 1, 50]],
    {
        name: 'N',
        snapWidth: 1,
        precision: 0,
        label: { fontSize: 14 }
    }
);

/*=========================================================
    STORAGE
=========================================================*/

let objects = [];

function clearScene() {
    while (objects.length) {
        board.removeObject(objects.pop());
    }
}

/*=========================================================
    DRAW ONE CELL (a polygon from coordinate pairs, so no
    helper points are left on the board)
=========================================================*/

function drawCell(x, y, colour) {
    const cell = board.create('polygon',
        [[x, y], [x + 1, y], [x + 1, y - 1], [x, y - 1]],
        {
            fillColor: colour,
            fillOpacity: 0.85,
            vertices: { visible: false, fixed: true },
            borders: { strokeColor: '#607D8B', strokeWidth: 1, fixed: true },
            highlight: false,
            fixed: true
        });
    objects.push(cell);
    return cell;
}

/*=========================================================
    MESSAGE (shown on the board itself; the original script
    wrote to an HTML element "message" that the page lacks)
=========================================================*/

function messageText() {
    const N = Math.round(slider.Value());
    const side = Math.ceil(Math.sqrt(N));
    if (side * side === N) {
        return '<span style="color:#2E7D32"><b>' + N + (N === 1 ? ' tile makes' : ' tiles make') + ' a complete ' +
            side + ' × ' + side + ' square, so ' + N + ' is a perfect square.</b></span>';
    }
    const missing = side * side - N;
    return '<span style="color:#C62828"><b>' + N + ' is not a perfect square:</b></span> ' +
        missing + ' more tile' + (missing === 1 ? '' : 's') + ' needed to complete a ' +
        side + ' × ' + side + ' square.';
}

board.create('text', [-0.5, -1.1, messageText], {
    fontSize: 14,
    fixed: true,
    highlight: false,
    anchorY: 'middle'
});

/*=========================================================
    UPDATE
=========================================================*/

function updateScene() {
    board.suspendUpdate();
    clearScene();

    const N = Math.round(slider.Value());
    const side = Math.ceil(Math.sqrt(N));   // smallest square holding N tiles
    const startX = (8 - side) / 2;           // centre the frame
    const startY = 8;

    let count = 0;
    for (let r = 0; r < side; r++) {
        for (let c = 0; c < side; c++) {
            drawCell(startX + c, startY - r, count < N ? '#1E88E5' : '#F5F5F5');
            count++;
        }
    }
    board.unsuspendUpdate();
}

/*=========================================================
    EVENTS: redraw only when the whole-number value changes
=========================================================*/

let lastN = null;
function onSlide() {
    const N = Math.round(slider.Value());
    if (N !== lastN) {
        lastN = N;
        updateScene();
    }
}
slider.on('drag', onSlide);
slider.on('up', onSlide);

onSlide();
