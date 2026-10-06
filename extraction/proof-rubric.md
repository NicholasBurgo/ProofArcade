# Proof Rubric

*A rubric for grading a proof, combined from three published university rubrics (listed under Sources at the end) and fitted to this course's style ([proof-style.md](proof-style.md)). The professor's own rubric hasn't been seen. If the syllabus or a graded test shows how points are taken off, this file should be changed to match it.*

All three rubrics grade the same two things, in this order:

1. **Is it a complete, correct logical argument?** This decides most of the score.
2. **Can it be read?** Writing moves the score up or down, mostly when it is between two levels.

## 1. The score (0–4)

Two of the sources grade out of 4, and the third grades out of 10 at the same levels: 0, 3, 6, 8, 10.

| Score | Out of 10 | What the proof looks like |
|---|---|---|
| **4** | 10 | **Complete and correct.** Every step follows from the hypotheses, a definition, or an earlier result, and nothing important is assumed or skipped. All cases are covered, and both directions if it is an if-and-only-if. Written in full sentences with correct notation, and ends with a clear conclusion. Any suggestions are only about clarity, not logic. Small typos that don't affect understanding are fine. |
| **3** | 8 | **Nearly complete.** The argument is right, but has a gap that is quick to fix: a reason left out, a trivial case not ruled out, a step the reader has to fill in. Or it is correct but hard to follow, with incomplete sentences, symbols used as shorthand, or awkward wording. |
| **2** | 6 | **A correct outline with major holes.** The right method and several correct steps, but parts are missing that would take more than a few sentences to repair. Roughly a quarter to three quarters of a correct proof is there. Or it may be correct, but only a generous reader could tell. |
| **1** | 3 | **Some relevant steps, no workable plan.** A right definition or method is chosen and partly applied, but most of the argument is missing. This is also the score for misreading the question, or for a shortcut that makes the problem trivial (such as checking examples instead of proving). |
| **0** | 0 | **Nothing toward a proof.** Blank, unrelated to the problem, or only definitions copied out with no steps that use them. |

### How to decide

From Stange's rubric:

1. Read the proof and mark each step: does it follow, and why?
2. Decide how much of a complete argument is there. That gives a score, or two scores it falls between.
3. Let the writing settle it: clear writing moves it up, confusing writing moves it down.

- **A small slip can cost a lot.** If an early mistake makes the problem much easier, the rest of the proof doesn't count for much, even if it is correct. Using the same $k$ for two variables is an example.
- **Longer is not better.** A good proof is often one of the shortest: each sentence has a purpose, it doesn't wander, and there's no filler like "and thus we are done."

## 2. Checklist for one proof

Use it to grade your own proof before scoring it. Each line is something the course checks (see [proof-style.md](proof-style.md)).

**Setup**

- [ ] The statement is restated as an if-then (or if-and-only-if) when it was given as a sentence.
- [ ] The method is named when it isn't direct: "We prove the contrapositive", "We proceed by cases, according to whether …", "Assume, to the contrary, that …".
- [ ] It starts from the right hypothesis. That is the "if" part for a direct proof, the negated conclusion for a contrapositive, and the negated statement for a contradiction.

**Definitions and variables**

- [ ] Every term is turned into its definition: even → $2k$, odd → $2k + 1$, $a \mid b$ → $b = ac$, $a \equiv b \pmod{n}$ → $n \mid (a - b)$, rational → $\frac{a}{b}$ with $b \ne 0$.
- [ ] Every new letter is introduced with its type: "for some integer $k$", "where $a, b \in \mathbb{Z}$".
- [ ] Different variables get different letters ($x = 2a$, $y = 2b$).
- [ ] Conditions in a definition are checked: $a \ne 0$ for divides, $n \ge 2$ for congruence, $b \ne 0$ for rational.

**Logic**

- [ ] The steps go forward from the hypothesis to the conclusion, not backward from the conclusion.
- [ ] Every step that isn't obvious has a reason (a definition, a hypothesis, algebra, an earlier result).
- [ ] No result at the same level as the one being proved is used (for example, "the sum of evens is even" to prove "the product of odds is odd").
- [ ] In 4.2 homework, only definitions are used, no theorems from the text.
- [ ] The last step puts the result in the defining form and names the integer: "Since $3k - 1$ is an integer, $3n - 5$ is even."

**The checks for each method**

