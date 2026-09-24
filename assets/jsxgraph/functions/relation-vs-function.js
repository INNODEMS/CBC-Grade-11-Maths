// 1. Initialize the board
// Note: This script expects an HTML element with the id 'jxgbox' to exist.
const board = JXG.JSXGraph.initBoard('jsxgraph-relation-vs-function', { 
    boundingbox: [-7, 6, 7, -6], 
    axis: false, 
    showCopyright: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

// 2. Draw the Domain (Left Set)
board.create('curve', [
    (t) => -4 + 1 * Math.cos(t), 
    (t) => 2 * Math.sin(t), 
    0, 2 * Math.PI
], { strokeColor: '#2563eb', strokeWidth: 3, fillColor: '#bfdbfe', fillOpacity: 0.3 });
board.create('text', [-4, 3, 'Domain'], { fontSize: 18, anchorX: 'middle', cssClass: 'font-bold' });

// 3. Draw the Range (Right Set)
board.create('curve', [
    (t) => 4 + 1 * Math.cos(t), 
    (t) => 2 * Math.sin(t), 
    0, 2 * Math.PI
], { strokeColor: '#16a34a', strokeWidth: 3, fillColor: '#bbf7d0', fillOpacity: 0.3 });
board.create('text', [4, 3, 'Range'], { fontSize: 18, anchorX: 'middle', cssClass: 'font-bold' });

// 4. Create Elements (Points) inside the sets
const d1 = board.create('point', [-4, 1], { name: 'a', size: 5, color: '#1e3a8a', fixed: true });
const d2 = board.create('point', [-4, 0], { name: 'b', size: 5, color: '#1e3a8a', fixed: true });
const d3 = board.create('point', [-4, -1], { name: 'c', size: 5, color: '#1e3a8a', fixed: true });

const c1 = board.create('point', [4, 1], { name: 'x', size: 5, color: '#14532d', fixed: true });
const c2 = board.create('point', [4, 0], { name: 'y', size: 5, color: '#14532d', fixed: true });
const c3 = board.create('point', [4, -1], { name: 'z', size: 5, color: '#14532d', fixed: true });

// Array to keep track of arrows and text so we can clear them
let animatedObjects = [];

function clearAnimation() {
    board.removeObject(animatedObjects);
    animatedObjects = [];
}

// Function to animate an arrow drawn from point A to point B
function animateArrow(startPt, endPt, delay) {
    setTimeout(() => {
        // Create an invisible moving point at the start
        let p = board.create('point', [startPt.X(), startPt.Y()], { visible: false });
        animatedObjects.push(p);
        
        // Draw an arrow from the start point to the moving point
        let arrow = board.create('arrow', [startPt, p], { 
            strokeColor: '#334155', 
            strokeWidth: 3, 
            lastArrow: { type: 1, size: 6 } 
        });
        animatedObjects.push(arrow);
        
        // Animate the invisible point to the target point (takes 800ms)
        p.moveTo([endPt.X(), endPt.Y()], 800);
    }, delay);
}

// 5. Create Button: General Relation (Not a Function)
board.create('button', [-6, -5, 'Show Relation', function() {
    clearAnimation();
    
    // Animation sequence
    animateArrow(d1, c1, 0);      // 'a' maps to 'x'
    animateArrow(d1, c2, 1000);   // 'a' ALSO maps to 'y' (Breaks the function rule!)
    animateArrow(d2, c3, 2200);   // 'b' maps to 'z'
    
    // Show explanation text
    setTimeout(() => {
        let txt = board.create('text', [0, -3.5, 'Not a function: Element "a" has more than one output!'], { 
            fontSize: 16, color: '#dc2626', anchorX: 'middle', cssClass: 'font-bold' 
        });
        animatedObjects.push(txt);
    }, 3200);
}], { fixed: true, cssStyle: 'padding: 10px; cursor: pointer;' });

// 6. Create Button: Valid Function
board.create('button', [2, -5, 'Show Function', function() {
    clearAnimation();
    
    // Animation sequence
    animateArrow(d1, c1, 0);      // 'a' maps to 'x'
    animateArrow(d2, c2, 1000);   // 'b' maps to 'y'
    animateArrow(d3, c2, 2000);   // 'c' ALSO maps to 'y' (Many-to-one is perfectly fine!)
    
    // Show explanation text
    setTimeout(() => {
        let txt = board.create('text', [0, -3.5, 'Function: Every input has exactly ONE output!'], { 
            fontSize: 16, color: '#2563eb', anchorX: 'middle', cssClass: 'font-bold' 
        });
        animatedObjects.push(txt);
    }, 3000);
}], { fixed: true, cssStyle: 'padding: 10px; cursor: pointer;' });