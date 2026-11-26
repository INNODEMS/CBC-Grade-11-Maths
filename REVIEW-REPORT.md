# CBC Grade 11 Mathematics: section-by-section review report

Review date: 26 November 2026. Branch: `content-review-2026-11` (from `main` at c30494c). Nothing has been pushed.

## Scope and method

Every section of all 17 chapters was read in order. For each section:

- **Typos:** fixed directly in the source. A spell-check pass over all prose came first, then reading caught the rest.
- **Learner experiences and Key Takeaways:**
  - Each `<activity>` (learner experience) was checked for clarity, accuracy and fit with the section, and rewritten where it was unfinished, contradictory or did not work mathematically.
  - Each **Key Takeaways & Teacher Connection** block (inside the *Structured Instruction* lesson-plan axiom) and each `<insight>` was checked the same way.
  - 56 sections had no active takeaways: either a commented-out `XXXX` template or nothing at all. Every one now has two or three takeaways, each tied to that section's activity.
- **Examples and exercises:**
  - Every worked example and every exercise with an answer or solution was recomputed.
  - Question, hint and solution were checked against each other.
  - Clear errors were fixed. Judgement calls were left as they were and are listed at the end of this report.
- **Not reviewed:** STACK questions and checkpoints, as instructed.
- **JSXGraph:** every embedded interactive was audited (see the JSXGraph section). Broken ones were fixed, and seven interactives were added.

Each chapter was committed separately, so any change can be reviewed or reverted on its own (`git log content-review-2026-11`).


## Global findings

- Spelling pass (commit b30fa42): ~30 misspellings fixed across 18 files.
- Mixed UK/US spelling: "centre" (144) dominates, but "circumcenter"(20)/"excenter"(3)/"center" in places; "metres" vs "meters". Judgement: left mostly, normalised where touched.
- perfect_squares.js writes to an HTML element "message" that does not exist in the slate -> feedback never shown.

## Chapter-by-chapter findings

### Ch 1 Quadratic expressions and equations
#### Applying the quadratic formula
- Activity rewritten: roles were contradictory (Person 2 "chooses 5" with a "<= 5 constraint"; Person 3 "chooses a variable x"). Now clear Chooser/Adder/Multiplier/Announcer flow; added "is there more than one answer?".
- Key takeaways: added worked value for 13.5 ((-5±√79)/2), the two-answers point (x=2 and x=-7 for 14), and a discriminant takeaway.
- Example 2: missing step (-6±4)/2 added.
- Exercise (2c) answer unsimplified (−1±√9)/4 -> 1/2 or −1.
- Exercise (4a),(4c) unsimplified -> 3/5,−1 and 1/2,−2/3. (4b) 2x²+3x+4=0 gave √−23 "solutions" -> now "no real solutions (discriminant −23)".
- Ticket revenue exercise: answer WRONG (√1600 computed as 400; "2250 tickets"). Correct: x=5 or 45 (tens) -> 50 or 450 tickets.
#### Completing the square I
- Exercise 1(a) x²−6x+5=0 answer WRONG (3±2√2) -> x=5 or 1. (c) simplified to 4, −1; (e) simplified to (7±3√5)/2.
- Ball exercise: "approximately" with exact values -> exact + decimals (0.76 s, 5.24 s) and up/down interpretation.
#### Completing the square II
- Activity asked learners to solve 2x²+5x+4=0 (discriminant −7, no real roots) for a garden side length, and to "rearrange into one large square" which is not possible with two x² pieces. Rewritten: area = 10 m² (matches Example 3), divide by 2, find the missing corner piece 25/16, solve (x≈0.89 m).
#### Deriving the quadratic formula
- Activity: area 24 m² gave x(2x+5)=24 with disc 217 (messy). Changed to 12 m² -> width 1.5 m, length 8 m, so completing the square is achievable by hand.
- Examples 2 and 3 were titled "Derive the quadratic formula for 2x²+3x−5=0" (a specific equation has no formula to derive). Reworded to "Solve ... following the same steps"; final roots 1 and −5/2 added to Example 2.
#### Simultaneous linear and quadratic
- Example 4: y only as decimals -> exact y=(19±√33)/2 and coordinate pairs.
- Exercise 1: y=3x−2 and y=x²−5x+6 gives x=4±2√2, but the answer said x=2,3 (y=4,7). Question corrected to y=x²−2x+4, which matches the given answer.
- Exercise 2(b): 2x+1=x²−x−2 answer WRONG (−1, 2) -> (3±√21)/2. 2(a) simplified to 2±2√2.

