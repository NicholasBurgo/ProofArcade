// js/15-boot.js · boot: the bar's buttons, then the first screen
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
document.getElementById('home').addEventListener('click', renderMap)
document.getElementById('sound').addEventListener('click', () => {
  state.muted = !state.muted
  save()
  hud()
  if (!state.muted) sfx.right(0)
})
// a new screen (question, card, results) starts with a clean page: no ink, no marks (js/14c),
// no Ask pop-up (js/14b)
new MutationObserver(() => {
  clearInk()
  clearMarks()
  closeAsk()
}).observe(view, { childList: true })
hud()
renderMap()
// is there a grader to check the writing? (js/14)
graderPing()
