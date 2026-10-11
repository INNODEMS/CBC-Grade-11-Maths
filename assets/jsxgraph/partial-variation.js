/* Partial Variation
 * Community Water Delivery Investigation
 * y = 50x + 100
 */

var m = 50;   // Rate per kilometer (gradient)
var c = 100;  // Fixed delivery fee (y-intercept)

var board = JXG.JSXGraph.initBoard('jsx-partial-variation', {
    boundingbox: [-2, 1350, 25, -100],
    keepaspectratio: false,
    axis: true,
    showNavigation: false,
    showCopyright: false
});

/* ============================================================
   SLIDER
   ============================================================ */

board.create('text',[18.5,1250,"<b>Distance (km)</b>"]);

var distance = board.create('slider',
    [[18.5,1170],[23.5,1170],[0,2,20]],{
        name:'',
        snapWidth:0.5
});

/* ============================================================
   GRAPH
   ============================================================ */

var graph = board.create('functiongraph',[
    function(x){
        return m*x + c;
    },
    0,
    22
],{
    strokeWidth:3,
    strokeColor:'#1565c0'
});

/* ============================================================
   MOVING POINT
   ============================================================ */

var P = board.create('glider',
    [distance.Value(), (m*distance.Value() + c), graph],{
        name:'',
        size:5,
        fillColor:'#d32f2f',
        strokeColor:'#d32f2f'
});

/* ============================================================
   KEEP SLIDER AND POINT SYNCHRONIZED
   ============================================================ */

/* Slider → Point */

distance.on('drag',function(){

    P.moveTo([
        distance.Value(),
        m*distance.Value() + c
    ]);

});

/* Point → Slider */

P.on('drag',function(){

    var x = Math.max(0,Math.min(20,P.X()));

    distance.setValue(x);

    P.moveTo([
        x,
        m*x + c
    ]);

});

/* ============================================================
   GUIDE LINES
   ============================================================ */

board.create('segment',[
    function(){ return [P.X(),0]; },
    P
],{
    dash:2,
    strokeColor:'#999'
});

board.create('segment',[
    function(){ return [0,P.Y()]; },
    P
],{
    dash:2,
    strokeColor:'#999'
});

/* ============================================================
   COORDINATE LABEL
   ============================================================ */

board.create('text',[
    function(){ return P.X()-1.2; },
    function(){ return P.Y()+50; },
    function(){
        return "("
            +P.X().toFixed(1)
            +", "
            +P.Y().toFixed(0)
            +")";
    }
],{
    color:'#999999'
});

/* ============================================================
   INFORMATION PANEL
   ============================================================ */

board.create('text',[18.5,1050,function(){
    return "<b>Distance (x)</b> = "
        +P.X().toFixed(1)
        +" km";
}]);

board.create('text',[18.5,950,function(){
    return "<b>Total Cost (y)</b> = "
        +P.Y().toFixed(0)
        +" Ksh";
}]);

board.create('text',[18.5,850,function(){
    return "<i>y</i> = 50("
        +P.X().toFixed(1)
        +") + 100";
}]);

board.create('text',[18.5,750,function(){
    return "<b>= " + P.Y().toFixed(0) + " Ksh</b>";
}]);

board.create('text',[18.5,650,"<i>y</i> = 50<i>x</i> + 100"]);

/* ============================================================
   AXIS LABELS
   ============================================================ */

board.create('text',[0.5,1300,"Total Charge (Ksh)"]);
board.create('text',[15.5,-50,"Distance (km)"]);