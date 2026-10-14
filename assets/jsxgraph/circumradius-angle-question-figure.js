/* ============================================================================
 * Circumradius -> inscribed angle, QUESTION figure (STACK display).
 * Circle centre O, radius R. Chord BC subtends the inscribed angle theta at A.
 * A is on the major arc (top) and B,C are symmetric about the downward vertical,
 * so the central angle BOC = 2*theta and the inscribed angle BAC = theta exactly.
 *
 * Sample variant: theta = 60, R = 3, so BC = 3*sqrt(3) (matches the textbook
 * example). In the STACK question these four lines become:
 *     var R     = {#RR#};
 *     var theta = {#theta#};
 *     var coef  = {#bc_coef#};   // chord = coef*sqrt(rad)
 *     var rad   = {#bc_rad#};
 * and 'jxgbox' becomes the STACK variable  divid.
 * Expects a div with id="jxgbox".
 * ==========================================================================*/
JXG.Options.text.useMathJax = true;
var R = 3;          // -> {#RR#}
var theta = 60;     // -> {#theta#}
var coef = 3;       // -> {#bc_coef#}
var rad = 3;        // -> {#bc_rad#}

var sfac = 3.0/R, Rd = R*sfac, d2r = Math.PI/180;     // display radius = 3
var angB = (270-theta)*d2r, angC = (270+theta)*d2r, angA = 90*d2r;
var O = [0,0];
var B = [Rd*Math.cos(angB), Rd*Math.sin(angB)];
var C = [Rd*Math.cos(angC), Rd*Math.sin(angC)];
var A = [Rd*Math.cos(angA), Rd*Math.sin(angA)];
var pad = 1.4;
var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-Rd-pad, Rd+pad, Rd+pad, -Rd-pad], keepaspectratio:true, axis:false, showCopyright:false, showNavigation:false, pan:{enabled:false}, zoom:{enabled:false}});

board.create('circle', [O, Rd], {strokeColor:'#1565c0', strokeWidth:2, fillColor:'none', highlight:false});
var pO = board.create('point', O, {name:'O', size:1, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[8,6], anchorX:'left', anchorY:'bottom'}});
var pA = board.create('point', A, {name:'A', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[0,10], anchorX:'middle', anchorY:'bottom'}});
var pB = board.create('point', B, {name:'B', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[-11,-2], anchorX:'right', anchorY:'middle'}});
var pC = board.create('point', C, {name:'C', size:1.5, fixed:true, fillColor:'#333', strokeColor:'#333', label:{offset:[11,-2], anchorX:'left', anchorY:'middle'}});
board.create('polygon', [pA,pB,pC], {borders:{strokeColor:'#333', strokeWidth:2, highlight:false}, fillColor:'none', highlight:false, vertices:{visible:false}});
board.create('segment', [pO,pB], {strokeColor:'#9e9e9e', strokeWidth:1.4, highlight:false});
board.create('segment', [pO,pC], {strokeColor:'#9e9e9e', strokeWidth:1.4, highlight:false});

board.create('angle', [pB,pA,pC], {radius:0.95, type:'sector', fillColor:'#f39c12', fillOpacity:0.30, strokeColor:'#e67e22', name:'', label:{visible:false}, highlight:false});
board.create('text', [A[0], A[1]-1.05, '\\(\\theta\\)'], {anchorX:'middle', anchorY:'top', fontSize:16, strokeColor:'#333', fixed:true});

var bclabel = (rad==1) ? (''+coef) : ('\\('+coef+'\\sqrt{'+rad+'}\\)');
board.create('text', [(B[0]+C[0])/2, (B[1]+C[1])/2-0.5, bclabel], {anchorX:'middle', anchorY:'top', fontSize:14, strokeColor:'#333', fixed:true});
board.create('text', [(O[0]+B[0])/2-0.15, (O[1]+B[1])/2+0.15, '\\('+R+'\\)'], {anchorX:'right', anchorY:'bottom', fontSize:14, strokeColor:'#333', fixed:true});
