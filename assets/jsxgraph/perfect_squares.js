/*=========================================================
    PERFECT SQUARE EXPLORER
=========================================================*/

const board = JXG.JSXGraph.initBoard('jsxgraph-perfect-squares', {
    boundingbox: [-1, 10, 10, -2],
    axis: false,
    showNavigation: false,
    showCopyright: false,
    keepAspectRatio: true
});

/*=========================================================
    SLIDER
=========================================================*/

const slider = board.create(
    'slider',
    [[0.5, 9], [8.5, 9], [1, 1, 50]],
    {
        name: 'Number of unit squares',
        snapWidth: 1
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

function add(obj) {

    objects.push(obj);
    return obj;

}

/*=========================================================
    DRAW ONE CELL
=========================================================*/

function drawCell(x, y, colour) {

    const p1 = board.create('point', [x, y], {visible:false});
    const p2 = board.create('point', [x+1, y], {visible:false});
    const p3 = board.create('point', [x+1, y-1], {visible:false});
    const p4 = board.create('point', [x, y-1], {visible:false});

    objects.push(p1,p2,p3,p4);

    return add(
        board.create(
            'polygon',
            [p1,p2,p3,p4],
            {
                fillColor: colour,
                fillOpacity: 0.85,
                borders:{
                    strokeColor:"#607D8B",
                    strokeWidth:1
                },
                highlight:false
            }
        )
    );

}

/*=========================================================
    UPDATE
=========================================================*/

function updateScene(){

    clearScene();

    const N = Math.round(slider.Value());

    // Smallest square that can contain N tiles

    const side = Math.ceil(Math.sqrt(N));

    // Centre the frame

    const startX = (8 - side)/2;
    const startY = 8;

    // Draw frame

    for(let r=0;r<side;r++){

        for(let c=0;c<side;c++){

            drawCell(
                startX+c,
                startY-r,
                "#F5F5F5"
            );

        }

    }

    // Fill tiles sequentially

    let count=0;

    outer:

    for(let r=0;r<side;r++){

        for(let c=0;c<side;c++){

            if(count>=N)
                break outer;

            drawCell(
                startX+c,
                startY-r,
                "#1E88E5"
            );

            count++;

        }

    }

    /*---------------------------------------
        Message
    ---------------------------------------*/

    const info=document.getElementById("message");

    if(info){

        if(Number.isInteger(Math.sqrt(N))){

            info.innerHTML=

            "<b>"+N+"</b> unit squares form a complete <b>"+side+" × "+side+"</b> square.<br><br>"+

            "<span style='color:green'><b>"+N+" is a perfect square.</b></span>";

        }
        else{

            const missing=side*side-N;

            info.innerHTML=

            "<b>"+N+"</b> unit squares cannot yet form a complete square.<br><br>"+

            missing+" more unit square"+(missing===1?"":"s")+" needed to complete the <b>"+side+" × "+side+"</b> square.<br><br>"+

            "<span style='color:#C62828'><b>"+N+" is not a perfect square.</b></span>";

        }

    }

}

/*=========================================================
    EVENTS
=========================================================*/

slider.on("drag",updateScene);
slider.on("up",updateScene);

updateScene();