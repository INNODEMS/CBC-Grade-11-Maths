
'use strict';

const UNIT_CIRCLE_BUFF = 0.3;
const VERT_BUFF = 0.5;


var CIRCLE = {
    cx: 0,
    cy: 0,
    r: 1.0
};

var leftx = CIRCLE.cx - CIRCLE.r - UNIT_CIRCLE_BUFF;
var topy = CIRCLE.cy - CIRCLE.r - UNIT_CIRCLE_BUFF;

var BOARD_ID = 'jsxgraph-unit-circle';
var BOUNDING_BOX = [leftx, topy, leftx + 10, topy + 5];

var WAVES = {
    startX: leftx + 3,
    endX: leftx + 10,
    scaleX: 1,
    amp: 1,
    cosMidY: CIRCLE.cy + 2*CIRCLE.r + VERT_BUFF,
    sinMidY: CIRCLE.cy
};

var COLORS = {
    cosine: '#2447ff',
    sine: '#ff2a2a',
    circle: '#f0ae2b',
    radius: '#f0ae2b',
    panel: '#c8c8cc',
    grid: '#d4d4da',
    connectionCos: '#bcc4ff',
    connectionSin: '#ffc2c2',
    angle: '#f0ae2b',
    text: '#202020'
};

var state = {
    theta: Math.PI / 6,
    animating: false,
    lastTimestamp: 0,
    speed: 0.9
};

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function thetaToX(theta) {
    return WAVES.startX + WAVES.scaleX * theta;
}

function thetaFromPoint(p) {
    return normalizeAngle(Math.atan2(CIRCLE.cy-p.Y(), p.X() - CIRCLE.cx));
}

function pointOnCircle(theta) {
    return [
        CIRCLE.cx + CIRCLE.r * Math.cos(theta),
        CIRCLE.cy - CIRCLE.r * Math.sin(theta)
    ];
}

function currentTheta() {
    return normalizeAngle(state.theta);
}

function fmt(v) {
    return (Math.round(v * 100) / 100).toFixed(2);
}

var xMin = WAVES.startX;
var xMax = WAVES.startX + WAVES.scaleX * 2 * Math.PI;


function createWaveGrid(midY) {
    var yMin = midY - WAVES.amp;
    var yMax = midY + WAVES.amp;

    var majorThetaStep = Math.PI / 2;
    var minorThetaStep = Math.PI / 4;
    var majorYStep = 1;
    var minorYStep = 0.5;

    var i;
    var theta;
    var x;
    var y;

    // Minor vertical grid lines
    for (theta = 0, i = 0; theta <= 2 * Math.PI + 1e-9; theta += minorThetaStep, i += 1) {
        if (i % 2 === 0) {
            continue;
        }
        x = thetaToX(theta);
        board.create('segment', [[x, yMin], [x, yMax]], {
            strokeColor: '#e4e4e9',
            strokeWidth: 1,
            fixed: true,
            highlight: false
        });
    }

    // Major vertical grid lines (0, pi/2, pi, 3pi/2, 2pi)
    for (theta = 0; theta <= 2 * Math.PI + 1e-9; theta += majorThetaStep) {
        x = thetaToX(theta);
        board.create('segment', [[x, yMin], [x, yMax]], {
            strokeColor: '#d2d2d8',
            strokeWidth: 2,
            fixed: true,
            highlight: false
        });
    }

    // Minor horizontal grid lines
    for (i = 1; i <= 3; i += 2) {
        board.create('segment', [[xMin, yMin + i * minorYStep], [xMax, yMin + i * minorYStep]], {
            strokeColor: '#e4e4e9',
            strokeWidth: 1,
            fixed: true,
            highlight: false
        });
    }

    // Major horizontal grid lines
    for (i = 0; i <= 2; i += 1) {
        board.create('segment', [[xMin, yMin + i * majorYStep], [xMax, yMin + i * majorYStep]], {
            strokeColor: '#d2d2d8',
            strokeWidth: 1.4,
            fixed: true,
            highlight: false
        });
    }

    // Panel border
    board.create('polygon', [[xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]], {
        withLines: true,
        fillOpacity: 0,
        borders: {
            strokeColor: '#c8c8cf',
            strokeWidth: 0.5,
            fixed: true,
            highlight: false
        },
        vertices: {
            visible: false
        },
        fixed: true,
        highlight: false
    });
}

