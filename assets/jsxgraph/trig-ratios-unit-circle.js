'use strict';

const CIRCLE = { cx: 0, cy: 0, r: 1 };
const BOARD_ID = 'jsxgraph-trig-ratios-unit-circle';
const BOUNDING_BOX = [-2.2, 3.0, 2.2, -1.5];

const COLORS = {
    axis: '#555555',
    circle: '#222222',
    radius: '#f0ae2b',
    sine: '#d82737',
    cosine: '#2b5cff',
    tangent: '#1f8a2f',
    positive: '#1f8a2f',
    negative: '#d82737',
    undefined: '#777777',
    text: '#202020',
    quadrant1: '#dbefff',
    quadrant2: '#dff0d7',
    quadrant3: '#ffe9d8',
    quadrant4: '#ffe1eb'
};

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function toDegrees(rad) {
    return normalizeAngle(rad) * 180 / Math.PI;
}

function fmt(value) {
    if (Math.abs(value) < 5e-4) {
        return '0.000';
    }
    return (Math.round(value * 1000) / 1000).toFixed(3);
}

function fmtSigned(value) {
    if (Math.abs(value) < 5e-4) {
        return '0.000';
    }
    return (value > 0 ? '+' : '') + fmt(value);
}

function valueColor(value) {
    if (value > 0) return COLORS.positive;
    if (value < 0) return COLORS.negative;
    return COLORS.undefined;
}

const board = JXG.JSXGraph.initBoard(BOARD_ID, {
    boundingbox: BOUNDING_BOX,
    keepAspectRatio: false,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false
});

board.create('polygon', [[0, 0], [2.2, 0], [2.2, 1.7], [0, 1.7]], {
    fillColor: COLORS.quadrant1,
    fillOpacity: 0.13,
    strokeOpacity: 0,
    fixed: true,
    highlight: false,
    vertices: { visible: false }
});
board.create('polygon', [[-2.2, 0], [0, 0], [0, 1.7], [-2.2, 1.7]], {
    fillColor: COLORS.quadrant2,
    fillOpacity: 0.13,
    strokeOpacity: 0,
    fixed: true,
    highlight: false,
    vertices: { visible: false }
});
board.create('polygon', [[-2.2, -1.5], [0, -1.5], [0, 0], [-2.2, 0]], {
    fillColor: COLORS.quadrant3,
    fillOpacity: 0.13,
    strokeOpacity: 0,
    fixed: true,
    highlight: false,
    vertices: { visible: false }
});
board.create('polygon', [[0, -1.5], [2.2, -1.5], [2.2, 0], [0, 0]], {
    fillColor: COLORS.quadrant4,
    fillOpacity: 0.13,
    strokeOpacity: 0,
    fixed: true,
    highlight: false,
    vertices: { visible: false }
});

const center = board.create('point', [CIRCLE.cx, CIRCLE.cy], { visible: false, fixed: true });
const xAxis = board.create('line', [[-2.2, 0], [2.2, 0]], {
    strokeColor: COLORS.axis,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
    straightFirst: false,
    straightLast: false
});
const yAxis = board.create('line', [[0, -1.5], [0, 2.5]], {
    strokeColor: COLORS.axis,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
    straightFirst: false,
    straightLast: false
});

const circle = board.create('circle', [center, CIRCLE.r], {
    strokeColor: COLORS.circle,
    strokeWidth: 3,
    fillOpacity: 0,
    fixed: true
});

const rotor = board.create('glider', [CIRCLE.cx + CIRCLE.r, CIRCLE.cy, circle], {
    name: 'P',
    size: 5,
    strokeColor: COLORS.circle,
    fillColor: COLORS.circle
});

const xFoot = board.create('point', [function () {
    return rotor.X();
}, 0], { visible: false, fixed: true });
const yFoot = board.create('point', [0, function () {
    return rotor.Y();
}], { visible: false, fixed: true });

board.create('segment', [center, xFoot], {
    strokeColor: COLORS.cosine,
    strokeWidth: 3,
    dash: 2
});
board.create('segment', [xFoot, rotor], {
    strokeColor: COLORS.sine,
    strokeWidth: 3,
    dash: 2
});
board.create('segment', [center, rotor], {
    strokeColor: COLORS.radius,
    strokeWidth: 3
});

board.create('angle', [rotor, center, board.create('point', [CIRCLE.cx + 1, CIRCLE.cy], { visible: false, fixed: true })], {
    radius: 0.25,
    withLabel: false,
    fillColor: COLORS.radius,
    fillOpacity: 0.25,
    strokeColor: COLORS.radius,
    strokeWidth: 2
});

const thetaLabel = board.create('text', [0, 2.85, ''], {
    anchorX: 'middle',
    fontSize: 16,
    color: COLORS.text,
    fixed: true
});
const cosLabel = board.create('text', [-1.95, 2.45, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.text,
    fixed: true
});
const sinLabel = board.create('text', [-1.95, 2.2, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.text,
    fixed: true
});
const tanLabel = board.create('text', [-1.95, 1.95, ''], {
    anchorX: 'left',
    fontSize: 14,
    color: COLORS.text,
    fixed: true
});

function updateLabels() {
    const cosValue = rotor.X();
    const sinValue = rotor.Y();
    const angle = toDegrees(Math.atan2(sinValue, cosValue));
    const tanValue = Math.abs(cosValue) < 1e-6 ? null : sinValue / cosValue;

    thetaLabel.setText('θ = ' + angle.toFixed(1) + '°');
    cosLabel.setText('cos θ = ' + fmtSigned(cosValue));
    sinLabel.setText('sin θ = ' + fmtSigned(sinValue));
    tanLabel.setText('tan θ = ' + (tanValue === null ? 'undefined' : fmtSigned(tanValue)));

    cosLabel.setAttribute({ color: valueColor(cosValue) });
    sinLabel.setAttribute({ color: valueColor(sinValue) });
    tanLabel.setAttribute({ color: tanValue === null ? COLORS.undefined : valueColor(tanValue) });
}

board.on('update', updateLabels);
updateLabels();

rotor.on('drag', function () {
    // Allow the point to stay on the circle.
});

rotor.on('down', function () {
    // Ensure the display updates while dragging.
    updateLabels();
});
