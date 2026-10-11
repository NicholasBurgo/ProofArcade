# grader.py · Check my writing: Claude reads the pen work, then checks it against the
# worked proof. serve.py hands it every /grade/ request.
#   GET  /grade/ping   -> {ok, model}                      (the page shows its button only then)
#   POST /grade/read   {images, question} -> {text}        (type the writing out, mistakes and all)
#   POST /grade/check  {question, reference, written}      (strict, against the worked proof)
#                      -> {verdict, score, summary, issues: [{line_no, line, part, problem, nudge,
#                          insert, insert_after, kind, fix}], missing: [{what, after_line, insert, kind, fix}]}
#                      (where each mistake is on the page, its kind, and the worked answer's words for it)
#   POST /grade/ask    {images, question, reference, written, review, history} -> {heard, answer}
#                      (a question about the checked proof, written by hand; the tutor answers)
# Reading and checking are two calls on purpose: a model that reads and grades at once tends
# to fix a mistake while reading it, then pass it. In between, the student fixes only what
# was misread. Every call runs the Claude Code CLI on a subscription, the personal one under
# CONFIG_DIR once it's signed in (no API key, no cost per check), with every tool off, in an
# empty folder.
# Only this computer and the tailnet may use these routes; anyone else gets a 404, as if they
# weren't there. The static pages stay open as before.
import base64
import binascii
import ipaddress
import json
import os
import subprocess
import tempfile
import threading
import time

MODEL = 'sonnet'
# the personal sign-in, kept apart from the work one plain `claude` uses on this computer:
#   CLAUDE_CONFIG_DIR=~/.claude-personal claude auth login
# Until that sign-in exists, checks run on the work login.
CONFIG_DIR = os.path.expanduser('~/.claude-personal')
# this computer and the tailnet: the tablet reaches it over Tailscale, at home or away
ALLOWED = [ipaddress.ip_network(n) for n in ('127.0.0.0/8', '::1/128', '100.64.0.0/10', 'fd7a:115c:a1e0::/48')]
RUNS = threading.BoundedSemaphore(2)  # at most two runs at a time
TIMEOUT = 300  # seconds, per run
MAX_BODY = 24 * 1024 * 1024  # eight strips of PNG, as data URLs
MAX_IMAGES = 8
MAX_IMAGE = 4 * 1024 * 1024  # bytes, each, decoded
MAX_TEXT = 20000  # characters, each text field

READ_PROMPT = """You type out a student's handwritten work, exactly as written, from pictures of a tablet page.

Rules:
- Copy every line exactly as written, mistakes and all. Never fix, finish or tidy anything: a wrong sign, a wrong letter, a missing step or a misspelled word stays as it is.
- One line of the page per line of output, top to bottom.
- Write math as \\( LaTeX \\) inside the line, for example: Then \\(x = 2k + 1\\) for some integer \\(k\\). Write words as words.
- Work that is crossed out: [crossed out: what it said].
- A symbol that could be read two ways: [? a or b], for example [? 7 or 1]. A symbol you can't read at all: [?].
- Never pick the reading that makes the math come out right. If a symbol is unclear, mark it.
- The page comes in strips, top to bottom, and the strips overlap: copy a line that shows in two strips once.
- The question is given only to help tell symbols apart. Don't copy it, and don't use it to correct the student.
- Output only the lines: no comments, headings or code fences. If there is no writing, output [no writing]."""

