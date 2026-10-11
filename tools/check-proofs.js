// Checks the proofs (js/08-proofs.js): every = in every worked proof and given proof, at
// random values, for the homework's numbers and many twins; and the words, for leftovers
// like "undefined", "+ -" or a coefficient of 1; and that a proof starts with Proof, as the
// book's do (a 3.5 answer with Proof Analysis or Proof Evaluation).
//   node tools/check-proofs.js            -> 300 twins per problem
//   TWINS=2000 node tools/check-proofs.js -> more
//   SHOW=1 node tools/check-proofs.js     -> also print each homework proof
const path = require('path')
const fs = require('fs')
const vm = require('vm')
const ROOT = path.resolve(__dirname, '..')
const TWINS = Number(process.env.TWINS || 300)

// the file is a classic script for the page; give it what it uses at load time
const ctx = {
  CARDS: {},
  PROOF_LEVELS: {},
  pickOne: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffleArr: arr => [...arr].sort(() => Math.random() - 0.5),
}
vm.createContext(ctx)
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/08-proofs.js'), 'utf8') + '\n;globalThis.__P = { PROOFS, proofRound, proofProblem, PROOF_MIX }', ctx)
const { PROOFS, proofRound, PROOF_MIX } = ctx.__P

// the plain math as JavaScript: implicit times, ^ as **
const js = s => s.replace(/\^/g, '**').replace(/(\d|[a-z]|\))(?=[a-z(])/g, '$1*')
function equalEverywhere(parts) {
  const letters = [...new Set(parts.join(' ').match(/[a-z]/g) || [])]
  const fns = parts.map(p => new Function(...letters, `return ${js(p)}`))
  for (let t = 0; t < 12; t++) {
    const vals = letters.map(() => Math.floor(Math.random() * 21) - 10)
    const got = fns.map(f => f(...vals))
    if (got.some(g => !Number.isFinite(g) || g !== got[0])) return `${parts.join(' = ')} fails at ${letters.map((l, i) => l + '=' + vals[i]).join(', ')}: ${got.join(' | ')}`
  }
  return null
}
// leftovers a generated line should never have
const BAD = [/undefined/, /NaN/, /\+ -/, /- -/, /\+ \+/, /(^|[^\d.])1[a-z(]/, /\b0[a-z]/, /\+ 0\b/, /- 0\b/, /\(\s*\)/]
const textsOf = p => [p.ask, p.start, p.note, ...p.lines.flatMap(l => [l.say, l.math, l.after, l.why]), ...(p.given || []).flatMap(b => [b.say, b.math, b.after])].filter(Boolean)

let problems = 0, chains = 0
const fails = []
for (const d of PROOFS) {
  const runs = [d.hw, ...Array.from({ length: TWINS }, () => d.twin())]
  for (const v of runs) {
    const p = d.make(v)
    problems++
    for (const c of p.checks) {
      chains++
      const err = equalEverywhere(c)
      if (err) fails.push(`${d.id} ${JSON.stringify(v)}: ${err}`)
    }
    for (const t of textsOf(p)) for (const re of BAD) if (re.test(t.replace(/\\[a-z]+/g, ' '))) fails.push(`${d.id} ${JSON.stringify(v)}: ${re} in "${t}"`)
    if (!p.lines.length || !p.start || !p.ask) fails.push(`${d.id}: missing ask, start or lines`)
    if (p.lines.some(l => !(l.say || l.math) || !l.why)) fails.push(`${d.id}: a step without words or a why`)
    const lead = p.lines[0].lead
    if (d.sec === '3.5' ? !['Proof Analysis', 'Proof Evaluation'].includes(lead) : lead !== 'Proof') fails.push(`${d.id}: starts with ${lead}, not ${d.sec === '3.5' ? 'Proof Analysis or Proof Evaluation' : 'Proof'}`)
    if (!/∎\s*$/.test(p.lines[p.lines.length - 1].after || p.lines[p.lines.length - 1].say) && d.sec !== '3.5') fails.push(`${d.id}: the proof doesn't end with ∎`)
  }
  if (process.env.SHOW) {
    const p = d.make(d.hw)
    console.log(`\n=== ${d.id}: ${p.ask}`)
    for (const b of p.given || []) console.log('  > ' + [b.lead, b.say, b.math && `[ ${b.math} ]`, b.after].filter(Boolean).join(' '))
    for (const l of p.lines) console.log(`  [${l.label || l.move}] ${[l.lead, l.say, l.math && `[ ${l.math} ]`, l.after].filter(Boolean).join(' ')}\n      why: ${l.why}`)
  }
}
// the rounds: every section's homework once, the mix every problem
for (const [name, level] of Object.entries(ctx.PROOF_LEVELS)) {
  const r = proofRound(name)
  if (r.length !== level.size) fails.push(`${name}: round of ${r.length}, size ${level.size}`)
  if (!ctx.CARDS[name]) fails.push(`${name}: no card`)
}
if (proofRound(PROOF_MIX, true).length !== 4) fails.push('the quick mix is not 4 questions')

console.log(`${PROOFS.length} problems, ${problems} made (${TWINS} twins each), ${chains} chains checked`)
if (fails.length) {
  console.log(`\n${fails.length} problem(s):`)
  for (const f of [...new Set(fails)].slice(0, 40)) console.log('  ' + f)
  process.exit(1)
}
console.log('All good.')