var board = JXG.JSXGraph.initBoard(BOARD_ID, {
    boundingbox: BOUNDING_BOX,
    keepAspectRatio: false,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false
});


createWaveGrid(WAVES.cosMidY);
createWaveGrid(WAVES.sinMidY);

var center = board.create('point', [CIRCLE.cx, CIRCLE.cy], {
    visible: false,
    fixed: true
});

var xDirection = board.create('point', [CIRCLE.cx + CIRCLE.r, CIRCLE.cy], {
    visible: false,
    fixed: true
});

var circle = board.create('circle', [center, CIRCLE.r], {
    strokeColor: 'black',
    strokeWidth: 3,
    fillOpacity: 0,
    fixed: true
});

var initial = pointOnCircle(state.theta);
var rotor = board.create('glider', [initial[0], initial[1], circle], {
    name: '',
    size: 5,
    strokeColor: COLORS.circle,
    fillColor: COLORS.circle
});

board.create('segment', [center, rotor], {
    strokeColor: COLORS.radius,
    strokeWidth: 3
});

var horizontalProjection = board.create('point', [
    function () {
        return rotor.X();
    },
    CIRCLE.cy
], {
    visible: false
});

var ang = board.create('angle', [rotor, center, xDirection], {
    radius: 0.26,
    orthoType: 'sector',
    fillColor: COLORS.angle,
    fillOpacity: 0.3,
    strokeColor: COLORS.angle,
    strokeWidth: 2,
    name: 'θ',
    withLabel: false
});



var arc_centre = board.create('point', [CIRCLE.cx + CIRCLE.r, WAVES.cosMidY - 1], {
    visible: false
});
var arc_tl = board.create('point', [() => rotor.X(), WAVES.cosMidY - 1], {
    visible: false
});
var arc_br = board.create('point', [CIRCLE.cx + CIRCLE.r, () => WAVES.cosMidY - Math.cos(currentTheta())], {
    visible: false
});

var top_left = board.create('point', [CIRCLE.cx - CIRCLE.r, WAVES.cosMidY - 1], {
    visible: false
});

var bottom_right = board.create('point', [CIRCLE.cx + CIRCLE.r, WAVES.cosMidY + 1], {
    visible: false
});



var a = board.create('arc', [arc_centre, arc_br, arc_tl], {
    strokeColor: COLORS.cosine,
    strokeWidth: 2,
    withLabel: false
});

board.create('arc', [arc_centre, bottom_right, top_left], {
    strokeColor: COLORS.grid,
    strokeWidth: 2,
    withLabel: false
});

board.create('segment', [arc_centre, top_left], {
    strokeColor: COLORS.grid,
    strokeWidth: 2
});

board.create('segment', [arc_centre, bottom_right], {
    strokeColor: COLORS.grid,
    strokeWidth: 2,
});

board.create('curve', [
    function (u) {
        return thetaToX(u);
    },
    function (u) {
        return WAVES.cosMidY - WAVES.amp * Math.cos(u);
    },
    0,
    2 * Math.PI
], {
    strokeColor: '#d9ddff',
    strokeWidth: 3,
    fixed: true,
    highlight: false,
    fillOpacity: 1,
});

board.create('curve', [
    function (u) {
        return thetaToX(u);
    },
    function (u) {
        return WAVES.sinMidY - WAVES.amp * Math.sin(u);
    },
    0,
    2 * Math.PI
], {
    strokeColor: '#ffd8d8',
    strokeWidth: 3,
    fixed: true,
    highlight: false,
    fillOpacity: 1
});

board.create('curve', [
    function (u) {
        return thetaToX(u);
    },
    function (u) {
        return WAVES.cosMidY - WAVES.amp * Math.cos(u);
    },
    0,
    function () {
        return currentTheta();
    }
], {
    strokeColor: COLORS.cosine,
    strokeWidth: 4,
    highlight: false,
    fillOpacity: 1
});

board.create('curve', [
    function (u) {
        return thetaToX(u);
    },
    function (u) {
        return WAVES.sinMidY - WAVES.amp * Math.sin(u);
    },
    0,
    function () {
        return currentTheta();
    }
], {
    strokeColor: COLORS.sine,
    strokeWidth: 4,
    highlight: false,
    fillOpacity: 1
});

