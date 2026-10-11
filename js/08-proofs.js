// js/08-proofs.js · the proofs: the homework, its twins, and a proof set like the book
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- the proofs ----------
// Math 2230's Test 2 is proofs (3.2–3.5, 4.1–4.6, 5.2), written out. Each homework problem
// is asked in the book's own words first: write the proof with the pen, then Show the work
// sets the worked proof the way the book sets one (Proof, sentences, an equation on its own
// line, ∎ at the margin) and plays it a step at a time, each step's reason in a box under it,
// written the way the professor and the book write (extraction/proof-style.md). A miss comes
// back as a twin: the same proof with new numbers. A 3.5 problem hands you a proof to read,
// set the same way, and its answer starts Proof Analysis or Proof Evaluation, as the book's do.

// The math in a step is written once, in a plain form ("9(2k + 1) + 5", l for ℓ), then turned
// into TeX for the page; tools/check-proofs.js turns the same strings into JavaScript and
// checks every = in every proof at random values.
const ptex = s => s.replace(/l/g, '\\ell ')
const pword = s => s.replace(/l/g, 'ℓ')
// a polynomial from [coefficient, variable] pairs, zeros left out: 4k^2 - 6k + 9
function poly(terms) {
  let out = ''
  for (const [c, v] of terms) {
    if (!c) continue
    const abs = Math.abs(c)
    const body = v ? (abs === 1 ? v : abs + v) : String(abs)
    out += out ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body
  }
  return out || '0'
}
// a term with its sign, for an expression built piece by piece: " - 3(2k)", " + 5"
const signed = (c, body = '') => (c < 0 ? ' - ' : ' + ') + (Math.abs(c) === 1 && body ? '' : Math.abs(c)) + body
// a coefficient in front of letters: 1 is left off
const coef = c => (c === 1 ? '' : c === -1 ? '-' : String(c))
// m(2k + 1), or (2k + 1) when m is 1
const times = (m, inner) => (m === 1 ? `(${inner})` : `${m}(${inner})`)
// a chain of equal expressions: its parts (for the checker), and the same cut at each = for
// a sentence (a typeset piece never wraps, so a chain in a sentence wraps between pieces)
const chain = (...parts) => ({ parts, inline: parts.map(ptex).join('\\) \\(= ') })
// an equation on its own line, as the book sets one; a long chain breaks before an =, two
// expressions to a line
function dsp(lhs, c) {
  const rhs = c.parts.map(ptex)
  if (lhs.length + c.parts.join(' = ').length < 50) return `${lhs} = ${rhs.join(' = ')}.`
  const rows = []
  for (let i = 0; i < rhs.length; i += 2) rows.push((i ? '&= ' : `${lhs} &= `) + rhs.slice(i, i + 2).join(' = '))
  return `\\begin{aligned} ${rows.join(' \\\\ ')}. \\end{aligned}`
}
// 2(…) for even, 2(…) + 1 for odd: the defining forms
const evenForm = inner => `2(${inner})`
const oddForm = inner => `2(${inner}) + 1`
const innerOf = form => form.replace(/^2\(/, '').replace(/\)( \+ 1)?$/, '')
const parity = n => (Math.abs(n) % 2 ? 'odd' : 'even')
const sgn = () => pickOne([1, -1])
// A step of a proof: its move, its sentence, and why. More: math (an equation on its own
// line after the sentence), after (the sentence after it), lead (a word that starts a
// paragraph, as the book's Proof does), para (starts a new paragraph), label (the chip's
// own name).
const PL = (move, say, why, more = {}) => ({ move, say, why, ...more })

// the moves a step makes, shown as a chip in the Why box
const PROOF_MOVES = {
  method: { name: 'Method', mv: 'mv-s' },
  parts: { name: 'Two parts', mv: 'mv-s' },
  cases: { name: 'Cases', mv: 'mv-s' },
  assume: { name: 'Assume', mv: 'mv-b' },
  case: { name: 'Case', mv: 'mv-d' },
  wlog: { name: 'WLOG', mv: 'mv-d' },
  converse: { name: 'Converse', mv: 'mv-b' },
  algebra: { name: 'Algebra', mv: 'mv-a' },
  conclude: { name: 'Conclude', mv: 'mv-e' },
  read: { name: 'Read it', mv: 'mv-b' },
  verdict: { name: 'Verdict', mv: 'mv-e' },
  result: { name: 'The result', mv: 'mv-e' },
}

