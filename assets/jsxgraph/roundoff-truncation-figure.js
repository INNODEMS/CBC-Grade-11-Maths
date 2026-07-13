
const board = JXG.JSXGraph.initBoard('jsxgraph-roundoff-truncation', {
  boundingbox: [-16, 12, 16, -12],
  axis: false,
  keepAspectRatio: false,
  showNavigation: false,
  showCopyright: false
});

const COLORS = {
  blue: "#0D47A1",
  lightBlue: "#EAF3FF",
  orange: "#F57C00",
  green: "#2E7D32",
  purple: "#6A1B9A",
  grey: "#EEEEEE",
  yellow: "#FFF8E1"
};

let showWorking = false;
let showTruncation = false;
let showRounding = false;
let showErrors = false;
let revealValues = false;
let checked = false;

board.create('polygon', [
  [-15.6, 10], [8.5, 10], [8.5, 8.2], [-15.6, 8.2]
], {
  fillColor: COLORS.yellow,
  strokeColor: "#FBC02D",
  strokeWidth: 2,
  fixed: true
});

board.create('text', [
  -15.2, 9.25,
  '<span style="font-size:16px;">Click the Reset challenge button to clear the workspace for the second trial.</span>'
], { anchorX: "left", fixed: true });

const rulerLeft = -15.0;
const rulerRight = 7.8;
const rulerLength = rulerRight - rulerLeft;
const rulerY = 4.2;
const rulerHeight = 0.9;

board.create('polygon', [
  [rulerLeft, rulerY], [rulerRight, rulerY],
  [rulerRight, rulerY - rulerHeight], [rulerLeft, rulerY - rulerHeight]
], { fillColor: "#F7F3E8", fillOpacity: 1, strokeColor: "#999999", strokeWidth: 2, fixed: true });

board.create('segment', [[rulerLeft, rulerY], [rulerRight, rulerY]], {
  strokeWidth: 2, strokeColor: "black", fixed: true
});

function cmToX(cm) {
  return rulerLeft + (cm / 5) * rulerLength;
}

for (let cm = 0; cm <= 5; cm++) {
  let x = cmToX(cm);
  board.create('segment', [[x, rulerY], [x, rulerY + 0.85]], {
    strokeWidth: 2, strokeColor: "black", fixed: true
  });
}
for (let cm = 1; cm <= 5; cm++) {
  board.create('text', [cmToX(cm) - 0.12, rulerY + 1.05, cm.toString()], {
    fontSize: 18, fixed: true
  });
}
for (let cm = 0; cm < 5; cm++) {
  let x = cmToX(cm + 0.5);
  board.create('segment', [[x, rulerY], [x, rulerY + 0.6]], { strokeWidth: 1.5, fixed: true });
}
for (let mm = 1; mm < 50; mm++) {
  if (mm % 10 === 0) continue;
  if (mm % 5 === 0) continue;
  let x = cmToX(mm / 10);
  board.create('segment', [[x, rulerY], [x, rulerY + 0.35]], {
    strokeWidth: 1, strokeColor: "#444", fixed: true
  });
}

board.create('text', [-15, 6.6,
  '<span style="font-size:22px;color:#0D47A1;"><b>15 cm RULER (centimetres)</b></span>'
], { fixed: true });


const pinY = rulerY + 1.6;

const pinLine = board.create('line', [[rulerLeft, pinY], [rulerRight, pinY]], {
  visible: false, fixed: true
});

const working = board.create('glider', [cmToX(4.7), pinY, pinLine], {
  name: '',
  size: 6,
  strokeColor: "#E65100",
  fillColor: "#F57C00",
  face: 'circle'
});

const workingFoot = board.create('point', [
  function () { return working.X(); },
  rulerY
], {
  name: '',
  size: 5,
  strokeColor: "#E65100",
  fillColor: "#F57C00",
  fixed: true
});

board.create('segment', [working, workingFoot], {
  strokeColor: '#E65100',
  strokeWidth: 1.5,
  dash: 2,
  fixed: true,
  highlight: false
});

board.create('text', [
  function () { return working.X(); },
  function () { return working.Y(); },
  "\u2605"
], {
  anchorX: 'middle',
  anchorY: 'middle',
  fontSize: 15,
  color: '#E65100',
  fixed: true,
  highlight: false,
  cssStyle: 'pointer-events:none;'
});

function measuredValue() {
  let cm = ((workingFoot.X() - rulerLeft) / rulerLength) * 5;
  return Math.round(cm * 10) / 10;
}


board.create('text', [
  function () { return working.X() - 0.5; },
  pinY + 0.6,
  function () {
    return '<span style="font-size:16px;color:#F57C00;"><b>' + measuredValue().toFixed(1) + ' cm</b></span>';
  }
], { visible: function () { return showWorking; } });

board.create('button', [9.5, 6, 'Show Working', function () {
  showWorking = !showWorking;
  board.update();
}]);

board.create('button', [9.5, 5, 'Show Rounding', function () {
  showRounding = !showRounding;
  board.update();
}]);

