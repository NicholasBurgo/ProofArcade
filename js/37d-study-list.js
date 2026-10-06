// js/37d-study-list.js · the study list: only what is on Test 2
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- the study list: only what is on Test 2 ----------
// From people who took it: about half the test is derivations (two MGFs, pdf ↔ cdf, a
// uniform pdf), half is like the quiz questions, and the formula sheet prints its formulas
// with no names (the geometric, binomial and hypergeometric pdfs, not the negative
// binomial). The home screen opens on this list, in three parts: the sheet, the derivation
// half, the number half. Every line is a level.

const SHEET_READ = 'Read the sheet: name each formula'
const SHEET_MEMO = 'Not on the sheet: memorize'
const isStudySheet = short => short === SHEET_READ || short === SHEET_MEMO

// ---- part 1: the formula sheet ----
// each printed formula (as Formulas shows it), its name, how to spot it, and what its
// letters mean and how it is used (played line by line after the answer)
const SHEET_ITEMS = [
  { label: 'Geometric series', name: 'Geometric series (an infinite sum)', asked: 'the geometric series (the sum to ∞)', spot: 'A sum to ∞ of a times r to a power: a series, not a pdf.', lines: [
    ['What it is', R`\sum_{k=1}^{\infty} ar^{k-1} = \frac{a}{1-r}, \quad |r| < 1`, 'First term a, each term r times the one before.'],
    ['Use it', R`\sum_{x=1}^{\infty} q^{x-1}p = \frac{p}{1-q} = 1`, 'Showing the geometric pdf adds up to 1: a = p, r = q.'],
    ['Use it', R`\sum_{x=1}^{\infty} pe^t(qe^t)^{x-1} = \frac{pe^t}{1-qe^t}`, 'The geometric MGF: a = peᵗ, r = qeᵗ, so it needs qeᵗ < 1.'],
  ] },
  { label: 'Finite geometric series', name: 'Finite geometric series (the first n terms)', asked: 'the finite geometric series (the first n terms)', spot: 'The same sum, stopped at n.', lines: [
    ['What it is', R`\sum_{k=1}^{n} ar^{k-1} = \frac{a(1-r^n)}{1-r}`, 'The geometric series, stopped after n terms.'],
    ['Use it', R`F(x) = \sum_{k=1}^{x} q^{k-1}p = \frac{p(1-q^x)}{1-q} = 1 - q^x`, 'The geometric cdf: a = p, r = q, x terms.'],
  ] },
  { label: 'Poisson', name: 'Poisson pdf', asked: 'the Poisson pdf', spot: 'x! in the bottom, with e^(−k): a count of events.', lines: [
    ['What it is', R`f(x) = \frac{e^{-k}k^x}{x!}, \quad x = 0, 1, 2, \ldots`, 'X counts events in an interval of time or space.'],
    ['The letter', R`k = \lambda s`, 'k is the average count in the interval: the rate λ times the length s.'],
    ['Mean, variance', R`E[X] = \operatorname{Var}X = k`, 'Both are k (not on the sheet).'],
  ] },
  { label: 'Normal', name: 'Normal pdf', asked: 'the normal pdf', spot: 'A √(2π) and a squared (x − μ) up in the exponent.', lines: [
    ['What it is', R`f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}e^{-(x-\mu)^2/2\sigma^2}`, 'The bell curve: μ is the mean, σ the standard deviation.'],
    ['Use it', R`Z = \frac{X - \mu}{\sigma}`, 'You never integrate it: change x to z, then read the normal table.'],
  ] },
  { label: 'Gamma function', name: 'The gamma function Γ(α)', asked: 'the gamma function Γ(α)', spot: 'An integral of z to a power times e^(−z), from 0 to ∞: a number, not a pdf.', lines: [
    ['What it is', R`\Gamma(\alpha) = \int_0^{\infty} z^{\alpha-1}e^{-z}\,dz`, 'A number for each α > 0.'],
    ['Use it', R`\int_0^{\infty} z^{2}e^{-z}\,dz = \Gamma(3) = 2! = 2`, 'Match the power: z^(α−1) = z², so α = 3.'],
  ] },
  { label: 'Gamma function, integers', name: 'Γ at a whole number: a factorial', asked: 'Γ at a whole number', spot: 'Γ of n + 1 equals a factorial.', lines: [
    ['What it is', R`\Gamma(n+1) = n!`, 'Γ of a whole number is the factorial one below it.'],
    ['Use it', R`\Gamma(5) = 4! = 24`, 'n + 1 = 5, so n = 4.'],
  ] },
  { label: 'Gamma', name: 'Gamma pdf', asked: 'the gamma pdf', spot: 'Γ(α) and β^α in the bottom, x^(α−1) e^(−x/β) on top.', lines: [
    ['What it is', R`f(x) = \frac{1}{\Gamma(\alpha)\beta^{\alpha}}x^{\alpha-1}e^{-x/\beta}, \quad x > 0`, 'α is the shape, β the scale.'],
    ['Mean, variance', R`\mu = \alpha\beta, \quad \sigma^2 = \alpha\beta^2`, 'Not on the sheet.'],
    ['Its family', R`\alpha = 1:\ \text{exponential}, \qquad \alpha = \tfrac{\gamma}{2},\ \beta = 2:\ \chi^2_\gamma`, 'The exponential and the chi-squared are gammas.'],
  ] },
  { label: 'Exponential', name: 'Exponential pdf', asked: 'the exponential pdf', spot: '1/β times e^(−x/β), and nothing else.', lines: [
    ['What it is', R`f(x) = \frac{1}{\beta}e^{-x/\beta}, \quad x > 0`, 'A gamma with α = 1: the wait for the first event.'],
    ['The letter', R`\beta = \frac{1}{\lambda} = \mu`, 'β is the mean wait; λ is the rate.'],
    ['Use it', R`P[W \le t] = 1 - e^{-t/\beta}`, 'Its cdf: integrate f from 0 to t.'],
  ] },
  { label: 'Geometric', name: 'Geometric pdf', asked: 'the geometric pdf', spot: '(1 − p) to the power x − 1, times p.', lines: [
    ['What it is', R`f(x) = (1-p)^{x-1}p, \quad x = 1, 2, 3, \ldots`, 'x − 1 failures, then the first success.'],
    ['Mean, variance', R`E[X] = \frac{1}{p}, \quad \operatorname{Var}X = \frac{q}{p^2}`, 'Not on the sheet.'],
  ] },
  { label: 'Binomial', name: 'Binomial pdf', asked: 'the binomial pdf', spot: 'C(n, x) times pˣ(1 − p)ⁿ⁻ˣ.', lines: [
    ['What it is', R`f(x) = \binom{n}{x}p^x(1-p)^{n-x}, \quad x = 0, 1, \ldots, n`, 'x successes in n trials: choose which x, times their chances.'],
    ['Mean, variance', R`E[X] = np, \quad \operatorname{Var}X = npq`, 'Not on the sheet.'],
  ] },
  { label: 'Hypergeometric', name: 'Hypergeometric pdf', asked: 'the hypergeometric pdf', spot: 'Three C’s in a fraction.', lines: [
    ['What it is', R`f(x) = \frac{\binom{r}{x}\binom{N-r}{n-x}}{\binom{N}{n}}`, 'n drawn from N without putting back, r of the N successes.'],
    ['Mean', R`E[X] = n\frac{r}{N}`, 'Not on the sheet (nor its variance).'],
  ] },
].map(it => ({ ...it, latex: [...unit.sheet.given, ...unit.sheet.maybe].find(f => f.label === it.label)?.latex ?? it.lines[0][1] }))
// names that aren't printed, for the list of names
const SHEET_NOT_PRINTED = ['Negative binomial pdf', 'Uniform pdf', 'Chi-squared pdf']