CHECK_PROMPT = """You check a student's handwritten proof for Math 2230, an intro-to-proofs course (Chartrand, Polimeni and Zhang, Mathematical Proofs). It was typed out from their handwriting and the student fixed only misreadings, so treat it as exactly what they wrote. You get the question, the question's own worked answer, and what the student wrote.

Be strict but fair, like the professor grading a test:
- Any correct method counts: a direct proof where the worked answer uses the contrapositive, other letters, other wording, equivalent algebra. Don't mark down for not matching the worked answer word for word.
- These cost points: starting from the wrong hypothesis, or proving the converse; checking examples instead of proving; the same letter for two different integers; a definition used without saying the new letter is an integer ("for some integer k"); concluding even or odd without naming the integer that makes it so; only one direction of an if and only if; cases that don't cover everything; "without loss of generality" when the cases aren't alike; using a result as strong as the one being proved; an algebra slip; no conclusion; a step the question needs that is skipped.
- For a question that hands over a proof to read (which result it proves, or evaluate it): the result must be stated as an implication with its hypothesis (not the conclusion alone, not the converse), and an evaluation must say whether it is a proof and point to the step that fails.
- Lines marked [?] couldn't be read: treat them as unreadable, not wrong, and say so if it matters.
- Don't be generous: an argument with a gap is not right.

Give:
- verdict: right (complete and correct), almost (correct, with a small gap that is quick to fix), wrong (a logical error, or the wrong statement proved), unfinished (it stops before the end, or most of it is missing).
- score, on this rubric: 4 complete and correct, and readable; 3 nearly complete, with a gap that is quick to fix, or correct but hard to follow; 2 a correct outline with major holes; 1 some relevant steps but no workable plan, or a shortcut that makes it trivial (examples, the converse); 0 nothing toward a proof.
- summary: one or two sentences on how it went.
- issues: the mistakes in order, first one first, at most four. Their lines come numbered (3| …); the number isn't part of the line. For each:
  - line_no: the number of the line it is on; line: that line, quoted exactly, without its number;
  - part: the exact words of that line that are wrong, copied character for character, as few as show it ("" if it's the whole line, or if the mistake is only something left out);
  - problem: one sentence on what is wrong; nudge: one sentence toward fixing it, a question or a hint;
  - insert: when the fix is to add something at a spot in that line, what to add, at most six words (e.g. for some integer \\(k\\)); otherwise "";
  - insert_after: the exact words of the line right before where the insert goes ("" for the end of the line);
  - kind: definition (a definition used without all it says, e.g. no "for some integer k", or the wrong form), algebra (a slip in the arithmetic or algebra), reason (a step or conclusion without its why, e.g. "is even" without naming the integer, or a step that doesn't follow), structure (the wrong thing proved, the converse, examples instead of a proof, a missing case or direction);
  - fix: the words of ITS WORKED ANSWER that show how this part should be, copied character for character from it, TeX included (e.g. for some integer \\(k\\), or 18k + 14 from inside an equation), as few as show it; "" if the worked answer has nothing to point to.
  The page gets marked like a teacher's pen: part is underlined, insert is written at a caret, each in the color of its kind. Never write out the correct proof or the fixed line: an insert is a hint of what goes there, never a whole sentence of the proof.
- missing: what the proof needs that isn't there at all (a conclusion, the second direction, a case), without repeating an issue. For each: what (a short phrase), after_line (the number of the line it belongs after, 0 for before the first line), insert (at most six words to write there as a hint, or ""), kind and fix (as above). Empty if nothing is.
Write to the student, as "you" ("You proved the converse"), not about them. Put math in your sentences inside \\( \\), in the course's notation."""

KINDS = ['definition', 'algebra', 'reason', 'structure']  # the kinds of mistake, each its own color on the page

CHECK_SCHEMA = {
    'type': 'object',
    'properties': {
        'verdict': {'type': 'string', 'enum': ['right', 'almost', 'wrong', 'unfinished']},
        'score': {'type': 'integer', 'minimum': 0, 'maximum': 4},
        'summary': {'type': 'string'},
        'issues': {'type': 'array', 'maxItems': 4, 'items': {
            'type': 'object',
            'properties': {
                'line_no': {'type': 'integer', 'minimum': 1}, 'line': {'type': 'string'}, 'part': {'type': 'string'},
                'problem': {'type': 'string'}, 'nudge': {'type': 'string'},
                'insert': {'type': 'string'}, 'insert_after': {'type': 'string'},
                'kind': {'type': 'string', 'enum': KINDS}, 'fix': {'type': 'string'},
            },
            'required': ['line_no', 'line', 'part', 'problem', 'nudge', 'insert', 'insert_after', 'kind', 'fix'],
            'additionalProperties': False,
        }},
        'missing': {'type': 'array', 'items': {
            'type': 'object',
            'properties': {
                'what': {'type': 'string'}, 'after_line': {'type': 'integer', 'minimum': 0}, 'insert': {'type': 'string'},
                'kind': {'type': 'string', 'enum': KINDS}, 'fix': {'type': 'string'},
            },
            'required': ['what', 'after_line', 'insert', 'kind', 'fix'],
            'additionalProperties': False,
        }},
    },
    'required': ['verdict', 'score', 'summary', 'issues', 'missing'],
    'additionalProperties': False,
}


