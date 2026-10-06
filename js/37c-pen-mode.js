// js/37c-pen-mode.js · pen mode: write it out like the test, then check it
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- pen mode: write it out like the test, then check it ----------
// The test is written, and half of it is derivations: two MGFs, pdf ↔ cdf, a uniform pdf,
// on a formula sheet with no names on it. So here there is no list: the question, room to
// write the whole answer with the pen, then Show the work plays the worked answer (the
// same animation as a right answer) to check yours against, and you say whether you had
// it. A miss comes back at the end with new numbers.

// can this question be written out and checked? A derivation, work to play, or a story to
// plug into (not a list question: which distribution is this MGF?)
const penCan = p => Boolean(p && !p.slice && !p.params && !(p.leaf && !p.plug) && ((p.build ?? p.mgf?.build) || (p.plug && p.vars) || p.answerLatex || p.hint))

// The derivations round: ten like the test's written half, each slot a kind of question
// the study guide says to be able to do, with new numbers every time. From those who took
// it: two MGF questions, a couple of pdf ↔ cdf, a uniform pdf; the sheet printed the
// geometric, binomial and hypergeometric pdfs but not the negative binomial, so that one
// is the pdf to derive.
const penKind = (k, level) => () => ({ p: KIND[k].tp.generate(), level })
const penBuild = (make, level) => () => ({ p: mgfBuildProblem(make), level })
const penOne = makers => () => pickOne(makers)()
const PEN_SLOTS = [
  // the geometric MGF, from the series
  () => penBuild(MGF_SLOTS[0], 'Geometric MGF')(),
  // a continuous MGF: e^(−x) or an exponential, a uniform, a pdf table, or the gamma
  () => penBuild(pickOne(MGF_SLOTS.slice(1)), 'Continuous MGF')(),
  // E[X] and Var X from an MGF
  penOne(['mgf:geometric', 'mgf:finite', 'mgf:continuous'].map(k => penKind(k, 'Mean and variance from an MGF'))),
  // pdf → cdf, then cdf → pdf
  penKind('continuous-cdf:derive', 'pdf ↔ cdf'),
  penKind('continuous-cdf:pdf', 'pdf ↔ cdf'),
  // the pdf the sheet leaves off: the negative binomial
  penKind('discrete-derive:negbin-build', 'Negative binomial pdf'),
  // the uniform's pdf: a flat f(x) = c whose area is 1
  penKind('uniform:derive', 'Uniform pdf'),
  // show that it is a pdf: f ≥ 0, and the sum comes to 1
  penOne([penKind('geometric-derive:show-pdf', 'Geometric pdf'), penKind('discrete-derive:binom-sum', 'Binomial pdf'), penKind('discrete-derive:poisson-sum', 'Poisson probabilities')]),
  // the geometric cdf
  penKind('geometric-derive:cdf-build', 'Geometric cdf'),
  // the constant that makes it a pdf, or the mean or variance of a continuous X
  penOne([
    penKind('continuous-pdf:find-c', 'Verify a pdf, or find the constant'),
    penKind('continuous-pdf:find-c-discrete', 'Discrete pdf: find c, probabilities, mean'),
    ...['continuous-expectation:mean', 'continuous-expectation:variance', 'continuous-expectation:second-moment'].map(k => penKind(k, 'Mean and variance from a pdf')),
  ]),
]
// a round: every slot once, in a random order; a quick one: an MGF, a pdf ↔ cdf, the
// negative binomial or uniform pdf, and one more
function penRound(quick = false) {
  const slots = quick ? [pickOne([0, 1]), pickOne([3, 4]), pickOne([5, 6]), pickOne([2, 7, 8, 9])].map(i => PEN_SLOTS[i]) : PEN_SLOTS
  return shuffleArr(slots).map(make => ({ ...make(), seen: 0, missed: false }))
}

CARDS[PEN_ROUND] = [
  `${PEN_SIZE} questions like the test’s written half: the geometric MGF and a continuous one, E[X] or Var X from an MGF, pdf → cdf and cdf → pdf, the negative binomial pdf (the sheet leaves it off), the uniform pdf, a pdf to show is one, the geometric cdf, and a constant c or a mean.`,
  'No list to pick from. Write the whole answer on the page with the pen, every line, then tap Show the work: it plays the worked answer, line by line, to check yours against.',
  'Then say whether you had it. One you missed comes back at the end with new numbers.',
  'The test’s formula sheet has no names on it. Open Formulas and tap Hide the names to read it that way.',
]
LEVEL_VIDEOS[PEN_ROUND] = ['mgfIntro', 'geoMgf', 'expMgf', 'contProb']

