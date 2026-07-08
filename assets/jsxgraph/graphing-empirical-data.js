/*
    Graphing empirical data — choose the axes, then PLOT the points  (13.7)
    -----------------------------------------------------------------------
    A two-stage interactive.

    Stage 1 (native PreTeXt buttons): the student decides which variable is
    independent (horizontal) and which is dependent (vertical). Nothing appears
    on the blank plane until the choice is correct
    (grade -> horizontal, students -> vertical).

    Stage 2 (dragging, on this board): once the axes are correct
      - six dashed VERTICAL GUIDE LINES appear, one per grade (x = 6..11);
      - six DRAGGABLE points appear, each a glider trapped on its own guide line
        so it only moves up and down (x is fixed, y is free);
      - the points start at DIFFERENT RANDOM heights (about 28..50), not all at
        the bottom, so the student must actually read the table rather than just
        dragging everything upward in order.
    The student drags each point to the correct number of students, then a native
    PreTeXt button calls window.gedCheck(). Wrong -> "try again". A Reset button
    (window.gedReset) re-randomises the starting heights.

    House-style split:
      - Coordinate plane   = this JSXGraph board (id="jsx-graphing-empirical-data").
      - Data TABLE         = fixed PreTeXt content beside the board.
      - All buttons        = native PreTeXt, wired to the window.ged* functions.
      - Status line        = html slate with id="ged_status".
*/

