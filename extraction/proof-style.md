# Proof Style: How the Professor and the Book Write

*A guide for writing anything in this repo (notes, homework, test material) so it reads the way the professor and the textbook (Chartrand, Polimeni & Zhang, *Mathematical Proofs*) write it. It covers the symbols, definitions, what a proof may assume, how each kind of proof opens and closes, and the slips the course marks wrong.*

*Sources. Most of this is taken from the handouts ([chapter-3.md](notes-extraction/chapter-3.md), [chapter-4.md](notes-extraction/chapter-4.md), [chapter-5.md](notes-extraction/chapter-5.md)). The handouts leave most proofs blank, so the professor's own wording comes from the few proofs written out in full. Most of those are in the Chapter 5 handout's Section 5.4, which is not on Test 2 but shows how the professor writes. The book's own wording comes from photos of a few pages of its Chapter 3 text (Sections 3.3–3.5: Theorems 3.12, 3.16 and 3.17, Result 3.15, Problems 3.20 and 3.21) and the sample proofs in its Section 3.5 exercises ([section-3.5.md](homework-extraction/section-3.5.md)). Items marked **(book)** are the textbook's usual conventions that have not been seen in the handouts or the photos yet.*

## 1. Symbols

| Meaning | Written as | Typed in these .md files | Not this |
|---|---|---|---|
| integers, rationals, reals | $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$ (the book prints a bold **Z**; the handouts use $\mathbb{Z}$, so use that) | `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{R}` | Z, ℤ in plain text |
| positive integers | $\mathbb{Z}^+$ | `\mathbb{Z}^+` | $\mathbb{N}$ (unless the problem says natural numbers) |
| is an element of | $n \in \mathbb{Z}$ | `\in` | |
| not (negation) | $\sim P$ | `\sim P` | $\neg P$, $\bar{P}$ |
| implies | $P \Rightarrow Q$ | `\Rightarrow` | $\to$, $\implies$ |
| if and only if | $P \Leftrightarrow Q$ | `\Leftrightarrow` | $\leftrightarrow$, iff (in a statement) |
| logically equivalent | $P \Rightarrow Q \equiv\ \sim Q \Rightarrow \sim P$ | `\equiv` | $=$, $\iff$ |
| divides | $a \mid b$ | `\mid` | $a / b$, $a \div b$, a plain bar |
| does not divide | $a \nmid b$ | `\nmid` | |
| congruent mod $n$ | $a \equiv b \pmod{n}$ | `\equiv` and `\pmod{n}` | $a = b \bmod n$, $a \equiv_n b$ |
| subset | $X \subseteq Y$ | `\subseteq` | $\subset$ |
| empty set | $\emptyset$ (also $\{\}$) | `\emptyset` | $\varnothing$, $\{\emptyset\}$ |
| complement | $\overline{A}$ | `\overline{A}` | $A^c$, $A'$ |
| complement of a whole expression | $\overline{A \cup B}$ | one bar over all of it | $(A \cup B)^c$ |
| set difference | $A - B$ | `A - B` | $A \setminus B$ |
| universal set | $U$ | `U` | $\Omega$, $S$ |
| Cartesian product | $A \times B$ | `\times` | $AB$ |
| logarithm base 2 | $\log_2 3$ | `\log_2 3` | |
| or, and | $P \vee Q$, $P \wedge Q$, written $\sim (P \vee Q)$ and $(\sim P) \wedge (\sim Q)$ in the book | `\vee`, `\wedge` | $P + Q$, $PQ$ |
| end of proof | ∎ (filled black square) | `∎` | Q.E.D., □, // |
| end of an example, a Proof Analysis or a Proof Strategy (book) | ♦ | `♦` | ∎ (that is only for proofs) |

- Write "(mod $n$)" with a space before the parenthesis, as the handouts do: $a \equiv 1 \pmod{n}$.
- The handouts use the minus sign for set difference everywhere: $A - B = A \cap \overline{B}$.
- A defined term is underlined where it is defined: "An integer $n$ is <u>even</u> if and only if …". Use `<u>…</u>` in these files.

