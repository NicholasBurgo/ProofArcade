# Proof Arcade

A study game for **Math 2230 Test 2**, the intro-to-proofs course (textbook: Chartrand, Polimeni
& Zhang, *Mathematical Proofs*). It will work like the [Math Arcade](https://github.com/NicholasBurgo/MathArcade)
for Math 3800, made for a Galaxy Tab with an S Pen. Each section of the notes becomes a set of
levels, and every proof plays out line by line with the reason for each step.

## Where it stands

- **The material is being gathered** in `extraction/` as Markdown: the notes, the homework, the
  test sections, and guides to how the class writes and grades proofs.
- **The game is not built yet.** The page code (`index.html`, `js/`, `css/`, `homework/`,
  `engine.js`) is still the Math 3800 arcade this repo was copied from. It is kept as the starting
  point and will be changed to proofs.

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

    python3 serve.py 8230     # http://localhost:8230, or http://<this computer's IP>:8230 on a tablet

`serve.py` tells browsers not to keep stale copies, so a refresh always gets the latest files.
Port 8230 keeps it from clashing with the Math 3800 arcade on 8380. For now this still shows the
Math 3800 game.
