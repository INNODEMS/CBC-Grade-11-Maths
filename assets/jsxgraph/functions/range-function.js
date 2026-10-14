(function () {

    let currentGraph = null;
    let currentShading = [];
    let currentObjects = [];

    const board = JXG.JSXGraph.initBoard('random-range-board', {
        boundingbox: [-8, 10, 10, -5],
        axis: true,
        showCopyright: false,
        showNavigation: true,
        zoom: { wheel: true },
        pan: { enabled: true },
        grid: true
    });

    // ================= TITLE =================
    board.create('text', [-7.5, 9.2, 'Random Range Explorer'], {
        fontSize: 24,
        fixed: true,
        strokeColor: '#1e3a8a'
    });

    // ================= INFO PANEL =================
    const infoText = board.create('text', [3.5, 8.5, ''], {
        fontSize: 16,
        fixed: true,
        useHTML: true,
        anchorX: 'left'
    });

    // ================= CLEAR PREVIOUS OBJECTS =================
    function clearPrevious() {

        if (currentGraph) {
            board.removeObject(currentGraph);
            currentGraph = null;
        }

        currentShading.forEach(obj => board.removeObject(obj));
        currentShading = [];

        currentObjects.forEach(obj => board.removeObject(obj));
        currentObjects = [];

    }

    // ================= GENERATE RANDOM FUNCTION =================
    function generateRandomFunction() {

        clearPrevious();

        const type = Math.floor(Math.random() * 4);

        let func;
        let graphStart;
        let graphEnd;
        let color;
        let name;
        let explanation;

        switch (type) {

            // =========================================
            // Quadratic Function
            // =========================================
            case 0: {

                const k = Math.floor(Math.random() * 5) - 2;

                func = x => (x - 1) * (x - 1) + k;

                graphStart = -8;
                graphEnd = 10;

                name = `f(x) = (x - 1)² + ${k}`;

                explanation = `Range: [${k}, ∞)`;

                color = '#2563eb';

                // Shade range region
                currentShading.push(
                    board.create('polygon', [
                        [-8, k],
                        [10, k],
                        [10, 10],
                        [-8, 10]
                    ], {
                        fillColor: '#86efac',
                        fillOpacity: 0.18,
                        strokeOpacity: 0
                    })
                );

                // Vertex
                currentObjects.push(
                    board.create('point', [1, k], {
                        fixed: true,
                        size: 4,
                        color: '#15803d',
                        name: 'Vertex'
                    })
                );

                break;
            }

            // =========================================
            // Square Root Function
            // =========================================
            case 1: {

                const shift = Math.floor(Math.random() * 5) - 2;

                func = x => Math.sqrt(x + 2) + shift;

                graphStart = -2;
                graphEnd = 10;

                name = `f(x) = √(x + 2) + ${shift}`;

                explanation = `Range: [${shift}, ∞)`;

                color = '#7c3aed';

                currentShading.push(
                    board.create('polygon', [
                        [-8, shift],
                        [10, shift],
                        [10, 10],
                        [-8, 10]
                    ], {
                        fillColor: '#c4b5fd',
                        fillOpacity: 0.18,
                        strokeOpacity: 0
                    })
                );

                currentObjects.push(
                    board.create('point', [-2, shift], {
                        fixed: true,
                        size: 4,
                        color: '#7c3aed',
                        name: ''
                    })
                );

                break;
            }

            // =========================================
            // Exponential Function
            // =========================================
            case 2: {

                func = x => Math.pow(2, x);

                graphStart = -8;
                graphEnd = 4;

                name = `f(x) = 2^x`;

                explanation = `Range: (0, ∞)`;

                color = '#db2777';

                // Horizontal asymptote
                currentObjects.push(
                    board.create('line', [[-8, 0], [10, 0]], {
                        dash: 2,
                        strokeColor: '#f59e0b',
                        strokeWidth: 2,
                        fixed: true
                    })
                );

                currentShading.push(
                    board.create('polygon', [
                        [-8, 0],
                        [10, 0],
                        [10, 10],
                        [-8, 10]
                    ], {
                        fillColor: '#fbcfe8',
                        fillOpacity: 0.18,
                        strokeOpacity: 0
                    })
                );

                break;
            }

            // =========================================
            // Absolute Value Function
            // =========================================
            case 3: {

                const k = Math.floor(Math.random() * 5) - 2;

                func = x => Math.abs(x - 1) + k;

                graphStart = -8;
                graphEnd = 10;

                name = `f(x) = |x - 1| + ${k}`;

                explanation = `Range: [${k}, ∞)`;

                color = '#16a34a';

                currentShading.push(
                    board.create('polygon', [
                        [-8, k],
                        [10, k],
                        [10, 10],
                        [-8, 10]
                    ], {
                        fillColor: '#86efac',
                        fillOpacity: 0.18,
                        strokeOpacity: 0
                    })
                );

                currentObjects.push(
                    board.create('point', [1, k], {
                        fixed: true,
                        size: 4,
                        color: '#15803d',
                        name: 'Minimum'
                    })
                );

                break;
            }

        }

        // ================= CREATE GRAPH =================
        currentGraph = board.create('functiongraph', [
            func,
            graphStart,
            graphEnd
        ], {
            strokeWidth: 4,
            strokeColor: color
        });

        // ================= UPDATE INFO PANEL =================
        infoText.setText(
            `<b>${name}</b><br><span style="color:#166534">${explanation}</span>`
        );

    }

    // ================= INITIAL GRAPH =================
    generateRandomFunction();

    // ================= BUTTON =================
    board.create(
        'button',
        [-7, -3.8, 'New Random Function', generateRandomFunction],
        {
            fontSize: 15,
            fixed: true
        }
    );

    // ================= FOOTER TEXT =================
    board.create('text', [
        -7.5,
        -2.5,
        'The shaded horizontal region represents the range of the function.'
    ], {
        fontSize: 13,
        fixed: true,
        strokeColor: '#64748b'
    });

})();