// js/02-progress.js · progress: stars and plays, saved in this browser
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- progress ----------
// Its own key: the Math 3800 arcade is on the same GitHub Pages site, and keeps its own.
const LOCAL_KEY = 'proof-arcade.v1'
const fresh = () => ({ v: 1, stars: {}, plays: {}, recent: {}, muted: false, answered: 0, correct: 0, updated: 0 })
let state = fresh()
try {
  const s = JSON.parse(localStorage.getItem(LOCAL_KEY))
  if (s && s.v === 1) state = { ...fresh(), ...s }
} catch {}
function save() {
  state.updated = Date.now()
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)) } catch {}
}
