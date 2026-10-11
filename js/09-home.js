// js/09-home.js · the home screen, and a level's card
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
const view = document.getElementById('view')
let screen = 'map'
let round = null
function starsText(n, total = 3) {
  const wrap = h('span', 'stars')
  for (let i = 0; i < total; i++) wrap.append(h('span', i < n ? '' : 'off', '★'))
  return wrap
}
// the home screen: the proofs, a level per section (js/08)
function renderMap() {
  screen = 'map'
  round = null
  view.replaceChildren()
  proofBlock()
  window.scrollTo({ top: 0 })
}
// a level's card: the idea in a few lines, then Start (and Watch one first, or a quick round)
function openCard(short) {
  screen = 'card'
  view.replaceChildren()
  const sheet = h('section', 'sheet')
  sheet.append(h('div', 'eyebrow', 'Proofs · Chapter 3 · The idea'), h('h2', '', short))
  const ul = h('ul', 'points')
  for (const line of CARDS[short] ?? []) ul.append(h('li', '', line))
  sheet.append(ul)
  const acts = h('div', 'row-actions')
  const go = h('button', 'btn', `Start · ${roundSize(short)} questions`)
  go.type = 'button'
  go.addEventListener('click', () => startRound(short))
  const back = h('button', 'btn ghost', 'Home')
  back.type = 'button'
  back.addEventListener('click', renderMap)
  if (PROOF_LEVELS[short].mixed) {
    const quick = h('button', 'btn', `Quick round · ${QUICK_ROUND} questions`)
    quick.type = 'button'
    quick.addEventListener('click', () => startRound(short, true))
    acts.append(go, quick, back)
  } else acts.append(go, penWatchButton(short, sheet), back)
  sheet.append(acts)
  view.append(sheet)
  go.focus()
  window.scrollTo({ top: 0 })
}
