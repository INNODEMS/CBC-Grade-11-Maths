/*
    y = b^x and y = log_b x as mirror images in y = x
    --------------------------------------------------
    Slider b (base). The blue curve is y = b^x, the red curve is y = log_b x,
    the dashed grey line is y = x. The point P glides along y = b^x; its
    mirror image P' (coordinates swapped) lies on y = log_b x. The readout
    shows the matching statements  b^p = q  <=>  log_b q = p.

    Expects: a surface="jsxboard" slate with id="jsx-log-exp-mirror".
*/

JXG.Options.text.fontSize = 14;
JXG.Options.text.useMathJax = false;

const board = JXG.JSXGraph.initBoard('jsx-log-exp-mirror', {
    boundingbox: [-4.5, 8, 8, -4.5],
    keepAspectRatio: true,
    axis: true,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const b = board.create('slider', [[-4, 7.2], [0, 7.2], [1.2, 2, 5]], {
    name: 'b', snapWidth: 0.1, precision: 1, size: 4, label: { fontSize: 14 }
});
const B = () => b.Value();

board.create('functiongraph', [(x) => x, -4.5, 8], { strokeColor: '#9e9e9e', dash: 2, strokeWidth: 1.5, highlight: false });
const expG = board.create('functiongraph', [(x) => Math.pow(B(), x), -4.5, 8], { strokeColor: '#1565c0', strokeWidth: 2.5, highlight: false });
board.create('functiongraph', [(x) => Math.log(x) / Math.log(B()), 0.001, 8], { strokeColor: '#c62828', strokeWidth: 2.5, highlight: false });

board.create('text', [5.6, 6.2, 'y = x'], { fixed: true, color: '#757575' });
board.create('text', [() => Math.log(6.5) / Math.log(B()) + 0.15, 6.5, () => 'y = ' + B().toFixed(1) + '<sup>x</sup>'], { fixed: true, color: '#1565c0' });
board.create('text', [6.3, () => Math.log(6.3) / Math.log(B()) - 0.55, () => 'y = log<sub>' + B().toFixed(1) + '</sub> x'], { fixed: true, color: '#c62828' });

// Fixed key points (0, 1) and (1, 0)
board.create('point', [0, 1], { name: '(0, 1)', size: 3, fixed: true, color: '#1565c0', label: { offset: [-48, 8] } });
board.create('point', [1, 0], { name: '(1, 0)', size: 3, fixed: true, color: '#c62828', label: { offset: [4, -14] } });

// P on y = b^x and its mirror image P'
const P = board.create('glider', [1.5, Math.pow(2, 1.5), expG], {
    name: 'P', size: 5, strokeColor: '#1565c0', fillColor: '#1565c0'
});
const Pm = board.create('point', [() => P.Y(), () => P.X()], {
    name: "P'", size: 5, strokeColor: '#c62828', fillColor: '#c62828', fixed: true
});
board.create('segment', [P, Pm], { strokeColor: '#6a1b9a', dash: 1, strokeWidth: 1.5, highlight: false });

board.create('text', [-4.2, -3.3, () => {
    const p = P.X(), q = P.Y(), base = B().toFixed(1);
    return '<span style="color:#1565c0">P = (' + p.toFixed(2) + ', ' + q.toFixed(2) + '): ' +
        base + '<sup>' + p.toFixed(2) + '</sup> = ' + q.toFixed(2) + '</span><br>' +
        '<span style="color:#c62828">P′ = (' + q.toFixed(2) + ', ' + p.toFixed(2) + '): log<sub>' +
        base + '</sub> ' + q.toFixed(2) + ' = ' + p.toFixed(2) + '</span>';
}], { fixed: true, anchorX: 'left', anchorY: 'bottom', fontSize: 13 });
