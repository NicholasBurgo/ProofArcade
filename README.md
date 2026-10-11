# Proof Arcade

A study game for **Math 2230 Test 2**, the intro-to-proofs course (textbook: Chartrand, Polimeni
& Zhang, *Mathematical Proofs*). It works like the [Math Arcade](https://github.com/NicholasBurgo/MathArcade)
for Math 3800, made for a Galaxy Tab with an S Pen: write the proof with the pen, then watch the
worked proof play line by line, with the reason for each step.

## Where it stands

- **Chapter 3's homework proofs are in** (3.2–3.5). Chapters 4 and 5.2 come next.
- **The material is gathered** in `extraction/` as Markdown: the notes, the homework, the test
  sections, and guides to how the class writes and grades proofs.
- **Check my writing and Ask about it work** when the arcade is served from this computer (or,
  later, the always-on box) and opened on this computer or over Tailscale.

## The proofs

The home screen is **Proofs · Test 2**: a level per section, then all of them mixed.

- **A section's level** (Direct proofs, Proof by contrapositive, Proof by cases, Proof
  evaluations) asks its homework problems in the book's own words, in pen mode: the question,
  a hint under a veil (how to start, never the answer), and the page to write on.
- **Show the work** sets the worked proof on a page like the book's, in serif type: **Proof:**
  first (bold, with a colon, as the handouts write it), sentences that run on, an equation on
  its own line, *Case 1.* paragraphs, ∎ at the right margin. It plays a step at a time, the
  new step underlined, and the line under the proof says the step's move (Assume, Algebra,
  Case, WLOG, Converse, Conclude…) and why. Tap any step afterwards to see its reason again.
  The wording follows the professor and the book (`extraction/proof-style.md`). Then say
  whether you had it. A miss comes back at the end as a twin: the same proof with new numbers.
- **A 3.5 question** hands you a proof to read, set the same way (**Result:**, then **Proof:**),
  and its answer starts **Proof Analysis:** or **Proof Evaluation:**, as the book's do.
- **Watch one first**, on a section's card, plays a twin before you start.
- **Chapter 3 proofs, mixed** asks all 11 with new numbers in a random order, with nothing on top
  naming the method. Its quick round is one from each section.

### Check my writing

In pen mode, **Check my writing** (next to More room) has Claude read what you wrote and check
it against the worked proof. It's a hint: **I had it** and **I missed something** still decide.

1. **Reading…** It types out what you wrote, mistakes and all, a line per line of your page.
   Math comes back as \( \) TeX; a symbol it can't tell is marked like `[? 7 or 1]`, one it
   can't read `[?]`, crossed-out work `[crossed out: …]`.
2. **What it read.** Fix only what it misread, not your math, and watch the preview. Then
   **Check it** (or **Read it again**).
3. **The verdict.** Each mistake gets a kind, and each kind its color: **structure** (pink:
   the wrong thing proved, a case or direction missing), **definition** (violet: a definition
   used without all it says), **reason** (teal: a step without its why) and **algebra**
   (orange: a slip in the arithmetic).
   - **On your page**, like a teacher's pen in those colors: what's wrong is underlined, and
     a caret ‸ shows where something goes in, with the words to add written beside it (a
     hint, never the whole line). Each mark has a circled number. **Hide marks** turns them
     off. Lines are found from the ink, so they pair up best when you write on the ruled lines,
     one line of the proof per ruled line; where a mark falls inside a line is approximate.
   - **Under your page, What it should look like:** the worked proof, with where yours went
     wrong underlined in it, in the same colors and numbers. **Play it step by step** plays it.
   - **Under that, the grade:** a stamp (Right, Almost, Wrong, Unfinished), the score on the 0–4
     rubric (`extraction/proof-rubric.md`), a sentence on how it went, then each mistake in a
     line, grouped by kind. Then **I had it** or **I missed something**, as after Show the work.
   **Change what it read** goes back to step 2.
4. **Ask about it.** A tutor pops up from the bottom. Write a question on its lined pad with
   the pen ("why is my second line wrong?") and tap **Ask**. Claude reads the question and
   shows what it read under your writing, so a misreading is easy to spot. It answers knowing
   the question, the worked proof, what you wrote and what the check said. Ask as many as you
   like. **Close** keeps the conversation; checking again or leaving the question ends it.

It also works after Show the work. Reading and checking are two separate calls on purpose: a
model that reads and grades at once tends to fix a mistake while reading it, then pass it.

How it runs: `serve.py` hands `/grade/` to `grader.py`, which runs the Claude Code CLI
(`claude -p`, Sonnet) on your Claude subscription: no API key and no cost per check. It uses
the account signed in under `~/.claude-personal` (`CLAUDE_CONFIG_DIR=~/.claude-personal claude
auth login`), and until that exists, whichever account plain `claude` is signed into. Each run
has every tool off, runs in an empty folder, and gets at most 5 minutes; two can run at once,
and each logs its seconds and tokens. Only this computer and your tailnet (127.0.0.0/8, ::1,
100.64.0.0/10, fd7a:115c:a1e0::/48) can use `/grade/`; anyone else gets a 404, and a POST has
to come from the arcade's own page. The GitHub Pages copy has no grader, so the button only
appears when `grade/ping` answers.