board.create('button', [9.5, 4, 'Show Truncation', function () {
  showTruncation = !showTruncation;
  board.update();
}]);

board.create('button', [9.5, 3, 'Show Errors', function () {
  showErrors = !showErrors;
  board.update();
}]);

board.create('button', [9.5, 2, 'Reveal Values', function () {
  revealValues = !revealValues;
  board.update();
}]);

function truncValue() {
  return Math.floor(measuredValue());
}
function roundValue() {
  return Math.round(measuredValue());
}
function valueToX(v) {
  return cmToX(v);
}
function truncError() {
  return Math.abs(measuredValue() - truncValue());
}
function roundError() {
  return Math.abs(measuredValue() - roundValue());
}


const truncPinY = rulerY - 2.0;
const roundPinY = rulerY - 3.0;

const truncFoot = board.create('point', [
  function () { return valueToX(truncValue()); },
  rulerY
], {
  name: '', size: 4, face: 'o',
  fillColor: '#1565C0', strokeColor: '#1565C0',
  fixed: true,
  visible: function () { return showTruncation; }
});

const roundFoot = board.create('point', [
  function () { return valueToX(roundValue()); },
  rulerY
], {
  name: '', size: 4, face: 'o',
  fillColor: '#2E7D32', strokeColor: '#2E7D32',
  fixed: true,
  visible: function () { return showRounding; }
});

const truncPin = board.create('point', [
  function () { return valueToX(truncValue()); },
  truncPinY
], {
  name: '', size: 9, face: 'o',
  fillColor: '#1565C0', strokeColor: '#1565C0',
  fixed: true,
  visible: function () { return showTruncation; }
});

const roundPin = board.create('point', [
  function () { return valueToX(roundValue()); },
  roundPinY
], {
  name: '', size: 9, face: 'o',
  fillColor: '#2E7D32', strokeColor: '#2E7D32',
  fixed: true,
  visible: function () { return showRounding; }
});

board.create('segment', [truncFoot, truncPin], {
  strokeColor: '#1565C0', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false,
  visible: function () { return showTruncation; }
});

board.create('segment', [roundFoot, roundPin], {
  strokeColor: '#2E7D32', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false,
  visible: function () { return showRounding; }
});

board.create('text', [
  function () { return truncPin.X(); },
  function () { return truncPin.Y(); },
  'T'
], {
  anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: '#FFFFFF',
  fixed: true, highlight: false, cssStyle: 'pointer-events:none;',
  visible: function () { return showTruncation; }
});

board.create('text', [
  function () { return roundPin.X(); },
  function () { return roundPin.Y(); },
  'R'
], {
  anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: '#FFFFFF',
  fixed: true, highlight: false, cssStyle: 'pointer-events:none;',
  visible: function () { return showRounding; }
});


const truncArrow = board.create('arrow', [workingFoot, truncFoot], {
  strokeColor: '#1565C0', strokeWidth: 2, dash: 2,
  lastArrow: { type: 2, size: 6 },
  visible: function () { return showErrors && showTruncation; }
});

const roundArrow = board.create('arrow', [workingFoot, roundFoot], {
  strokeColor: '#2E7D32', strokeWidth: 2, dash: 2,
  lastArrow: { type: 2, size: 6 },
  visible: function () { return showErrors && showRounding; }
});

board.create('text', [
  function () { return (workingFoot.X() + truncFoot.X()) / 2 - 0.3; },
  rulerY - 0.4,
  function () { return '<span style="color:#1565C0;"><b>' + truncError().toFixed(1) + '</b></span>'; }
], { visible: function () { return showErrors && showTruncation; } });

board.create('text', [
  function () { return (workingFoot.X() + roundFoot.X()) / 2 - 0.3; },
  rulerY - 0.6,
  function () { return '<span style="color:#2E7D32;"><b>' + roundError().toFixed(1) + '</b></span>'; }
], { visible: function () { return showErrors && showRounding; } });


board.create('polygon', [[-15.6, -0.8], [-9.8, -0.8], [-9.8, -5.8], [-15.6, -5.8]], {
  fillColor: '#FFFFFF', strokeColor: '#F57C00', strokeWidth: 2, fixed: true,
  visible: function () { return revealValues; }
});
board.create('text', [-15.2, -1.4,
  '<span style="font-size:18px;font-weight:bold;color:#F57C00;">WORKING</span>'
], { visible: function () { return revealValues; }, fixed: true });
board.create('text', [-13.9, -3.1, function () {
  return '<span style="font-size:34px;font-weight:bold;color:#F57C00;">' + measuredValue().toFixed(1) + ' cm</span>';
}], { visible: function () { return revealValues; } });
board.create('text', [-14.6, -4.5, 'Measured to 1 decimal place'], {
  visible: function () { return revealValues; }
});

board.create('polygon', [[-9.5, -0.8], [-3.7, -0.8], [-3.7, -5.8], [-9.5, -5.8]], {
  fillColor: '#FFFFFF', strokeColor: '#1565C0', strokeWidth: 2,
  visible: function () { return revealValues; }
});

