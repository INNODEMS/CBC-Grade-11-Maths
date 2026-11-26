/*
    Slot diagram: permutations against combinations
    -----------------------------------------------
    n learners stand in a row; r positions (slots) are to be filled.
      Order matters (e.g. Chairperson, Secretary, Treasurer):
          n x (n-1) x ... x (n-r+1) = nPr
      Order does not matter (a committee): each committee is counted r! times
      in nPr, so nCr = nPr / r!.
    "Random pick" fills the slots with a random choice. Below the slots the
    board then lists every order of the same r people (r! rows, shown for
    r <= 4), so learners see why we divide by r!.
    Defaults match the opening activity: 4 friends, 2 positions.

    Expects: a surface="jsxboard" slate with id="jsx-slots-perm-comb".
*/

JXG.Options.text.fontSize = 14;
JXG.Options.text.useMathJax = false;

const board = JXG.JSXGraph.initBoard('jsx-slots-perm-comb', {
    boundingbox: [0, 12, 16, 0],
    keepAspectRatio: false,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
});

const PEOPLE = ['Achieng', 'Baraka', 'Chebet', 'Daudi', 'Ekiru', 'Fatuma', 'Githinji', 'Halima'];
const COLOURS = ['#1565c0', '#c62828', '#2e7d32', '#6a1b9a', '#ef6c00', '#00838f', '#ad1457', '#5d4037'];
const ROLES = ['Chairperson', 'Secretary', 'Treasurer', 'Organiser', 'Timekeeper', 'Member 6', 'Member 7', 'Member 8'];

const nS = board.create('slider', [[1, 11.3], [5, 11.3], [2, 4, 8]], { name: 'n', snapWidth: 1, precision: 0, size: 4 });
const rS = board.create('slider', [[8, 11.3], [12, 11.3], [1, 2, 8]], { name: 'r', snapWidth: 1, precision: 0, size: 4 });
const ordered = board.create('checkbox', [1, 10.4, 'Order matters (named posts)'], { fixed: true, checked: true });

const n = () => nS.Value();
const r = () => Math.min(rS.Value(), nS.Value());
const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
const nPr = () => fact(n()) / fact(n() - r());
const nCr = () => nPr() / fact(r());

let pick = [];                       // indices of the chosen people, in slot order

// --- The n learners --------------------------------------------------------------
for (let i = 0; i < 8; i++) {
    board.create('text', [() => 1 + i * 1.85, 9.2, PEOPLE[i]], {
        fixed: true, color: COLOURS[i], fontSize: 13,
        visible: () => i < n(),
        cssStyle: 'font-weight:bold'
    });
}

// --- The r slots --------------------------------------------------------------------
for (let j = 0; j < 8; j++) {
    const x = () => 1 + j * 1.85;
    board.create('polygon', [[x, 6.6], [() => x() + 1.7, 6.6], [() => x() + 1.7, 7.9], [x, 7.9]], {
        fillColor: '#fff8e1', fillOpacity: 1, borders: { strokeColor: '#999' }, vertices: { visible: false },
        fixed: true, highlight: false, visible: () => j < r()
    });
    board.create('text', [() => x() + 0.85, 7.25, () => (pick.length === r() && pick[j] !== undefined ? PEOPLE[pick[j]] : String(n() - j) + ' choices')], {
        fixed: true, anchorX: 'middle', anchorY: 'middle', fontSize: 12,
        color: () => (pick.length === r() && pick[j] !== undefined ? COLOURS[pick[j]] : '#555'),
        visible: () => j < r()
    });
    board.create('text', [() => x() + 0.85, 6.25, () => (ordered.Value() ? ROLES[j] : 'member')], {
        fixed: true, anchorX: 'middle', fontSize: 11, color: '#777', visible: () => j < r()
    });
}

// --- Counting readout -----------------------------------------------------------------
board.create('text', [1, 5.2, () => {
    const factors = [];
    for (let j = 0; j < r(); j++) factors.push(n() - j);
    let s = 'Filling the slots in order: ' + factors.join(' × ') + ' = <b>' + nPr() + '</b> = <sup>' + n() + '</sup>P<sub>' + r() + '</sub>';
    if (!ordered.Value()) {
        s += '<br>Order does not matter: each group of ' + r() + ' appears ' + r() + '! = ' + fact(r()) +
            ' times in that list, so <sup>' + n() + '</sup>C<sub>' + r() + '</sub> = ' + nPr() + ' ÷ ' + fact(r()) +
            ' = <b>' + nCr() + '</b>';
    }
    return s;
}], { fixed: true, anchorY: 'top' });

// --- Random pick and all its orderings ---------------------------------------------------
function permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    const out = [];
    arr.forEach((v, i) => permutations(arr.slice(0, i).concat(arr.slice(i + 1))).forEach((p) => out.push([v].concat(p))));
    return out;
}
board.create('button', [10.2, 10.6, 'Random pick', () => {
    const idx = [...Array(n()).keys()];
    for (let i = idx.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [idx[i], idx[k]] = [idx[k], idx[i]]; }
    pick = idx.slice(0, r());
    board.update();
}], { fixed: true });
board.create('button', [14.4, 10.6, 'Clear', () => { pick = []; board.update(); }], { fixed: true });

board.create('text', [1, 3.3, () => {
    if (pick.length !== r() || pick.some((i) => i >= n())) return '';
    if (r() > 4) return 'These ' + r() + ' people can be arranged in ' + r() + '! = ' + fact(r()) + ' orders.';
    const rows = permutations(pick).map((p) => p.map((i) => '<span style="color:' + COLOURS[i] + '">' + PEOPLE[i] + '</span>').join(', '));
    return 'The same ' + r() + ' people in all ' + fact(r()) + ' orders' +
        (ordered.Value() ? ' (different arrangements of the posts):' : ' (all the same committee):') +
        '<br><span style="font-size:12px">' + rows.map((t, i) => t + (i % 4 === 3 ? '<br>' : (i < rows.length - 1 ? ' &nbsp;|&nbsp; ' : ''))).join('') + '</span>';
}], { fixed: true, anchorY: 'top', fontSize: 13 });

// Changing n or r clears any old pick.
nS.on('drag', () => { pick = []; });
rS.on('drag', () => { pick = []; });
