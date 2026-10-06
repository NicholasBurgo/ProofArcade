# Notes for Chapter 3

*Copied from `Ch3 (1).pdf` (9 pages). The handout leaves blank space under each example and proof for working in class; those blanks are marked "*(blank for work)*". The homework numbers for every section are collected in [assignments.md](assignments.md).*

## Section 3.2 – Direct Proofs

> HW: # 8, 10 (On # 10, $b \in \mathbb{Z}$ is part of the hypotheses.)

For the remainder of the course, we will assume that the sum, difference, and product of integers are integers and that the negative of an integer is an integer.

**Definitions:** An integer $n$ is <u>even</u> if and only if $n = 2k$ for some integer $k$. An integer $n$ is <u>odd</u> if and only if $n = 2k + 1$ for some integer $k$ (or $n = 2k - 1$ if you prefer, but be consistent throughout a single proof).

Note: For "if-then" statements, a direct proof means "assume the if, show the then."

Note: READ the examples in the section!

**Example:** The product of an even integer and an odd integer is even.

Rewrite: *(blank for work)*

**Proof:** *(blank for work)*

**Example:** For all integers $n$ and $m$, if $n - m$ is even, then $n^3 - m^3$ is even.

**Proof:** *(blank for work)*

**Example:** If $r$ and $s$ are integers, then there exists an integer $m$ such that $12r - 4s = 2m$.

**Proof:** *(blank for work)*

Note: Do not use equivalent-level results in your proofs. For example, do not use the result that the sum of even integers is even in a proof that the product of odd integers is odd.

**Result 3.6, p. 87:** If $n$ is an odd integer, then $4n^3 + 2n - 1$ is odd.

**Proof:** *(blank for work)*

**Proof Analysis of Result 3.6, p. 87:** If $n$ is an integer, then $4n^3 + 2n - 1$ is odd. *(blank for work)*

*(The hypothesis drops "odd" on purpose: the proof of Result 3.6 never uses that $n$ is odd, so the result holds for every integer.)*

**Example:** (# 11) Let $n \in \mathbb{Z}$. If $1 - n^2 > 0$, then $3n - 2$ is an even integer.

**Proof:** *(blank for work)*

**Example:** The previous example is silly, as are #12 and #13. How could #11 be rewritten? *(blank for work)*

## Section 3.3 – Proof by Contrapositive

> HW: # 16, 18, 21

**Definition:** For statements $P$ and $Q$, the <u>contrapositive</u> of $P \Rightarrow Q$ is $\sim Q \Rightarrow \sim P$.

**Theorem:** Let $P$ and $Q$ be statements. Then $P \Rightarrow Q \equiv\ \sim Q \Rightarrow \sim P$.

**Proof:** *(blank for work)*

**Definition:** A <u>proof by contrapositive</u> is a direct proof of a statement's contrapositive.

**Result 3.10, p. 90:** Let $x \in \mathbb{Z}$. If $5x - 7$ is even, then $x$ is odd.

**Proof:** *(blank for work)*

**Example:** (# 17) Let $n \in \mathbb{Z}$. If $15n$ is even, then $9n$ is even.

To prove #17, first we need a lemma (a small theorem).

> **Lemma:** Let $n \in \mathbb{Z}$. If $15n$ is even, then $n$ is even.
>
> **Proof:** *(blank for work)*

Now we return the proof of # 17:

**Proof of # 17:** *(blank for work)*

Note: To prove $P \Leftrightarrow Q$, you must prove $P \Rightarrow Q$ and $Q \Rightarrow P$. One way may be a direct proof and the other may be via contraposition.

## Section 3.4 – Proof by Cases

> HW: # 26, 28, 59

Sometimes the proof of a universal statement cannot be done with an arbitrary element. However, by breaking the generic situation down into cases and putting a restriction on the generic element in each case, one can construct a proof. For example, the integers might be divided into the cases of odd and even, the real numbers might be divided into the cases of negative, zero, and positive, and the natural numbers might be divided into the cases of $n = 1$ and $n \ge 2$. Notice that when dividing into cases, you basically are creating a partition of the domain. Often, the word "or" is a dead giveaway that a proof requires cases, such as "if $x$ is odd or prime . . . ."

**Example:** The square of any integer has the form $4k$ or $4k + 1$ for some integer $k$.

**Proof:** *(blank for work)*

**Definition:** <u>Parity</u> refers to whether an integer is even or odd.

**Example:** (# 31) Let $a, b \in \mathbb{Z}$. If $a + b$ and $ab$ are of the same parity, then $a$ and $b$ are even.

**Proof:** *(blank for work)*

**Example:** (# 63) If $a$ and $b$ are two positive integers, then $a^2(b + 1) + b^2(a + 1) \ge 4ab$.

**Proof:** *(blank for work)*

## Section 3.5 – Proof Evaluations

> HW: # 42, 44, 46

**Example 3.19:** Given below is a proof of a result.

Assume that $n$ is an odd integer. Then $n = 2k + 1$ for some integer $k$. Then

$$3n - 5 = 3(2k + 1) - 5 = 6k + 3 - 5 = 6k - 2 = 2(3k - 1).$$

Since $3k - 1$ is an integer, $3n - 5$ is even. ∎

Which of the following is proved above?

1. $3n - 5$ is an even integer.
2. If $n$ is an odd integer, then $3n - 5$ is an even integer.
3. Let $n$ be an integer. If $3n - 5$ is an even integer, then $n$ is an odd integer.
4. Let $n$ be an integer. If $3n - 5$ is an odd integer, then $n$ is an even integer.

*(blank for work)*

**Problem 3.20:** Evaluate the proposed proof of the following result.

**Result:** If $x$ and $y$ are integers of the same parity, then $x - y$ is even.

**Proof:** Let $x$ and $y$ be two integers of the same parity. We consider two cases, according to whether $x$ and $y$ are both even or are both odd.

Case 1. *$x$ and $y$ are both even.* Let $x = 6$ and $y = 2$, which are both even. Then $x - y = 4$, which is even.

Case 2. *$x$ and $y$ are both odd.* Let $x = 7$ and $y = 1$, which are both odd. Then $x - y = 6$, which is even. ∎

*(blank for work)*

**Problem 3.21:** Evaluate the proposed proof of the following result.

**Result:** If $m$ is an even integer and $n$ is an odd integer, then $3m + 5n$ is odd.

**Proof:** Let $m$ be an even integer and $n$ an odd integer. Then $m = 2k$ and $n = 2k + 1$, where $k \in \mathbb{Z}$. Therefore,

$$3m + 5n = 3(2k) + 5(2k + 1) = 6k + 10k + 5 = 16k + 5 = 2(8k + 2) + 1.$$

Since $8k + 2$ is an integer, $3m + 5n$ is odd. ∎

*(blank for work)*

**Example:** (# 48) Consider the following statement.

Let $n \in \mathbb{Z}$. Then $(n - 5)(n + 7)(n + 13)$ is odd if and only if $n$ is even.

Which of the following would be an appropriate way to begin a proof of this statement?

- (a) Assume that $(n - 5)(n + 7)(n + 13)$ is odd.
- (b) Assume that $(n - 5)(n + 7)(n + 13)$ is even.
- (c) Assume that $n$ is even.
- (d) Assume that $n$ is odd.
- (e) We consider two cases, according to whether $n$ is even or $n$ is odd.

*(blank for work)*