## 2. Definitions, word for word

Every proof works from these. Use the professor's wording exactly.

| Term | Definition |
|---|---|
| even | An integer $n$ is <u>even</u> if and only if $n = 2k$ for some integer $k$. |
| odd | An integer $n$ is <u>odd</u> if and only if $n = 2k + 1$ for some integer $k$ (or $n = 2k - 1$ if you prefer, but be consistent throughout a single proof). |
| parity | <u>Parity</u> refers to whether an integer is even or odd. |
| same parity | Two integers $x$ and $y$ are <u>of the same parity</u> if $x$ and $y$ are both even or are both odd. *(The book, §3.4.)* |
| opposite parity | The integers $x$ and $y$ are <u>of opposite parity</u> if one of $x$ and $y$ is even and the other is odd. *(The book, §3.4.)* |
| contrapositive | For statements $P$ and $Q$, the <u>contrapositive</u> of $P \Rightarrow Q$ is $\sim Q \Rightarrow \sim P$. |
| proof by contrapositive | A <u>proof by contrapositive</u> is a direct proof of a statement's contrapositive. |
| divides | If $a$ and $b$ are integers and $a \ne 0$, then $a$ <u>divides</u> $b$ if and only if $b = ac$ for some integer $c$. Also: $b$ is a <u>multiple</u> of $a$, $a$ is a <u>factor</u> of $b$, $a$ is a <u>divisor</u> of $b$. |
| congruent mod $n$ | If $a$ and $b$ are integers and $n \ge 2$, <u>$a$ is congruent to $b$ modulo $n$</u> if $n \mid (a - b)$. |
| rational | A real number $r$ is <u>rational</u> if and only if there exist $a, b \in \mathbb{Z}$ such that $r = \frac{a}{b}$ and $b \ne 0$. |
| irrational | A real number that is not rational is <u>irrational</u>. |
| existence proof | The proof of an existential statement is called an <u>existence proof</u>. |
| uniqueness proof | To show an object is unique, assume there are two of them and show that the two must be equal. |

Facts about these that the notes state (no proof needed):

- $a \mid b$ is a statement, NOT a number.
- $a \equiv b \pmod{n}$ when $a$ and $b$ leave the same remainder when divided by $n$.
- Every integer $a$ is $\equiv 0, 1, \ldots,$ or $(n - 1) \pmod{n}$, and $a \equiv 1 \pmod{n}$ means $a = nk + 1$ for some $k \in \mathbb{Z}$, etc. These are the cases for a mod-$n$ proof.

## 3. What a proof may and may not use

**May assume without proof:**

- The sum, difference, and product of integers are integers, and the negative of an integer is an integer. ("For the remainder of the course, we will assume …", Section 3.2.)
- The facts about real numbers in the opening paragraph on page 113 of the book (Section 4.3).
- A numbered Result, Theorem, Lemma or Corollary already proved in the notes. This is how it is cited: "By the lemma, $\log_2 3$ is irrational."
- **The book's Chapter 3 theorems, when the professor allows it.** The 4.1 #10 hint says to "use Theorem 3.12 twice". The ones seen so far:
  - **Theorem 3.12:** if $x$ is even, then $x^2$ is even, and if $x^2$ is even, then $x$ is even. The book restates it as "An integer is even if and only if its square is even." Its contrapositives are: if $x$ is odd, then $x^2$ is odd; if $x^2$ is odd, then $x$ is odd.
  - **Theorem 3.16:** Let $x, y \in \mathbb{Z}$. Then $x$ and $y$ are of the same parity if and only if $x + y$ is even.
  - **Theorem 3.17:** Let $a$ and $b$ be integers. Then $ab$ is even if and only if $a$ is even or $b$ is even.

  These are off limits in 4.2 homework, and in a proof of a fact at the same level as the theorem.

