// js/14-check-writing.js · Check my writing: Claude reads the pen work, you fix what it
// misread, then it checks the proof against the worked one
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- check my writing ----------
// The grader is the computer serving the arcade (serve.py + grader.py), on this computer or
// the tailnet: the GitHub Pages copy has none, so the button only shows once
// grade/ping answers. Reading and checking are two steps on purpose: a model that reads and
// grades at once tends to fix a mistake while reading it, then pass it. So it types out what
// you wrote, mistakes and all; you fix only its misreadings; then it checks, strictly,
// against the worked proof. Each mistake is marked on your page in the color of its kind
// (js/14c), and the worked proof shows under your page, What it should look like, with where
// yours went wrong underlined in it, the grade under that. It's a hint: I had it and I
// missed something still decide.

let grader = null // { ok, model } once the grader answers
async function graderPing() {
  try {
    const r = await fetch('grade/ping', { cache: 'no-store' })
    if (r.ok) {
      const j = await r.json()
      if (j.ok) grader = j
    }
  } catch {}
}

// Where the writing is on an ink canvas (the page's, or the Ask pad's), in its own pixels,
// with a margin; null when it's blank.
function inkBounds(src) {
  const W = src.width, H = src.height
  if (!W || !H) return null
  // find the writing on a small copy: any pixel with ink on it
  const k = Math.min(1, 480 / W)
  const sw = Math.max(1, Math.round(W * k)), sh = Math.max(1, Math.round(H * k))
  const small = document.createElement('canvas')
  small.width = sw
  small.height = sh
  const sctx = small.getContext('2d', { willReadFrequently: true })
  sctx.drawImage(src, 0, 0, sw, sh)
  const px = sctx.getImageData(0, 0, sw, sh).data
  let x0 = sw, y0 = sh, x1 = -1, y1 = -1
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    if (px[(y * sw + x) * 4 + 3] > 12) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x1 < 0) return null
  // back to full size, with a margin
  const pad = Math.round(24 * (W / (src.clientWidth || document.documentElement.clientWidth)))
  const left = Math.max(0, Math.floor(x0 / k) - pad), top = Math.max(0, Math.floor(y0 / k) - pad)
  return { left, top, w: Math.min(W, Math.ceil((x1 + 1) / k) + pad) - left, h: Math.min(H, Math.ceil((y1 + 1) / k) + pad) - top }
}

// The ink as pictures for the reader: the part of the canvas with writing on it, black on
// white, cut into strips that overlap (each at most about 1.3 times as tall as it is wide,
// 1800 px on its long edge, 8 at most).
function inkStrips(src = ink) {
  const b = inkBounds(src)
  if (!b) return []
  const { left, top, w, h } = b
  // black on white, at a size that keeps a strip within 1800 px
  const stripW = Math.min(w, Math.floor(1800 / 1.3))
  const scale = stripW / w
  let stripH = Math.round(stripW * 1.3)
  const fullH = Math.round(h * scale)
  const overlap = Math.round(stripH * 0.12)
  let n = fullH <= stripH ? 1 : Math.ceil((fullH - overlap) / (stripH - overlap))
  if (n > 8) {
    // too tall for 8 at that shape: taller strips (still within 1800 px), or a smaller page
    n = 8
    stripH = Math.min(1800, Math.ceil((fullH + overlap * 7) / 8))
  }
  const page = document.createElement('canvas')
  page.width = stripW
  page.height = fullH
  const pctx = page.getContext('2d')
  pctx.drawImage(src, left, top, w, h, 0, 0, stripW, fullH)
  pctx.globalCompositeOperation = 'source-in'
  pctx.fillStyle = '#000'
  pctx.fillRect(0, 0, stripW, fullH)
  pctx.globalCompositeOperation = 'destination-over'
  pctx.fillStyle = '#fff'
  pctx.fillRect(0, 0, stripW, fullH)
  if (n === 1) {
    const one = document.createElement('canvas')
    const s = Math.min(1, 1800 / Math.max(stripW, fullH))
    one.width = Math.round(stripW * s)
    one.height = Math.round(fullH * s)
    one.getContext('2d').drawImage(page, 0, 0, one.width, one.height)
    return [one.toDataURL('image/png')]
  }
  const step = (fullH - stripH) / (n - 1)
  const strips = []
  for (let i = 0; i < n; i++) {
    const y = Math.round(i * step)
    const hh = Math.min(stripH, fullH - y)
    const c = document.createElement('canvas')
    c.width = stripW
    c.height = hh
    c.getContext('2d').drawImage(page, 0, y, stripW, hh, 0, 0, stripW, hh)
    strips.push(c.toDataURL('image/png'))
  }
  return strips
}