var cosHead = board.create('point', [
    function () {
        return thetaToX(currentTheta());
    },
    function () {
        return WAVES.cosMidY - WAVES.amp * Math.cos(currentTheta());
    }
], {
    name: '',
    size: 4,
    strokeColor: COLORS.cosine,
    fillColor: COLORS.cosine,
    fixed: true
});

var sinHead = board.create('point', [
    function () {
        return thetaToX(currentTheta());
    },
    function () {
        return WAVES.sinMidY - WAVES.amp * Math.sin(currentTheta());
    }
], {
    name: '',
    size: 4,
    strokeColor: COLORS.sine,
    fillColor: COLORS.sine,
    fixed: true
});

board.create('segment', [rotor, arc_tl], {
    strokeColor: COLORS.connectionCos,
    strokeWidth: 2,
    dash: 1
});

board.create('segment', [arc_br, cosHead], {
    strokeColor: COLORS.connectionCos,
    strokeWidth: 2,
    dash: 1
});

board.create('segment', [rotor, sinHead], {
    strokeColor: COLORS.connectionSin,
    strokeWidth: 2,
    dash: 1
});

board.create('text', [
    WAVES.startX + 2 * Math.PI - 0.7,
    WAVES.cosMidY - 0.2,
    'cos θ'
], {
    fontSize: 16,
    color: COLORS.cosine,
    fixed: true
});

board.create('text', [
    WAVES.startX + 2 * Math.PI - 0.7,
    WAVES.sinMidY - 0.2,
    'sin θ'
], {
    fontSize: 16,
    color: COLORS.sine,
    fixed: true
});

function createThetaLabels(midY) {
    board.create('text', [thetaToX(0), midY + 0.14, '0'], {
        fontSize: 14,
        color: '#555',
        fixed: true
    });

    board.create('text', [thetaToX(Math.PI / 2) - 0.15, midY + 0.14, '90°'], {
        fontSize: 14,
        color: '#555',
        fixed: true
    });

    board.create('text', [thetaToX(Math.PI) - 0.08, midY + 0.14, '180°'], {
        fontSize: 14,
        color: '#555',
        fixed: true
    });

    board.create('text', [thetaToX(3 * Math.PI / 2) - 0.15, midY + 0.14, '270°'], {
        fontSize: 14,
        color: '#555',
        fixed: true
    });

    board.create('text', [thetaToX(2 * Math.PI) - 0.15, midY + 0.14, '360°'], {
        fontSize: 14,
        color: '#555',
        fixed: true
    });
}

function createYLabels(midY) {
    var labelX = xMin - 0.12;

    board.create('text', [labelX, midY + 1, '-1'], {
        fontSize: 14,
        color: '#555',
        fixed: true,
        anchorX: 'right'
    });

    board.create('text', [labelX, midY, '0'], {
        fontSize: 14,
        color: '#555',
        fixed: true,
        anchorX: 'right'
    });

    board.create('text', [labelX, midY - 1, '1'], {
        fontSize: 14,
        color: '#555',
        fixed: true,
        anchorX: 'right'
    });
}

createThetaLabels(WAVES.cosMidY);
createThetaLabels(WAVES.sinMidY);

createYLabels(WAVES.cosMidY);
createYLabels(WAVES.sinMidY);

rotor.on('drag', function () {
    state.theta = thetaFromPoint(rotor);
});

rotor.on('down', function () {
    state.animating = false;
    updateButton();
});

board.create('segment', [center, horizontalProjection], {
    strokeColor: COLORS.cosine,
    strokeWidth: 3
});

board.create('segment', [horizontalProjection, rotor], {
    strokeColor: COLORS.sine,
    strokeWidth: 3
});


board.create('text', [CIRCLE.cx, CIRCLE.cy + 1.25, function () {
    const phi = JXG.Math.Geometry.trueAngle(rotor, center, xDirection);''
    return 'θ = ' + phi.toFixed(1) + '°';
}], {
    anchorX: 'middle',
    fontSize: 14,
    anchorY: 'middle',
    color: COLORS.angle
});