- [ ] **Contrapositive:** the negations are right, including an "or" turning into an "and".
- [ ] **Cases:** the cases cover every possibility, and each case is proved with a general element. "Without loss of generality" is used only when the skipped case is the same proof with the letters swapped.
- [ ] **If and only if:** both directions are proved and labeled ("First, assume … For the converse, assume …").
- [ ] **Contradiction:** it assumes exactly the negation of the statement, reaches a real contradiction, and says so ("This is a contradiction.").
- [ ] **Set equality:** both $X \subseteq Y$ and $Y \subseteq X$ are shown, each starting from "Let $x \in$ …".
- [ ] **Set properties (4.5):** each equality names the law it uses, and there is no element-chasing when the problem says not to.

**Writing**

- [ ] Full sentences that read aloud; no sentence starts with a symbol.
- [ ] No $\Rightarrow$, $\forall$, $\exists$ or $\therefore$ as shorthand in place of words.
- [ ] The course's notation is used: $\sim P$, $a \mid b$, $\overline{A}$, $A - B$, $\pmod{n}$.
- [ ] It ends with the conclusion in words, then ∎.

## 3. The course's slips and what they usually cost

These are the mistakes from [proof-style.md §6](proof-style.md), placed on the 0–4 scale using the rules above. This placement is a guess from the sources' rules, not the professor's grading.

| Slip | Likely score at best | Why |
|---|---|---|
| Proving by example (Problem 3.20) | 1 | Nothing general is proved; it is the shortcut that makes the problem trivial. |
| Same letter for two variables (Problem 3.21) | 1–2 | It quietly assumes something extra ($n = m + 1$), so only a special case is proved. |
| Only one direction of an if-and-only-if | 2 | Half the proof is missing. |
| Only one subset for a set equality | 2 | Half the proof is missing. |
| A case missing, or cases that don't cover everything | 2–3 | 3 if the missing case is quick to add, 2 if it needs its own argument. |
| Wrong negation in a contrapositive or contradiction proof | 1 | The proof is of a different statement. |
| Proving the converse instead of the statement | 1 | The proof is of a different statement. |
| "Without loss of generality" when the cases aren't alike | 2–3 | A case was skipped without good reason. |
| Using an equivalent-level result, or a theorem in 4.2 homework | 2–3 | The step that matters was skipped. How much this costs depends on the professor. |
| Correct, but in symbols and fragments instead of sentences | 3 | The logic is complete, but it doesn't read as a proof. |
| A missing reason, or a missing "for some integer $k$" | 3 | Quick to fix. |
| A missing final sentence or ∎ | 3–4 | Writing only. |

## 4. Proof-evaluation questions (3.5)

For "Which result is proved?" and "Evaluate the proof", score each of these:

| Part | Full credit means |
|---|---|
| Name the result | State exactly what the proof shows, with its hypothesis, as an if-then. Don't give the conclusion alone, which is an open sentence. Don't give the converse. |
| Verdict | Say whether it is a proof. |
| The mistake | If it isn't a proof, point to the step that fails and say why: "In Case 1, $x$ and $y$ must be arbitrary even integers, not specific ones." |
| What's right | Following the book's Proof Evaluations, first say what the proof does correctly. |

## Sources

- Katherine E. Stange (University of Colorado), [Rubric for Grading Student Solutions](https://math.colorado.edu/~kstange/grading-rubric.pdf). The 0–4 levels and the "How to decide" section.
- sarah-marie belcastro, [Rubric for Scoring Proofs](http://www.toroidalsnark.net/rubpfs.html). The 0–4 levels with writing criteria (sentences, notation, restating the problem, a concluding statement).
- Vincent Vatter (University of Florida), [Proofs course page](https://people.clas.ufl.edu/vatter/courses/3202s26/). The 10-point version (0, 3, 6, 8, 10), with full credit for complete sentences "without logical symbols".
- Rutgers Math 311, [Writing proofs](https://math.rutgers.edu/academics/undergraduate/courses/course-materials/311-h1/1200-writing-proofs). Forward reasoning, using definitions, no ∀ and ∃, graded "for both content and style".
- [Mathematics Professors' Evaluation of Students' Proofs](https://link.springer.com/article/10.1007/s40753-016-0029-y) (*International Journal of Research in Undergraduate Mathematics Education*). Professors rank logical correctness, clarity, fluency and understanding as what matters most.
