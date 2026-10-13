'use strict';

const BOARD_ID = 'jsxgraph-negative-angle-reflection';
const BOUNDING_BOX = [-3.4, 3.2, 3.4, -2.6];
const COLORS = {
    axis: '#555555',
    circle: '#222222',
    positive: '#2457d6',
    negative: '#d43b3b',
    guide: '#777777',
    text: '#202020'
};

const board = JXG.JSXGraph.initBoard(BOARD_ID, {
    boundingbox: BOUNDING_BOX,
    keepAspectRatio: true,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false
});

const center = board.create('point', [0, 0], { visible: false, fixed: true });
const xAxis = board.create('line', [[-1.25, 0], [1.25, 0]], {
    strokeColor: COLORS.axis,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
    straightFirst: false,
    straightLast: false,
    name: 'x'
});
const yAxis = board.create('line', [[0, -1.25], [0, 1.25]], {
    strokeColor: COLORS.axis,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
    straightFirst: false,
    straightLast: false,
    name: 'y'
});
const circle = board.create('circle', [center, 1], {
    strokeColor: COLORS.circle,
    strokeWidth: 3,
    fillOpacity: 0,
    fixed: true,
    highlight: false
});

const slider = board.create('slider', [[-2.7, -2.05], [0.1, -2.05], [-180, 45, 180]], {
    name: 'θ',
    snapWidth: 1,
    fixed: true,
    highlight: false
});

function radians() {
    return slider.Value() * Math.PI / 180;
}

function pointCoordinates(angle) {
    return [Math.cos(angle), Math.sin(angle)];
}

const pointTheta = board.create('point', [
    function () { return Math.cos(radians()); },
    function () { return Math.sin(radians()); }
], {
    name: 'P',
    size: 5,
    strokeColor: COLORS.positive,
    fillColor: COLORS.positive,
    fixed: true,
    highlight: false
});
const pointNegativeTheta = board.create('point', [
    function () { return Math.cos(radians()); },
    function () { return -Math.sin(radians()); }
], {
    name: 'Q',
    size: 5,
    strokeColor: COLORS.negative,
    fillColor: COLORS.negative,
    fixed: true,
    highlight: false
});

board.create('segment', [center, pointTheta], {
    strokeColor: COLORS.positive,
    strokeWidth: 3,
    fixed: true,
    highlight: false
});
board.create('segment', [center, pointNegativeTheta], {
    strokeColor: COLORS.negative,
    strokeWidth: 3,
    fixed: true,
    highlight: false
});
board.create('segment', [pointTheta, pointNegativeTheta], {
    strokeColor: COLORS.guide,
    dash: 2,
    strokeWidth: 2,
    fixed: true,
    highlight: false
});

const thetaLabel = board.create('text', [-2.7, 2.75, ''], {
    anchorX: 'left',
    fontSize: 16,
    color: COLORS.text,
    fixed: true
});
const positiveCoordinates = board.create('text', [1.45, 1.2, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.positive,
    fixed: true
});
const negativeCoordinates = board.create('text', [1.45, 0.75, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.negative,
    fixed: true
});
const symmetryLabel = board.create('text', [1.45, 0.2, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.text,
    fixed: true
});

function format(value) {
    return (Math.round(value * 1000) / 1000).toFixed(3);
}

function updateLabels() {
    const angle = slider.Value();
    const coordinates = pointCoordinates(radians());
    thetaLabel.setText('θ = ' + angle.toFixed(0) + '°    -θ = ' + (-angle).toFixed(0) + '°');
    positiveCoordinates.setText('P (θ):       (' + format(coordinates[0]) + ', ' + format(coordinates[1]) + ')');
    negativeCoordinates.setText('Q (-θ):     (' + format(coordinates[0]) + ', ' + format(-coordinates[1]) + ')');
    symmetryLabel.setText('Same x-coordinate; opposite y-coordinates');
}

board.on('update', updateLabels);
updateLabels();