board.create('button', [9.4, -2.4, 'Reset Challenge', function () {

    
    checked = false;

    
    showErrors = false;
    showTruncation = false;
    showRounding = false;
    showWorking = false;
    revealValues = false;

   
    document.getElementById('truncInput').value = '';
    document.getElementById('roundInput').value = '';

    
    board.update();
}]);

board.create('text', [-8.9, -1.4,
  '<span style="font-size:18px;font-weight:bold;color:#1565C0;">TRUNCATION</span>'
], { visible: function () { return revealValues; } });
board.create('text', [-7.7, -3, function () {
  return '<span style="font-size:34px;font-weight:bold;color:#1565C0;">' + truncValue() + ' cm</span>';
}], { visible: function () { return revealValues; } });
board.create('text', [-8.8, -4.6, function () {
  return measuredValue().toFixed(1) + ' \u2192 ' + truncValue();
}], { visible: function () { return revealValues; } });

board.create('polygon', [[-3.4, -0.8], [2.4, -0.8], [2.4, -5.8], [-3.4, -5.8]], {
  fillColor: '#FFFFFF', strokeColor: '#2E7D32', strokeWidth: 2,
  visible: function () { return revealValues; }
});
board.create('text', [-2.8, -1.4,
  '<span style="font-size:18px;font-weight:bold;color:#2E7D32;">ROUNDING</span>'
], { visible: function () { return revealValues; } });
board.create('text', [-1.6, -3, function () {
  return '<span style="font-size:34px;font-weight:bold;color:#2E7D32;">' + roundValue() + ' cm</span>';
}], { visible: function () { return revealValues; } });
board.create('text', [-2.8, -4.6, function () {
  return measuredValue().toFixed(1) + ' \u2192 ' + roundValue();
}], { visible: function () { return revealValues; } });

board.create('polygon', [[2.7, -0.8], [8.5, -0.8], [8.5, -5.8], [2.7, -5.8]], {
  fillColor: '#FFFFFF', strokeColor: '#6A1B9A', strokeWidth: 2,
  visible: function () { return revealValues; }
});
board.create('text', [3.2, -1.4,
  '<span style="font-size:18px;font-weight:bold;color:#6A1B9A;">ERRORS</span>'
], { visible: function () { return revealValues; } });
board.create('text', [3.2, -2.7, function () {
  return 'Truncation Error = ' + truncError().toFixed(1) + ' cm';
}], { visible: function () { return revealValues; } });
board.create('text', [3.2, -4, function () {
  return 'Rounding Error = ' + roundError().toFixed(1) + ' cm';
}], { visible: function () { return revealValues; } });

function winner() {
  if (truncError() < roundError()) return "Truncation is closer.";
  if (roundError() < truncError()) return "Rounding is closer.";
  return "Both methods are equally close.";
}
board.create('text', [-2, -6.8, function () {
  return '<span style="font-size:18px;color:#6A1B9A;"><b>\u2605 ' + winner() + '</b></span>';
}], { visible: function () { return revealValues; } });


board.create('text', [-15.2, -6.9,
  '<span style="font-size:20px;font-weight:bold;color:#0D47A1;">Prediction Challenge</span>'
], { fixed: true });

board.create('text', [-15.2, -7.8,
  'Enter your predictions, then click Check.'
], { fixed: true });


board.create('text', [-15.2, -8.8,
  '<span>Truncate: <input id="truncInput" type="number" min="0" max="15" style="width:55px;"></span>'
], { fixed: true });

board.create('text', [-15.2, -10.0,
  '<span>Round:&nbsp;&nbsp;&nbsp;&nbsp; <input id="roundInput" type="number" min="0" max="15" style="width:55px;"></span>'
], { fixed: true });

board.create('button', [-4, -9.3, 'Check Answers', function () {
  checked = true;
  board.update();
}]);

board.create('text', [0, -8.8, function () {
  if (!checked) return '';

  const guess = parseInt(document.getElementById('truncInput').value, 10);

  return guess === truncValue()
    ? '<span style="color:green;font-size:20px;">&#10004; Correct</span>'
    : '<span style="color:red;font-size:20px;">&#10008; Try Again</span>';
}]);

board.create('text', [0, -10, function () {
  if (!checked) return '';

  const guess = parseInt(document.getElementById('roundInput').value, 10);

  return guess === roundValue()
    ? '<span style="color:green;font-size:20px;">&#10004; Correct</span>'
    : '<span style="color:red;font-size:20px;">&#10008; Try Again</span>';
}]);

board.create('text', [-1, -11, function () {
  if (!checked) return '';

  const ok1 = parseInt(document.getElementById('truncInput').value, 10) === truncValue();
  const ok2 = parseInt(document.getElementById('roundInput').value, 10) === roundValue();

  if (ok1 && ok2) {
    return '<span style="font-size:22px;color:#2E7D32;"><b>🎉 Excellent! Both predictions are correct.</b></span>';
  }
  return '';
}]);
document.getElementById('truncInput').value = '';
document.getElementById('roundInput').value = '';