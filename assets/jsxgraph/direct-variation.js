/* Direct Variation
 * Fuel Efficiency Investigation
 * d = 20f
 */

var k = 20;

var board = JXG.JSXGraph.initBoard('jsx-direct-variation', {
    boundingbox: [-1, 190, 15, -10],
    keepaspectratio: false,
    axis: true,
    showNavigation: false,
    showCopyright: false
});

/* ============================================================
   SLIDER
   ============================================================ */

board.create('text',[11.3,176,"<b>Fuel (L)</b>"]);

var fuel = board.create('slider',
    [[11.3,165],[14.3,165],[0,3,10]],{
        name:'',
        snapWidth:0.5
});

/* ============================================================
   GRAPH
   ============================================================ */

var graph = board.create('functiongraph',[
    function(x){
        return k*x;
    },
    0,
    9
],{
    strokeWidth:3,
    strokeColor:'#1565c0'
});

/* ============================================================
   MOVING POINT
   ============================================================ */

var P = board.create('glider',
    [fuel.Value(), k*fuel.Value(), graph],{
        name:'',
        size:5,
        fillColor:'#d32f2f',
        strokeColor:'#d32f2f'
});

/* ============================================================
   KEEP SLIDER AND POINT SYNCHRONIZED
   ============================================================ */

/* Slider → Point */

fuel.on('drag',function(){

    P.moveTo([
        fuel.Value(),
        k*fuel.Value()
    ]);

});

/* Point → Slider */

P.on('drag',function(){

    var x = Math.max(0,Math.min(10,P.X()));

    fuel.setValue(x);

    P.moveTo([
        x,
        k*x
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
    function(){ return P.X()-0.8; },
    function(){ return P.Y()+8; },
    function(){
        return "("
            +P.X().toFixed(2)
            +", "
            +P.Y().toFixed(2)
            +")";
    }
],{
    color:'#999999'
});

/* ============================================================
   INFORMATION PANEL
   ============================================================ */

board.create('text',[11.3,150,function(){
    return "<b>Fuel</b> = "
        +P.X().toFixed(1)
        +" L";
}]);

board.create('text',[11.3,136,function(){
    return "<b>Distance</b> = "
        +P.Y().toFixed(1)
        +" km";
}]);

board.create('text',[11.3,122,function(){
    return "<i>d</i> = 20 × "
        +P.X().toFixed(1)
        +" = "
        +P.Y().toFixed(1);
}]);

board.create('text',[11.3,108,"<i>d</i> = 20<i>f</i>"]);

/* ============================================================
   AXIS LABELS
   ============================================================ */

board.create('text',[0.4,183,"Distance (km)"]);
board.create('text',[9.7,-8,"Fuel (L)"]);