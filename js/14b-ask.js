// js/14b-ask.js · Ask about it: after Check my writing, a tutor pops up and you ask it what
// you did wrong, writing the question with the pen
// Loaded in order by index.html as a classic script: top-level names are shared with the other js/ files.
// ---------- ask about it ----------
// The questions are handwritten, like the proof: you write one on the pop-up's own lined
// pad, Claude reads it (what it read shows under your writing, so a misreading is plain)
// and answers it knowing the question, the worked proof, what you wrote and what the check
// said. A talk is about one verdict: closing the pop-up keeps it; reading or checking
// again, or a new screen, ends it.

let askShown = null // the talk on screen

const askTalk = (p, written, review) => ({ p, written, review, turns: [], sheet: null })

function closeAsk() {
  askShown?.sheet.remove()
  askShown = null
  document.body.classList.remove('asking')
}
function openAsk(talk) {
  if (askShown === talk) return
  closeAsk()
  talk.sheet ??= askSheet(talk)
  document.body.append(talk.sheet)
  document.body.classList.add('asking')
  askShown = talk
  const thread = talk.sheet.querySelector('.ask-thread')
  thread.scrollTop = thread.scrollHeight
}
addEventListener('keydown', e => {
  if (e.key === 'Escape' && askShown) closeAsk()
})

// a message in the thread: the tutor's, yours, or a failure; paragraphs on their own lines
function askSaid(who, text) {
  const el = h('div', 'ask-msg ' + who)
  if (text) el.append(...text.replace(/\*\*/g, '').split(/\n+/).filter(s => s.trim()).map(s => h('p', '', s)))
  return el
}

