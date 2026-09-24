/*
    Range of a Function — watch the graph form, then find the range
    "Kick" animates a ball along a projectile (downward parabola); a dotted trail
    draws the graph as it flies. The highest point is marked when it lands and its
    value is shown. "Next" reveals range answer choices; Submit checks the answer
    and, if wrong, highlights the peak as a hint. Restart makes a new question.

    House-style split:
      - The GRAPH / animation is the JSXGraph board (id="jsx-range-kick").
      - The range CHOICES are rendered into an html slate (id="rangekick_choices").
      - A status line is written to an html slate (id="rangekick_status").
      - The fixed controls (Kick / Next / Previous / Submit / Restart) are native
        PreTeXt buttons wired to window.rkKick(), rkNext(), rkPrev(), rkSubmit(),
        rkRestart().

    DRAFT NOTE: the request describes two separate screens; this draft animates on
    the board and shows the choices in the adjacent html slate. See PROGRESS.md.
*/

(function () {
    'use strict';

    JXG.Options.text.fontSize = 14;

    const board = JXG.JSXGraph.initBoard('jsx-range-kick', {
        boundingbox: [-2, 8, 12, -3],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    const choicesEl = () => document.getElementById('rangekick_choices');
    const statusEl = () => document.getElementById('rangekick_status');
    const setStatus = (html) => { const s = statusEl(); if (s) s.innerHTML = html; };

    const rnd = (lo, hi) => lo + Math.random() * (hi - lo);

    // --- State --------------------------------------------------------------
    let q, scene = [], progX, timer = null, vertex = null, selected = null;

    function clearScene() {
        if (timer) { clearInterval(timer); timer = null; }
        board.removeObject(scene); scene = []; vertex = null;
    }

    function newQuestion() {
        clearScene();
        selected = null;
        if (choicesEl()) choicesEl().innerHTML = '';
        const a = rnd(0.4, 0.6), h = 3, k = Math.round(rnd(3, 6));
        const half = Math.sqrt(k / a), xL = h - half, xR = h + half;
        const f = (x) => -a * (x - h) * (x - h) + k;
        q = { a, h, k, xL, xR, f };
        progX = xL;

        scene.push(board.create('segment', [[xL, 0], [xR, 0]], { strokeColor: '#8d6e63', strokeWidth: 3 }));
        scene.push(board.create('curve', [(x) => x, f, xL, () => progX], { strokeColor: '#1565c0', strokeWidth: 2, dash: 2 }));
        scene.push(board.create('point', [() => progX, () => f(progX)], { name: '', size: 5, strokeColor: '#c62828', fillColor: '#c62828', fixed: true }));
        setStatus('Press <b>Kick</b>, watch the highest point, then press <b>Next</b>.');
        board.update();
    }

    function kick() {
        if (timer) clearInterval(timer);
        progX = q.xL;
        board.update();
        timer = setInterval(() => {
            progX += (q.xR - q.xL) / 60;
            if (progX >= q.xR) {
                progX = q.xR; clearInterval(timer); timer = null;
                vertex = board.create('point', [q.h, q.k], { name: 'max', size: 4, strokeColor: '#2e7d32', fillColor: '#2e7d32', fixed: true });
                scene.push(vertex);
                setStatus('Highest value reached: <b>y = ' + q.k.toFixed(1) + '</b>. Press <b>Next</b> to choose the range.');
            }
            board.update();
        }, 40);
    }

    // --- Answer choices (html slate) ----------------------------------------
    const CH = 'display:block;width:100%;margin:4px 0;padding:8px 10px;border:1px solid #90a4ae;border-radius:6px;background:#fff;cursor:pointer;font-size:15px;text-align:left;';
    function showChoices() {
        const box = choicesEl();
        if (!box) return;
        const K = q.k.toFixed(1);
        const choices = [
            { t: '0 ≤ y ≤ ' + K, ok: true },
            { t: 'y ≥ 0', ok: false },
            { t: '−' + K + ' ≤ y ≤ ' + K, ok: false },
            { t: 'all real numbers', ok: false }
        ];
        box.innerHTML = '';
        selected = null;
        choices.forEach((c) => {
            const btn = document.createElement('button');
            btn.type = 'button'; btn.textContent = c.t; btn.style.cssText = CH;
            btn.addEventListener('click', () => {
                Array.from(box.querySelectorAll('button')).forEach(b => b.style.background = '#fff');
                btn.style.background = '#bbdefb';
                selected = { btn, c };
            });
            box.appendChild(btn);
        });
        setStatus('Choose the range, then press <b>Submit</b>.');
    }
    function prev() { if (choicesEl()) choicesEl().innerHTML = ''; selected = null; setStatus('Press <b>Kick</b> to watch the graph again.'); }
    function submit() {
        if (!selected) { setStatus('Pick a range first.'); return; }
        selected.btn.style.background = selected.c.ok ? '#a5d6a7' : '#ef9a9a';
        if (!selected.c.ok && vertex) vertex.setAttribute({ size: 7, strokeColor: '#ef6c00', fillColor: '#ef6c00' });
        setStatus(selected.c.ok ? 'Correct — the range runs from the ground up to the highest point.'
            : 'Not quite — look at the highlighted highest point for a hint.');
    }

    // --- Control API for native PreTeXt buttons -----------------------------
    window.rkKick = kick;
    window.rkNext = showChoices;
    window.rkPrev = prev;
    window.rkSubmit = submit;
    window.rkRestart = newQuestion;

    newQuestion();
}());