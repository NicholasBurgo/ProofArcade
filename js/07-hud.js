// js/07-hud.js · heads-up: the bar's Sound button
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
function hud() {
  const snd = document.getElementById('sound')
  snd.setAttribute('aria-pressed', String(!state.muted))
  snd.textContent = state.muted ? 'Muted' : 'Sound'
}