// a deck: each item once, in a random order, then again
const studyDeck = items => {
  let d = []
  return () => {
    if (!d.length) d = shuffleArr(items)
    return d.pop()
  }
}
// a build that explains the answer, line by line (the MGF player, with no ①②③)
const studyBuild = (name, pdf, lines) => ({ name, pdf, strip: false, lines: lines.map(([label, tex, why]) => ({ label, tex, why, own: true })) })
const studyNorm = t => t.replace(/\s+/g, '').replace(/\\[,;!: ]/g, '')
// a question: the right answer first, then the wrong ones (no repeats), up to 12, shuffled
function studyQ({ ask, latex = '', start, right, wrong, text = false, build, at = null, another }) {
  const seen = new Set([studyNorm(right)])
  const opts = [right]
  for (const w of wrong) {
    const n = studyNorm(w)
    if (seen.has(n) || opts.length >= 12) continue
    seen.add(n)
    opts.push(w)
  }
  const options = opts.map(o => (text ? o : { latex: o }))
  return { ask, latex, start, options, answer: 'a', order: shuffleArr(options.map((_, i) => i)), mgf: { build, at }, oneBuild: true, another }
}

const sheetNext = studyDeck(SHEET_ITEMS)
// a printed formula: what is it?
function sheetNameQ() {
  const it = sheetNext()
  return studyQ({
    ask: 'This formula is on the test’s sheet, with no name. What is it?',
    latex: it.latex,
    start: it.spot,
    right: it.name,
    wrong: shuffleArr([...SHEET_ITEMS.map(x => x.name), ...SHEET_NOT_PRINTED]),
    text: true,
    build: studyBuild(it.name, it.latex, it.lines),
    another: sheetNameQ,
  })
}
// a name: which formula on the sheet is it?
function sheetFindQ() {
  const it = sheetNext()
  return studyQ({
    ask: `Which formula on the sheet is ${it.asked}?`,
    start: 'Look for its shape: ' + it.spot.charAt(0).toLowerCase() + it.spot.slice(1),
    right: it.latex,
    wrong: shuffleArr(SHEET_ITEMS.map(x => x.latex)),
    build: studyBuild(it.name, it.latex, it.lines),
    another: sheetFindQ,
  })
}