**May not use:**

- **Equivalent-level results.** "Do not use the result that the sum of even integers is even in a proof that the product of odd integers is odd." Facts at the same level as the one being proved must be shown from the definitions.
- **Theorems from the text in 4.2 homework.** "Use definitions in all proofs. Do not use theorems from the text."
- **Specific numbers in place of a general element** (see Problem 3.20 in §6).

When a proof needs a smaller fact first, prove it as a **Lemma** and then return to the main proof. The notes do this for #17: "To prove #17, first we need a lemma (a small theorem)." The proof comes next under the heading "Now we return the proof of # 17:".

## 4. The shape of a proof

1. **Rewrite** the statement as an if-then with its variables named, when it is written as a sentence. The handout has a "Rewrite:" line before the proof of "The product of an even integer and an odd integer is even." The rewrite itself was filled in during class. In the book's style it would be something like "If $a$ is even and $b$ is odd, then $ab$ is even" **(book)**. The book moves between the two forms all the time: "If $x$ is an even integer, then $x^2$ is even" is the same as "The square of every even integer is even." It stresses recognizing what a result says however it is worded.
2. Start with **Proof:** in bold.
3. Write full sentences. Math inside a sentence is part of the sentence, and every sentence ends with a period.
4. Introduce each variable with its type: "for some integer $k$", "where $k \in \mathbb{Z}$", "for some $a, b \in \mathbb{Z}$ with $b \ne 0$".
5. Give every **different** variable a **different** letter: $m = 2k$ and $n = 2\ell + 1$, never $2k$ for both (see Problem 3.21 in §6).
6. Rewrite the result in the defining form, and name the integer that makes it fit: "$3n - 5 = 2(3k - 1)$. Since $3k - 1$ is an integer, $3n - 5$ is even." The book often writes the reason with $\in$: "Since $a + b \in \mathbb{Z}$, the integer $x + y$ is odd." or "Because $2y^2 + 5y + 4 \in \mathbb{Z}$, the integer $n^2 + 3n + 5$ is odd."
7. End with the conclusion in words, then ∎.

**Connecting words the professor uses:** Then · Thus · Hence · Therefore · So · It follows that · Since … , … · By the lemma, … · By the definition of … , … · We may assume that … · Let … · Now assume … · This is a contradiction.

**Openers the book uses:** We proceed by cases, according to whether … · We consider two cases. · First, assume that … · For the converse, assume that … · Without loss of generality, assume that … · Because … , … · The proof is similar to the proof of the preceding case and is therefore omitted.

**How the label is printed:** the handouts write **Proof:** with a colon; the book prints ***Proof*** in bold italic with no colon, and **Result** in bold. Use the handouts' style in the notes and the book's in copied exercises.

**Labels the book uses:** most statements are a **Result** (Result 3.6, Result 4.19). **Theorem** is kept for the big ones (Theorem 4.17, the Triangle Inequality; Theorem 5.16, $\sqrt{2}$ is irrational). **Lemma** is a small result used to prove another, and a **Corollary** follows quickly from one. **Proof Analysis** discusses a proof after it is done (Proof Analysis of Result 3.6 points out that the hypothesis "$n$ is odd" was never used). **Proof Strategy** plans a proof before it is written, under a **Theorem to Prove** heading. **Proof Evaluation** is the book's verdict on a proposed proof. The book ends a proof with ∎ and an analysis, strategy or worked example with ♦.

## 5. How each kind of proof opens and closes

Example lines are quoted from the handouts or the book's pages. Lines marked **(book)** follow the textbook's usual wording and still need checking.

### Planning first (the book's Proof Strategy)

Before proving Theorem 3.17, the book plans the proof:

