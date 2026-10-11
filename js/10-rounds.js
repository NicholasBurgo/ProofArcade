// js/10-rounds.js · a round: a level's questions, one after another
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// quick: one question from each section (the mixed level only)
async function startRound(short, quick = false) {
  view.replaceChildren(h('p', 'loading', 'Shuffling the deck…'))
  await mathBoot
  round = { short, quick, queue: proofRound(short, quick), at: 0, combo: 0, best: 0, misses: 0, marks: [] }
  showQuestion()
}