### Ch 2 Irrational numbers
- Ch1 insights: CS-II insight said "add (b/2)²" after dividing by a (should be (b/2a)²); deriving insight "simplify the square root" step repeated the unsimplified root; QF insight mentioned complex conjugate roots (out of scope) -> "no real roots"; simultaneous insight missing the "substitute back for y" step.
#### Identifying irrational numbers
- Example 2: 0.272727 and 0.1010010001 written as terminating decimals (so both rational) but solution called them recurring / irrational. Added "..." and pattern descriptions; added 27/99 = 3/11.
- Example 1 solution was "√50√72√90 They are not perfect squares" -> full sentence, also states √64, √81 rational.
- Invalid nested <li> inside <p> in solution removed.
- Activity verbs "Lists/Writes" -> imperative; maths-mode "e.g." fixed.
- Teacher Connection block had a second <title> inside the axiom (invalid structure) -> converted to Key Takeaways & Teacher Connection paragraphs (same in real-life, rationalising, simplifying). New concrete takeaways in all four, plus a new one for adding/subtracting (block was commented out with XXXX).
#### Adding and subtracting
- Insight said "two fundamental laws" but listed three; "not same" grammar; added decimal counterexample √2+√3≈3.15 vs √5≈2.24.
#### Real life
- Machine-generated jargon in 8 solutions ("structural corner math", "parse the line split allocation", "geometric span") replaced with plain language.
#### Rationalising
- Activity contained a teacher instruction ("If learners are struggling, remind them...") shown to learners -> learner hint.
#### Simplifying
- Example (d) 3√20 had 6 levels of nested <p> with prose inside <md> (rendered as italic maths) -> rebuilt as aligned md.
- Exercise: "√25×{2}" (missing √) and "√50=√(s²)" layout -> clean derivation.
- Exercise: "classroom is build ... √20 cm" with answer in m -> "square classroom ... √20 m".

### Ch 3 Linear inequalities
- Simple: Example 15−2x≥7 wrote "2x ≥ −8" before dividing by −2 (sign lost). Exercise "smallest integer" answer didn't give the integer. Mwakidize answer started "When n represent" with no working -> full working. Mike exercise "squares are always positive" -> "never negative".
- Compound: "Combing" -> Combining; "Nanjala scored by N marks" -> "scored N percent".
- Graphing one unknown: activity used the HOLLOW object for x ≤ −2 (should be closed/solid) and a 0–30 cm ruler with no negatives. Redesigned: 15 cm mark = 0; solid marker = closed circle, hollow marker = open circle, pencil = arrow; learners decide which marker. Borehole: "minimum average" -> "average"; answer (a) now W = 1200 − 150d ≥ 0, d ≤ 8.
- Graphing two unknowns: "Parkie Nairobi" -> "Parklands, Nairobi" (judgement call).
- Solving in two unknowns: Example 2 said origin is "below" y = 2x − 4 (it is above). Exercise statement x + y > 4 but solution & figure use x + 2y > 4 -> statement corrected. Activity region x+y≤6, x≥y was unbounded (one vertex) yet asked for "the vertices" -> added y ≥ 0 (triangle (0,0),(6,0),(3,3)).
- Real life: "Represent your combination chart" -> "Present your graph"; Angie/Makueni/Kisumu/Turkana typeset in maths mode.
- Key takeaways: none of the 7 sections had an active "Key Takeaways & Teacher Connection" (6 were commented-out XXXX templates, 1 missing). All 7 now active with two concrete, activity-linked points each.

### Ch 4 Logarithms II
- Maths all correct; domino chain verified by hand (15 dominoes, 14 joins). Answer listed 15 "join" values -> clarified as start value + 14 joins.
- pH exercise attributed log(1/x) = −log x to the quotient law -> power law. Example log2 8 now shows 8 = 2³. "give by" -> "given by".
- Key takeaways: none of the 4 sections had one -> added (dominoes, matching pairs, Domain Trap, guessing game/rounding up).
- Teacher notes inside activities are already component="lesson-plan" (hidden in student build) – OK.

### Ch 5 Formulae and variations
- Inverse variation: all 5 exercises were word-for-word copies of the 5 worked examples -> new numbers/answers (k=60 y=180; p=90/q; k=36; gradient 40; P=24/V with updated tikz).
- Direct variation: spring and generator exercises duplicated the examples -> new numbers. "Weight varies as the square of velocity when calculating kinetic energy" (physically wrong) -> kinetic energy E = kv².
- Partial variation: jersey exercise duplicated the stone-wall example in Variation in real life; freight exercise duplicated the courier example -> new numbers. Activity Home F (1,100) duplicated Home E -> 1,600 (30 km).
- Direct variation activity said "fill in missing distances" but they were given -> ratio column only.
- Inverse variation activity: titled "Learner Experience 1.2.1" (wrong chapter numbering) and told learners the constant ("magic number 24") before they explored -> discovery version (they compute times then the products; then write t = 24/w).
- Variation in real life insight: \\text in md (renders as line breaks) -> \text.
- Key takeaways: combined/joint block was only definitions -> added activity link (k=0.5, trial answers) and method; partial variation had none -> added 3 points.
- Not changed (judgement): "brightness varies inversely as distance" (real light follows inverse square) left as a fictional model; noted.

