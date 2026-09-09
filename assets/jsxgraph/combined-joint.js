/* Combined Variation
 * Pressure, Temperature and Volume
 * P = kT / V
 */

var k = 0.5;

var board = JXG.JSXGraph.initBoard('jsx-combined-variation', {
    boundingbox: [-1, 65, 15, -5],
    keepaspectratio: false,
    axis: true,
    showNavigation: false,
    showCopyright: false
});

/* ============================================================
   TEMPERATURE SLIDER
   ============================================================ */

board.create('text',[11.2,61,"<b>Temperature</b>"]);

var temp = board.create('slider',
    [[11.2,57],[14.2,57],[100,200,500]],{
        name:'',
        snapWidth:10
});

/* ============================================================
   GRAPH
   ============================================================ */

var graph = board.create('functiongraph',[
    function(x){
        return k*temp.Value()/x;
    },
    1,
    10
],{
    strokeWidth:3,
    strokeColor:'#1565c0'
});

/* ============================================================
   MOVING POINT
   ============================================================ */

var P = board.create('glider',
    [5,k*temp.Value()/5,graph],{
        name:'',
        size:5,
        fillColor:'#d32f2f',
        strokeColor:'#d32f2f'
});

/* ============================================================
   KEEP POINT ON CURVE
   ============================================================ */

temp.on('drag',function(){

    P.moveTo([
        P.X(),
        k*temp.Value()/P.X()
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
    function(){ return P.X()-0.7; },
    function(){ return P.Y()+3; },
    function(){
        return "("
            +P.X().toFixed(1)
            +", "
            +P.Y().toFixed(1)
            +")";
    }
],{
    color:'#777'
});

/* ============================================================
   INFORMATION PANEL
   ============================================================ */

board.create('text',[11.2,50,function(){
    return "<b>Temperature</b> = "
        +temp.Value().toFixed(0)
        +" K";
}]);

board.create('text',[11.2,46,function(){
    return "<b>Volume</b> = "
        +P.X().toFixed(1)
        +" L";
}]);

board.create('text',[11.2,42,function(){
    return "<b>Pressure</b> = "
        +P.Y().toFixed(1);
}]);

board.create('text',[11.2,36,function(){

    return "<i>P</i> = "
        +k.toFixed(1)
        +" × "
        +temp.Value().toFixed(0)
        +" / "
        +P.X().toFixed(1)
        +" = "
        +P.Y().toFixed(1);

}]);

board.create('text',[11.2,30,
    "<i>P</i> = 0.5<i>T</i>/<i>V</i>"
]);

/* ============================================================
   AXIS LABELS
   ============================================================ */

board.create('text',[0.4,61,"Pressure"]);
board.create('text',[9.6,-3.5,"Volume"]);