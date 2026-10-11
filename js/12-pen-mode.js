// js/12-pen-mode.js · pen mode: write the proof, then check it against the worked one
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- pen mode ----------
// The test is written, so there is no list to pick from: the question, room to write the
// whole proof with the pen, then Show the work sets the worked proof like the book's and
// plays it a step at a time, and you say whether you had it. A miss comes back at the end
// with new numbers.

// The question in pen mode: Show the work on the button row (with Hint and Skip), the hint
// under a veil (opening it moves nothing you wrote: the ink stays where it was put), then a
// whole screen of blank page to write on (the pen writes anywhere, the question and the
// margins too), with Show the work again at the bottom, where the writing ends, and More
// room for a long one. The worked proof goes under it.
function penQuestion(p, sheet, q) {
  if (p.start) sheet.append(penHint(p))
  const show = h('button', 'btn pen-show', 'Show the work')
  show.type = 'button'
  show.title = 'Write your proof first: this plays the worked proof to check it against'
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
  // Show the work, or a check's verdict, ends the writing: false if it already had
  const lock = () => {
    if (round.locked) return false
    round.locked = true
    show.disabled = show2.disabled = more.disabled = true
    space.classList.add('pen-shown')
    return true
  }
  const reveal = () => {
    if (!lock()) return
    const work = proofPlayer(p, { auto: true, next: penGrade(q) })
    sheet.append(work)
    work.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' })
  }
  show.addEventListener('click', reveal)
  show2.addEventListener('click', reveal)
  sheet.append(show, space, end)
  // Check my writing, when the computer serving the arcade can grade (js/14); its verdict
  // shows the worked proof itself, so it locks the writing and grades the same way
  checkWriting(p, end, { lock, grade: () => penGrade(q) })
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
// the end of the worked proof: had it or not, said by you; a miss comes back at the end
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
// "Watch one first" on a section's card: a twin, its proof played (js/08)
function penWatchButton(short, sheet) {
  const b = h('button', 'btn ghost', 'Watch one first')
  b.type = 'button'
  b.addEventListener('click', () => {
    sheet.querySelector(':scope > .pen-example')?.remove()
    const ex = proofExample(short)
    sheet.append(ex)
    ex.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' })
    b.textContent = 'Watch another'
  })
  return b
}