// The pad: a lined box the pen writes on, with an ink of its own (the page's skips the
// pop-up, js/05). Only a pen or a mouse writes; the side button, the eraser end or Eraser
// rubs out. changed(has) says when it goes from blank to written and back.
function askPad(canvas, changed) {
  const ctx = canvas.getContext('2d')
  let erasing = false
  let stroke = null // { id, last, pts, erase }
  let used = false
  const dpr = () => window.devicePixelRatio || 1
  // to its size on screen, keeping what's written (rotation); off screen, left alone
  const size = () => {
    const w = canvas.clientWidth, hh = canvas.clientHeight
    const d = dpr()
    if (!w || !hh || (canvas.width === Math.round(w * d) && canvas.height === Math.round(hh * d))) return
    const snap = document.createElement('canvas')
    snap.width = canvas.width
    snap.height = canvas.height
    snap.getContext('2d').drawImage(canvas, 0, 0)
    canvas.width = Math.round(w * d)
    canvas.height = Math.round(hh * d)
    ctx.setTransform(d, 0, 0, d, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (used) ctx.drawImage(snap, 0, 0, snap.width / d, snap.height / d)
  }
  new ResizeObserver(size).observe(canvas)
  const at = e => {
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const line = (a, b, erase, pressure) => {
    ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
    ctx.strokeStyle = penColor()
    ctx.lineWidth = erase ? 22 : pressure > 0 ? 0.6 + pressure * 3 : 2
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
  canvas.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return
    e.preventDefault()
    try { canvas.setPointerCapture(e.pointerId) } catch {}
    const pt = at(e)
    // a right click just before the pen touched means the side button is down (js/05)
    stroke = { id: e.pointerId, last: pt, pts: [pt], erase: erasing || sideButton(e) || Date.now() - heldAt < 700 }
  })
  canvas.addEventListener('pointermove', e => {
    if (!stroke || e.pointerId !== stroke.id) return
    e.preventDefault()
    const pt = at(e)
    const erase = stroke.erase || erasing || (e.buttons & 34) !== 0
    line(stroke.last, pt, erase, e.pressure)
    stroke.last = pt
    stroke.pts.push(pt)
    if (!erase && !used) {
      used = true
      changed(true)
    }
  })
  // the side button as a right click mid-stroke (Chrome): the whole stroke was an erase
  canvas.addEventListener('contextmenu', () => {
    if (!stroke || stroke.erase) return
    stroke.erase = true
    for (let i = 1; i < stroke.pts.length; i++) line(stroke.pts[i - 1], stroke.pts[i], true)
  })
  const up = () => (stroke = null)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  return {
    clear() {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      used = false
      changed(false)
    },
    eraser(on) {
      erasing = on
    },
    // what's written: pictures for the reader (js/14) and a copy of the ink, cut to the
    // writing, for the thread; null when it's blank
    take() {
      const b = inkBounds(canvas)
      if (!b) return null
      const look = document.createElement('canvas')
      look.width = b.w
      look.height = b.h
      look.getContext('2d').drawImage(canvas, b.left, b.top, b.w, b.h, 0, 0, b.w, b.h)
      return { images: inkStrips(canvas), look: look.toDataURL('image/png'), width: b.w / dpr() }
    },
  }
}

// The pop-up: the talk so far, the pad, and Ask, Eraser, Clear under it
function askSheet(talk) {
  const sheet = h('section', 'ask-sheet')
  sheet.setAttribute('role', 'dialog')
  sheet.setAttribute('aria-label', 'Ask about your proof')
  const close = h('button', 'ink-clear', 'Close')
  close.type = 'button'
  close.addEventListener('click', closeAsk)
  const head = h('div', 'ask-head')
  head.append(h('span', 'eyebrow', 'Ask about it'), close)
  const thread = h('div', 'ask-thread')
  thread.setAttribute('aria-live', 'polite')
  thread.append(askSaid('tutor', 'Write a question with the pen, like “Why is my second line wrong?”, then tap Ask. I can see your proof and what the check said.'))
  const box = h('div', 'ask-pad')
  const hint = h('p', 'ask-hint', 'Write your question here')
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-label', 'Write your question here with the pen')
  box.append(hint, canvas)
  const pad = askPad(canvas, has => {
    hint.hidden = has
    hint.textContent = 'Write your question here'
  })
  const send = h('button', 'btn small', 'Ask')
  send.type = 'button'
  const rub = h('button', 'ink-clear', 'Eraser')
  rub.type = 'button'
  rub.setAttribute('aria-pressed', 'false')
  rub.addEventListener('click', () => {
    const on = rub.getAttribute('aria-pressed') !== 'true'
    rub.setAttribute('aria-pressed', String(on))
    pad.eraser(on)
  })
  const wipe = h('button', 'ink-clear', 'Clear')
  wipe.type = 'button'
  wipe.addEventListener('click', () => pad.clear())
  const row = h('div', 'ask-row')
  row.append(send, rub, wipe)
  sheet.append(head, thread, box, row)

  const down = () => (thread.scrollTop = thread.scrollHeight)
  let busy = false
  async function ask(q) {
    busy = true
    send.disabled = true
    const mine = askSaid('you')
    const img = document.createElement('img')
    img.className = 'ask-writing'
    img.src = q.look
    img.alt = 'Your handwritten question'
    img.style.maxWidth = `min(100%, ${q.width}px)`
    mine.append(img)
    const wait = askSaid('tutor')
    const secs = h('span', 'timer', '0 s')
    const top = h('div', 'pr-head')
    top.append(h('span', 'working', 'Reading your question…'), secs)
    wait.append(top, h('div', 'sweep'))
    const t0 = performance.now()
    const timer = setInterval(() => (secs.textContent = Math.floor((performance.now() - t0) / 1000) + ' s'), 250)
    thread.append(mine, wait)
    down()
    try {
      const a = await graderPost('ask', {
        question: questionText(talk.p), reference: stepsText(talk.p.lines), written: talk.written,
        review: talk.review, history: talk.turns.slice(-8), images: q.images,
      })
      const heard = h('div', 'ask-heard')
      heard.append(h('span', 'lbl-s', 'Read as'), readLine(a.heard || '[?]', 'heard-line'))
      mine.append(heard)
      const reply = askSaid('tutor', a.answer)
      wait.replaceWith(reply)
      talk.turns.push({ asked: a.heard || '[?]', answer: a.answer })
      // read it from the top: your question, then the answer, a few lines of it at least
      thread.scrollTop = Math.max(mine.offsetTop - 8, reply.offsetTop + 120 - thread.clientHeight)
    } catch (e) {
      const err = askSaid('error', e.message)
      const again = h('button', 'btn small', 'Try again')
      again.type = 'button'
      again.addEventListener('click', () => {
        if (busy) return
        mine.remove()
        err.remove()
        ask(q)
      })
      err.append(again)
      wait.replaceWith(err)
      down()
    } finally {
      clearInterval(timer)
      busy = false
      send.disabled = false
    }
  }
  send.addEventListener('click', () => {
    if (busy) return
    const q = pad.take()
    if (!q) {
      hint.textContent = 'Write your question here first, with the pen'
      hint.hidden = false
      return
    }
    pad.clear()
    ask(q)
  })
  return sheet
}