// a proof's steps as plain text with TeX, a line per paragraph, for the grader
const stepsText = steps => {
  const paras = []
  for (const s of steps) {
    const bits = [s.lead, s.say, s.math && `\\[ ${s.math} \\]`, s.after].filter(Boolean).join(' ').replace(/\*/g, '')
    if (!paras.length || s.lead || s.para) paras.push(bits)
    else paras[paras.length - 1] += ' ' + bits
  }
  return paras.join('\n')
}
const questionText = p => p.ask + (p.note ? `\n(${p.note})` : '') + (p.given ? `\n\nThe proof given:\n${stepsText(p.given)}` : '')

// a line of what it read: math typeset, its marks as chips ([? a or b], [?], [crossed out: …])
function readLine(line, cls = 'read-line') {
  const el = h('div', cls)
  const re = /\[crossed out:\s*([^\]]*)\]|\[\?\s*([^\]]*)\]/g
  let at = 0
  let m
  const plain = s => el.append(...richNodes(s))
  while ((m = re.exec(line))) {
    if (m.index > at) plain(line.slice(at, m.index))
    if (m[1] !== undefined) el.append(h('span', 'crossed', m[1]))
    else el.append(h('span', 'unsure', m[2] ? '? ' + m[2] : '? unreadable'))
    at = re.lastIndex
  }
  if (at < line.length) plain(line.slice(at))
  if (!line.trim()) el.append(' ')
  return el
}