// ---- what the sheet leaves off: the negative binomial and uniform pdfs, every mean and variance ----
const NEGBIN_LINES = [
  ['Last trial S', R`f(x) = P[\,r-1 \text{ successes in } x-1 \text{ trials}\,]\cdot p`, 'Trial x is the r-th success: the first x − 1 trials hold the other r − 1.'],
  ['Binomial part', R`= \binom{x-1}{r-1}p^{r-1}q^{x-r}\cdot p`, 'r − 1 successes in x − 1 trials is a binomial chance.'],
  ['Simplify', R`= \binom{x-1}{r-1}p^{r}q^{x-r}`, 'One more p makes pʳ.'],
  ['Values', R`x = r,\ r+1,\ r+2,\ \ldots`, 'At least r trials for r successes, and no top.'],
  ['Mean, variance', R`E[X] = \frac{r}{p}, \quad \operatorname{Var}X = \frac{rq}{p^2}`, 'Not on the sheet either.'],
]
const UNIFORM_LINES = [
  ['Flat', R`f(x) = c, \quad a < x < b`, 'Uniform: every value in (a, b) is as likely, so f is flat.'],
  ['Area 1', R`\int_a^b c\,dx = c(b-a) = 1`, 'A pdf’s area is 1: a rectangle, height c, width b − a.'],
  ['Solve', R`c = \frac{1}{b-a}`, 'Divide by b − a; f is 0 outside (a, b).'],
  ['Then', R`F(x) = \frac{x-a}{b-a}, \quad E[X] = \frac{a+b}{2}, \quad \operatorname{Var}X = \frac{(b-a)^2}{12}`, 'Its cdf (quiz 4.1 #10), mean and variance.'],
]
const UNIFORM_CDF_LINES = [
  ['Set up', R`F(x) = \int_a^x \frac{1}{b-a}\,dt`, 'The area under f from where it starts, a, up to x.'],
  ['Integrate', R`= \frac{t}{b-a}\Big|_a^x = \frac{x-a}{b-a}`, 'f is a constant, so the area is its height times the width x − a.'],
  ['All of F', R`F(x) = \begin{cases} 0 & x \le a \\ \frac{x-a}{b-a} & a < x < b \\ 1 & x \ge b \end{cases}`, '0 before a, 1 after b.'],
]
const NEGBIN_PDF = R`f(x) = \binom{x-1}{r-1}p^rq^{x-r}`
const TRIALS = R`\text{independent trials}, \quad P(S) = p, \quad q = 1 - p`
const MEMO_PDFS = [
  () => studyQ({
    ask: 'X counts the trials needed for the r-th success. Which is its pdf? It isn’t on the sheet.',
    latex: TRIALS,
    start: 'X = x means trial x is the r-th success. Split it: the first x − 1 trials, then the last one.',
    right: NEGBIN_PDF,
    wrong: [R`f(x) = \binom{x-1}{r}p^rq^{x-r}`, R`f(x) = \binom{x}{r}p^rq^{x-r}`, R`f(x) = \binom{x-1}{r-1}p^{x-r}q^{r}`, R`f(x) = \binom{x-1}{r-1}p^{r-1}q^{x-r}`, R`f(x) = \binom{x}{r-1}p^rq^{x-r}`, R`f(x) = \binom{x-1}{r-1}p^rq^{x-r+1}`, R`f(x) = \binom{n}{x}p^xq^{n-x}`, R`f(x) = q^{x-1}p`, R`f(x) = \binom{x+r-1}{r-1}p^rq^{x}`, R`f(x) = \binom{x-1}{r-1}p^rq^{x-1}`],
    build: studyBuild('Negative binomial pdf', NEGBIN_PDF, NEGBIN_LINES),
    at: 2,
  }),
  () => studyQ({
    ask: 'X counts the trials needed for the r-th success. What values can X take?',
    latex: TRIALS,
    start: 'How few trials can give r successes? And is there a most?',
    right: R`x = r,\ r+1,\ r+2,\ \ldots`,
    wrong: [R`x = 0,\ 1,\ 2,\ \ldots`, R`x = 1,\ 2,\ 3,\ \ldots`, R`x = 0,\ 1,\ \ldots,\ r`, R`x = r+1,\ r+2,\ \ldots`, R`x = 0,\ 1,\ \ldots,\ n`, R`x = r,\ r+1,\ \ldots,\ n`, R`x = 1,\ 2,\ \ldots,\ r`],
    build: studyBuild('Negative binomial pdf', NEGBIN_PDF, NEGBIN_LINES),
    at: 3,
  }),
  () => studyQ({
    ask: 'X is uniform on (a, b). Which is its pdf? It isn’t on the sheet: derive it.',
    latex: R`f(x) = c \text{ on } (a, b), \quad 0 \text{ elsewhere}`,
    start: 'Flat means a rectangle. Its area must be 1.',
    right: R`f(x) = \frac{1}{b-a}`,
    wrong: [R`f(x) = b - a`, R`f(x) = \frac{1}{a+b}`, R`f(x) = \frac{x-a}{b-a}`, R`f(x) = \frac{1}{b}`, R`f(x) = \frac{x}{b-a}`, R`f(x) = \frac{b-a}{2}`, R`f(x) = \frac{2}{b-a}`, R`f(x) = \frac{1}{(b-a)^2}`],
    build: studyBuild('Uniform pdf', R`f(x) = \frac{1}{b-a}`, UNIFORM_LINES),
    at: 2,
  }),
  () => studyQ({
    ask: 'X is uniform on (a, b). What is its cdf F(x) for a < x < b?',
    latex: R`f(x) = \frac{1}{b-a}, \quad a < x < b`,
    start: 'F(x) is the area under f from a up to x: a rectangle.',
    right: R`F(x) = \frac{x-a}{b-a}`,
    wrong: [R`F(x) = \frac{1}{b-a}`, R`F(x) = \frac{b-x}{b-a}`, R`F(x) = \frac{x}{b-a}`, R`F(x) = \frac{x-a}{b+a}`, R`F(x) = \frac{x-b}{b-a}`, R`F(x) = \frac{x-a}{b}`, R`F(x) = 1 - \frac{x-a}{b-a}`, R`F(x) = \frac{(x-a)^2}{2(b-a)}`],
    build: studyBuild('Uniform cdf', R`f(x) = \frac{1}{b-a}`, UNIFORM_CDF_LINES),
    at: 1,
  }),
]
// every distribution's mean and variance, with the slips that use the same letters
const MOMENTS = [
  { name: 'geometric', pdf: R`f(x) = q^{x-1}p`, mean: R`\frac{1}{p}`, var: R`\frac{q}{p^2}`, meanSlips: [R`p`, R`\frac{q}{p}`, R`\frac{1}{q}`, R`\frac{q}{p^2}`, R`\frac{p}{q}`, R`\frac{1}{p^2}`], varSlips: [R`\frac{1}{p}`, R`\frac{q}{p}`, R`\frac{p}{q^2}`, R`\frac{1}{p^2}`, R`pq`, R`\frac{q^2}{p}`], meanWhy: 'One success takes 1/p trials on average: p = 1/13 means 13 wells.', varWhy: 'q over p squared (from the MGF: m″(0) − m′(0)²).' },
  { name: 'binomial', pdf: R`f(x) = \binom{n}{x}p^xq^{n-x}`, mean: R`np`, var: R`npq`, meanSlips: [R`npq`, R`nq`, R`\frac{n}{p}`, R`\frac{p}{n}`, R`np^2`, R`n + p`], varSlips: [R`np`, R`np^2`, R`\frac{nq}{p}`, R`npq^2`, R`\sqrt{npq}`, R`n^2pq`], meanWhy: 'n trials, each a success with chance p.', varWhy: 'Each trial adds pq.' },
  { name: 'negative binomial', pdf: NEGBIN_PDF, mean: R`\frac{r}{p}`, var: R`\frac{rq}{p^2}`, meanSlips: [R`rp`, R`\frac{rq}{p}`, R`\frac{r}{q}`, R`\frac{r-1}{p}`, R`\frac{1}{p}`, R`\frac{r}{p^2}`], varSlips: [R`\frac{rq}{p}`, R`\frac{r}{p^2}`, R`\frac{rp}{q^2}`, R`\frac{q}{p^2}`, R`\frac{rq^2}{p}`, R`\frac{r^2q}{p^2}`], meanWhy: 'r successes, each taking 1/p trials on average.', varWhy: 'r geometric waits, each with variance q/p².' },
  { name: 'hypergeometric', pdf: R`f(x) = \frac{\binom{r}{x}\binom{N-r}{n-x}}{\binom{N}{n}}`, mean: R`n\frac{r}{N}`, var: R`n\frac{r}{N}\cdot\frac{N-r}{N}\cdot\frac{N-n}{N-1}`, meanSlips: [R`n\frac{N-r}{N}`, R`\frac{r}{N}`, R`\frac{n}{N}`, R`nr`, R`\frac{Nr}{n}`, R`\frac{nr}{N-1}`], varSlips: [R`n\frac{r}{N}\cdot\frac{N-r}{N}`, R`n\frac{r}{N}\cdot\frac{N-r}{N}\cdot\frac{N-n}{N}`, R`n\frac{r}{N}\cdot\frac{N-n}{N-1}`, R`\frac{r}{N}\cdot\frac{N-r}{N}\cdot\frac{N-n}{N-1}`, R`n\frac{r}{N}\cdot\frac{N-r}{N}\cdot\frac{N-1}{N-n}`, R`n\frac{r}{N}`], meanWhy: 'n draws, each a success with chance r/N.', varWhy: 'The binomial’s npq with p = r/N, times (N − n)/(N − 1) for drawing without putting back.' },
  { name: 'Poisson', pdf: R`f(x) = \frac{e^{-k}k^x}{x!}`, mean: R`k`, var: R`k`, meanSlips: [R`\lambda`, R`k^2`, R`\sqrt{k}`, R`\frac{1}{k}`, R`e^{-k}`, R`s`], varSlips: [R`k^2`, R`\sqrt{k}`, R`\lambda`, R`\frac{1}{k}`, R`2k`, R`k(1-k)`], meanWhy: 'k = λs, the average count in the interval.', varWhy: 'The same k: a Poisson’s mean and variance are equal.' },
  { name: 'uniform on (a, b)', pdf: R`f(x) = \frac{1}{b-a}`, mean: R`\frac{a+b}{2}`, var: R`\frac{(b-a)^2}{12}`, meanSlips: [R`\frac{b-a}{2}`, R`\frac{a+b}{12}`, R`b-a`, R`\frac{(a+b)^2}{12}`, R`\frac{1}{b-a}`, R`\frac{(b-a)^2}{2}`], varSlips: [R`\frac{b-a}{12}`, R`\frac{(a+b)^2}{12}`, R`\frac{(b-a)^2}{2}`, R`\frac{(b-a)^2}{4}`, R`\frac{b^2-a^2}{12}`, R`\frac{b-a}{2}`], meanWhy: 'The middle of (a, b).', varWhy: 'The width squared over 12.' },
  { name: 'exponential', pdf: R`f(x) = \frac{1}{\beta}e^{-x/\beta}`, mean: R`\beta`, var: R`\beta^2`, meanSlips: [R`\frac{1}{\beta}`, R`\beta^2`, R`\lambda`, R`2\beta`, R`\sqrt{\beta}`, R`e^{-\beta}`], varSlips: [R`\beta`, R`\frac{1}{\beta^2}`, R`2\beta^2`, R`\lambda^2`, R`\sqrt{\beta}`, R`\frac{1}{\beta}`], meanWhy: 'β is the mean wait (β = 1/λ).', varWhy: 'β squared.' },
  { name: 'gamma', pdf: R`f(x) = \frac{1}{\Gamma(\alpha)\beta^{\alpha}}x^{\alpha-1}e^{-x/\beta}`, mean: R`\alpha\beta`, var: R`\alpha\beta^2`, meanSlips: [R`\frac{\alpha}{\beta}`, R`\frac{\beta}{\alpha}`, R`\alpha\beta^2`, R`\alpha + \beta`, R`\alpha^2\beta`, R`\frac{1}{\alpha\beta}`], varSlips: [R`\alpha\beta`, R`\alpha^2\beta`, R`\frac{\alpha}{\beta^2}`, R`\alpha^2\beta^2`, R`\frac{\beta^2}{\alpha}`, R`\alpha + \beta^2`], meanWhy: 'α times β.', varWhy: 'α times β squared.' },
  { name: 'chi-squared with γ degrees of freedom', pdf: R`\chi^2_\gamma`, mean: R`\gamma`, var: R`2\gamma`, meanSlips: [R`2\gamma`, R`\frac{\gamma}{2}`, R`\gamma^2`, R`\sqrt{\gamma}`, R`\gamma - 1`, R`\frac{1}{\gamma}`], varSlips: [R`\gamma`, R`\frac{\gamma}{2}`, R`4\gamma`, R`\gamma^2`, R`2\gamma^2`, R`\sqrt{2\gamma}`], meanWhy: 'A gamma with α = γ/2 and β = 2: αβ = γ.', varWhy: 'αβ² = (γ/2)(4) = 2γ.' },
  { name: 'normal', pdf: R`f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}e^{-(x-\mu)^2/2\sigma^2}`, mean: R`\mu`, var: R`\sigma^2`, meanSlips: [R`\sigma`, R`\sigma^2`, R`0`, R`\frac{\mu}{\sigma}`, R`\mu^2`, R`1`], varSlips: [R`\sigma`, R`\mu`, R`2\sigma`, R`\frac{\sigma}{\mu}`, R`1`, R`\sqrt{\sigma}`], meanWhy: 'μ is its own letter.', varWhy: 'σ² is its own letter (σ is the standard deviation).' },
]
const memoPdfNext = studyDeck(MEMO_PDFS)
function memoPdfQ() {
  return { ...memoPdfNext()(), another: memoPdfQ }
}
const momentNext = studyDeck(MOMENTS.flatMap(m => [{ m, stat: 'mean' }, { m, stat: 'var' }]))
// E[X] or Var X of a named distribution: the same letters slipped, then two from others
function memoMomentQ() {
  const { m, stat } = momentNext()
  const lhs = stat === 'mean' ? 'E[X] = ' : R`\operatorname{Var}X = `
  const others = shuffleArr(MOMENTS.filter(o => o !== m)).slice(0, 3).map(o => o[stat])
  return studyQ({
    ask: `X is ${m.name}. What is ${stat === 'mean' ? '\\(E[X]\\)' : '\\(\\operatorname{Var}X\\)'}? It isn’t on the sheet.`,
    latex: m.pdf,
    start: stat === 'mean' ? m.meanWhy : m.varWhy,
    right: lhs + m[stat],
    wrong: [...m[stat === 'mean' ? 'meanSlips' : 'varSlips'], ...others].map(t => lhs + t),
    build: studyBuild(m.name.charAt(0).toUpperCase() + m.name.slice(1), m.pdf, [
      ['Mean', 'E[X] = ' + m.mean, m.meanWhy],
      ['Variance', R`\operatorname{Var}X = ` + m.var, m.varWhy],
    ]),
    at: stat === 'mean' ? 0 : 1,
    another: memoMomentQ,
  })
}

