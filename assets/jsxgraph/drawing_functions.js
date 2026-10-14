var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-4, 4, 4, -4], axis:true,  showCopyright:false, showNavigation:false });
var graph1 = board.create('functiongraph', ['sin(x)', -Math.PI, Math.PI],{name:'sin(x)', withLabel:true});
var graph2 = board.create('functiongraph', ['x^2 - 2', -3, 3],{name:'x^2 - 2', withLabel:true, strokeColor:'red'});