1. **List what has to be shown.** An if-and-only-if is two implications: (1) if $a$ is even or $b$ is even, then $ab$ is even, and (2) if $ab$ is even, then $a$ is even or $b$ is even.
2. **Try a direct proof first.** For (1) that works.
3. **If the direct route gives nothing to work with, try the contrapositive.** Assuming $ab = 2k$ says nothing about $a$ or $b$ separately, so (2) goes by contrapositive.
4. **Negate carefully.** By De Morgan's law, $\sim (P \vee Q)$ is logically equivalent to $(\sim P) \wedge (\sim Q)$. So the negation of "$a$ is even or $b$ is even" is "$a$ is odd **and** $b$ is odd."
5. **Cut cases that repeat.** If the cases "$a$ is even" and "$b$ is even" would be the same proof, assume without loss of generality that $a$ is even.

### Direct proof (3.2)

"For 'if-then' statements, a direct proof means 'assume the if, show the then.'"

> **Proof:** Assume that $n$ is an odd integer. Then $n = 2k + 1$ for some integer $k$. Then $3n - 5 = 3(2k + 1) - 5 = 6k + 3 - 5 = 6k - 2 = 2(3k - 1)$. Since $3k - 1$ is an integer, $3n - 5$ is even. ∎
>
> *(Example 3.19, quoted in the notes.)*

### Proof by contrapositive (3.3)

Prove $\sim Q \Rightarrow \sim P$ directly. Say that you are doing it, then assume the negated conclusion.

> **Proof:** Assume that $x$ is even. Then $x = 2k$ for some integer $k$. … Thus $5x - 7$ is odd. ∎ **(book)**