(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 15;

    const board = JXG.JSXGraph.initBoard('jsx-graphing-empirical-data', {
        boundingbox: [-1.5, 56, 13, -8],
        axis: true, grid: true,
        showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false }
    });

    // --- Fixed data: correct number of students per class -------------------
    const grades   = [6, 7, 8, 9, 10, 11];
    const students = [30, 34, 37, 41, 44, 48];   // target heights (the answer)

    const LABELS = { grade: 'Grade level', students: 'Number of students' };

    // --- Tuning -------------------------------------------------------------
    const TOL   = 1;         // a point within this many students counts as correct
    const Y_LO  = 28,        // random start range (deliberately straddles the data
          Y_HI  = 50;        // so some points start above and some below target)
    const GUIDE_TOP = 52;    // height of the vertical guide segments

    const BLUE = '#1565c0', GREEN = '#2e7d32', RED = '#c62828';

    // --- Vertical guide lines (hidden until the axes are chosen correctly) --
    // Each is a bounded segment, so the glider that rides it is clamped to the
    // visible range and can only move vertically.
    const guides = grades.map(g => board.create('segment', [[g, 0], [g, GUIDE_TOP]], {
        dash: 2, strokeColor: '#9e9e9e', strokeWidth: 1,
        fixed: true, visible: false, highlight: false
    }));

    // --- Draggable points: one glider per guide line ------------------------
    const drag = grades.map((g, i) => board.create('glider', [g, Y_LO, guides[i]], {
        name: '', size: 5, strokeColor: BLUE, fillColor: BLUE,
        visible: false, showInfobox: false,
        label: { visible: false }
    }));

    // --- Live height readout beside each point (shows the student's value) --
    const readouts = grades.map((g, i) => board.create('text',
        [g + 0.18, () => drag[i].Y(), () => String(Math.round(drag[i].Y()))],
        { anchorX: 'left', anchorY: 'middle', fixed: true, visible: false,
          fontSize: 13, cssStyle: 'color:#1565c0;font-weight:bold' }));

    // --- Axis labels (hidden until correct) ---------------------------------
    const xLabel = board.create('text', [6.5, -5.5, () => LABELS.grade],
        { anchorX: 'middle', fixed: true, visible: false, cssStyle: 'font-weight:bold' });
    const yLabel = board.create('text', [-1.2, 54, () => LABELS.students],
        { anchorX: 'left', fixed: true, visible: false, cssStyle: 'font-weight:bold' });

    // --- Selection / plotting state -----------------------------------------
    let horiz = null, vert = null;   // chosen axes
    let plotting = false;            // is the draggable plane currently active?

    const statusEl = () => document.getElementById('ged_status');
    function setStatus(html) { const s = statusEl(); if (s) s.innerHTML = html; }

    const DRAG_PROMPT =
        'Axes correct. Now drag each blue point up or down to the correct ' +
        'number of students from the table, then click <b>Check Plot</b>.';

    // Show or hide every element that belongs to the draggable plane.
    function showPlane(on) {
        guides.forEach(el => el.setAttribute({ visible: on }));
        drag.forEach(el => el.setAttribute({ visible: on }));
        readouts.forEach(el => el.setAttribute({ visible: on }));
        xLabel.setAttribute({ visible: on });
        yLabel.setAttribute({ visible: on });
    }

    // Give every point a fresh random starting height (x stays fixed).
    function randomiseStart() {
        drag.forEach((p, i) => {
            const y = Math.round(Y_LO + Math.random() * (Y_HI - Y_LO));
            p.setPositionDirectly(JXG.COORDS_BY_USER, [grades[i], y]);
            p.setAttribute({ strokeColor: BLUE, fillColor: BLUE });
        });
        board.update();
    }

    // --- Stage 1: axis selection -------------------------------------------
    function refresh() {
        const bothChosen = horiz && vert;
        const correct = horiz === 'grade' && vert === 'students';

        if (correct) {
            if (!plotting) {          // first time correct -> reveal + randomise
                plotting = true;
                showPlane(true);
                randomiseStart();
                setStatus(DRAG_PROMPT);
            }
            return;                   // already plotting: leave the student's work alone
        }

        // Not correct: pack the plane away.
        if (plotting) { plotting = false; showPlane(false); board.update(); }

        if (!bothChosen) {
            setStatus('Choose which variable goes on each axis using the buttons.' +
                (horiz ? '<br>Horizontal: <b>' + LABELS[horiz] + '</b>' : '') +
                (vert ? '<br>Vertical: <b>' + LABELS[vert] + '</b>' : ''));
        } else {
            setStatus('Horizontal: <b>' + LABELS[horiz] + '</b> &nbsp; Vertical: <b>' + LABELS[vert] + '</b>' +
                '<br><span style="color:' + RED + '">Not quite — the independent variable ' +
                '(grade level) goes on the horizontal axis, and the dependent variable ' +
                '(number of students) on the vertical axis. Try again.</span>');
        }
    }

    // --- Stage 2: checking the plotted heights ------------------------------
    function checkPlot() {
        if (!plotting) {
            setStatus('First choose the axes correctly, then plot the points.');
            return;
        }
        const wrong = [];
        drag.forEach((p, i) => { if (Math.abs(p.Y() - students[i]) > TOL) wrong.push(i); });

        if (wrong.length === 0) {
            drag.forEach(p => p.setAttribute({ strokeColor: GREEN, fillColor: GREEN }));
            board.update();
            setStatus('<span style="color:' + GREEN + '"><b>Correct!</b> Every point matches the table. ' +
                'The number of students generally increases with grade level.</span>');
        } else {
            drag.forEach((p, i) => p.setAttribute({
                strokeColor: wrong.indexOf(i) >= 0 ? RED : BLUE,
                fillColor:   wrong.indexOf(i) >= 0 ? RED : BLUE
            }));
            board.update();
            setStatus('<span style="color:' + RED + '">Not quite — ' + wrong.length +
                ' point' + (wrong.length > 1 ? 's are' : ' is') +
                ' at the wrong height (shown in red). Check the table again and retry.</span>');
        }
    }

    // --- Control API for native PreTeXt buttons -----------------------------
    window.gedHoriz = function (v) { horiz = v; refresh(); };
    window.gedVert  = function (v) { vert  = v; refresh(); };
    window.gedCheck = function () { checkPlot(); };
    window.gedReset = function () {
        if (!plotting) return;
        randomiseStart();
        setStatus('Points reset to new starting heights. ' +
            'Drag each point to the correct number of students, then click <b>Check Plot</b>.');
    };

    refresh();
}());
/*
    Graphing empirical data — choosing the axes, then plotting  (13.7)
    ------------------------------------------------------------------
    Students are shown a table of the number of students in each class from
    Grade 6 to Grade 11. Using native PreTeXt buttons they choose which variable
    goes on the horizontal axis (independent) and which on the vertical axis
    (dependent). When the choice is correct the scatter is plotted automatically on
    the (initially blank, unlabelled) plane, the axes are labelled, and the overall
    trend is described.

    House-style split:
      - The coordinate plane is the JSXGraph board (id="jsx-graphing-empirical-data").
      - The data TABLE is fixed PreTeXt content beside the board.
      - Selection controls are native PreTeXt buttons wired to
        window.gedHoriz('grade'|'students') and window.gedVert('grade'|'students').
      - A status line (selected variables + trend) is written to an html slate
        with id="ged_status".
*/