async function graderPost(route, body) {
  const r = await fetch('grade/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  let j = null
  try { j = await r.json() } catch {}
  if (!r.ok || !j || j.error) throw new Error(j?.error || (r.status === 404 ? 'The grader isn’t reachable from here.' : `The grader answered ${r.status}.`))
  return j
}

// The button, on pen mode's bottom row, and its panel under that row: Reading → What it
// read (fix it) → Checking → the verdict; on a failure, why, and Try again.
// hooks (js/12): lock() ends the writing as Show the work does (false if it already had);
// grade() is the I had it / I missed something pair.
function checkWriting(p, end, hooks = { lock: () => false, grade: () => h('span') }) {
  if (!grader) return
  const btn = h('button', 'btn ghost check-btn', 'Check my writing')
  btn.type = 'button'
  btn.title = 'Claude reads what you wrote, you fix what it misread, then it checks your proof'
  end.insertBefore(btn, end.lastChild)
  const panel = h('section', 'pen-review')
  panel.hidden = true
  panel.setAttribute('aria-live', 'polite')
  end.after(panel)
  let timer = 0
  let token = 0 // a newer step makes an older answer stale
  let written = ''
  const head = (label, right) => {
    const row = h('div', 'pr-head')
    row.append(h('span', 'eyebrow', label))
    if (right) row.append(right)
    return row
  }
  let locked = false // a verdict here ended the writing
  const WORDS = { right: 'Right', almost: 'Almost', wrong: 'Wrong', unfinished: 'Unfinished' }
  const gradeRow = () => {
    const row = h('div', 'row-actions')
    row.append(hooks.grade())
    return row
  }
  const show = (v, ...kids) => {
    clearInterval(timer)
    // a talk and the marks are about one verdict: reading or checking again ends them
    closeAsk()
    clearMarks()
    panel.hidden = false
    panel.dataset.v = v || ''
    panel.classList.toggle('done', v in WORDS)
    panel.replaceChildren(...kids)
    // once a verdict has ended the writing, grading yourself is always at hand
    if (locked && !(v in WORDS)) panel.append(gradeRow())
  }
  const working = (what, line) => {
    const secs = h('span', 'timer', '0 s')
    const t0 = performance.now()
    show('', head('Check my writing', secs), h('p', 'working', what), h('div', 'sweep'), h('p', 'sub', line))
    timer = setInterval(() => (secs.textContent = Math.floor((performance.now() - t0) / 1000) + ' s'), 250)
    panel.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' })
  }
  const failed = (message, again) => {
    const retry = h('button', 'btn small', 'Try again')
    retry.type = 'button'
    retry.addEventListener('click', again)
    const row = h('div', 'row')
    row.append(retry)
    show('error', head('Check my writing'), h('p', 'err-title', message), row)
  }
  const busy = on => (btn.disabled = on)

  async function read() {
    const me = ++token
    const images = inkStrips()
    if (!images.length) {
      show('error', head('Check my writing'), h('p', 'err-title', 'There’s no writing on the page yet. Write your proof with the pen first.'))
      return
    }
    busy(true)
    working('Reading your writing…', 'It types out what you wrote, mistakes and all. Nothing is checked yet.')
    try {
      const { text } = await graderPost('read', { images, question: questionText(p) })
      if (me !== token || !panel.isConnected) return
      written = text === '[no writing]' ? '' : text
      edit()
    } catch (e) {
      if (me === token && panel.isConnected) failed(e.message, read)
    } finally {
      if (me === token) busy(false)
    }
  }

  function edit() {
    const box = h('textarea', 'read-box')
    box.id = 'read-box'
    box.spellcheck = false
    box.value = written
    box.rows = Math.max(4, written.split('\n').length + 1)
    box.setAttribute('aria-label', 'What it read, one line per line of your page')
    const preview = h('div', 'preview')
    const legend = h('p', 'legend')
    const draw = () => {
      written = box.value
      preview.replaceChildren(...written.split('\n').map(l => readLine(l)))
      legend.hidden = !/\[\?|\[crossed out:/.test(written)
    }
    let soon = 0
    box.addEventListener('input', () => {
      clearTimeout(soon)
      soon = setTimeout(draw, 200)
    })
    legend.append('Its marks: ', h('span', 'unsure', '? a or b'), ' it couldn’t tell which, ', h('span', 'unsure', '? unreadable'), ' it couldn’t read it, ', h('span', 'crossed', 'crossed out'), ' work you crossed out. Change a mark to what you wrote.')
    const go = h('button', 'btn small', 'Check it')
    go.type = 'button'
    go.addEventListener('click', () => (written.trim() ? check() : box.focus()))
    const again = h('button', 'btn ghost small', 'Read it again')
    again.type = 'button'
    again.addEventListener('click', read)
    const row = h('div', 'row')
    row.append(go, again)
    show('', head('What it read'), h('p', 'fixnote', 'Fix only what it misread, not your math.'), box, h('span', 'lbl-s', 'Preview'), preview, legend, row)
    draw()
  }

  async function check() {
    const me = ++token
    busy(true)
    working('Checking it against the worked proof…', 'Strict, like the test. It points to the first mistake, never the answer.')
    try {
      const v = await graderPost('check', { question: questionText(p), reference: stepsText(p.lines), written })
      if (me !== token || !panel.isConnected) return
      verdict(v)
    } catch (e) {
      if (me === token && panel.isConnected) failed(e.message, check)
    } finally {
      if (me === token) busy(false)
    }
  }

  // The verdict: the worked proof, What it should look like, with where yours went wrong
  // underlined in it; under it the grade (the stamp, the score, then each mistake in a line,
  // grouped by kind and numbered like the marks on your page); then grading yourself.
  function verdict(v) {
    // the writing is done: the worked proof shows here, so one shown below by Show the work goes
    locked = hooks.lock() || locked
    view.querySelectorAll('.sheet > .proof-player').forEach(w => w.remove())
    // every mistake, numbered in page order as the marks are (js/14c)
    const all = [
      ...v.issues.map(it => ({ ...it, where: it.line_no ? `Line ${it.line_no}` : '', text: it.problem })),
      ...v.missing.map(m => ({ ...m, where: m.after_line ? `Missing after line ${m.after_line}` : 'Missing at the start', text: m.what, line: '' })),
    ].map((it, i) => ({ ...it, n: i + 1, k: kindOf(it) }))
    const work = proofPlayer(p, { title: 'What it should look like', fixes: all.filter(f => f.fix).map(f => ({ n: f.n, cls: f.k.cls, fix: f.fix })) })

    const grade = h('section', 'grade')
    const top = h('div', 'verdict-top')
    const score = h('span', 'score')
    score.append('Rubric ', h('b', '', `${v.score} / 4`))
    top.append(h('span', 'stamp', WORDS[v.verdict]), score)
    grade.append(head('Check my writing · a hint, not a grade'), top, h('p', 'summary', v.summary))
    const kinds = Object.values(MISTAKE_KINDS).map(k => [k, all.filter(f => f.k === k)]).filter(([, fs]) => fs.length)
    if (kinds.length) {
      const tally = h('div', 'kinds')
      for (const [k, fs] of kinds) tally.append(h('span', 'kind ' + k.cls, `${fs.length} ${k.name.toLowerCase()}`))
      grade.append(tally)
    }
    for (const [k, fs] of kinds) {
      const group = h('div', 'kind-group ' + k.cls)
      const name = h('div', 'kind-head', k.name)
      name.append(h('small', '', k.says))
      const ol = h('ol', 'fixes')
      for (const f of fs) {
        const text = h('span', 'fix-text', f.text)
        if (f.where) text.prepend(h('span', 'where', f.where))
        f.li = h('li')
        f.li.append(markNum(f.n, k.cls), text)
        ol.append(f.li)
      }
      group.append(name, ol)
      grade.append(group)
    }

    // Ask about it: a tutor pops up to answer questions about this check, written with the pen (js/14b)
    const talk = askTalk(p, written, v)
    const ask = h('button', 'btn small', 'Ask about it')
    ask.type = 'button'
    ask.title = 'Write a question about your proof with the pen, and Claude answers it'
    ask.addEventListener('click', () => openAsk(talk))
    const fix = h('button', 'btn ghost small', 'Change what it read')
    fix.type = 'button'
    fix.addEventListener('click', edit)
    const row = h('div', 'row')
    row.append(ask, fix)
    grade.append(row)
    show(v.verdict, work, grade, gradeRow())
    // the same mistakes marked on your page, in their colors (js/14c)
    if (all.length) {
      if (drawMarks(v, written)) {
        const shown = h('button', 'btn ghost small', 'Hide marks')
        shown.type = 'button'
        shown.addEventListener('click', () => {
          marks.hidden = !marks.hidden
          shown.textContent = marks.hidden ? 'Show marks' : 'Hide marks'
        })
        row.append(shown)
      } else {
        // no marks on the page, so each line says which line of yours it means
        grade.querySelector('.kind-group')?.before(h('p', 'sub', 'The marks couldn’t be lined up with your writing, so they’re only listed here.'))
        for (const f of all) if (f.line) f.li.append(readLine(f.line, 'said'))
      }
    }
    panel.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
  }

  btn.addEventListener('click', read)
}