// the two levels: their kinds (as the engine's are), sizes and cards
for (const [id, name, gens] of [
  ['study-sheet', 'Reading the formula sheet', { name: sheetNameQ, find: sheetFindQ }],
  ['study-memo', 'What the sheet leaves off', { pdfs: memoPdfQ, moments: memoMomentQ }],
]) {
  const t = { id, name, templates: [] }
  for (const [tid, generate] of Object.entries(gens)) {
    const tp = { id: tid, generate }
    t.templates.push(tp)
    KIND[`${id}:${tid}`] = { t, tp }
  }
}
LEVELS[SHEET_READ] = { kinds: ['study-sheet:name', 'study-sheet:find'], parts: [], size: SHEET_ITEMS.length }
LEVELS[SHEET_MEMO] = { kinds: ['study-memo:pdfs', 'study-memo:moments'], parts: [], size: 12 }
CARDS[SHEET_READ] = [
  `The test’s formula sheet prints these ${SHEET_ITEMS.length} with no names: the two geometric series sums, Poisson, normal, Γ(α), Γ(n + 1) = n!, gamma, exponential, geometric, binomial and hypergeometric.`,
  'Each question shows one and asks what it is, or names one and asks you to find it on the sheet. Then it plays what its letters mean and how it is used.',
  'The negative binomial and uniform pdfs aren’t on it: they are the next level.',
]
CARDS[SHEET_MEMO] = [
  'What the sheet leaves off, to know cold: the negative binomial pdf and its values, the uniform pdf and cdf, and every mean and variance.',
  'Each answer plays where it comes from, line by line.',
]