/*(function () {
    'use strict';

    JXG.Options.text.useMathJax = true;
    JXG.Options.text.fontSize = 15;

    const board = JXG.JSXGraph.initBoard('jsx-graphing-empirical-data', {
        // Tighter bounding box so the graph fills the available PreTeXt width
        boundingbox: [4.5, 52, 12.5, 26],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // -------------------------------------------------------------------------
    // Fixed data
    // -------------------------------------------------------------------------
    const grades = [6, 7, 8, 9, 10, 11];
    const students = [30, 34, 37, 41, 44, 48];

    const LABELS = {
        grade: 'Grade level',
        students: 'Number of students'
    };

    // -------------------------------------------------------------------------
    // Scatter points (hidden until correct choice)
    // -------------------------------------------------------------------------
    const pts = grades.map((g, i) =>
        board.create('point', [g, students[i]], {
            name: '',
            size: 4,
            strokeColor: '#1565c0',
            fillColor: '#1565c0',
            fixed: true,
            withLabel: false,
            visible: false,
            highlight: false
        })
    );

    // -------------------------------------------------------------------------
    // Axis labels (kept INSIDE the board so they are not clipped in PreTeXt)
    // -------------------------------------------------------------------------
    const xLabel = board.create('text', [
        8.5,
        27.2,
        () => LABELS.grade
    ], {
        anchorX: 'middle',
        fixed: true,
        visible: false,
        cssStyle: 'font-weight:bold'
    });

    const yLabel = board.create('text', [
        4.8,
        50.8,
        () => LABELS.students
    ], {
        anchorX: 'left',
        fixed: true,
        visible: false,
        cssStyle: 'font-weight:bold'
    });

    // -------------------------------------------------------------------------
    // Selection state
    // -------------------------------------------------------------------------
    let horiz = null;
    let vert = null;

    const statusEl = () => document.getElementById('ged_status');

    function setStatus(html) {
        const s = statusEl();
        if (s) s.innerHTML = html;
    }

    function refresh() {
        const bothChosen = horiz && vert;
        const correct = horiz === 'grade' && vert === 'students';

        pts.forEach(p => p.setAttribute({ visible: correct }));
        xLabel.setAttribute({ visible: correct });
        yLabel.setAttribute({ visible: correct });

        board.update();

        if (!bothChosen) {
            setStatus(
                'Choose which variable goes on each axis using the buttons.' +
                (horiz ? '<br>Horizontal: <b>' + LABELS[horiz] + '</b>' : '') +
                (vert ? '<br>Vertical: <b>' + LABELS[vert] + '</b>' : '')
            );
            return;
        }

        if (!correct) {
            setStatus(
                'Horizontal: <b>' + LABELS[horiz] + '</b>' +
                '&nbsp;&nbsp;Vertical: <b>' + LABELS[vert] + '</b>' +
                '<br><span style="color:#c62828">' +
                'Not quite — the independent variable (grade level) belongs on the horizontal axis, ' +
                'and the dependent variable (number of students) belongs on the vertical axis. Try again.' +
                '</span>'
            );
            return;
        }

        setStatus(
            'Independent variable (horizontal): <b>' + LABELS.grade + '</b>' +
            '<br>Dependent variable (vertical): <b>' + LABELS.students + '</b>' +
            '<br><span style="color:#2e7d32">' +
            'The number of students generally increases with grade level.' +
            '</span>'
        );
    }

    // -------------------------------------------------------------------------
    // API used by the PreTeXt buttons
    // -------------------------------------------------------------------------
    window.gedHoriz = function (v) {
        horiz = v;
        refresh();
    };

    window.gedVert = function (v) {
        vert = v;
        refresh();
    };

    refresh();

}());*/