### Ch 6 Sequences and series
- Sum of arithmetic: exercise (S10=400, S6=120) answer 975 WRONG -> 135 (d=10, a=−5). Exercise (S20=7½, T3=2) answer 2.869 WRONG -> 221/15 ≈ 14.73.
- Sum of geometric I: exercise (T2+T3=4, T3+T4=2) answer a=−16, r=−½ WRONG (gives T3+T4=−2) -> a=16/3, r=½.
- Introduction: Example "next three terms" – solutions (c) and (d) were in swapped order. Domino squares: solution said nth square has n rings but D1 = 12 = 4+8 -> n+1 rings, D_n = 4+8+…+4(n+1). "1,2,ldots,5" missing backslash. "forth" x2.
- Geometric: activity said the square "is divided into 4" but table starts at 1 -> "Stage 1 is a single square". "form arithmetic sequence", lowercase "if".
- Real life: Amina Plan B total 16,325 -> 16,324 (matches its own table); difference 2,824.
- Sum II: "has an infinite sum" (ambiguous) -> "has a sum to infinity"; added why the harmonic series diverges (grouping argument).
- Judgement (not changed): GP exercise "show second term is x²−1" ignores r = 1 − x (gives −(x²−1)); M-Pesa savings with 1.5% monthly interest is unrealistic (M-Shwari would be better).
- Key takeaways: none of the 7 sections had one -> added to all 7.
- All other answers verified (savings, primes, population 2030, drug dosing, Wanjiku, ball 60 m, Sierpinski).

### Ch 7 Matrices I
#### Matrices in real life (most errors in the book so far)
- TB activity: A² given as [0.26 0.14; 0.42 0.84]; correct (0.5·0.5+0.1·0.3) is 0.28 -> x₂ = (98, 336) not (82, 306); teacher note sequence updated; "A^{10}x_{10}" -> x₁₀ = A^{10}x₀.
- Static Sage output for A^{10} was wrong ([0.1225 0.0775; 0.1852 0.8775]); correct A^{10} ≈ [0.0853 0.1317; 0.3951 0.6122]; x₁₀ ≈ (57, 263) not (38, 282).
- Soccer example: working line used 100 and 300 / 10 instead of 1000 and 3000 (final totals were right).
- Canteen example QP: [1704 1742; 1660 1700] -> [1696 1742; 1720 1750].
- Canteen exercise SK: [1875 1930; 1900 2000] -> [1925 1985; 2100 2150].
- Poster exercise: 1530 / 1756.5 -> 1410 / 1621.5. Matatu fare income 36,900 -> 36,600 ("The the").
- Tech kits: prices 4000/3500 -> 3400/4400 (verified in both equations); confusing row/column description rewritten.
- Delivery hubs: 13,200 / 10,050 -> 13,600 / 11,050.
#### Other sections
- Determinant: Q·S worked with wrong matrices ([3 −2; 2 4], [5 −4; 4 5]) though the result was right -> correct matrices and products.
- Inverse I: R⁻¹ for −30° rotation written with sine signs swapped (equal to R itself) and a missing "="; shirt/jumper answer described the order backwards.
- Inverse II: elimination derivation had a stray ")" and a sign slip (8ab + 5bc). Example 2x−y=1, 3x+2y=14 claimed (2,4) – actual (16/7, 25/7); changed RHS to 12 -> (2,3). Arithmetic sequence "1,4,7,10,13,15" (15 should be 16) made the system's answer (−1,2) false -> 16. "follow pair" x2.
- Adding: "4 less bananas" -> "fewer". Multiplying II: "next week/second week" mixed with months.
- Verified correct: magic squares M±R, all determinant/inverse exercise answers, multiplication exercises, Fibonacci, AP-system proof, (AB)⁻¹ exercise.
- Key takeaways: added for intro, inverse II, multiplying II, real life; strengthened the one-line items in multiplying I and inverse I.

### Ch 8 Approximation and errors
- Absolute/relative/% errors: exercise (a) 45.138 s – absolute error 0.0005 (3 d.p.) not 0.005 -> relative 0.000011, 0.0011 %. Locker activity: "Divide (b) by the working length" – (b) is the working locker's own difference (zero); now (c) and (d). Key takeaway referred to "Mr. Mbasu's 90 cm measurement" which does not appear in the activity -> rewritten to the locker activity.
- Addition/subtraction: 8.63 l + 3.25 l limits given as 12.140/12.160 -> 11.870/11.890. "9,200 m race" run in 21 s -> 200 m. Relative error given in "cm" -> unitless.
- Division: absolute error of a cm÷cm quotient given in "cm" -> unitless.
- Estimation: activity measures a locker but the reflection and key takeaway said "desk" -> locker.
- Maximum/minimum: insight said limits are "actual value ±" -> working value. Key takeaway added (template was empty).
- Multiplication: mug minimum capacity π(4.45)²(8.15) = 161.4π (was 160.4π). Card example labelled "Percentage error = Absolute error × 100 %" -> Relative error. Triangle (c): A_min = 27.5054 (was 27.5104; conclusion unchanged).
- Rounding/truncation: exercise "0.32" – the given answers (0.33, 0.9 %; 0.32, 2.1 %) only fit 0.327 -> question changed to 0.327. Bounds of 649.0 (nearest 0.1) were 693.95/694.05 -> 648.95/649.05. Example lines labelled "absolute error" that were relative errors. "..", "truncated off".
- Judgement (not changed): the book mixes two definitions of absolute error for products/quotients ("max − working" in some places, "half of max − min" in others; e.g. sphere 3.06 % uses half-range while "max − working" gives 3.09 %). Recommend picking one convention chapter-wide.
- Verified correct: real-life examples (aircraft, pharmacist, pressure), flour 7 loaves, container 1.54, aspect ratio 0.19 %, bus 38.39, tiles 52, maize 11 %, salt range, matchbox limits, triangle (a)/(b), temperatures.

