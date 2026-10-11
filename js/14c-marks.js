// js/14c-marks.js · the checker's marks on your page: an underline under what's wrong and a
// caret where something goes in, in the color of the kind of mistake, each numbered like its
// line in the grade under the page
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- marks ----------
// The page is ruled and the reader types one line per line of the page, so the lines of ink
// are found from the ink itself and paired with the typed lines in order. Within a line, a
// word is placed by how far along the typed line it is, then moved to the nearest gap in the
// ink. The marks are a layer of their own over the page, never the ink (so the reader never
// sees them), and they go when the verdict does.

// the kinds of mistake (grader.py), most serious first: each one's color and what it means
const MISTAKE_KINDS = {
  structure: { cls: 'k-shape', name: 'Structure', says: 'the wrong thing proved, or a case or direction missing' },
  definition: { cls: 'k-def', name: 'Definition', says: 'a definition used without all it says' },
  reason: { cls: 'k-why', name: 'Reason', says: 'a step without its why' },
  algebra: { cls: 'k-alg', name: 'Algebra', says: 'a slip in the arithmetic' },
}
const kindOf = it => MISTAKE_KINDS[it.kind] ?? MISTAKE_KINDS.reason

const marks = document.createElement('div')
marks.id = 'marks'
marks.setAttribute('aria-hidden', 'true')
document.body.append(marks)
function clearMarks() {
  marks.replaceChildren()
  marks.hidden = false
}
document.getElementById('ink-clear').addEventListener('click', clearMarks)

// The lines of writing on the page, top to bottom, in page pixels: each one's top, bottom,
// left and right, and the gaps between its words.
function inkLines() {
  const W = ink.width, H = ink.height
  if (!W || !H) return []
  const per = 0.5 // samples per page pixel: a copy at half size is plenty
  const k = per / (window.devicePixelRatio || 1)
  const sw = Math.max(1, Math.round(W * k)), sh = Math.max(1, Math.round(H * k))
  const c = document.createElement('canvas')
  c.width = sw
  c.height = sh
  const cx = c.getContext('2d', { willReadFrequently: true })
  cx.drawImage(ink, 0, 0, sw, sh)
  const px = cx.getImageData(0, 0, sw, sh).data
  const on = (x, y) => px[(y * sw + x) * 4 + 3] > 24
  const rows = new Uint32Array(sh)
  for (let y = 0; y < sh; y++) {
    let n = 0
    for (let x = 0; x < sw; x++) if (on(x, y)) n++
    rows[y] = n
  }
  const L = 44 * per // a ruled line (css/04)
  // bands of rows with ink, small gaps bridged
  let bands = []
  let start = -1, last = -1
  for (let y = 0; y < sh; y++) {
    if (!rows[y]) continue
    if (start >= 0 && y - last > 4 * per) {
      bands.push([start, last + 1])
      start = -1
    }
    if (start < 0) start = y
    last = y
  }
  if (start >= 0) bands.push([start, last + 1])
  // two lines that touch (a tail into the line under it): cut where the ink is thinnest
  bands = bands.flatMap(([a, b]) => {
    const n = Math.round((b - a) / L)
    if (b - a < 1.6 * L || n < 2) return [[a, b]]
    const cuts = [a]
    for (let j = 1; j < n; j++) {
      const t = Math.round(a + (j * (b - a)) / n)
      let best = t
      for (let y = Math.max(a + 1, t - Math.round(0.3 * L)); y <= Math.min(b - 1, t + Math.round(0.3 * L)); y++) if (rows[y] < rows[best]) best = y
      cuts.push(best)
    }
    cuts.push(b)
    return cuts.slice(1).map((e, j) => [cuts[j], e])
  })
  // a dot or a stray mark joins the line next to it
  for (let i = 0; i < bands.length; i++) {
    const [a, b] = bands[i]
    if (b - a >= 0.28 * L || bands.length < 2) continue
    const up = i > 0 ? a - bands[i - 1][1] : Infinity
    const down = i < bands.length - 1 ? bands[i + 1][0] - b : Infinity
    if (Math.min(up, down) > 0.6 * L) continue
    if (up <= down) bands[i - 1][1] = b
    else bands[i + 1][0] = a
    bands.splice(i--, 1)
  }
  return bands.map(([a, b]) => {
    const cols = new Uint8Array(sw)
    for (let y = a; y < b; y++) for (let x = 0; x < sw; x++) if (on(x, y)) cols[x] = 1
    let left = cols.indexOf(1), right = cols.lastIndexOf(1)
    const gaps = []
    const wide = Math.max(8 * per, 0.22 * (b - a))
    for (let x = left, run = 0; x <= right; x++) {
      if (!cols[x]) run++
      else {
        if (run >= wide) gaps.push((x - run / 2) / per)
        run = 0
      }
    }
    return { top: a / per, bottom: b / per, left: left / per, right: (right + 1) / per, gaps }
  })
}

