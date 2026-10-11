// js/11-question.js · the question screen, and what a right or missed answer does
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
function showQuestion() {
  screen = 'question'
  const q = round.queue[round.at]
  q.seen++
  // one that comes back (missed or skipped) comes back with new numbers
  if (q.seen > 1 && q.p.another) q.p = q.p.another()
  const p = q.p
  view.replaceChildren()
  const sheet = h('section', 'sheet')
  // once the question is drawn: Show the work, Hint and Skip on one row
  queueMicrotask(() => questionActions(sheet))
  const top = h('div', 'qtop')
  const prog = h('div', 'progress')
  round.queue.forEach((x, i) => {
    const mark = round.marks[i]
    prog.append(h('i', mark === 'ok' ? 'ok' : mark === 'bad' ? 'bad' : mark === 'skip' ? 'skip' : i === round.at ? 'now' : ''))
  })
  top.append(prog, skipButton(q))
  sheet.append(top)
  sheet.append(h('div', 'eyebrow', round.short + (p.tag ? ' · ' + p.tag : '') + (q.seen > 1 ? ' · second chance' : '')))
  sheet.append(h('p', 'ask', p.ask))
  // a note from the professor, and for a 3.5 question the proof it hands you to read
  if (p.note) sheet.append(h('p', 'proof-note', p.note))
  if (p.given) sheet.append(bookBlock(p.given).box)
  penQuestion(p, sheet, q)
}
// Show the work, Hint and Skip on one row, the hint itself under it
function questionActions(sheet) {
  if (!sheet.isConnected) return
  const show = sheet.querySelector(':scope > .pen-show')
  if (!show) return
  const row = h('div', 'q-acts')
  show.before(row)
  row.append(show)
  const helps = [...sheet.querySelectorAll(':scope > .howto')]
  for (const w of helps) {
    const btn = w.querySelector(':scope > button')
    if (btn) row.append(btn)
  }
  const skip = sheet.querySelector('.skip-btn')
  if (skip) row.append(skip)
  row.after(...helps)
}
// Skip: the question goes to the end of the round to try again. Skipped a second time,
// or skipped after a miss, it counts as wrong and doesn't come back. Once it's answered,
// Skip just moves on.
function skipButton(q) {
  const b = h('button', 'btn ghost skip-btn', 'Skip')
  b.type = 'button'
  b.title = 'It comes back at the end. Skip it again and it counts as wrong.'
  b.addEventListener('click', () => {
    if (!round || screen !== 'question') return
    if (!round.locked) {
      if (!q.skipped && !q.missed) {
        q.skipped = true
        round.marks[round.at] = 'skip'
        round.queue.push(q)
      } else {
        track(false)
        state.answered++
        round.combo = 0
        if (!q.missed) {
          q.missed = true
          round.misses++
        }
        round.marks[round.at] = 'bad'
        save()
        hud()
      }
    }
    advance()
  })
  return b
}
// how each level has gone lately: the last 12 first tries
function track(right) {
  const q = round.queue[round.at]
  if (q.seen !== 1) return
  const r = (state.recent[round.short] ??= [])
  r.push(right ? 1 : 0)
  if (r.length > 12) r.shift()
  save()
}
// the streak, a sound and the progress mark for a right answer
function award() {
  track(true)
  state.answered++
  state.correct++
  round.combo++
  round.best = Math.max(round.best, round.combo)
  round.marks[round.at] = 'ok'
  sfx.right(round.combo)
  hud()
}
// a miss: the streak resets, and the question comes back at the end of the round (up to twice)
function miss(q) {
  track(false)
  state.answered++
  round.combo = 0
  if (!q.missed) {
    q.missed = true
    round.misses++
  }
  round.marks[round.at] = 'bad'
  if (q.seen < 3 && q.requeuedAt !== q.seen) {
    q.requeuedAt = q.seen
    round.queue.push(q)
  }
  sfx.wrong()
  hud()
}
