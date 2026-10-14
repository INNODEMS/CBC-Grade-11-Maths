/* ============================================================================
 * Circumradius of a right triangle, QUESTION figure (STACK display).
 * Right angle at B (origin); legs on the axes. The circumscribed circle passes
 * through A, B, C with centre O at the midpoint of the hypotenuse. Only the two
 * legs are labelled; the hypotenuse length is NOT shown (the student finds it).
 *
 * Sample variant: legs 4 and 3 (so hypotenuse 5, R = 2.5). In the STACK question
 * these three lines become:
 *     var lega = {#lega#};   // longer leg  (horizontal, = BC)
 *     var legb = {#legb#};   // shorter leg (vertical,   = AB)
 *     var hyp  = {#hyp#};    // hypotenuse  (used only to size the circle)
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
JXG.Options.text.useMathJax = true;
var lega = 4;       // -> {#lega#}
var legb = 3;       // -> {#legb#}
var hyp = 5;        // -> {#hyp#}

var s = 6.0/hyp;                        // scale so the circle diameter is 6 units
var B = [0, 0], C = [lega*s, 0], A = [0, legb*s];
var O = [lega*s/2, legb*s/2], Rd = hyp*s/2, pad = 0.9;
var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[O[0]-Rd-pad, O[1]+Rd+pad, O[0]+Rd+pad, O[1]-Rd-pad], keepaspectratio:true, axis:false, showCopyright:false, showNavigation:false, pan:{enabled:false}, zoom:{enabled:false}});

var pO = board.create('point', O, {name:'O', size:1.5, fixed:true, fillColor:'#0d8e8e', strokeColor:'#0d8e8e', label:{offset:[8,6], anchorX:'left', anchorY:'bottom'}});
board.create('circle', [pO, Rd], {strokeColor:'#0d8e8e', strokeWidth:2, fillColor:'#0d8e8e', fillOpacity:0.04, highlight:false});
var pA = board.create('point', A, {name:'A', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[-9,6], anchorX:'right', anchorY:'bottom'}});
var pB = board.create('point', B, {name:'B', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[-9,-8], anchorX:'right', anchorY:'top'}});
var pC = board.create('point', C, {name:'C', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[9,-8], anchorX:'left', anchorY:'top'}});
board.create('polygon', [pA,pB,pC], {borders:{strokeColor:'#1565c0', strokeWidth:2, highlight:false}, fillColor:'#1565c0', fillOpacity:0.05, highlight:false, vertices:{visible:false}});
board.create('angle', [pA,pB,pC], {type:'square', radius:0.5, strokeColor:'#333', fillColor:'#333', fillOpacity:0.12, name:'', label:{visible:false}, highlight:false});
board.create('text', [C[0]/2, -0.3, lega+' cm'], {anchorX:'middle', anchorY:'top', fontSize:14, strokeColor:'#333', fixed:true});
board.create('text', [-0.3, A[1]/2, legb+' cm'], {anchorX:'right', anchorY:'middle', fontSize:14, strokeColor:'#333', fixed:true});
