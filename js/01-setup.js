// js/01-setup.js · setup: the helpers every file uses, and the levels' registry
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.

// the levels (js/08): each its round size, and the section it asks (or mixed: all of them)
const PROOF_LEVELS = {}
// each level's card: what the level is about, a line each
const CARDS = {}
// a quick round: one question from each section
const QUICK_ROUND = 4
const roundSize = short => PROOF_LEVELS[short]?.size ?? 0
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)]
const shuffleArr = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const wait = ms => new Promise(r => setTimeout(r, ms))