### Ch 9 Angle properties of a circle
- Cyclic quadrilateral exercise (shield): extended NM past M and claimed exterior ∠LMF = ∠KNL. The exterior angle at M equals the interior angle at K, and ∠KNL is not even the interior angle at N. Rewritten to extend KL past L: ∠MLF = ∠KNM = 71°, with the TikZ figure redrawn (F, clip region, label).
- Real-life exercise (clock): "angle at terminal L measures ∠KNM" -> terminal N.
- Angles at centre insight: "angle at circumference is half because P is much farther away" (false reasoning) -> isosceles-triangle reason.
- Real-life insight: claim that silos/tanks "use cyclic layouts to handle internal pressure" (unsupported) -> practical use of opposite angles.
- Diameter: takeaway referred to point C (activity uses P); rim example called angles "lengths of these spokes".
- Verified correct: all numeric answers (arcs/sectors/segments, Pythagoras, algebraic angle equations, a = b = 10.8).
- Key takeaways added: angles at centre, same arc, arcs/chords/segments, real life.
- Note: file/section id "sec-angles-substended-by-the-same-arc" still contains the misspelling (title fixed; id/filename left so links do not break).

### Ch 10 Circles, chords and tangents
- Real life – posho mill belt: total = 2L + a + b but the working used one L: 15√3 + 32π ≈ 126.5 cm -> 30√3 + 32π ≈ 152.5 cm. Angle names garbled ("∠O_BO_AG = 30° and ∠O_BO_AG = 60°").
- Real life – gap circle: general formula r = (8√3/3)R − R (wrong; came from substituting R = 4) -> (2√3/3 − 1)R, which agrees with the next part's ratio. "right triangle OXD" -> AXO.
- Real life – conversion kick: part (b) said the circle is tangent "to the try line at T" -> to the kicking line KT at K.
- Real life – crossed belt: arc formula showed "×10×π×10" -> "×2×π×10" (values were right). Basketball "(b)" -> "(a)". Mount Kenya/Kilimanjaro: explanation now quantifies (258 + 275 ≈ 533 km > 323 km).
- Escribed: r = 2, r_a = 3, r_b = 10 -> 1/r_c = 1/15, r_c = 15 cm (was 2/15 and 15/2; checks: Δ² = 900, the 5-12-13 triangle). 3-4-5 exercise with AB=3, BC=4, CA=5 reused the example's labels: correct r_a=3, r_b=6, r_c=2, and "largest excircle is opposite the shortest side" was backwards. 8-15-17 example asked for the excircle "tangent to the longer leg" (r_b = 12) but computed the one opposite the right angle (r_c = 20); question reworded and notation r_B -> r_c. Proof captions said the excircle touches BC at X (it touches BC at Z and the extensions at Y and X); AX step typo (b+c−a -> a+c−b). Activity intro sentence was cut off.
- Inscribed: 5-12-13 exercise caption/figure labels (PR = 12, QR = 13) contradicted the drawing and the solution (right angle at Q) -> PQ = 5, QR = 12, PR = 13; "YIXW" -> YIXQ.
- Circumscribed: sin θ = √3/2 and √2/2 answers now note the obtuse alternatives (120°, 135°); "line in a line".
- Direct tangents: construction step said T₁ is "where the tangent meets AB" -> touches circle A; "only look".
- Transverse tangents: construction said to continue the ray QB past B to find T₁′ (that gives the wrong point; T₁′ is between Q and B) – fixed in Key Ideas and example; insight said d ≤ R + r gives no transverse tangent (d = R + r gives one).
- Constructing tangents: "two lines perpendicular to the same line at a point must be parallel" -> unique perpendicular. Alternate segment: alt text said P is left of T (it is right); "∠PTA" -> ∠PTQ.
- Intersecting secants: "PB = PA + PB" -> PA + AB.
- Verified correct: all intersecting-chord, secant and common-tangent numeric answers, Euler line, Euler's formula, Heron results, Pappus, circular tree proof, lake road 59.78 km, horizon 258 km.
- Accessibility note (not changed): the alt text for the algebraic chord exercise figures repeats "Chords AB and CD intersecting at P" although the parts use PQ, RS and T.
- Key takeaways added: constructing tangents, circumscribed, escribed, secants/tangents, real life.