// on the home screen, under Next up
function penCta() {
  const b = h('button', 'cta')
  b.type = 'button'
  const t = h('span')
  t.append(h('small', '', 'Written like the test · with the pen'), h('strong', '', `${PEN_ROUND} · ${PEN_SIZE} questions`))
  b.append(t, h('span', 'go', '→'))
  b.addEventListener('click', () => openCard(PEN_ROUND))
  return b
}

// The question in pen mode: Show the work on the button row (with Hint, the video and
// Skip), the hint under a veil (opening it moves nothing you wrote: the ink stays where it
// was put), then a whole screen of blank page to write on (the pen writes anywhere, the
// question and the margins too), with Show the work again at the bottom, where the writing
// ends, and More room for a long one. The worked answer goes under it.
function penQuestion(p, sheet, q) {
  if (p.start) sheet.append(penHint(p))
  const show = h('button', 'btn pen-show', 'Show the work')
  show.type = 'button'
  show.title = 'Write your answer first: this plays the worked answer to check it against'
  const space = h('div', 'pen-space')
  space.append(h('p', 'pen-note', 'Write anywhere on the page with the pen, every line, like on the test.'))
  const end = h('div', 'pen-end')
  const more = h('button', 'btn ghost', 'More room')
  more.type = 'button'
  more.addEventListener('click', () => {
    space.style.minHeight = space.offsetHeight + Math.round(innerHeight * 0.6) + 'px'
  })
  const show2 = h('button', 'btn', 'Show the work')
  show2.type = 'button'
  end.append(more, show2)
  const reveal = () => {
    if (round.locked) return
    round.locked = true
    show.disabled = show2.disabled = more.disabled = true
    space.classList.add('pen-shown')
    const work = penWork(p, sheet, q)
    sheet.append(work)
    work.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' })
  }
  show.addEventListener('click', reveal)
  show2.addEventListener('click', reveal)
  sheet.append(show, space, end)
  view.append(sheet)
  window.scrollTo({ top: 0 })
}
function penHint(p) {
  const wrap = h('div', 'howto')
  const btn = h('button', 'btn ghost', 'Hint')
  btn.type = 'button'
  const body = h('p', 'first-move pen-veil', p.start)
  body.setAttribute('aria-hidden', 'true')
  btn.addEventListener('click', () => {
    const veiled = body.classList.toggle('pen-veil')
    body.setAttribute('aria-hidden', String(veiled))
    btn.textContent = veiled ? 'Hint' : 'Hide the hint'
  })
  wrap.append(btn, body)
  return wrap
}
// the worked answer, as a right answer plays it: a derivation line by line with each move
// and why, or the numbers flying into the work, the table and the graph
function penWork(p, sheet, q) {
  const grade = penGrade(q)
  const b = p.build ?? p.mgf?.build
  if (b) return mgfPlayer(b, { auto: true, next: grade })
  if (p.plug && p.vars) return plugPanel(p, { sheet, auto: true, next: grade })
  if (p.answerLatex || p.hint) return workPanel(p, { sheet, auto: true, next: grade, level: q.level ?? round.short })
  const box = h('div', 'reveal-box')
  box.append(h('h3', '', 'The answer'), tex(T2.answerDisplay(p)), grade)
  return box
}
// the end of the worked answer: had it or not, said by you; a miss comes back at the end
function penGrade(q) {
  const wrap = h('span', 'pen-grade')
  const yes = h('button', 'btn', 'I had it')
  const no = h('button', 'btn ghost', 'I missed something')
  yes.type = 'button'
  no.type = 'button'
  let done = false
  const grade = had => {
    if (done || round?.queue[round.at] !== q) return
    done = true
    if (had) award()
    else miss(q)
    advance()
  }
  yes.addEventListener('click', () => grade(true))
  no.addEventListener('click', () => grade(false))
  wrap.append(yes, no)
  return wrap
}
