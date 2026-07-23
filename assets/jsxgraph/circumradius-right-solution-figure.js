/* ============================================================================
 * Circumradius of a right triangle, SOLUTION figure (STACK display).
 * Same configuration as the question, now with a radius OA labelled R and the
 * hypotenuse AC labelled with its value: the hypotenuse is a diameter, O its
 * midpoint, and R = (hypotenuse)/2.
 *
 * Sample variant: legs 4 and 3, hypotenuse 5, R = 2.5. In the STACK general
 * feedback these three lines become {#lega#}, {#legb#}, {#hyp#}, and
 * 'jxgbox' -> divid.  Expects a div with id="jxgbox".
 * ==========================================================================*/
JXG.Options.text.useMathJax = true;
var lega = 4;       // -> {#lega#}
var legb = 3;       // -> {#legb#}
var hyp = 5;        // -> {#hyp#}

var s = 6.0/hyp;
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

// radius OA labelled R, and the hypotenuse labelled with its value
board.create('segment', [pO,pA], {strokeColor:'#0d8e8e', strokeWidth:1.6, dash:2, highlight:false});
board.create('text', [(O[0]+A[0])/2-0.15, (O[1]+A[1])/2+0.15, 'R'], {anchorX:'right', anchorY:'bottom', fontSize:14, strokeColor:'#0d8e8e', fixed:true});
var Gx=(A[0]+B[0]+C[0])/3, Gy=(A[1]+B[1]+C[1])/3;
var mx=(A[0]+C[0])/2, my=(A[1]+C[1])/2, dx=mx-Gx, dy=my-Gy, L=Math.sqrt(dx*dx+dy*dy)||1;
board.create('text', [mx+0.45*dx/L, my+0.45*dy/L, hyp+' cm'], {anchorX:'middle', anchorY:'middle', fontSize:14, strokeColor:'#0d8e8e', fixed:true});