ASK_PROMPT = """You tutor a student in Math 2230, an intro-to-proofs course (Chartrand, Polimeni and Zhang, Mathematical Proofs). They wrote a proof by hand, it was typed out (they fixed only misreadings), and a checker marked it. Now they ask you about it, writing on a tablet with a pen: you get a picture of their handwritten question, along with the question they were proving, its worked answer, what they wrote, the checker's marks and the conversation so far.

First read their question: heard is what they wrote, word for word, with math as \\( LaTeX \\). A word you can't make out: [?].

Then answer it, like a patient TA in office hours:
- Answer what they asked, to them, as "you". Two to five sentences, about 120 words at most, unless they ask for more.
- When they ask what they did wrong, quote their own line, say why it doesn't work in plain words, and give the idea that fixes it.
- Help them see it rather than handing it over: the idea, a hint, a question that gets them there. If they ask straight out for the fixed line or the whole proof, you may show it, briefly.
- Be honest: if the checker was wrong or too harsh, say so; never invent a mistake. Any correct method counts.
- If there's no question in the picture, or you can't read it, say so and ask them to write it again.
- Plain sentences: no markdown, no headings, no bullets, no bold. A blank line between paragraphs. Math inside \\( \\), in the course's notation."""

ASK_SCHEMA = {
    'type': 'object',
    'properties': {'heard': {'type': 'string'}, 'answer': {'type': 'string'}},
    'required': ['heard', 'answer'],
    'additionalProperties': False,
}


class GradeError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


def allowed(address):
    """This computer (127.0.0.0/8, ::1) or the tailnet (100.64.0.0/10, fd7a:115c:a1e0::/48)."""
    try:
        ip = ipaddress.ip_address(address.split('%', 1)[0])
    except ValueError:
        return False
    if getattr(ip, 'ipv4_mapped', None):
        ip = ip.ipv4_mapped
    return any(ip in net for net in ALLOWED)


def same_origin(origin, host):
    """A POST must come from a page this server served: its Origin is this Host."""
    return bool(origin and host) and origin in (f'http://{host}', f'https://{host}')


def plain_error(text):
    """What the CLI said, as a sentence someone can act on."""
    low = (text or '').lower()
    if any(w in low for w in ('not logged in', 'please run /login', 'login', 'authentication', 'invalid api key', 'oauth')):
        return 'Claude isn’t signed in on the computer running the arcade. Run CLAUDE_CONFIG_DIR=~/.claude-personal claude auth login there, then try again.'
    if any(w in low for w in ('usage limit', 'rate limit', 'limit reached', 'reached your', 'quota')):
        return 'Your Claude usage limit is reached. Checking works again when it resets; until then, tap Show the work and compare it yourself.'
    first = next((l.strip() for l in (text or '').splitlines() if l.strip()), 'no reason given')
    return f'Claude couldn’t do it: {first[:200]}'


def run_claude(label, system, content, schema=None, effort='low'):
    """One run of the CLI: the system prompt, one user message (pictures and text), maybe a
    JSON schema. Returns the result event."""
    args = ['claude', '-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose',
            '--model', MODEL, '--effort', effort, '--tools', '', '--safe-mode', '--strict-mcp-config',
            '--no-session-persistence', '--system-prompt', system]
    if schema:
        args += ['--json-schema', json.dumps(schema)]
    # always a subscription: no key or token in the child's environment to override the sign-in
    env = {k: v for k, v in os.environ.items()
           if k not in ('ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN')}
    if os.path.exists(os.path.join(CONFIG_DIR, '.credentials.json')):
        env['CLAUDE_CONFIG_DIR'] = CONFIG_DIR
    line = json.dumps({'type': 'user', 'message': {'role': 'user', 'content': content}})
    if not RUNS.acquire(timeout=30):
        raise GradeError(503, 'Two checks are already running. Try again in a moment.')
    started = time.monotonic()
    try:
        with tempfile.TemporaryDirectory(prefix='grade-') as cwd:
            done = subprocess.run(args, input=line + '\n', capture_output=True, text=True, timeout=TIMEOUT, cwd=cwd, env=env)
    except subprocess.TimeoutExpired:
        raise GradeError(504, 'It took more than 5 minutes, so it was stopped. Try again.')
    except FileNotFoundError:
        raise GradeError(500, 'Claude Code isn’t installed on the computer running the arcade.')
    finally:
        RUNS.release()
    result = None
    for raw in done.stdout.splitlines():
        try:
            event = json.loads(raw)
        except ValueError:
            continue
        if event.get('type') == 'result':
            result = event
    seconds = time.monotonic() - started
    if result is None:
        print(f'[grade] {label}: failed after {seconds:.1f} s: {(done.stderr or done.stdout)[-300:]!r}', flush=True)
        raise GradeError(502, plain_error(done.stderr or done.stdout))
    usage = result.get('usage') or {}
    print(f'[grade] {label}: {seconds:.1f} s (model {result.get("duration_ms", 0) / 1000:.1f} s), '
          f'tokens in {usage.get("input_tokens", 0)} + cache {usage.get("cache_read_input_tokens", 0) + usage.get("cache_creation_input_tokens", 0)}, '
          f'out {usage.get("output_tokens", 0)}' + (' · error' if result.get('is_error') else ''), flush=True)
    if result.get('is_error'):
        raise GradeError(502, plain_error(str(result.get('result') or result.get('subtype') or '')))
    return result


