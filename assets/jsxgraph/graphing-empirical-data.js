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

    // --- Fixed data: number of students per class ---------------------------
    const grades = [6, 7, 8, 9, 10, 11];
    const students = [30, 34, 37, 41, 44, 48];   // generally increasing

    const LABELS = { grade: 'Grade level', students: 'Number of students' };

    // --- Scatter points (hidden until the axes are chosen correctly) --------
    const pts = grades.map((g, i) => board.create('point', [g, students[i]], {
        name: '', size: 4, strokeColor: '#1565c0', fillColor: '#1565c0',
        fixed: true, withLabel: false, visible: false, highlight: false
    }));

    // --- Axis labels (hidden until correct) ---------------------------------
    const xLabel = board.create('text', [6.5, -5.5, () => LABELS.grade],
        { anchorX: 'middle', fixed: true, visible: false, cssStyle: 'font-weight:bold' });
    const yLabel = board.create('text', [-1.2, 54, () => LABELS.students],
        { anchorX: 'left', fixed: true, visible: false, cssStyle: 'font-weight:bold' });

    // --- Selection state ----------------------------------------------------
    let horiz = null, vert = null;
    const statusEl = () => document.getElementById('ged_status');
    function setStatus(html) { const s = statusEl(); if (s) s.innerHTML = html; }

    function refresh() {
        const bothChosen = horiz && vert;
        const correct = horiz === 'grade' && vert === 'students';
        pts.forEach(p => p.setAttribute({ visible: correct }));
        xLabel.setAttribute({ visible: correct });
        yLabel.setAttribute({ visible: correct });
        board.update();

        if (!bothChosen) {
            setStatus('Choose which variable goes on each axis using the buttons.' +
                (horiz ? '<br>Horizontal: <b>' + LABELS[horiz] + '</b>' : '') +
                (vert ? '<br>Vertical: <b>' + LABELS[vert] + '</b>' : ''));
            return;
        }
        if (!correct) {
            setStatus('Horizontal: <b>' + LABELS[horiz] + '</b> &nbsp; Vertical: <b>' + LABELS[vert] + '</b>' +
                '<br><span style="color:#c62828">Not quite — the independent variable (grade level) goes on the ' +
                'horizontal axis, and the dependent variable (number of students) on the vertical axis. Try again.</span>');
            return;
        }
        setStatus('Independent variable (horizontal): <b>' + LABELS.grade + '</b>' +
            '<br>Dependent variable (vertical): <b>' + LABELS.students + '</b>' +
            '<br><span style="color:#2e7d32">The number of students generally increases with grade level.</span>');
    }

    // --- Control API for native PreTeXt buttons -----------------------------
    window.gedHoriz = function (v) { horiz = v; refresh(); };
    window.gedVert = function (v) { vert = v; refresh(); };

    refresh();
}());