// ---- the Chapter 3 homework ----
// hw: the book's numbers; twin(): new ones; make(v): the question, the hint (how to start,
// never the answer), the proof given to read (3.5), the worked steps, and the = chains
const PROOFS = [
  {
    id: '3.2-8', sec: '3.2', num: '8',
    hw: { kind: 'odd', a: 9, b: 5 },
    twin: () => pickOne([
      () => ({ kind: 'odd', a: pickOne([3, 5, 7, 11, 13]), b: pickOne([1, 3, 5, 7, 9, 11]) * sgn() }),
      () => ({ kind: 'even', a: pickOne([2, 3, 4, 5, 6, 7, 8]), b: pickOne([1, 3, 5, 7, 9, 11]) * sgn() }),
    ])(),
    make: ({ kind, a, b }) => {
      const E = poly([[a, 'x'], [b, '']])
      const from = kind === 'odd' ? 'odd' : 'even'
      const to = kind === 'odd' ? 'even' : 'odd'
      const c = kind === 'odd'
        ? chain(`${a}(2k + 1)${signed(b)}`, poly([[2 * a, 'k'], [a + b, '']]), evenForm(poly([[a, 'k'], [(a + b) / 2, '']])))
        : chain(`${a}(2k)${signed(b)}`, poly([[2 * a, 'k'], [b, '']]), oddForm(poly([[a, 'k'], [(b - 1) / 2, '']])))
      const inner = innerOf(c.parts[2])
      return {
        ask: `Prove that if \\(x\\) is an ${from} integer, then \\(${ptex(E)}\\) is ${to}.`,
        start: `A direct proof: assume the if. What does the definition of ${from} let you write for x?`,
        lines: [
          PL('assume', `Assume that \\(x\\) is an ${from} integer. Then \\(x = ${kind === 'odd' ? '2k + 1' : '2k'}\\) for some integer \\(k\\). So,`, `A direct proof assumes the if. Then the definition of ${from}, with k said to be an integer.`, { lead: 'Proof' }),
          PL('algebra', '', `Substitute for x, then write it in the form the definition of ${to} needs.`, { math: dsp(ptex(E), c) }),
          PL('conclude', `Since \\(${ptex(inner)}\\) is an integer, \\(${ptex(E)}\\) is ${to}. ∎`, `The definition of ${to}, with ${pword(inner)} as the integer.`),
        ],
        checks: [c.parts],
      }
    },
  },
  {
    id: '3.2-10', sec: '3.2', num: '10',
    hw: { m: 1, n: 1, s: 1 },
    twin: () => ({ m: pickOne([1, 3, 5]), n: pickOne([1, 3, 5]), s: sgn() }),
    make: ({ m, n, s }) => {
      const op = s < 0 ? '-' : '+'
      const E = `${coef(m)}ab ${op} ${coef(n)}bc`
      const factored = `b(${coef(m)}a ${op} ${coef(n)}c)`
      const c = chain(`b(${times(m, '2k + 1')} ${op} ${times(n, '2l + 1')})`, `b(${poly([[2 * m, 'k'], [2 * s * n, 'l'], [m + s * n, '']])})`, `2b(${poly([[m, 'k'], [s * n, 'l'], [(m + s * n) / 2, '']])})`)
      const inner = c.parts[2].slice(1)
      return {
        ask: `Prove that if \\(a\\) and \\(c\\) are odd integers, then \\(${ptex(E)}\\) is even for every integer \\(b\\).`,
        note: 'The professor: b ∈ ℤ is part of the hypotheses.',
        start: 'Assume a and c are odd and b is an integer. a and c are different odd integers, so how many letters do you need? What can you factor out first?',
        lines: [
          PL('assume', 'Assume that \\(a\\) and \\(c\\) are odd integers and \\(b\\) is an integer. Then \\(a = 2k + 1\\) and \\(c = 2\\ell + 1\\) for some integers \\(k\\) and \\(\\ell\\).', 'Assume the if (that b is an integer is part of it). Then the definition of odd twice, with different letters, because a and c are different odd integers.', { lead: 'Proof' }),
          PL('algebra', `First, \\(${ptex(E)} = ${ptex(factored)}\\). So,`, 'Factor out b: it is the one letter we know nothing about except that it is an integer. Then substitute, collect, and factor out 2.', { math: dsp(ptex(factored), c) }),
          PL('conclude', `Since \\(${ptex(inner)}\\) is an integer, \\(${ptex(E)}\\) is even. ∎`, `The definition of even, with ${pword(inner)} as the integer.`),
        ],
        checks: [[E, factored], c.parts],
      }
    },
  },
  {
    id: '3.3-16', sec: '3.3', num: '16',
    hw: { kind: 'odd', a: 7, b: 5 },
    twin: () => ({ kind: pickOne(['odd', 'even']), a: pickOne([3, 5, 7, 9, 11]), b: pickOne([1, 3, 5, 7, 9, 11]) * sgn() }),
    make: ({ kind, a, b }) => {
      // if E is odd, then x is even (or: if E is even, then x is odd), a and b odd
      const E = poly([[a, 'x'], [b, '']])
      const hyp = kind
      const con = kind === 'odd' ? 'even' : 'odd'
      // the contrapositive: if x is not con, then E is not hyp
      const xIs = con === 'even' ? 'odd' : 'even'
      const notHyp = hyp === 'odd' ? 'even' : 'odd'
      const c = xIs === 'odd'
        ? chain(`${a}(2k + 1)${signed(b)}`, poly([[2 * a, 'k'], [a + b, '']]), evenForm(poly([[a, 'k'], [(a + b) / 2, '']])))
        : chain(`${a}(2k)${signed(b)}`, poly([[2 * a, 'k'], [b, '']]), oddForm(poly([[a, 'k'], [(b - 1) / 2, '']])))
      const inner = innerOf(c.parts[2])
      return {
        ask: `Let \\(x \\in \\mathbb{Z}\\). Prove that if \\(${ptex(E)}\\) is ${hyp}, then \\(x\\) is ${con}.`,
        start: `Starting from “${E} is ${hyp}” tells you little about x. Which statement could you start from instead?`,
        lines: [
          PL('method', `We prove the contrapositive: if \\(x\\) is ${xIs}, then \\(${ptex(E)}\\) is ${notHyp}.`, `The contrapositive of P ⇒ Q is ∼Q ⇒ ∼P: not ${con} is ${xIs}, and not ${hyp} is ${notHyp}. It lets the proof start from x.`, { lead: 'Proof' }),
          PL('assume', `Assume that \\(x\\) is ${xIs}. Then \\(x = ${xIs === 'odd' ? '2k + 1' : '2k'}\\) for some integer \\(k\\). So,`, `The definition of ${xIs}.`),
          PL('algebra', '', 'Substitute for x, then write it in a defining form.', { math: dsp(ptex(E), c) }),
          PL('conclude', `Since \\(${ptex(inner)}\\) is an integer, \\(${ptex(E)}\\) is ${notHyp}. ∎`, `The definition of ${notHyp}. That proves the contrapositive, and with it the result.`),
        ],
        checks: [c.parts],
      }
    },
  },
  {
    id: '3.3-18', sec: '3.3', num: '18',
    hw: { kind: 'even', a: 5, b: -11 },
    twin: () => ({ kind: pickOne(['even', 'odd']), a: pickOne([3, 5, 7, 9]), b: pickOne([1, 3, 5, 7, 9, 11, 13]) * sgn() }),
    make: ({ kind, a, b }) => {
      // E is even iff x is odd (or: E is odd iff x is even), a and b odd
      const E = poly([[a, 'x'], [b, '']])
      const xFirst = kind === 'even' ? 'odd' : 'even'
      const xOther = xFirst === 'odd' ? 'even' : 'odd'
      const otherE = kind === 'even' ? 'odd' : 'even'
      // x odd gives E even; x even gives E odd (k for the first part, ℓ for the second)
      const cOdd = v => chain(`${a}(2${v} + 1)${signed(b)}`, poly([[2 * a, v], [a + b, '']]), evenForm(poly([[a, v], [(a + b) / 2, '']])))
      const cEven = v => chain(`${a}(2${v})${signed(b)}`, poly([[2 * a, v], [b, '']]), oddForm(poly([[a, v], [(b - 1) / 2, '']])))
      const first = xFirst === 'odd' ? cOdd('k') : cEven('k')
      const second = xOther === 'odd' ? cOdd('l') : cEven('l')
      return {
        ask: `Let \\(x \\in \\mathbb{Z}\\). Prove that \\(${ptex(E)}\\) is ${kind} if and only if \\(x\\) is ${xFirst}.`,
        start: `An if and only if is two implications. For the one that starts from “${E} is ${kind}”, think contrapositive.`,
        lines: [
          PL('parts', `We prove both implications: if \\(x\\) is ${xFirst}, then \\(${ptex(E)}\\) is ${kind}; and if \\(${ptex(E)}\\) is ${kind}, then \\(x\\) is ${xFirst}.`, 'An if and only if is two implications.', { lead: 'Proof' }),
          PL('assume', `First, assume that \\(x\\) is ${xFirst}. Then \\(x = ${xFirst === 'odd' ? '2k + 1' : '2k'}\\) for some integer \\(k\\). So,`, `The definition of ${xFirst}.`),
          PL('algebra', '', `Substitute, write it in the defining form, then the definition of ${kind}.`, { math: dsp(ptex(E), first), after: `Since \\(${ptex(innerOf(first.parts[2]))}\\) is an integer, \\(${ptex(E)}\\) is ${kind}.` }),
          PL('converse', `For the converse, we prove the contrapositive: if \\(x\\) is ${xOther}, then \\(${ptex(E)}\\) is ${otherE}. Assume that \\(x\\) is ${xOther}. Then \\(x = ${xOther === 'odd' ? '2\\ell + 1' : '2\\ell'}\\) for some integer \\(\\ell\\). So,`, `Assuming ${E} is ${kind} says nothing about x directly, so prove the contrapositive. A new letter, ℓ, for this new x.`, { para: true }),
          PL('algebra', '', `Substitute, write it in the defining form, then the definition of ${otherE}.`, { math: dsp(ptex(E), second), after: `Since \\(${ptex(innerOf(second.parts[2]))}\\) is an integer, \\(${ptex(E)}\\) is ${otherE}. ∎` }),
        ],
        checks: [first.parts, second.parts],
      }
    },
  },
  {
    id: '3.3-21', sec: '3.3', num: '21',
    hw: { m: 1 },
    twin: () => ({ m: pickOne([2, 3, 4, 5, -1, -2, -3]) }),
    make: ({ m }) => {
      // (n + m)^2 - m^2 = n^2 + 2mn is even iff n is even
      const E = `(n${signed(m)})^2 - ${m * m}`
      const ex = poly([[1, 'n^2'], [2 * m, 'n']])
      const in1 = poly([[2, 'k^2'], [2 * m, 'k']])
      const in2 = poly([[2, 'l^2'], [2 + 2 * m, 'l'], [m, '']])
      const c1 = chain(`(2k)^2${signed(2 * m, '(2k)')}`, poly([[4, 'k^2'], [4 * m, 'k']]), evenForm(in1))
      const c2 = chain(`(2l + 1)^2${signed(2 * m, '(2l + 1)')}`, poly([[4, 'l^2'], [4 + 4 * m, 'l'], [1 + 2 * m, '']]), oddForm(in2))
      return {
        ask: `Let \\(n \\in \\mathbb{Z}\\). Prove that \\(${ptex(E)}\\) is even if and only if \\(n\\) is even.`,
        start: `Multiply out ${E} first. Then it is two implications, and one of them is easier by contrapositive.`,
        lines: [
          PL('parts', `We prove both implications: if \\(n\\) is even, then \\(${ptex(E)}\\) is even; and if \\(${ptex(E)}\\) is even, then \\(n\\) is even.`, 'An if and only if is two implications.', { lead: 'Proof' }),
          PL('algebra', `First, \\(${ptex(E)} = ${ptex(ex)}\\).`, 'Multiply out the square: the constants cancel.'),
          PL('assume', 'Assume that \\(n\\) is even. Then \\(n = 2k\\) for some integer \\(k\\). So,', 'The definition of even.'),
          PL('algebra', '', 'Substitute into the multiplied-out form, factor out 2, then the definition of even.', { math: dsp(ptex(E), { parts: [ex, ...c1.parts] }), after: `Since \\(${ptex(in1)}\\) is an integer, \\(${ptex(E)}\\) is even.` }),
          PL('converse', `For the converse, we prove the contrapositive: if \\(n\\) is odd, then \\(${ptex(E)}\\) is odd. Assume that \\(n\\) is odd. Then \\(n = 2\\ell + 1\\) for some integer \\(\\ell\\). So,`, 'Assuming it is even says nothing about n directly, so prove the contrapositive. A new letter, ℓ, for this new n.', { para: true }),
          PL('algebra', '', 'Substitute, then write it as 2(an integer) + 1: the definition of odd.', { math: dsp(ptex(E), { parts: [ex, ...c2.parts] }), after: `Since \\(${ptex(in2)}\\) is an integer, \\(${ptex(E)}\\) is odd. ∎` }),
        ],
        checks: [[E, ex], c1.parts, c2.parts],
      }
    },
  },
  {
    id: '3.4-26', sec: '3.4', num: '26',
    hw: { b: -3, c: 9 },
    twin: () => {
      const b = pickOne([1, 3, 5, 7]) * sgn()
      let c = 0
      while (!c || (c === 9 && b === -3)) c = pickOne([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) * sgn()
      return { b, c }
    },
    make: ({ b, c }) => {
      // n^2 + bn + c with b odd: its parity is c's for every n
      const E = poly([[1, 'n^2'], [b, 'n'], [c, '']])
      const word = parity(c)
      const in1 = word === 'odd' ? poly([[2, 'k^2'], [b, 'k'], [(c - 1) / 2, '']]) : poly([[2, 'k^2'], [b, 'k'], [c / 2, '']])
      const in2 = word === 'odd' ? poly([[2, 'l^2'], [2 + b, 'l'], [(b + c) / 2, '']]) : poly([[2, 'l^2'], [2 + b, 'l'], [(1 + b + c) / 2, '']])
      const form = word === 'odd' ? oddForm : evenForm
      const c1 = chain(`(2k)^2${signed(b, '(2k)')}${signed(c)}`, poly([[4, 'k^2'], [2 * b, 'k'], [c, '']]), form(in1))
      const c2 = chain(`(2l + 1)^2${signed(b, '(2l + 1)')}${signed(c)}`, poly([[4, 'l^2'], [4 + 2 * b, 'l'], [1 + b + c, '']]), form(in2))
      return {
        ask: `Prove that if \\(n \\in \\mathbb{Z}\\), then \\(${ptex(E)}\\) is ${word}.`,
        start: 'There is nothing to assume about n but that it is an integer. Which two cases cover every integer?',
        lines: [
          PL('cases', 'We proceed by cases, according to whether \\(n\\) is even or odd.', 'Every integer is even or odd, so the two cases cover every n.', { lead: 'Proof' }),
          PL('case', 'Case 1. *\\(n\\) is even.* Then \\(n = 2k\\) for some integer \\(k\\). So,', 'The definition of even.', { para: true }),
          PL('algebra', '', `Substitute, write it in the defining form, then the definition of ${word}.`, { math: dsp(ptex(E), c1), after: `Since \\(${ptex(in1)}\\) is an integer, the integer \\(${ptex(E)}\\) is ${word}.` }),
          PL('case', 'Case 2. *\\(n\\) is odd.* Then \\(n = 2\\ell + 1\\) for some integer \\(\\ell\\). So,', 'The definition of odd, with its own letter.', { para: true }),
          PL('algebra', '', `Substitute, write it in the defining form, then the definition of ${word}.`, { math: dsp(ptex(E), c2), after: `Since \\(${ptex(in2)}\\) is an integer, the integer \\(${ptex(E)}\\) is ${word}.` }),
          PL('conclude', `In both cases, \\(${ptex(E)}\\) is ${word}. ∎`, 'The two cases cover every integer, so it holds for every n.', { para: true }),
        ],
        checks: [c1.parts, c2.parts],
      }
    },
  },
  {
    id: '3.4-28', sec: '3.4', num: '28',
    hw: { a: 1 },
    twin: () => ({ a: pickOne([3, 5, 7, 9]) }),
    make: ({ a }) => {
      const E = `${coef(a)}xy`
      const inner = `${coef(a)}ky`
      const c = chain(`${coef(a)}(2k)y`, evenForm(inner))
      return {
        ask: `Let \\(x, y \\in \\mathbb{Z}\\). Prove that if \\(${E}\\) is odd, then \\(x\\) and \\(y\\) are odd.`,
        start: 'Contrapositive. What is the negation of “x and y are odd”?',
        lines: [
          PL('method', `We prove the contrapositive: if \\(x\\) is even or \\(y\\) is even, then \\(${E}\\) is even.`, 'By De Morgan’s law, the negation of “x and y are odd” is “x is even or y is even”: the “and” becomes an “or”.', { lead: 'Proof' }),
          PL('wlog', 'Assume that \\(x\\) is even or \\(y\\) is even. Without loss of generality, assume that \\(x\\) is even. Then \\(x = 2k\\) for some integer \\(k\\).', `The case y even is the same proof with x and y swapped, since ${E} doesn’t change when they swap.`),
          PL('algebra', `So \\(${E} = ${c.inline}\\). Since \\(${inner}\\) is an integer, \\(${E}\\) is even. ∎`, 'Substitute, then the definition of even.'),
        ],
        checks: [c.parts],
      }
    },
  },
  {
    id: '3.4-59', sec: '3.4', num: '59', letters: true,
    hw: { dir: '>' },
    twin: () => ({ dir: pickOne(['>', '<']) }),
    make: ({ dir }) => {
      const avg = '\\frac{a + b}{2}'
      const big = dir === '>'
      return {
        ask: `Prove for every two distinct real numbers \\(a\\) and \\(b\\) that either \\(${avg} ${dir} a\\) or \\(${avg} ${dir} b\\).`,
        start: 'a and b are distinct, so one of them is smaller. Are the two cases really different?',
        lines: [
          PL('cases', 'Let \\(a\\) and \\(b\\) be distinct real numbers. Since \\(a \\ne b\\), either \\(a < b\\) or \\(b < a\\).', 'Distinct means a ≠ b, so one of them is smaller: two cases.', { lead: 'Proof' }),
          PL('wlog', `Without loss of generality, assume that \\(${big ? 'a < b' : 'b < a'}\\).`, 'Swapping a and b doesn’t change the statement, so the other case is the same proof.'),
          PL('algebra', big
            ? `Adding \\(a\\) to both sides of \\(a < b\\) gives \\(2a < a + b\\). Dividing by 2 gives \\(a < ${avg}\\).`
            : `Adding \\(a\\) to both sides of \\(b < a\\) gives \\(a + b < 2a\\). Dividing by 2 gives \\(${avg} < a\\).`,
            'Adding the same number to both sides, or dividing by a positive number, keeps an inequality’s direction.'),
          PL('conclude', `So \\(${avg} ${dir} a\\), and therefore \\(${avg} ${dir} a\\) or \\(${avg} ${dir} b\\). ∎`, 'An “or” is true as soon as one side is.'),
        ],
        checks: [],
      }
    },
  },
  {
    id: '3.5-42', sec: '3.5', num: '42',
    hw: { A: 3, B: -4, C: -5 },
    twin: () => {
      // A + B odd, so x even and x odd give different parities
      let A, B, C
      do {
        A = pickOne([1, 2, 3, 5])
        B = pickOne([1, 2, 3, 4, 5, 6]) * sgn()
        C = pickOne([1, 2, 3, 4, 5, 6, 7, 8, 9]) * sgn()
      } while ((A + B) % 2 === 0 || (A === 3 && B === -4 && C === -5))
      return { A, B, C }
    },
    make: ({ A, B, C }) => {
      const E = poly([[A, 'x^2'], [B, 'x'], [C, '']])
      const pe = parity(C)
      const po = parity(A + B + C)
      const S = A + B + C
      const in1 = poly([[2 * A, 'a^2'], [B, 'a'], [(C - (pe === 'odd' ? 1 : 0)) / 2, '']])
      const in2 = poly([[2 * A, 'b^2'], [2 * A + B, 'b'], [(S - (po === 'odd' ? 1 : 0)) / 2, '']])
      const c1 = chain(`${coef(A)}(2a)^2${signed(B, '(2a)')}${signed(C)}`, poly([[4 * A, 'a^2'], [2 * B, 'a'], [C, '']]), pe === 'odd' ? oddForm(in1) : evenForm(in1))
      const c2 = chain(`${coef(A)}(2b + 1)^2${signed(B, '(2b + 1)')}${signed(C)}`, `${times(A, '4b^2 + 4b + 1')}${signed(2 * B, 'b')}${signed(B)}${signed(C)}`, poly([[4 * A, 'b^2'], [4 * A + 2 * B, 'b'], [S, '']]), po === 'odd' ? oddForm(in2) : evenForm(in2))
      const T = ptex(E)
      return {
        ask: 'Below is given a proof of a result. Which result is being proved?',
        start: 'Read each part on its own: what does it assume, and what does it show?',
        given: [
          { lead: 'Proof', say: 'Assume that \\(x\\) is even. Then \\(x = 2a\\) for some integer \\(a\\). So,', math: dsp(T, c1), after: `Since \\(${ptex(in1)}\\) is an integer, \\(${T}\\) is ${pe}.` },
          { para: true, say: 'For the converse, assume that \\(x\\) is odd. So, \\(x = 2b + 1\\), where \\(b \\in \\mathbb{Z}\\). Therefore,', math: dsp(T, c2), after: `Since \\(${ptex(in2)}\\) is an integer, \\(${T}\\) is ${po}. ∎` },
        ],
        lines: [
          PL('read', `The first part assumes \\(x\\) is even and shows \\(${T}\\) is ${pe}. So it proves: if \\(x\\) is even, then \\(${T}\\) is ${pe}.`, 'A proof that assumes P and shows Q proves P ⇒ Q.', { lead: 'Proof Analysis' }),
          PL('read', `The second part assumes \\(x\\) is odd and shows \\(${T}\\) is ${po}. That is the contrapositive of: if \\(${T}\\) is ${pe}, then \\(x\\) is even.`, 'Not even is odd, and not odd is even. So this part proves the converse of the first part, by contrapositive. (The proof calls it the converse.)'),
          PL('result', `Let \\(x \\in \\mathbb{Z}\\). Then \\(${T}\\) is ${pe} if and only if \\(x\\) is even.`, 'An implication and its converse together make an if and only if: that is the result being proved.', { lead: 'Result' }),
        ],
        checks: [c1.parts, c2.parts],
      }
    },
  },
  {
    id: '3.5-44', sec: '3.5', num: '44',
    hw: { s: -1, m: 1, flaw: false },
    twin: () => ({ s: sgn(), m: pickOne([1, 1, 3, 5]), flaw: Math.random() < 0.5 }),
    make: ({ s, m, flaw }) => {
      // a ± mb is even iff a and b have the same parity (m odd), proved by cases; a twin
      // may give Subcase 2.2 the same letter for a and b
      const op = s < 0 ? '-' : '+'
      const sm = s * m
      const E = `a ${op} ${coef(m)}b`
      const mb = v => (m === 1 ? v : `${m}(${v})`)
      const T = ptex(E)
      const c11 = chain(`2x ${op} ${mb('2y')}`, evenForm(poly([[1, 'x'], [sm, 'y']])))
      const c12 = chain(`(2x + 1) ${op} ${m === 1 ? '(2y + 1)' : mb('2y + 1')}`, evenForm(poly([[1, 'x'], [sm, 'y'], [(1 + sm) / 2, '']])))
      const c21 = chain(`(2x + 1) ${op} ${mb('2y')}`, oddForm(poly([[1, 'x'], [sm, 'y']])))
      const c22 = flaw
        ? chain(`2x ${op} ${m === 1 ? '(2x + 1)' : mb('2x + 1')}`, poly([[2 + 2 * sm, 'x'], [sm, '']]), oddForm(poly([[1 + sm, 'x'], [(sm - 1) / 2, '']])))
        : chain(`2x ${op} ${m === 1 ? '(2y + 1)' : mb('2y + 1')}`, poly([[2, 'x'], [2 * sm, 'y'], [sm, '']]), oddForm(poly([[1, 'x'], [sm, 'y'], [(sm - 1) / 2, '']])))
      const last = c => c.parts[c.parts.length - 1]
      const sub = (n, label, v, c, word) => ({ para: true, say: `Subcase ${n}. *${label}* Then ${v}. Then \\(${T} = ${c.inline}\\). Since \\(${ptex(innerOf(last(c)))}\\) is an integer, \\(${T}\\) is ${word}.` })
      const given = [
        { lead: 'Result', say: `Let \\(a, b \\in \\mathbb{Z}\\). Then \\(${T}\\) is even if and only if \\(a\\) and \\(b\\) are of the same parity.` },
        { lead: 'Proof', say: 'We consider two cases.' },
        { para: true, say: 'Case 1. *\\(a\\) and \\(b\\) are of the same parity.* We now consider two subcases.' },
        sub('1.1', '\\(a\\) and \\(b\\) are both even.', '\\(a = 2x\\) and \\(b = 2y\\), where \\(x, y \\in \\mathbb{Z}\\)', c11, 'even'),
        sub('1.2', '\\(a\\) and \\(b\\) are both odd.', '\\(a = 2x + 1\\) and \\(b = 2y + 1\\), where \\(x, y \\in \\mathbb{Z}\\)', c12, 'even'),
        { para: true, say: 'Case 2. *\\(a\\) and \\(b\\) are of opposite parity.* We again have two subcases.' },
        sub('2.1', '\\(a\\) is odd and \\(b\\) is even.', '\\(a = 2x + 1\\) and \\(b = 2y\\), where \\(x, y \\in \\mathbb{Z}\\)', c21, 'odd'),
        sub('2.2', '\\(a\\) is even and \\(b\\) is odd.', flaw ? '\\(a = 2x\\) and \\(b = 2x + 1\\), where \\(x \\in \\mathbb{Z}\\)' : '\\(a = 2x\\) and \\(b = 2y + 1\\), where \\(x, y \\in \\mathbb{Z}\\)', c22, 'odd'),
      ]
      given[given.length - 1].say += ' ∎'
      const read1 = PL('read', `Case 1 assumes \\(a\\) and \\(b\\) are of the same parity and shows \\(${T}\\) is even. That proves: if \\(a\\) and \\(b\\) are of the same parity, then \\(${T}\\) is even.`, 'A proof that assumes P and shows Q proves P ⇒ Q; the two subcases cover both even and both odd.', { lead: 'Proof Evaluation' })
      const lines = flaw
        ? [
            read1,
            PL('verdict', 'But Subcase 2.2 is wrong: it writes \\(a = 2x\\) and \\(b = 2x + 1\\) with the same \\(x\\), so it only covers \\(b = a + 1\\), not every even \\(a\\) and odd \\(b\\).', 'Different integers need different letters (Problem 3.21). Point to the step that fails, and say why.'),
            PL('verdict', 'Everything else is right: with \\(b = 2y + 1\\) in Subcase 2.2, the same steps work, and Case 2 then proves the converse by contrapositive.', 'A proof evaluation says what is right, too.', { label: 'The fix' }),
          ]
        : [
            read1,
            PL('read', `Case 2 assumes \\(a\\) and \\(b\\) are of opposite parity and shows \\(${T}\\) is odd. That is the contrapositive of the converse: if \\(${T}\\) is even, then \\(a\\) and \\(b\\) are of the same parity.`, 'Not the same parity is opposite parity, and not even is odd.'),
            PL('verdict', 'So both directions are proved, and the proof is correct. It would read better as two implications, “First, assume … For the converse, …”, since Case 2 is really a proof by contrapositive.', 'A proof evaluation says what is right, then what could be better.'),
          ]
      return {
        ask: 'Evaluate the proof of the following result.',
        start: 'What does each case assume, and what does it show? Do the two cases together give both directions? Check every line, letters included.',
        given,
        lines,
        checks: [c11.parts, c12.parts, c21.parts, c22.parts],
      }
    },
  },
  {
    id: '3.5-46', sec: '3.5', num: '46', letters: true,
    hw: { v: 'sum' },
    twin: () => ({ v: pickOne(['sum', 'product', 'sumPlus']) }),
    make: ({ v }) => {
      // a proof that starts "without loss of generality": which result is it?
      const V = {
        sum: { E: 'xy + xz + yz', two: true, c: chain('(2a)(2b) + (2a)z + (2b)z', '2(2ab + az + bz)') },
        sumPlus: { E: 'xy + xz + yz + xyz', two: true, c: chain('(2a)(2b) + (2a)z + (2b)z + (2a)(2b)z', '2(2ab + az + bz + 2abz)') },
        product: { E: 'xyz', two: false, c: chain('(2a)yz', '2(ayz)') },
      }[v]
      const inner = innerOf(V.c.parts[1])
      const assumed = V.two ? '\\(x\\) and \\(y\\) are even' : '\\(x\\) is even'
      return {
        ask: 'Given below is a proof of a result. What is the result?',
        start: 'What does the proof assume about x, y and z? What does “without loss of generality” say about the choices it didn’t make?',
        given: [
          { lead: 'Proof', say: `Assume, without loss of generality, that ${assumed}. Then ${V.two ? '\\(x = 2a\\) and \\(y = 2b\\) for integers \\(a\\) and \\(b\\)' : '\\(x = 2a\\) for some integer \\(a\\)'}. Therefore,`, math: dsp(V.E, V.c), after: `Since \\(${inner}\\) is an integer, \\(${V.E}\\) is even. ∎` },
        ],
        lines: [
          PL('read', `The proof assumes ${assumed}, and only that ${V.two ? '\\(z\\) is an integer' : '\\(y\\) and \\(z\\) are integers'}. It shows \\(${V.E}\\) is even.`, 'Read what it assumes and what it shows: that is the result, P ⇒ Q.', { lead: 'Proof Analysis' }),
          PL('wlog', `“Without loss of generality” says any ${V.two ? 'two of the three' : 'one of the three'} would do: \\(${V.E}\\) stays the same when the letters are swapped.`, 'WLOG stands in for the cases it skips, so the hypothesis covers them too.'),
          PL('result', `Let \\(x, y, z \\in \\mathbb{Z}\\). If at least ${V.two ? 'two' : 'one'} of \\(x\\), \\(y\\) and \\(z\\) ${V.two ? 'are' : 'is'} even, then \\(${V.E}\\) is even.`, '“At least two (one)” is the hypothesis that WLOG turned into “x and y (x)”.', { lead: 'Result' }),
        ],
        checks: [V.c.parts],
      }
    },
  },
]

// ---- the levels: one per section, then all of them mixed ----
const PROOF_SECS = [
  { sec: '3.2', name: 'Direct proofs (3.2)', card: [
    'A direct proof: assume the if, show the then.',
    'Write each even or odd number with its definition, 2k or 2k + 1 “for some integer k”. Different numbers get different letters.',
    'End in the defining form and name the integer: “Since 9k + 7 is an integer, 9x + 5 is even.”',
  ] },
  { sec: '3.3', name: 'Proof by contrapositive (3.3)', card: [
    'The contrapositive of P ⇒ Q is ∼Q ⇒ ∼P. Prove it instead when the conclusion is the easier place to start.',
    'Say that you are doing it: “We prove the contrapositive: if x is odd, then 7x + 5 is even.”',
    'An if and only if is two implications: “First, assume … For the converse, assume …”. One can be direct and the other by contrapositive.',
  ] },
  { sec: '3.4', name: 'Proof by cases (3.4)', card: [
    'Split into cases that cover everything: even or odd, a < b or b < a.',
    '“We proceed by cases, according to whether n is even or odd.” Then Case 1, Case 2, and what both give.',
    'When the cases are the same with the letters swapped, do one: “Without loss of generality, assume that x is even.”',
  ] },
  { sec: '3.5', name: 'Proof evaluations (3.5)', card: [
    'Read a proof for what it assumes and what it shows: assuming P and showing Q proves P ⇒ Q, and its contrapositive, not its converse.',
    'To evaluate one, say what it does right, then point to the step that fails, or say it is correct.',
  ] },
]
const PROOF_MIX = 'Chapter 3 proofs, mixed'
for (const s of PROOF_SECS) {
  const nums = PROOFS.filter(d => d.sec === s.sec).map(d => d.num)
  PROOF_LEVELS[s.name] = { sec: s.sec, size: nums.length }
  CARDS[s.name] = [...s.card, `Homework ${nums.join(', ').replace(/, (\d+)$/, ' and $1')}, in the book’s words, written with the pen. Tap Show the work to check each one; a miss comes back with new numbers.`]
}
PROOF_LEVELS[PROOF_MIX] = { mixed: true, size: PROOFS.length }
CARDS[PROOF_MIX] = [
  `All ${PROOFS.length} Chapter 3 homework proofs with new numbers, in a random order. Nothing on top names the method: pick it yourself, like on the test.`,
  'The quick round is one from each section.',
  'Tap Show the work to check each one; a miss comes back at the end with new numbers.',
]
const PROOF_ORDER = [...PROOF_SECS.map(s => s.name), PROOF_MIX]

// a problem from its numbers: the homework's own or a twin's (a problem with no numbers,
// letters: true, has twins that are new versions of it instead)
function proofProblem(d, v, mixed = false) {
  const own = v === d.hw
  const m = d.make(v)
  const twin = d.letters ? 'a new version' : 'new numbers'
  return {
    ...m,
    id: d.id,
    tag: mixed ? twin : `#${d.num} · ${own ? 'the homework' : twin}`,
    another: () => proofProblem(d, d.twin(), mixed),
  }
}
// a section's round: its homework in the book's order and words; the mix: every problem
// with new numbers, shuffled (quick: one from each section)
function proofRound(short, quick = false) {
  const level = PROOF_LEVELS[short]
  if (!level.mixed) return PROOFS.filter(d => d.sec === level.sec).map(d => ({ p: proofProblem(d, d.hw), seen: 0, missed: false }))
  const defs = quick ? PROOF_SECS.map(s => pickOne(PROOFS.filter(d => d.sec === s.sec))) : PROOFS
  return shuffleArr(defs).map(d => ({ p: proofProblem(d, d.twin(), true), seen: 0, missed: false }))
}

// Text with *italics* (the book's case labels) and \( math \); and, in a worked proof after a
// check, the places yours went wrong (fixSteps): their words underlined in the color of the
// mistake, with its number.
const FIX_MARK = /(\d+)\|([\w-]+)([\s\S]*?)|(\d+)\|([\w-]+)/g
function emText(tag, cls, text) {
  const el = h(tag, cls)
  const plain = (into, s) => s.split('*').forEach((part, i) => {
    if (!part) return
    if (i % 2) {
      const em = document.createElement('em')
      em.append(...richNodes(part))
      into.append(em)
    } else into.append(...richNodes(part))
  })
  let at = 0
  for (const m of text.matchAll(FIX_MARK)) {
    plain(el, text.slice(at, m.index))
    if (m[3] !== undefined) {
      const u = h('span', 'fx ' + m[2])
      plain(u, m[3])
      el.append(u, markNum(m[1], m[2]))
    } else el.append(markNum(m[4], m[5]))
    at = m.index + m[0].length
  }
  plain(el, text.slice(at))
  return el
}

// Where a checked proof's mistakes show in the worked one (js/14): each fix's words, quoted
// from the worked proof by the checker, are found in a step and marked there; in an equation
// they're underlined in the TeX, in a sentence wrapped for emText. Words found only in part
// of a formula (or a line too tangled to cut) just get the mistake's number at that spot.
const texOk = s => (s.match(/\{/g) || []).length === (s.match(/\}/g) || []).length && !/&|\\\\/.test(s)
const texUnder = (s, cls) => `\\class{fx-m ${cls}}{\\underline{\\class{fx-t}{${s}}}}`
const numMark = (n, cls) => `${n}|${cls}`
// before a sentence's closing ∎, so the ∎ still ends it
const beforeQed = (s, mark) => s.replace(/(\s*∎\s*)?$/, end => mark + end)
function findIn(text, words) {
  for (const w of [words, words.replace(/\\[()[\]]/g, '')]) {
    const t = w.trim()
    if (!t) continue
    const m = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*')).exec(text)
    if (m) return [m.index, m.index + m[0].length]
  }
  return null
}
function fixSteps(steps, fixes) {
  if (!fixes?.length) return steps
  const out = steps.map(s => ({ ...s }))
  for (const { n, cls, fix } of fixes) {
    found: for (const s of out) {
      for (const key of ['say', 'math', 'after']) {
        const text = s[key]
        const at = text && findIn(text, fix)
        if (!at) continue
        let [a, b] = at
        if (key === 'math') {
          if (texOk(text.slice(a, b))) s.math = text.slice(0, a) + texUnder(text.slice(a, b), cls) + text.slice(b)
          s.nums = [...(s.nums ?? []), [n, cls]]
          break found
        }
        const maths = [...text.matchAll(/\\\(([\s\S]*?)\\\)/g)].map(m => ({ start: m.index, end: m.index + m[0].length }))
        const inside = maths.find(r => a >= r.start + 2 && b <= r.end - 2)
        if (inside) {
          // in a formula in the sentence: underline it there, the number after the formula
          const cut = texOk(text.slice(a, b)) ? text.slice(0, a) + texUnder(text.slice(a, b), cls) + text.slice(b, inside.end) : text.slice(0, inside.end)
          s[key] = cut + numMark(n, cls) + text.slice(inside.end)
        } else if (!text.includes('*')) {
          // words: take in any formula they cut into
          for (const r of maths) {
            if (a > r.start && a < r.end) a = r.start
            if (b > r.start && b < r.end) b = r.end
          }
          s[key] = text.slice(0, a) + `${n}|${cls}` + text.slice(a, b) + '' + text.slice(b)
        } else s[key] = beforeQed(text, numMark(n, cls))
        break found
      }
    }
  }
  return out
}

// A proof set the way the book sets one: paragraphs of sentences, an equation on its own
// line, a lead word that starts a paragraph in bold with a colon (Proof:, as the handouts
// write it; Result:, Proof Analysis:), and ∎ at the right margin of the last line. Returns the
// block and each step's pieces, so a player can show them a step at a time. fixes: where a
// checked proof went wrong, marked in it (fixSteps).
function bookBlock(steps, fixes = []) {
  steps = fixSteps(steps, fixes)
  const box = h('div', 'book')
  let para = null
  const qed = /\s*∎\s*$/
  const pieces = steps.map((s, i) => {
    if (!para || s.lead || s.para) {
      para = h('div', 'book-para' + (s.lead ? ' led' : ''))
      box.append(para)
    }
    const els = []
    const add = el => {
      el.dataset.step = i
      para.append(el)
      els.push(el)
    }
    const sentence = text => {
      // a space between sentences of a paragraph; none after an equation's line break
      if (para.lastChild && !para.lastChild.classList?.contains('math-d')) para.append(' ')
      return emText('span', 'book-s', text.replace(qed, ''))
    }
    if (s.say || s.lead) {
      const sp = sentence(s.say || '')
      if (s.lead) sp.prepend(h('b', 'lead', s.lead + ':'), ' ')
      add(sp)
    }
    if (s.math) {
      const m = tex(s.math)
      for (const [n, cls] of s.nums ?? []) m.append(markNum(n, cls))
      add(m)
    }
    if (s.after) add(sentence(s.after))
    return els
  })
  const end = steps[steps.length - 1]
  if (end && qed.test(end.after || end.say || '')) {
    const mark = h('span', 'qed', '∎')
    mark.dataset.step = steps.length - 1
    para.append(mark)
    pieces[pieces.length - 1].push(mark)
  }
  return { box, pieces }
}

// The worked proof, set like the book and played a step at a time: each step appears in its
// place (the rest of the proof keeps its room, so nothing jumps), underlined while it is new,
// its move and reason in a line under the proof. Afterwards, tap a step to see its reason.
// After a check (js/14) it opens whole, titled What it should look like, with where yours
// went wrong underlined in it (fixes), and plays only when asked.
function proofPlayer(p, { auto = false, next = null, title = '', fixes = [] } = {}) {
  const el = h('div', 'proof-player')
  el.append(h('div', 'eyebrow', title || (p.given ? 'The answer' : 'The worked proof')))
  const { box, pieces } = bookBlock(p.lines, fixes)
  const why = h('p', 'why-line')
  why.hidden = true
  const foot = h('div', 'book-foot')
  const replay = h('button', 'textbtn', auto ? 'Replay' : 'Play it step by step')
  replay.type = 'button'
  foot.append(replay)
  if (fixes.length) foot.append(h('span', 'foot-note', 'Underlined: where yours went wrong'))
  box.append(why, foot)
  el.append(box)
  if (next) {
    const acts = h('div', 'row-actions')
    acts.append(next)
    el.append(acts)
  }
  const light = i => {
    pieces.forEach((els, j) => els.forEach(e => e.classList.toggle('now', j === i)))
    const l = p.lines[i]
    const mv = PROOF_MOVES[l.move] ?? PROOF_MOVES.algebra
    why.hidden = false
    why.replaceChildren(h('span', 'proof-move ' + mv.mv, `Step ${i + 1} · ${l.label ?? mv.name}`), h('span', 'why-text', l.why))
  }
  pieces.forEach((els, i) => els.forEach(e => {
    e.setAttribute('role', 'button')
    e.tabIndex = 0
    e.addEventListener('click', () => !e.classList.contains('unseen') && light(i))
    e.addEventListener('keydown', ev => {
      if ((ev.key === 'Enter' || ev.key === ' ') && !e.classList.contains('unseen')) {
        ev.preventDefault()
        light(i)
      }
    })
  }))
  const readMs = l => Math.min(5200, 1200 + 16 * ((l.say || '').length + (l.after || '').length + l.why.length) + (l.math ? 800 : 0))
  let run = 0
  async function play() {
    const me = ++run
    const alive = () => me === run && el.isConnected
    replay.textContent = 'Replay'
    pieces.flat().forEach(e => e.classList.add('unseen'))
    for (let i = 0; i < pieces.length; i++) {
      await wait(reduced() ? 0 : i ? readMs(p.lines[i - 1]) : 300)
      if (!alive()) return
      for (const e of pieces[i]) {
        e.classList.remove('unseen')
        e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 })
      }
      light(i)
      tone(semis(523.25, 7), 0, 0.08, 'sine', 0.06)
    }
  }
  replay.addEventListener('click', play)
  if (auto) play()
  return el
}

