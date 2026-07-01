const board = JXG.JSXGraph.initBoard('jsxgraph-completing-square', {
    boundingbox: [-1.5, 12, 11.5, -3.5],
    axis: false,
    grid: false,
    showNavigation: false,
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const sliderB = board.create('slider', [[1, 11], [9, 11], [2, 6, 10]], {
    name: 'b',
    snapWidth: 1,
    precision: 0,
    size: 7,
    strokeColor: '#185FA5',
    fillColor: '#185FA5',
    highline: { strokeColor: '#185FA5', strokeWidth: 6 },
    baseline: { strokeColor: '#B5D4F4', strokeWidth: 6 },
    label: { fontSize: 16, strokeColor: '#0C447C' }
});

let shapeObjects = [];
let cornerFilled = false;

function add(o) { shapeObjects.push(o); return o; }

function clearShapes() {
    shapeObjects.forEach(o => { try { board.removeObject(o); } catch(e) {} });
    shapeObjects = [];
}

function poly(vertices, colour, opacity) {
    return add(board.create('polygon', vertices, {
        fillColor: colour, fillOpacity: opacity===undefined?0.75:opacity,
        borders:{ strokeColor:"#333", strokeWidth:2 },
        vertices:{ visible:false },
        highlight:false,
        fixed:true
    }));
}

function txt(x,y,str,colour,size) {
    return add(board.create('text',[x,y,str],{
        fixed:true, anchorX:'middle', anchorY:'middle',
        fontSize:size||15, strokeColor:colour||"#222", cssStyle:"font-weight:700",
        highlight:false
    }));
}

function draw() {
    clearShapes();
    const b = Math.round(sliderB.Value());
    const half = b / 2;
    const X = 5;
    const scale = X / half;
    const R = scale * half;

    poly([[0,0],[X,0],[X,X],[0,X]], "#85B7EB", 0.85);
    txt(X/2, X/2, "x\u00B2", "#042C53", 20);
    txt(X/2, -0.65, "x", "#0C447C", 14);
    txt(-0.55, X/2, "x", "#0C447C", 14);

    poly([[X,0],[X+R,0],[X+R,X],[X,X]], "#EF9F27", 0.80);
    txt(X+R/2, X/2, half+"x", "#412402", 14);
    poly([[0,-R],[X,-R],[X,0],[0,0]], "#EF9F27", 0.80);
    txt(X/2, -R/2, half+"x", "#412402", 14);

    if (cornerFilled) {
        poly([[X,-R],[X+R,-R],[X+R,0],[X,0]], "#97C459", 0.90);
        txt(X+R/2, -R/2, half+"\u00B2", "#173404", 15);
        add(board.create('polygon',[[0,-R],[X+R,-R],[X+R,X],[0,X]],{
            fillColor:'none', fillOpacity:0,
            borders:{ strokeColor:"#0C447C", strokeWidth:4 },
            vertices:{ visible:false },
            fixed:true
        }));
        txt((X+R)/2, X+0.9, "(x + "+half+")\u00B2  \u2014 complete!", "#0C447C", 17);
    } else {
        poly([[X,-R],[X+R,-R],[X+R,0],[X,0]], "#E24B4A", 0.22);
        txt(X+R/2, -R/2, "tap to\nfill", "#A32D2D", 13);
        txt((X+R)/2, X+0.9, "tap the gap to complete the square", "#A32D2D", 14);
    }

    board.update();
}

board.containerObj.addEventListener('pointerdown', function(e) {
    const rect = board.containerObj.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [cssX, cssY], board);
    const usrX = coords.usrCoords[1];
    const usrY = coords.usrCoords[2];

    const b = Math.round(sliderB.Value());
    const half = b / 2;
    const X = 5;
    const scale = X / half;
    const R = scale * half;

    if (!cornerFilled && usrX >= X - 0.3 && usrX <= X + R + 0.3 && usrY >= -R - 0.3 && usrY <= 0.3) {
        cornerFilled = true;
        draw();
    }
});

sliderB.on('drag', function() {
    cornerFilled = false;
    draw();
});

draw();