/*
    Domain of a Function — identify the domain from the graph
    A random function is drawn (linear, quadratic, square root, rational or
    logarithmic). The learner clicks the statement card(s) that describe the
    domain, then presses the native PreTeXt Submit button. Correct choices turn
    green, wrong ones red, with a short explanation.

    House-style split:
      - The GRAPH is the JSXGraph board (id="jsx-domain-quiz").
      - The statement CARDS are rendered into an html slate (id="domainquiz_cards")
        because they change with every question.
      - A status line is written to an html slate (id="domainquiz_status").
      - The fixed controls (Submit / Give Up / Skip-New) are native PreTeXt buttons
        wired to window.dqSubmit(), window.dqGiveUp(), window.dqNew().

    DRAFT NOTE: the request also describes a two-screen flow; this draft shows the
    graph (board) and cards (html slate) together. See PROGRESS.md.
*/

(function () {
    'use strict';

    JXG.Options.text.fontSize = 14;

    const board = JXG.JSXGraph.initBoard('jsx-domain-quiz', {
        boundingbox: [-7, 7, 7, -7],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    const cardsEl = () => document.getElementById('domainquiz_cards');
    const statusEl = () => document.getElementById('domainquiz_status');

    // --- Question bank ------------------------------------------------------
    const rInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
    function makeQuestion() {
        const kind = rInt(0, 4);
        const h = rInt(-2, 2);
        if (kind === 0) {
            const m = rInt(-2, 2) || 1;
            return { eq: 'f(x) = ' + m + 'x + ' + rInt(-3, 3), fn: (x) => m * x + h, dom: [-6, 6],
                choices: [{ t: 'All real numbers', ok: true, why: '' },
                          { t: 'x ≥ 0', ok: false, why: 'a line continues for every x' },
                          { t: 'x ≠ 0', ok: false, why: 'nothing is undefined here' }] };
        }
        if (kind === 1) {
            return { eq: 'f(x) = x² + ' + rInt(-3, 3), fn: (x) => x * x + h, dom: [-6, 6],
                choices: [{ t: 'All real numbers', ok: true, why: '' },
                          { t: 'x ≥ 0', ok: false, why: 'the parabola is defined for negative x too' },
                          { t: 'y ≥ 0', ok: false, why: 'that describes the range, not the domain' }] };
        }
        if (kind === 2) {
            return { eq: 'f(x) = √(x − ' + h + ')', fn: (x) => (x < h ? NaN : Math.sqrt(x - h)), dom: [h, 6],
                choices: [{ t: 'x ≥ ' + h, ok: true, why: '' },
                          { t: 'x ≤ ' + h, ok: false, why: 'the square root needs a non-negative inside' },
                          { t: 'All real numbers', ok: false, why: 'x < ' + h + ' gives a negative square root' }] };
        }
        if (kind === 3) {
            return { eq: 'f(x) = 1 / (x − ' + h + ')', fn: (x) => (Math.abs(x - h) < 0.03 ? NaN : 1 / (x - h)), dom: [-6, 6],
                choices: [{ t: 'x ≠ ' + h, ok: true, why: '' },
                          { t: 'x > ' + h, ok: false, why: 'values below ' + h + ' are allowed too' },
                          { t: 'All real numbers', ok: false, why: 'x = ' + h + ' makes the denominator 0' }] };
        }
        return { eq: 'f(x) = ln(x − ' + h + ')', fn: (x) => (x <= h ? NaN : Math.log(x - h)), dom: [h + 0.02, 6],
            choices: [{ t: 'x > ' + h, ok: true, why: '' },
                      { t: 'x ≥ ' + h, ok: false, why: 'ln(0) is undefined, so x = ' + h + ' is excluded' },
                      { t: 'x ≠ ' + h, ok: false, why: 'values below ' + h + ' are also excluded' }] };
    }

    // --- State --------------------------------------------------------------
    let q, graphObjs = [], selected = new Set(), score = 0, answered = 0;

    const CARD_BASE = 'display:block;width:100%;margin:4px 0;padding:8px 10px;border:1px solid #90a4ae;border-radius:6px;background:#fff;cursor:pointer;font-size:15px;text-align:left;';

    function renderCards() {
        const box = cardsEl();
        if (!box) return;
        box.innerHTML = '';
        q.choices.forEach((c, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = c.t;
            btn.style.cssText = CARD_BASE;
            btn.setAttribute('data-i', i);
            btn.addEventListener('click', () => {
                if (selected.has(i)) { selected.delete(i); btn.style.background = '#fff'; }
                else { selected.add(i); btn.style.background = '#bbdefb'; }
            });
            box.appendChild(btn);
        });
    }

    function setStatus(html) { const s = statusEl(); if (s) s.innerHTML = html; }

    function build() {
        board.removeObject(graphObjs); graphObjs = [];
        selected = new Set();
        q = makeQuestion();
        graphObjs.push(board.create('functiongraph', [q.fn, q.dom[0], q.dom[1]], { strokeColor: '#1565c0', strokeWidth: 3 }));
        renderCards();
        setStatus('Select the domain shown by the graph, then press <b>Submit</b>. &nbsp; Score: ' + score + ' / ' + answered);
        board.update();
    }

    function cardButtons() {
        const box = cardsEl();
        return box ? Array.from(box.querySelectorAll('button')) : [];
    }

    window.dqSubmit = function () {
        const btns = cardButtons();
        let allRight = true, notes = [];
        q.choices.forEach((c, i) => {
            const chosen = selected.has(i);
            if (c.ok) btns[i].style.background = '#a5d6a7';
            else if (chosen) { btns[i].style.background = '#ef9a9a'; allRight = false; notes.push('“' + c.t + '” — ' + c.why); }
            if (c.ok && !chosen) allRight = false;
        });
        answered++;
        if (allRight) score++;
        setStatus('<b>' + q.eq + '</b> &nbsp; ' + (allRight ? 'Correct' : 'Not quite') +
            ' &nbsp; Score: ' + score + ' / ' + answered +
            (notes.length ? '<br><span style="color:#c62828">' + notes.join('<br>') + '</span>' : ''));
    };
    window.dqGiveUp = function () {
        const btns = cardButtons();
        q.choices.forEach((c, i) => { if (c.ok) btns[i].style.background = '#a5d6a7'; });
        setStatus('<b>' + q.eq + '</b> &nbsp; Correct domain shown in green.');
    };
    window.dqNew = build;

    build();
}());