### Ch 11 Commercial arithmetic
- Income tax II: Kenyan tax table had the 4th band at 30.25 % (KRA rate is 32.5 %) and the top band's monthly threshold as Ksh 32,333 (should be 800,000; the annual column 9,600,000 was right). Ondiala example recomputed: gross tax 6,004,900, net tax 5,976,100, net monthly income 1,039,491.67 (was 1,046,241.67). Ondiala "employed in the United States" (Kenyan PAYE would not apply) -> multinational in Nairobi. Masimba conclusion stated the monthly tax (52,383.35) as the annual tax -> 628,600.20. Mwangi working labelled the tax step "Net monthly income = Gross mothly income − Relief". Jacob exercise mixed he/her. Other answers verified (Jacob 106,317; Kamau 96,762; Ben 3,738,385.09).
- Appreciation: exercise answer 4746.50 -> 47,463.56 (85,000/1.06^10).
- Compound interest: Lily 138,010 -> 138,013 (nearest shilling); "(1.006)^4" typo for (1.06)^4 (value was right); "Onyimbo invest".
- Depreciation: minibus 400,000 × 0.98^12 = 313,887 (was 313,700).
- Real life activity: Plan B called "reducing balance" but described compound interest -> renamed.
- Income tax I: "Taxable Income = Gross tax − Deductions" -> Gross Income; Esther pronouns; "total tax less deductions" -> allowable deductions.
- Simple interest: Sean exercise typos ("to but", "payed", "sean").
- Verified correct: all HP I/II answers, appreciation/compound rates and times, depreciation exercises, simple-interest answers.
- Note: Armstrong exercise 3.89 years is 3.896 (≈3.90) – left.
- Key takeaways: added for appreciation, HP I, HP II, income tax I, income tax II; simple interest strengthened.

### Ch 12 Trigonometry II
- Graphing sine and cosine: the learner activity statement was only "In groups of" (unfinished). Wrote a full activity: table of sin/cos at 30° steps, plot both, compare max/min/period, slide sine onto cosine (cos x = sin(x+90°)), predict 2 sin x vs sin 2x. Phase-shift example said sin(x−90°) = −cos(90°−x) (that equals −sin x) -> −cos x.
- Sine rule: Example b = 8 sin65°/sin40° = 11.3 (was 12.8); exercise b = 11 sin67°/sin28° = 21.6 (was 22.8); 13 sin32°/sin108° = 7.2 (was 7.3); ambiguous case 37.6°/142.4° and 45.6°/134.4° (rounding).
- Cosine rule: field c² ≈ 24 587.3, c ≈ 156.8 m (was 24 611.6 / 156.9).
- Real life: ships 13.38 km (13.42), roof 7.71 m (7.72), race 3.40 km (3.37), flight angle cos⁻¹(0.7019) ≈ 45.4° (0.7016, 45.5°), plot area 8929 m² (used sin 82.8° = 0.9903; correct 0.9922). Insight had "b\\cos C" (renders as line break).
- Solving equations I and II: intervals [0°, 360°] are closed, so sin θ = 0 also has 360° (answer gave 0°, 180°), tan θ = 0 has three solutions, and the "|k| = 1 gives one solution" rule fails for cos θ = 1. Changed every interval to 0° ≤ θ < 360° (and 0° ≤ u < 720°, etc.), which makes all printed answers correct.
- Radians: exercise "Convert the following into radians: sin(π/6)…" -> "Find the exact value… by converting to degrees"; sin/cos/tan typeset as italic letters.
- Beyond acute angles: example titled "Finding All Angles with a Given Cosine" was about the 300° point -> retitled.
- Not changed (judgement): satellite-dish example asks for an "elevation angle" between 0° and 360° and accepts 143.1° – physically odd; suggest rewording as a rotation angle.
- Key takeaways: none of the 11 sections had one -> added to all 11.

### Ch 13 Graphical methods
- Graphing quadratics: axis-of-symmetry exercise solution rewrote y = x²+6x+5 as (x+3)² (vertex (−3,0)) and y = −2x²+8x−3 as −(x−2)²+5 with a = −1. Corrected to (x+3)² − 4 (vertex (−3,−4)) and −2(x−2)²+5 (a = −2). Axes in the answer were already right.
- Roots: x³ − 3x + 1 roots read as −1.85, 0.38, 1.5 -> −1.88, 0.35, 1.53. ±√5 ≈ ±2.15 -> ±2.24. x³ − 2x² + x − 1: answer said 1.9, solution 1.76 -> 1.76 (only real root).
- Line of best fit: cold-drinks line used gradient 4.3 with a point it does not pass through -> 13/3 and −65.3; prediction 108.
- Empirical data: life-expectancy increase 2015–2020 is 2.6 (was 3.2) and the last interval is 3 years; internet-usage answer said growth was steepest early and levelling off – data accelerate -> rewritten (lower part of an S-curve).
- Instantaneous rate: answer bullet began with ". A tangent…" (missing "At t = 3, P(3) = 15").
- Verified correct: all AROC/tangent-gradient answers (checked tangent points against exact derivatives), linearisation and constants (pendulum, savings, bacteria, tea cooling, power laws), real-life (towers, break-even, equilibrium, pump profit), circles, simultaneous equations, Anscombe.
- Note: determining-constants activity (PV^k = C through (1, 2.3), (2, 0.9)) gives k = 1.4, C = 10^3.7 ≈ 5012 – no solution is provided; consider adding one.
- Key takeaways: added for converting to linear form (only section missing). Several existing ones are definition lists rather than links to the activity (average rate, instantaneous rate, line of best fit) – left, noted as possible improvements.