// "Watch one first" on a section's card: a twin, its proof played
function proofExample(short) {
  const level = PROOF_LEVELS[short]
  const d = pickOne(PROOFS.filter(x => level.mixed || x.sec === level.sec))
  const p = proofProblem(d, d.twin(), true)
  const box = h('div', 'howto-body pen-example')
  box.append(h('div', 'eyebrow', `Watch one · like #${d.num} · doesn’t count`), h('p', 'ask', p.ask))
  if (p.given) box.append(bookBlock(p.given).box)
  box.append(proofPlayer(p, { auto: true }))
  return box
}

// the home screen: the proofs, a level per section, then the mix
function proofBlock() {
  const intro = h('section', 'study-intro')
  intro.append(h('h2', '', 'Proofs · Test 2'), h('p', '', 'Math 2230. Write each homework proof with the pen, then watch the worked proof, set like the book’s, and say whether you had it. Chapter 3 is in; Chapters 4 and 5.2 come next.'))
  view.append(intro)
  const sec = h('section', 'world study')
  const head = h('div', 'world-head')
  const got = PROOF_ORDER.reduce((s, k) => s + Math.min(3, state.stars[k] || 0), 0)
  head.append(h('h2', '', 'Chapter 3 homework'), h('span', '', 'Direct, contrapositive, cases, and reading a proof.'), h('em', '', `${got}/${PROOF_ORDER.length * 3} ★`))
  const lv = h('div', 'levels')
  PROOF_ORDER.forEach((k, i) => {
    const s = state.stars[k] || 0
    const b = h('button', 'level' + (s ? ' cleared' : ''))
    b.type = 'button'
    b.append(h('span', 'oval', String(i + 1)), h('span', 'name', k), starsText(s))
    b.addEventListener('click', () => openCard(k))
    lv.append(b)
  })
  sec.append(head, lv)
  view.append(sec)
}
