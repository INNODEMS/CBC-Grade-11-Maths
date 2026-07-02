// 1. Initialize the board
const board = JXG.JSXGraph.initBoard('jsxgraph-domain-explorer', {
    boundingbox: [-8, 8, 8, -8],
    axis: true,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Define the four function types from the domain rules table
const functions = [
    {
        label: 'f(x) = 0.3x\u00B2 \u2212 1',
        fn: (x) => 0.3 * x * x - 1,
        domainText: 'Polynomial \u2014 domain: all real numbers',
        color: '#2563eb'
    },
    {
        label: 'f(x) = \u221A(x \u2212 1)',
        fn: (x) => (x - 1 >= 0 ? Math.sqrt(x - 1) : NaN),
        domainText: 'Square root \u2014 domain: x \u2265 1',
        color: '#16a34a'
    },
    {
        label: 'f(x) = 1 / (x \u2212 1)',
        fn: (x) => (x === 1 ? NaN : 1 / (x - 1)),
        domainText: 'Rational \u2014 domain: x \u2260 1',
        color: '#9333ea'
    },
    {
        label: 'f(x) = ln(x \u2212 1)',
        fn: (x) => (x - 1 > 0 ? Math.log(x - 1) : NaN),
        domainText: 'Logarithm \u2014 domain: x \u2192 1',
        color: '#ea580c'
    }
];

let currentIndex = 0;
let curveObj = null;
let labelText = null;
let domainDescText = null;
let markerObjects = [];

// 3. Slider to choose an input value to test
const xSlider = board.create('slider', [[-7, -6.3], [7, -6.3], [-7, 0, 7]], {
    name: 'x', snapWidth: 0.1, size: 6,
    label: { fontSize: 16, cssClass: 'font-bold' }
});

function clearMarkers() {
    board.removeObject(markerObjects);
    markerObjects = [];
}

// 4. Test the current x-value against the current function
function updateMarker() {
    clearMarkers();
    const x = xSlider.Value();
    const f = functions[currentIndex];
    const y = f.fn(x);
    const defined = isFinite(y) && !isNaN(y);

    if (defined) {
        let dash = board.create('segment', [[x, 0], [x, y]], {
            strokeColor: '#94a3b8', dash: 2, strokeWidth: 1
        });
        markerObjects.push(dash);

        let pt = board.create('point', [x, y], {
            name: '', size: 5, color: '#16a34a', fixed: true
        });
        markerObjects.push(pt);

        let txt = board.create('text', [0, -7.3,
            () => 'x = ' + x.toFixed(1) + ' IS in the domain \u2192 f(' + x.toFixed(1) + ') = ' + y.toFixed(2)
        ], { fontSize: 15, anchorX: 'middle', color: '#166534', cssClass: 'font-bold' });
        markerObjects.push(txt);
    } else {
        let cross = board.create('point', [x, 0], {
            name: '', size: 6, face: 'x', strokeColor: '#dc2626',
            fillColor: '#dc2626', strokeWidth: 3, fixed: true
        });
        markerObjects.push(cross);

        let txt = board.create('text', [0, -7.3,
            () => 'x = ' + x.toFixed(1) + ' is NOT in the domain \u2192 f(' + x.toFixed(1) + ') is undefined'
        ], { fontSize: 15, anchorX: 'middle', color: '#dc2626', cssClass: 'font-bold' });
        markerObjects.push(txt);
    }
}

// 5. Switch which function is being tested
function switchFunction(index) {
    currentIndex = index;
    const f = functions[index];

    if (curveObj) board.removeObject(curveObj);
    if (labelText) board.removeObject(labelText);
    if (domainDescText) board.removeObject(domainDescText);

    curveObj = board.create('functiongraph', [f.fn, -7.5, 7.5], {
        strokeColor: f.color, strokeWidth: 3
    });

    labelText = board.create('text', [0, 7.3, f.label], {
        fontSize: 18, anchorX: 'middle', cssClass: 'font-bold', color: f.color
    });

    domainDescText = board.create('text', [0, 6.4, f.domainText], {
        fontSize: 14, anchorX: 'middle', color: '#334155'
    });

    updateMarker();
}

xSlider.on('drag', updateMarker);

// 6. Buttons to choose the function type
board.create('button', [-7, 3.5, 'Polynomial', () => switchFunction(0)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 2.7, 'Square Root', () => switchFunction(1)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 1.9, 'Rational', () => switchFunction(2)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});
board.create('button', [-7, 1.1, 'Logarithm', () => switchFunction(3)], {
    fixed: true, cssStyle: 'padding: 6px 10px; cursor: pointer;'
});

// 7. Load the first function on start
switchFunction(0);