// ---- the list on the home screen: three parts, every line a level ----
const STUDY = [
  { n: 1, title: 'The formula sheet', blurb: 'Printed with no names: know each formula on sight, and what it leaves off.', levels: [SHEET_READ, SHEET_MEMO] },
  { n: 2, title: 'The derivation half', blurb: 'About 5 questions: two MGFs, pdf ↔ cdf, the uniform and negative binomial pdfs. Written with the pen.', levels: [...Object.keys(PEN_ONE), PEN_ROUND] },
  { n: 3, title: 'The number half', blurb: 'About 5 questions like the quiz: each quiz question, then all of them shuffled.', levels: [...Object.keys(QUIZ_LEVELS), SHUFFLED_QUIZ] },
]
const STUDY_ORDER = STUDY.flatMap(s => s.levels)
const studyPartOf = short => STUDY.find(s => s.levels.includes(short))
// a card's eyebrow (the quiz questions keep theirs)
const studyPlace = short => {
  const s = studyPartOf(short)
  return s && s.n < 3 ? `Study list · ${s.n} · ${s.title}` : null
}
// the level after this one in the list (the quiz questions go on as they do)
const studyAfter = short => {
  const s = studyPartOf(short)
  if (!s || s.n === 3) return undefined
  return STUDY_ORDER[STUDY_ORDER.indexOf(short) + 1]
}
const studyLabel = short => (short === PEN_ROUND ? `All of them mixed · ${PEN_SIZE}` : short === SHUFFLED_QUIZ ? `All of them shuffled · ${REVIEW[SHUFFLED_QUIZ].length}` : short.replace(/^Quiz /, ''))
function studyBlock() {
  const intro = h('section', 'study-intro')
  intro.append(h('h2', '', 'Study list'), h('p', '', 'Only what is on Test 2, from people who took it: half derivations, half like the quiz, on a formula sheet with no names. Work down it in order.'))
  view.append(intro)
  for (const part of STUDY) {
    const sec = h('section', 'world study')
    const head = h('div', 'world-head')
    const got = part.levels.reduce((s, k) => s + Math.min(3, state.stars[k] || 0), 0)
    head.append(h('h2', '', `${part.n} · ${part.title}`), h('span', '', part.blurb), h('em', '', `${got}/${part.levels.length * 3} ★`))
    const lv = h('div', 'levels')
    part.levels.forEach((k, i) => {
      const s = state.stars[k] || 0
      const b = h('button', 'level' + (s ? ' cleared' : ''))
      b.type = 'button'
      b.append(h('span', 'oval', String(i + 1)), h('span', 'name', studyLabel(k)), starsText(s))
      b.addEventListener('click', () => openCard(k))
      lv.append(b)
    })
    sec.append(head, lv)
    view.append(sec)
  }
}