### Ch 14 Permutations and combinations
- Permutations II: BEEKEEPER has five E's (solution treated it as four: "EEEE", 4!/4!). The final answer 120 was right by luck; working corrected.
- Stray question numbers left in example statements ("2. Simplify…", "5. Simplify…", "5. How many…", "2. How many…"). "a assistant prefect" -> "an".
- Verified all numeric answers (30C12 = 86 493 225, 52C5, STATISTICS 50 400, phone digits 210, licence plates 11 232 000, etc.).
- Key takeaways: added for combinations in real life (only missing one), using the menu activity (8C3 = 56 vs 8P3 = 336).
- Suggestion (not changed): "baseball batting order" exercise could use a Kenyan context (e.g. penalty-shootout order in football).

### Ch 15 Probability II
- Probability in real life: Kenya under-20 qualification 0.408 + 0.166 = 0.574 – exact value 0.57475, so 0.575 (rounding of rounded parts).
- Display maths: 68–95–99.7 rule (continuous II) and tree-diagram path probabilities used `\` line breaks inside a single `<md>`; converted to `<mrow>` lines so they break reliably in HTML and print.
- Verified correct: uniform U(a,b) examples, geometric probability (π/4, 0.09, π/9, meeting 7/16), normal-rule answers, exponential answers, discrete PDFs and k, laws (inclusion–exclusion P(C) = 0.26, conditional 4/15, 2/5), independence tests, malaria test (0.27, 80 false positives), bulbs 0.815, Nakuru crops 0.349, sickle cell 37/64, matatu 0.72, insurance KSh 100 000, all combination-counting and tree-diagram answers (5/32 multiple-choice pass, 5/9 same colour, etc.).
- Key takeaways: added to all 8 sections (none had any), each tied to the opening activity.
- Suggestion: no interactive in this chapter – see new JSXGraph (normal-distribution area explorer).

### Ch 16 Functions
- Functions in real life: escape velocity worked answer claimed √6 400 000 = 2500 (it is 2529.8). Changed 2GM to 1.25 × 10¹¹ so √6 250 000 = 2500 exactly. Mango activity said "20 shillings each" but defined k in kilograms – now "per kilogram".
- Types of functions: Key Takeaways and the differentiation table referred to a "vending machine activity" that does not exist; the activity is about school admission numbers. Rewritten to match.
- Range: final activity task asked "if the domain is all hours from 0 to 12, does changing the domain change the range?" without changing anything. Now restricts to 2 ≤ h ≤ 6 (range 0 ≤ T ≤ 16 versus −20 ≤ T ≤ 16 for the full day).
- Types of relations: three questions missing "?"; capital-city exercise said "but a capital city belongs to only one country" → "and each capital city…".
- Verified correct: all domain/range answers, even/odd classifications, function-notation evaluations, inverse functions (polynomial, temperature, taxi, forex), inverse-trig exact values, limits, flare (82 m, 8.05 s), tides (11 m), KICC (45°, 30°), Kepler, cube-root law, pendulum, relativity (12.5 years).
- Key takeaways: all 11 sections already have them; checked they match their activities (only types of functions did not).
- Judgement calls (not changed): range activity temperature T(h) = −h² + 12h − 20 gives −20 °C at midnight, unrealistic for a Kenyan town (a model such as T = −0.5h² + 6h + 10 would give 10–28 °C, but tasks and teacher notes rely on the zero crossings at h = 2 and 10). Limits exercise profit "in dollars" could be shillings. Range table labels linear functions "(odd-degree)", which is confusing.

### Ch 17 Differentiation I
- Application to kinematics: the matatu example used km and minutes, giving speeds of 11–15 km/min (660–900 km/h). Changed to metres and seconds on 0.5 ≤ t ≤ 5 (11 m/s ≈ 40 km/h). Cyclist exercise s = 3t² + 2t gave 32 m/s (115 km/h) → s = 0.2t² + 3t, v(5) = 5 m/s, a = 0.4 m/s². Runner interpretation exercise (15 m/s, 10 m/s, faster than a world-record sprint) → 5 m/s and 4 m/s, f(10) = 50. Activity solution "each value lies halfway between the AROC values on either side" now limited to s′(1), s′(2), s′(3).
- Average rates of change: profit example wrote (1200 − 800)/20 = 20,000 KSh per unit inside one equation; now = 20 (thousand KSh per unit), followed by the KSh 20 000 interpretation.
- Derivatives from first principles: √x extension asked "does this agree with the estimate you made earlier using a table of values?" – no such estimate exists in the book. Replaced with a calculator check (√4.01 − 2)/0.01 ≈ 0.2498.
- Finding the derivative graphically: "rises just as steeply leaving the left turning point" (x = −2 is before that turning point) → "approaching"; stray capital.
- Equations of normals: rhetorical "!" turned into a question.
- Verified correct: all tangent and normal equations, k = 2 or −10, tangents through (0, −4) and (2, 0), tangent to x³ meets again at −2a, 1/x triangle area 2, focus proof, sphere rates, marginal revenue, tea cooling, population growth, trough evaporation, f′ sketches, central-difference estimates.
- Key takeaways: added for kinematics, differentiation in real life, normals and finding the derivative graphically. (Also added the missed one for Ch 6 sequences in real life.)
- Judgement calls (not changed): marginal-cost example in dollars, car example in miles, projectile in feet – US contexts and units; consider KSh / km / metres. Ramp exercise s(t) = t² − 4t + 3 is described as "displacement from the top of the ramp" but s(0) = 3.

## JSXGraph interactives

### How the interactives were checked
- Static audit of all 73 embedded JSXGraph interactives (script `jsxaudit.py`):
  - the board id in each script matches its `<slate>`;
  - every `getElementById` target exists on the page;
  - the copyright notice is hidden;
  - each interactive has `<instructions>`.
- Runtime check: every page containing an interactive was loaded in the built web version. I checked the browser console for errors and confirmed that each board rendered.
- 29 JS files in `assets/jsxgraph/` are not used by any section (mostly old circle-theorem figures and drafts). Four of them were finished chapter 5 variation interactives that had never been embedded; they are now used (see below).

### Fixes to existing interactives
- **perfect_squares.js (Ch 1, perfect squares):** feedback was written to an HTML element `message` that does not exist, so learners never saw whether N is a perfect square. The message is now drawn on the board. Other changes:
  - Each cell is one polygon instead of a polygon plus four hidden points, so about 600 objects are no longer recreated on every slider step.
  - The board redraws only when N changes.
  - Pan and zoom are off.
  - The instructions were updated to match.
- **polynomial-limits.js (Ch 16, limits):** the script declared `const top = …` at the top level. `top` is a read-only browser global (`window.top`), so the whole script stopped with a SyntaxError before drawing anything. Renamed. Other changes:
  - Moving the slider `a` now stops the animation and parks `P` beside the new `a`. Before, the readouts kept describing an approach to the old value.
  - `P` now starts to the left of the initial `a`.
- **MathJax colour errors (Ch 16):** four interactives coloured their maths with `\color{#1565c0}{…}`:
  - even and odd functions,
  - inverse functions,
  - inverse of polynomial functions,
  - trigonometric functions.

  MathJax 3 rejects `#` inside TeX (it is the macro-parameter character), so the legends and equations showed yellow "You can't use 'macro parameter character #' in math mode" boxes instead of maths. The colour is now applied with an HTML `<span style="color:…">` around the maths.
- **trig-ratios-unit-circle.js (Ch 12):** the point now snaps to whole degrees. Learners can stop exactly on 90°, 180° and 270°, so "tan θ undefined" can actually be seen.
- **inverse-functions.js (Ch 16):** the equations used to read `f(x) = 2.0x + -3.0` and `f⁻¹(x) = (x - -3.0)/2.0`. They are now written as `f(x) = 2x − 3` and `f⁻¹(x) = (x + 3)/2`, with special cases for a = ±1, b = 0 and a = 0.
- **Accessibility:** 13 interactives had no `<instructions>`, so screen-reader users and anyone opening the page had no description of what to do:
  - Ch 12: unit circle, trig ratios beyond acute angles, negative angles.
  - Ch 16: function notation, inverse functions (two), inverse trig, limits, range kick, trigonometric functions, types of functions, types of relations.
  - Ch 17: secant line.

  Instructions were written for each from its code: what to drag or press, what the readouts mean, and what to look for.

### New interactives
1. **Ch 5 Formulae and variations (four):** direct variation (fuel, `d = 20f`), inverse variation (moving company, `t = 24/w`), partial variation (water delivery, `y = 50x + 100`) and combined variation (gas pressure, `P = 0.5T/V`).
   - These scripts were in the repository but had never been embedded, and Chapter 5 had no interactive at all. Each one matches its section's opening activity.
   - They are placed after the activity with a caption and instructions.
   - Fixes before embedding:
     - Direct variation: the line stopped at f = 9 while the slider went to 10, and d = 200 was off the board.
     - Inverse variation: the readouts now use workers and hours, axis labels were added, and the slider was moved so it no longer collides with the labels.
     - Partial variation: the information panel sat on top of the line; it was moved below it, and the line now ends at the slider's maximum (20 km).
     - Combined variation: made-up units "K" and "L" replaced by "units", as in the activity.
2. **Ch 6 Sequences in real life, `sequence-growth.js` (new):** running totals Sₙ for the arithmetic (general) and geometric (VIP) seating sections, plotted against the number of rows.
   - There is a chair-limit line, and readouts give Tₙ, Sₙ and the number of rows that fit.
   - Defaults match the activity (25 + 6 per row against 8 doubling, limit 800).
   - Why: this is the activity's central question, and the graph shows plainly why doubling overtakes steady adding.
3. **Ch 12 Graphing sine and cosine, `trig-transformations.js` (new):** explorer for y = a sin(b(x − c)) + d, with a sin/cos switch.
   - The basic graph and the midline are drawn for comparison.
   - Readouts give the amplitude, period, shift, maximum and minimum.
   - Why: the section's worked examples (2 sin x, sin 2x, sin(x − 90°), −cos x + 1) are all special cases. Learners can reproduce each one and see which parameter does what.
4. **Ch 15 Continuous probability II, `normal-distribution.js` (new):** N(μ, σ) explorer.
   - Two draggable bounds shade P(a < X < b), and the bounds are also shown as μ ± zσ.
   - Buttons jump to μ ± σ, μ ± 2σ and μ ± 3σ.
   - Defaults match the heights example (μ = 165, σ = 8).
   - Why: Chapter 15 had no interactive, and the 68–95–99.7 rule is easiest to believe when you can change μ and σ and watch the percentages stay put.

### Not changed (suggestions)
- `secant-line.js` (Ch 17) has its slope readout commented out. It may be worth restoring, so the secant gradient can be read off as the points move.
- About half the interactives sit in a `<figure>` with a caption and half are bare `<interactive>` elements inside an exploration. For consistent numbering and cross-referencing, consider wrapping all of them in figures.
- Several scripts use `onclick` plus `onkeypress` on native buttons. A keyboard Enter then fires the handler twice. This is harmless for select-type buttons, but for buttons that change state (Kick, Next) `onclick` alone is enough, because buttons already respond to Enter and Space.
- The 25 genuinely unused JS files in `assets/jsxgraph/` could be deleted or moved to an `archive/` folder to keep the folder easy to navigate.
- Further candidates for new interactives (not done):
  - Ch 3 linear inequalities: feasible region with a draggable objective line.
  - Ch 4 logarithms: y = log_b x beside y = bˣ, reflected in y = x.
  - Ch 8 approximation and errors: an interval/bounds number line for a measurement ± error.
  - Ch 11 commercial arithmetic: compound against simple interest growth.
  - Ch 14: a slot diagram for permutations against combinations.

## Open issues and judgement calls (not changed)

These were left for the authors to decide:

- **Ch 5 Formulae and variations:** Not changed (judgement): "brightness varies inversely as distance" (real light follows inverse square) left as a fictional model; noted.
- **Ch 6 Sequences and series:** Judgement (not changed): GP exercise "show second term is x²−1" ignores r = 1 − x (gives −(x²−1)); M-Pesa savings with 1.5% monthly interest is unrealistic (M-Shwari would be better).
- **Ch 8 Approximation and errors:** Judgement (not changed): the book mixes two definitions of absolute error for products/quotients ("max − working" in some places, "half of max − min" in others; e.g. sphere 3.06 % uses half-range while "max − working" gives 3.09 %). Recommend picking one convention chapter-wide.
- **Ch 9 Angle properties of a circle:** Note: file/section id "sec-angles-substended-by-the-same-arc" still contains the misspelling (title fixed; id/filename left so links do not break).
- **Ch 10 Circles, chords and tangents:** Accessibility note (not changed): the alt text for the algebraic chord exercise figures repeats "Chords AB and CD intersecting at P" although the parts use PQ, RS and T.
- **Ch 11 Commercial arithmetic:** Note: Armstrong exercise 3.89 years is 3.896 (≈3.90) – left.
- **Ch 12 Trigonometry II:** Not changed (judgement): satellite-dish example asks for an "elevation angle" between 0° and 360° and accepts 143.1° – physically odd; suggest rewording as a rotation angle.
- **Ch 13 Graphical methods:** Note: determining-constants activity (PV^k = C through (1, 2.3), (2, 0.9)) gives k = 1.4, C = 10^3.7 ≈ 5012 – no solution is provided; consider adding one.
- **Ch 14 Permutations and combinations:** Suggestion (not changed): "baseball batting order" exercise could use a Kenyan context (e.g. penalty-shootout order in football).
- **Ch 16 Functions:** Judgement calls (not changed): range activity temperature T(h) = −h² + 12h − 20 gives −20 °C at midnight, unrealistic for a Kenyan town (a model such as T = −0.5h² + 6h + 10 would give 10–28 °C, but tasks and teacher notes rely on the zero crossings at h = 2 and 10). Limits exercise profit "in dollars" could be shillings. Range table labels linear functions "(odd-degree)", which is confusing.
- **Ch 17 Differentiation I:** Judgement calls (not changed): marginal-cost example in dollars, car example in miles, projectile in feet – US contexts and units; consider KSh / km / metres. Ramp exercise s(t) = t² − 4t + 3 is described as "displacement from the top of the ramp" but s(0) = 3.

## Build status

`pretext build web` completes with "Success! Built requested target(s) without errors." All changed `.ptx` files parse as well-formed XML. Every new or changed JSXGraph script was loaded in a browser test page with no console errors; the interactives have not yet been clicked through in the built `output/web` pages.
