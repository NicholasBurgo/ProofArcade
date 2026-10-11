// js/13-results.js · the next question, and the end of a round
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
function advance() {
  if (!round || screen !== 'question') return
  round.locked = false
  round.at++
  if (round.at >= round.queue.length) finish()
  else showQuestion()
}
function finish() {
  screen = 'results'
  const r = round
  // a quick round tops out at 2 stars; the third needs a full round with no misses
  const stars = r.quick ? (r.misses === 0 ? 2 : 1) : r.misses === 0 ? 3 : r.misses <= 2 ? 2 : 1
  const prev = state.stars[r.short] || 0
  state.stars[r.short] = Math.max(prev, stars)
  state.plays[r.short] = (state.plays[r.short] || 0) + 1
  save()
  hud()

  view.replaceChildren()
  const sheet = h('section', 'sheet')
  sheet.append(h('div', 'eyebrow', 'Level cleared'), h('h2', '', r.short))
  const st = h('div', 'result-stars')
  for (let i = 0; i < 3; i++) {
    const s = h('span', i < stars ? '' : 'off', '★')
    s.style.animationDelay = i * 0.25 + 's'
    st.append(s)
  }
  sheet.append(st)
  const tally = h('div', 'tally')
  const cell = (label, value) => {
    const c = h('div')
    c.append(h('b', '', value), document.createTextNode(label))
    return c
  }
  tally.append(cell('best streak', String(r.best)), cell('first-try misses', String(r.misses)))
  sheet.append(tally)
  const msg = r.quick
    ? (stars === 2 ? 'Clean quick round. A full round with no misses gets the third star.' : 'Quick round done. Watch the worked proofs on the ones you missed, then go again.')
    : stars === 3 ? 'Clean sheet. Every proof right the first time.' : stars === 2 ? 'Good run. One with no misses gets the third star.' : 'Cleared. Run it again: the missed ones come back with new numbers.'
  sheet.append(h('p', 'note', msg + (stars > prev && prev ? ' New best!' : '')))
  const acts = h('div', 'row-actions')
  const nextShort = PROOF_ORDER[(PROOF_ORDER.indexOf(r.short) + 1) % PROOF_ORDER.length]
  const again = h('button', stars < 3 ? 'btn' : 'btn ghost', 'Run it again')
  again.type = 'button'
  again.addEventListener('click', () => startRound(r.short, r.quick))
  const nxt = h('button', stars < 3 ? 'btn ghost' : 'btn', 'Next level')
  nxt.type = 'button'
  nxt.addEventListener('click', () => openCard(nextShort))
  const home = h('button', 'btn ghost', 'Home')
  home.type = 'button'
  home.addEventListener('click', renderMap)
  acts.append(again, nxt, home)
  sheet.append(acts)
  view.append(sheet)
  window.scrollTo({ top: 0 })
  setTimeout(() => {
    sfx.clear()
    burst(stars === 3 ? 160 : 90)
  }, 150)
  round = null
}
