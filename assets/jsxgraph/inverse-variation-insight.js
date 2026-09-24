/* Inverse Variation
 * Speed-Time Relationship
 * s = d/t
 */

var d = 100;

var board = JXG.JSXGraph.initBoard('jsx-speed-time', {
    boundingbox: [-1, 120, 15, -10],
    keepaspectratio: false,
    axis: true,
    showNavigation: false,
    showCopyright: false
});

/* ============================================================
   SLIDER
   ============================================================ */

board.create('text',[11.2,115,"<b>Distance (km)</b>"]);

var distance = board.create('slider',
    [[11.2,105],[14.2,105],[50,100,200]],{
        name:'',
        snapWidth:10
});

/* ============================================================
   GRAPH
   ============================================================ */

var graph = board.create('functiongraph',[
    function(x){
        return distance.Value()/x;
    },
    0.5,
    10
],{
    strokeWidth:3,
    strokeColor:'#1565c0'
});

/* ============================================================
   MOVING POINT
   ============================================================ */

var P = board.create('glider',
    [2,distance.Value()/2,graph],{
        name:'',
        size:5,
        fillColor:'#d32f2f',
        strokeColor:'#d32f2f'
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
   KEEP POINT ON NEW CURVE
   ============================================================ */

distance.on('drag',function(){

    var x = P.X();

    if(x<0.5) x=0.5;
    if(x>10) x=10;

    P.moveTo([
        x,
        distance.Value()/x
    ]);

});

/* ============================================================
   INFORMATION PANEL
   ============================================================ */

board.create('text',[11.2,88,function(){
    return "<b>Time</b> = "
        +P.X().toFixed(1)
        +" h";
}]);

board.create('text',[11.2,76,function(){
    return "<b>Speed</b> = "
        +P.Y().toFixed(1)
        +" km/h";
}]);

board.create('text',[11.2,64,function(){
    return "<b>Distance</b> = "
        +distance.Value().toFixed(0)
        +" km";
}]);

board.create('text',[11.2,52,function(){
    return "<i>s × t</i> = "
        +(P.X()*P.Y()).toFixed(0);
}]);

board.create('text',[11.2,40,function(){
    return "<i>s = "
        +distance.Value().toFixed(0)
        +"/t</i>";
}]);

/* ============================================================
   AXIS LABELS
   ============================================================ */

board.create('text',[0.5,114,"Speed (km/h)"]);
board.create('text',[9,-8,"Time (h)"]);