## What Test 2 covers

From the course schedule (weeks 6–11). 5.2 is split around the exam and all of it is included.

| Section | Topic | Homework |
|---|---|---|
| 3.2 | Direct Proofs | 8, 10 |
| 3.3 | Proof by Contrapositive | 16, 18, 21 |
| 3.4 | Proof by Cases | 26, 28, 59 |
| 3.5 | Proof Evaluations | 42, 44, 46 |
| 4.1 | Proofs Involving Divisibility of Integers | 2, 10 |
| 4.2 | Proofs Involving Congruence of Integers | 14, 22d, 75, 87 |
| 4.3 | Proofs Involving Real Numbers | 26, 30, 34, 36 |
| 4.4 | Proofs Involving Sets | 40, 42, 46, 85 |
| 4.5 | Fundamental Properties of Set Operations | 54, 56 |
| 4.6 | Proofs Involving Cartesian Products of Sets | 68, 70, 88 |
| 5.2 | Proof by Contradiction | 18, 30, 32, 71 |

The professor's notes on each homework problem are in
[assignments.md](extraction/notes-extraction/assignments.md).

## What's in `extraction/`

| File | What it is |
|---|---|
| [proof-style.md](extraction/proof-style.md) | How the professor and the book write proofs: symbols, definitions word for word, what a proof may assume, how each kind of proof opens and closes, and the slips the course marks wrong. |
| [proof-rubric.md](extraction/proof-rubric.md) | A 0–4 rubric for grading a proof, a checklist to grade your own, what each common slip likely costs, and a rubric for the 3.5 proof-evaluation questions. |
| [test-extraction/](extraction/test-extraction) | [test-2-sections.md](extraction/test-extraction/test-2-sections.md), the sections on the test with their titles, and the schedule screenshot. |
| [notes-extraction/](extraction/notes-extraction) | The class handouts for the Test 2 sections only: [chapter-3.md](extraction/notes-extraction/chapter-3.md), [chapter-4.md](extraction/notes-extraction/chapter-4.md), [chapter-5.md](extraction/notes-extraction/chapter-5.md) (5.2 only). Blank space left for class work is marked *(blank for work)*. |
| [homework-extraction/](extraction/homework-extraction) | The assigned exercises copied from the textbook, one file per section. Chapter 3 is done; Chapter 4 and 5.2 are still to come. |
| [quiz-extraction/](extraction/quiz-extraction) | For quiz questions. Empty so far. |

## Run it

    python3 serve.py          # http://localhost:8230 on this computer
                              # http://<this computer's Tailscale IP>:8230 on the tablet

On the tablet, use the **Tailscale address** (`tailscale ip -4` on this computer), at home or
away: Check my writing and Ask about it only answer this computer and the tailnet. Any other
address still opens the arcade, just without those buttons. Checking needs Claude Code signed
in on the computer running `serve.py`.

`serve.py` tells browsers not to keep stale copies, so a refresh always gets the latest files.
Port 8230 keeps it from clashing with the Math 3800 arcade on 8380. Progress is saved in each
browser under its own name, so it never mixes with the Math 3800 arcade's.

To check the proofs after changing them (every = in every proof, at random values, for the
homework and 300 twins each, and that each proof starts with *Proof* and ends with ∎):

    node tools/check-proofs.js

## Files

- `index.html`: the page: the bar, then the scripts below, in order.
- `js/`: one file per part. They load in order as plain scripts and share one global scope,
  so the order in `index.html` matters.
  - `01-setup.js` the levels' registry and small helpers · `02-progress.js` stars, saved in
    the browser · `03-sound.js` · `04-confetti.js` · `05-ink.js` the S Pen ink ·
    `06-math.js` MathJax · `07-hud.js` the bar
  - `08-proofs.js` the problems (the book's numbers, twins, the worked steps), a proof set like
    the book, the player, and the home screen's block
  - `09-home.js` the home screen and a level's card · `10-rounds.js` · `11-question.js` ·
    `12-pen-mode.js` writing it, Show the work, and grading yourself · `13-results.js` ·
    `14-check-writing.js` the ink as pictures, and the read → fix → check panel ·
    `14b-ask.js` Ask about it: the tutor pop-up and its pen pad · `14c-marks.js` the
    checker's red-pen marks on your page · `15-boot.js`
- `css/`: the styles, one file per part (`06-proofs.css` is how a proof looks).
- `tools/check-proofs.js`: the checker above. `tools/test-grader.py` checks who may use the
  grader and which requests count as coming from the page.
- `serve.py`: the local server. `grader.py`: the routes for Check my writing and Ask about it,
  and their prompts.

The game started as a copy of the [Math Arcade](https://github.com/NicholasBurgo/MathArcade);
its Math 3800 content has been taken out.