def text_field(body, key, required=True):
    value = body.get(key, '')
    if not isinstance(value, str) or (required and not value.strip()):
        raise GradeError(400, f'Missing {key}.')
    if len(value) > MAX_TEXT:
        raise GradeError(413, f'The {key} is too long.')
    return value


def pictures(body):
    """The body's images (PNG data URLs) as image blocks for the CLI."""
    images = body.get('images')
    if not isinstance(images, list) or not 1 <= len(images) <= MAX_IMAGES:
        raise GradeError(400, f'Send 1 to {MAX_IMAGES} pictures of the page.')
    content = []
    for url in images:
        prefix = 'data:image/png;base64,'
        if not isinstance(url, str) or not url.startswith(prefix):
            raise GradeError(400, 'The pictures must be PNG data URLs.')
        data = url[len(prefix):]
        try:
            size = len(base64.b64decode(data, validate=True))
        except (binascii.Error, ValueError):
            raise GradeError(400, 'A picture is not valid base64.')
        if size > MAX_IMAGE:
            raise GradeError(413, 'A picture is too big.')
        content.append({'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/png', 'data': data}})
    return content


def read(body):
    images = body.get('images')
    content = pictures(body)
    question = text_field(body, 'question', required=False)
    content.append({'type': 'text', 'text': (
        f'The question, only to help tell symbols apart:\n{question}\n\n'
        f'The page is in {len(images)} strip{"s" if len(images) > 1 else ""}, top to bottom' + (', overlapping' if len(images) > 1 else '') +
        '. Type out what is written.')})
    result = run_claude(f'read {len(images)} strip{"s" if len(images) > 1 else ""}', READ_PROMPT, content, effort='low')
    text = str(result.get('result') or '').strip()
    if text.startswith('```'):
        text = text.strip('`').split('\n', 1)[-1].rsplit('\n', 1)[0] if '\n' in text else ''
    return {'text': text}


def check(body):
    question = text_field(body, 'question')
    reference = text_field(body, 'reference')
    written = text_field(body, 'written')
    # numbered, so a mistake can say which line of the page it is on
    numbered = '\n'.join(f'{n}| {l}' for n, l in enumerate(written.split('\n'), 1))
    content = [{'type': 'text', 'text': (
        f'THE QUESTION\n{question}\n\n'
        f'ITS WORKED ANSWER (any correct method counts)\n{reference}\n\n'
        f'WHAT THE STUDENT WROTE (one line per line of their page, numbered)\n{numbered}')}]
    result = run_claude('check', CHECK_PROMPT, content, schema=CHECK_SCHEMA, effort='medium')
    out = result.get('structured_output')
    if not isinstance(out, dict) or out.get('verdict') not in ('right', 'almost', 'wrong', 'unfinished'):
        raise GradeError(502, 'Claude’s answer came back in the wrong shape. Try again.')
    return {
        'verdict': out['verdict'],
        'score': max(0, min(4, int(out.get('score', 0)))),
        'summary': str(out.get('summary', '')),
        'issues': [{
            **{k: str(i.get(k, '')) for k in ('line', 'part', 'problem', 'nudge', 'insert', 'insert_after', 'fix')},
            'line_no': whole(i.get('line_no')), 'kind': kind(i.get('kind')),
        } for i in out.get('issues', [])[:4] if isinstance(i, dict)],
        'missing': [{
            **{k: str(m.get(k, '')) for k in ('what', 'insert', 'fix')},
            'after_line': whole(m.get('after_line')), 'kind': kind(m.get('kind')),
        } for m in out.get('missing', []) if isinstance(m, dict) and str(m.get('what', '')).strip()],
    }