// A typed line as roughly what it looks like written: math without its TeX, a symbol a letter.
const looks = t => t
  .replace(/\[crossed out:\s*([^\]]*)\]/g, '$1')
  .replace(/\[\?\s*([^\]]*)\]/g, '?')
  .replace(/\\[()[\]]/g, '')
  .replace(/\\(?:mathbb|mathrm|text|operatorname)\{([^}]*)\}/g, '$1')
  .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
  .replace(/\\[a-zA-Z]+/g, '#')
  .replace(/[{}^_]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()
// where some words of a line are, as how far along it they start and end (0 to 1)
function along(line, words) {
  if (!words?.trim()) return null
  for (const squeeze of [s => s, s => s.replace(/ /g, '')]) {
    const l = squeeze(looks(line)), w = squeeze(looks(words))
    const at = w ? l.indexOf(w) : -1
    if (at >= 0 && l.length) return [at / l.length, (at + w.length) / l.length]
  }
  return null
}
// that point on a line of ink, moved to the nearest gap between words when one is close
function xOn(ln, f) {
  const w = ln.right - ln.left
  const x = ln.left + f * w
  let best = x, d = 0.12 * w
  for (const g of [ln.left, ...ln.gaps, ln.right]) if (Math.abs(g - x) < d) (d = Math.abs(g - x)), (best = g)
  return best
}

const markNum = (n, cls = '') => h('span', 'mk-num ' + cls, String(n))
const put = (cls, x, y, kids = []) => {
  const el = h('div', cls)
  el.style.left = Math.round(x) + 'px'
  el.style.top = Math.round(y) + 'px'
  el.append(...kids)
  marks.append(el)
  return el
}
const caret = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 16 14')
  svg.innerHTML = '<path d="M1.5 12.5 L8 1.5 L14.5 12.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
  return svg
}

// The verdict's marks on the page. Returns false when the lines of ink and the typed lines
// don't pair up, so the summary can say the marks are missing.
function drawMarks(v, written) {
  clearMarks()
  const lines = inkLines()
  const typed = written.split('\n')
  const kept = typed.map((t, i) => (t.trim() ? i : -1)).filter(i => i >= 0)
  if (!lines.length || !kept.length) return false
  // a line or two off (a dot read as a line, two short lines read as one) still pairs up by
  // position; more than that, and a mark could land on the wrong line
  if (Math.abs(lines.length - kept.length) > Math.max(2, 0.3 * kept.length)) return false
  const inkOf = n => {
    const j = kept.indexOf(n - 1)
    if (j < 0) return null
    if (lines.length === kept.length) return lines[j]
    return lines[Math.min(lines.length - 1, Math.round((j * (lines.length - 1)) / Math.max(1, kept.length - 1)))]
  }
  const badges = new Map() // a line's badges so far, so two on one line sit side by side
  const badge = (ln, n, cls) => {
    const on = badges.get(ln) ?? 0
    badges.set(ln, on + 1)
    put('mk-badge', Math.max(4, ln.left - 34 - on * 28), (ln.top + ln.bottom) / 2 - 13, [markNum(n, cls)])
  }
  // the words to add go in the open space after the line, like a note in the margin (the gap
  // above a line is too narrow, and crosses the marks of the line over it); above the caret
  // only when there's no room on the right
  const room = view.getBoundingClientRect().right + window.scrollX - 24
  const insertAt = (x, ln, text, cls) => {
    put('mk-caret ' + cls, x - 8, ln.bottom - 6, [caret()])
    if (!text) return
    const end = Math.max(x, ln.right) + 14
    if (end + 9 * looks(text).length < room) put('mk-insert mk-after ' + cls, end, (ln.top + ln.bottom) / 2 - 11, [h('span', '', text)])
    else put('mk-insert ' + cls, x - 6, ln.top - 4, [h('span', '', text)])
  }
  let n = 0
  for (const it of v.issues) {
    n++
    const ln = inkOf(it.line_no)
    if (!ln) continue
    const line = typed[it.line_no - 1] ?? it.line
    const { cls } = kindOf(it)
    // what's wrong: those words underlined, or the whole line when it's the line itself
    const span = along(line, it.part)
    if (span || !it.insert) {
      let x0 = span ? xOn(ln, span[0]) : ln.left
      let x1 = span ? xOn(ln, span[1]) : ln.right
      if (x1 - x0 < 24) (x0 -= 12), (x1 += 12)
      const ul = put('mk-ul ' + cls, x0 - 3, ln.bottom + 1)
      ul.style.width = Math.round(x1 - x0 + 6) + 'px'
    }
    if (it.insert) {
      const after = along(line, it.insert_after)
      insertAt(after ? xOn(ln, after[1]) : ln.right + 8, ln, it.insert, cls)
    }
    badge(ln, n, cls)
  }
  // what's missing altogether: a caret in the margin between the lines it goes between, its
  // number by what to add (the gap is too narrow for it beside the line's own numbers)
  for (const m of v.missing) {
    n++
    const above = m.after_line ? inkOf(m.after_line) : null
    const below = inkOf(m.after_line + 1)
    const ref = above ?? below
    if (!ref) continue
    const y = above && below ? (above.bottom + below.top) / 2 : above ? above.bottom + 20 : below.top - 20
    const x = Math.min(...[above, below].filter(Boolean).map(l => l.left))
    const { cls } = kindOf(m)
    put('mk-caret mk-gap ' + cls, x - 8, y - 4, [caret()])
    put('mk-insert mk-gap ' + cls, x + 12, y - 12, [markNum(n, cls), h('span', '', m.insert || m.what)])
  }
  return true
}