Use it when the conclusion is easier to assume than the hypothesis, especially when the hypothesis says something "is even" about a messy expression (Result 3.10: if $5x - 7$ is even, then $x$ is odd). If the conclusion has an "or", its negation is an "and": to prove "if $ab$ is even, then $a$ is even or $b$ is even" by contrapositive, assume that $a$ and $b$ are both odd (the book's plan for Theorem 3.17).

### If and only if (any section)

"To prove $P \Leftrightarrow Q$, you must prove $P \Rightarrow Q$ and $Q \Rightarrow P$. One way may be a direct proof and the other may be via contraposition." Label the two halves and prove each one separately. The book starts the first half with "First, assume that …" and the second with "For the converse, assume that …" (Theorem 3.16, Exercise 3.42).

### Proof by cases (3.4)

"When dividing into cases, you basically are creating a partition of the domain. Often, the word 'or' is a dead giveaway."

The usual partitions:

| Domain | Cases |
|---|---|
| integers | even, odd |
| integers mod $n$ | $\equiv 0, 1, \ldots, n-1 \pmod{n}$ |
| real numbers | negative, zero, positive |
| natural numbers | $n = 1$, $n \ge 2$ |
| two nonzero integers $x, y$ | $xy > 0$ (subcases: $x > 0$ and $y > 0$; $x < 0$ and $y < 0$) and $xy < 0$ (subcases: $x > 0$ and $y < 0$; $x < 0$ and $y > 0$) |

The book: any result about same or opposite parity is likely to be proved by cases, because those definitions each have two possibilities.

> We consider two cases, according to whether $x$ and $y$ are both even or are both odd.
>
> Case 1. *$x$ and $y$ are both even.* …
>
> Case 2. *$x$ and $y$ are both odd.* …
>
> *(Wording from Problem 3.20. Each case's description is in italics.)*

> ***Proof*** We proceed by cases, according to whether $n$ is even or odd.
>
> Case 1. *$n$ is even.* Then $n = 2x$ for some $x \in \mathbb{Z}$. So, … $= 2(2x^2 + 3x + 2) + 1$. Since $2x^2 + 3x + 2 \in \mathbb{Z}$, the integer $n^2 + 3n + 5$ is odd.
>
> Case 2. *$n$ is odd.* Then $n = 2y + 1$, where $y \in \mathbb{Z}$. Thus, … Because $2y^2 + 5y + 4 \in \mathbb{Z}$, the integer $n^2 + 3n + 5$ is odd. ∎
>
> *(The book's Result 3.15, with the algebra cut. Each case uses its own letter.)*

Subcases are numbered under their case: "Case 1. *$a$ and $b$ are of the same parity.* We now consider two subcases. Subcase 1.1. *$a$ and $b$ are both even.* …" (Exercise 3.44).

A case that repeats another can be skipped: "Case 2. *$x$ is odd and $y$ is even.* The proof is similar to the proof of the preceding case and is therefore omitted." (Theorem 3.16).

Better, the book says it up front with **without loss of generality** (some write WOLOG or WLOG): "For the converse, assume that $x$ and $y$ are of opposite parity. Without loss of generality, assume that $x$ is even and $y$ is odd." It means the proofs of the two situations are similar, so only one is needed. The book warns that it is sometimes subjective whether two situations are similar, so use it only when the other case is the same proof with the letters swapped.

### Proof by contradiction (5.2)

Assume the statement is false, reach something impossible, then conclude the statement.

> **Proof:** Assume that $\log_2 3$ is rational. Then $\log_2 3 = \frac{a}{b}$ for some $a, b \in \mathbb{Z}$ with $b \ne 0$. Since $\log_2 3 > 0$, we may assume that $a, b \in \mathbb{Z}^+$. … This is a contradiction. Therefore $\log_2 3$ is irrational. ∎
>
> *(The professor's proof, from the Chapter 5 handout.)*

The book usually opens with "Assume, to the contrary, that …" **(book)**. For "irrational", assume it is rational and write it as $\frac{a}{b}$ with $b \ne 0$. For "there is no …", assume there is one and name it.

### Divisibility and congruence (4.1, 4.2)

Turn every $\mid$ and $\equiv$ into an equation with a named integer, work with the equations, then turn the result back.

- $a \mid b$ → $b = ac$ for some integer $c$.
- $a \equiv b \pmod{n}$ → $n \mid (a - b)$ → $a - b = nk$ for some integer $k$.
- Finish: "$2b - 3c = a(\ldots)$. Since $\ldots$ is an integer, $a \mid (2b - 3c)$."

### Real numbers (4.3)

Facts from page 113 can be used freely. Typical moves are factoring, completing the square, or showing that something $\ge 0$. For an inequality like Result 4.16, the book often works backward on scratch paper and then writes the proof forward **(book)**.

### Sets: element-chasing (4.4, 4.6)

"To prove $X \subseteq Y$, you assume $x \in X$ and show $x \in Y$. To prove $X = Y$, you must show $X \subseteq Y$ and $Y \subseteq X$."

> First, we show that $A - B \subseteq A \cap \overline{B}$. Let $x \in A - B$. Then $x \in A$ and $x \notin B$. … Thus $x \in A \cap \overline{B}$.
>
> Next, we show that $A \cap \overline{B} \subseteq A - B$. Let $x \in A \cap \overline{B}$. … **(book)**

For Cartesian products the element is an ordered pair: "Let $(x, y) \in A \times (B \cap C)$. Then $x \in A$ and $y \in B \cap C$. …"

### Sets: set properties, no element-chasing (4.5)

Write a chain of equalities and name the law used at each step. The laws are Theorem 4.22 (commutative, associative, distributive, DeMorgan) and the theorem after it (identity, complement, double complement, idempotent, universal bound, absorption, complements of $U$ and $\emptyset$, set difference).

$$
\begin{aligned}
\overline{\overline{B} \cup (\overline{B} - A)} &= \overline{\overline{B} \cup (\overline{B} \cap \overline{A})} && \text{Set Difference Law} \\
&= \overline{\overline{B}} && \text{Absorption Law} \\
&= B && \text{Double Complement Law}
\end{aligned}
$$

*(One way to do the 4.5 example. The handout leaves it blank.)*

### Evaluating a proof (3.5)

The book asks you to read a proposed proof, decide whether it is in fact a proof, and if not, point out the (or a) mistake. Its answers follow a pattern:

- **Proof Evaluation:** first say what the proof does right, then name the mistake. For Problem 3.20, the setup and the split into two cases are correct, but in each case $x$ and $y$ have to be arbitrary even (or odd) integers, not specific ones.
- **"Which result is proved?"** A proof that assumes $P$ and shows $Q$ proves $P \Rightarrow Q$, and so also its contrapositive $\sim Q \Rightarrow \sim P$. For Example 3.19 the answer is (2) and (4): a direct proof of (2) and a proof by contrapositive of (4). (1) is an open sentence, not a statement; it is only the conclusion of (2). (3) is the converse of (2), so it is not proved.

### Existence and uniqueness

Existence: give the object (constructive) or show one must exist (nonconstructive). Uniqueness: "Now assume there are two …, say $\emptyset_1$ and $\emptyset_2$. … Thus $\emptyset_1 = \emptyset_2$." Exactly one = an existence proof plus a uniqueness proof. *(Section 5.4 is not on Test 2, but uniqueness can come up in any section.)*

## 6. Slips the course marks wrong

Section 3.5 is about finding these, so a test may show a proof with one of them and ask what is wrong.

| Slip | Where it shows up | What is wrong |
|---|---|---|
| Proof by example | Problem 3.20 (uses $x = 6$, $y = 2$ and $x = 7$, $y = 1$) | The book: $x$ and $y$ must be arbitrary even integers, not specific ones. Use a general $x = 2a$, $y = 2b$. |
| Same letter for two variables | Problem 3.21 ($m = 2k$ and $n = 2k + 1$) | This forces $n = m + 1$. Different integers need different letters: $m = 2k$, $n = 2\ell + 1$. |
| Proving the wrong statement | Example 3.19 (which statement was proved?) | A proof that assumes $n$ is odd proves "if $n$ is odd, then …", and with it the contrapositive. It does not prove the converse, and the conclusion by itself is an open sentence, not a statement. |
| Negating an "or" as an "or" | Theorem 3.17 strategy | The negation of "$a$ is even or $b$ is even" is "$a$ is odd and $b$ is odd" (De Morgan). |
| "Without loss of generality" when the cases are not alike | §3.4 discussion of WLOG | Use it only when the other case is the same proof with the letters swapped. |
| Not saying which direction of an iff is being proved | #48 (which openings are appropriate?) | Several openings work: each direction can be done directly or by contrapositive, or the whole thing by cases. Say which direction you are proving and how. |
| Using an equivalent-level result | Section 3.2 note | Prove it from the definitions. |
| Using a theorem from the text in 4.2 | 4.2 homework note | Definitions only. |
| Forgetting $a \ne 0$ in "$a$ divides $b$" | 4.1 definition | Divisibility needs $a \ne 0$. |
| Showing only one subset for $X = Y$ | 4.4 | Equal sets need $X \subseteq Y$ **and** $Y \subseteq X$. |
| Element-chasing when told to use set properties (or the reverse) | 4.5 homework (#54 vs #56) | Use the method the problem asks for. |
| A hypothesis that is never used | Proof Analysis of Result 3.6 | It is not wrong, but the result can be stated more strongly. Notice it when it happens. |
| A "silly" statement | #11 ($1 - n^2 > 0$ only for $n = 0$) | It is true but trivial. The notes ask how to rewrite it. |

## 7. Writing rules from the book **(book)**

Chartrand's opening chapter, *Communicating Mathematics*, sets rules the course follows. Check these against the book.

- Don't start a sentence with a symbol. Write "The integer $n$ is odd", not "$n$ is odd" at the start of a sentence.
- Separate formulas with words, not just commas.
- Don't use $\Rightarrow$, $\forall$, $\exists$ or $\therefore$ as shorthand inside a proof. Write the words.
- Say what every letter is the first time it appears.
- Use "we" ("we now show …").