def kind(k):
    """A kind of mistake from the model; reason when it gave none we know."""
    return k if k in KINDS else 'reason'


def whole(n):
    """A line number from the model: a whole number, 0 when it gave none."""
    try:
        return max(0, int(n))
    except (TypeError, ValueError):
        return 0


def review_text(review):
    """The checker's marks (what /grade/check answered), as lines for the tutor."""
    if not isinstance(review, dict):
        raise GradeError(400, 'Missing review.')
    lines = [f'{review.get("verdict")}, rubric {review.get("score")} / 4. {review.get("summary", "")}']
    for n, it in enumerate(i for i in review.get('issues') or [] if isinstance(i, dict)):
        lines.append(f'Mistake {n + 1}, their line "{it.get("line", "")}": {it.get("problem", "")} Nudge given: {it.get("nudge", "")}')
    missing = [str(m.get('what', '')) if isinstance(m, dict) else str(m) for m in review.get('missing') or []]
    if missing:
        lines.append('Missing: ' + '; '.join(missing))
    text = '\n'.join(lines)
    if len(text) > MAX_TEXT:
        raise GradeError(413, 'The review is too long.')
    return text


def ask(body):
    question = text_field(body, 'question')
    reference = text_field(body, 'reference')
    written = text_field(body, 'written')
    review = review_text(body.get('review'))
    history = body.get('history') or []
    if not isinstance(history, list) or len(history) > 12:
        raise GradeError(400, 'The conversation is too long. Close it and check again to start over.')
    said = []
    for turn in history:
        if not isinstance(turn, dict):
            raise GradeError(400, 'The conversation is garbled.')
        said.append(f'Student: {text_field(turn, "asked")}\nYou: {text_field(turn, "answer")}')
    content = [{'type': 'text', 'text': (
        f'THE QUESTION\n{question}\n\n'
        f'ITS WORKED ANSWER (any correct method counts)\n{reference}\n\n'
        f'WHAT THE STUDENT WROTE (one line per line of their page)\n{written}\n\n'
        f'THE CHECKER\'S MARKS\n{review}\n\n'
        f'THE CONVERSATION SO FAR\n{chr(10).join(said) or "(none yet)"}\n\n'
        'Their new question, handwritten:')}]
    content += pictures(body)
    result = run_claude('ask', ASK_PROMPT, content, schema=ASK_SCHEMA, effort='medium')
    out = result.get('structured_output')
    if not isinstance(out, dict) or not str(out.get('answer', '')).strip():
        raise GradeError(502, 'Claude’s answer came back in the wrong shape. Try again.')
    return {'heard': str(out.get('heard', '')), 'answer': str(out['answer'])}


def reply(handler, status, data):
    body = json.dumps(data).encode()
    handler.send_response(status)
    handler.send_header('Content-Type', 'application/json')
    handler.send_header('Cache-Control', 'no-store')
    handler.send_header('Content-Length', str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def handle(handler, method):
    """A /grade/ request, from serve.py."""
    path = handler.path.split('?', 1)[0]
    # anyone outside this computer and the tailnet: no such page
    if not allowed(handler.client_address[0]):
        return handler.send_error(404)
    if method == 'GET' and path == '/grade/ping':
        return reply(handler, 200, {'ok': True, 'model': MODEL})
    routes = {'/grade/read': read, '/grade/check': check, '/grade/ask': ask}
    if method != 'POST' or path not in routes:
        return handler.send_error(404)
    # only from a page this server served, and only JSON
    if not same_origin(handler.headers.get('Origin'), handler.headers.get('Host')):
        return handler.send_error(404)
    if not (handler.headers.get('Content-Type') or '').split(';', 1)[0].strip().lower() == 'application/json':
        return reply(handler, 415, {'error': 'Send JSON.'})
    try:
        length = int(handler.headers.get('Content-Length') or 0)
    except ValueError:
        length = 0
    if not 0 < length <= MAX_BODY:
        return reply(handler, 413, {'error': 'The request is empty or too big.'})
    try:
        body = json.loads(handler.rfile.read(length))
        if not isinstance(body, dict):
            raise ValueError
    except ValueError:
        return reply(handler, 400, {'error': 'That isn’t valid JSON.'})
    try:
        return reply(handler, 200, routes[path](body))
    except GradeError as e:
        return reply(handler, e.status, {'error': e.message})
