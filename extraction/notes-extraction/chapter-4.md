# Notes for Chapter 4

*Copied from `Ch4 (1).pdf` (13 pages). Every section in the handout (4.1–4.6) is on Test 2. The handout leaves blank space under each example and proof for working in class; those blanks are marked "*(blank for work)*". The homework numbers for every section are collected in [assignments.md](assignments.md).*

## Section 4.1 – Proofs Involving Divisibility of Integers

> HW: # 2, 10
> (For # 10, prove the direction not done in class. Hint: Show $n^4$ is odd and use Theorem 3.12 twice.)

**Definition:** If $a$ and $b$ are integers and $a \ne 0$, then $a$ <u>divides</u> $b$ if and only if $b = ac$ for some integer $c$. We also say $b$ is a <u>multiple</u> of $a$, $a$ is a <u>factor</u> of $b$, and $a$ is a <u>divisor</u> of $b$.

**Notation:** $a \mid b$ means "$a$ divides $b$" and $a \nmid b$ means "$a$ does not divide $b$."

**Examples:** Which of the following are true statements? $3 \mid 9$, $7 \mid 22$, $1 \mid 76$, $-16 \mid 0$ *(blank for work)*

**Note:** $a \mid b$ is NOT a number.

**Result 4.1: (Transitivity of Divisibility)** Let $a, b, c \in \mathbb{Z}$ with $a, b \ne 0$. If $a \mid b$ and $b \mid c$, then $a \mid c$.

**Proof:** *(blank for work)*

**Example:** For all integers $a$, $b$, and $c$, if $a \mid b$ and $a \mid c$, then $a \mid (2b - 3c)$. *(blank for work)*

**Result 4.4:** Let $x \in \mathbb{Z}$. If $2 \mid (x^2 - 1)$, then $4 \mid (x^2 - 1)$.

**Proof:** *(blank for work)*

**Example:** (# 5) Let $a, b, c \in \mathbb{Z}$, where $a \ne 0$. If $a \nmid bc$, then $a \nmid b$ and $a \nmid c$.

**Proof:** *(blank for work)*

**Example:** (# 10) (one direction only) Let $n \in \mathbb{Z}$. If $4 \mid (n^2 + 3)$, then $2 \mid (n^4 - 3)$.

**Proof:** *(blank for work)*

## Section 4.2 – Proofs Involving Congruence of Integers

> HW: # 14, 22d, 75, 87. (Use definitions in all proofs. Do not use theorems from the text.)

**Definition:** If $a$ and $b$ are integers and $n \ge 2$, we say <u>$a$ is congruent to $b$ modulo $n$</u> if $n \mid (a - b)$. Notation: $a \equiv b \pmod{n}$.

**Note:** $a \equiv b \pmod{n}$ if the remainders of $a$ and $b$ when divided by $n$ are equal. *(blank for work)*

**Note:** For every integer $a$, $a \equiv 0 \pmod{n}$, $a \equiv 1 \pmod{n}$, …, or $a \equiv (n - 1) \pmod{n}$. Also, if $a \equiv 1 \pmod{n}$, then $a = nk + 1$ for some $k \in \mathbb{Z}$, etc. *(blank for work)*

**Result 4.9:** Let $a, b, k$, and $n$ be integers where $n \ge 2$. If $a \equiv b \pmod{n}$, then $ka \equiv kb \pmod{n}$. *(blank for work)*

**Result 4.10:** Let $a, b, c, d$, and $n$ be integers where $n \ge 2$. If $a \equiv b \pmod{n}$ and $c \equiv d \pmod{n}$, then $a + c \equiv b + d \pmod{n}$. *(blank for work)*

**Result 4.11:** Let $a, b, c, d, n \in \mathbb{Z}$ with $n \ge 2$. If $a \equiv b \pmod{n}$ and $c \equiv d \pmod{n}$, then $ac \equiv bd \pmod{n}$. *(blank for work)*

## Section 4.3 – Proofs Involving Real Numbers

> HW: # 26, 30, 34, 36 (On # 34, do not do cases like in the proof of the Triangle Inequality.)
> (Hint for # 26: Use the idea that if $x \in \mathbb{Z}$ and $x < 9w + 1$, then $x \le 9w$.)

Note that the opening paragraph on page 113 lists all facts about real numbers that we understand need no justification.

**Result 4.15:** Let $x \in \mathbb{R}$. If $x^5 - 3x^4 + 2x^3 - x^2 + 4x - 1 \ge 0$, then $x \ge 0$.

**Proof:** *(blank for work)*

**Result 4.16:** If $x, y \in \mathbb{R}$, then $\frac{1}{3}x^2 + \frac{3}{4}y^2 \ge xy$.

**Proof:** *(blank for work)*

**Theorem 4.17:** For all $x, y \in \mathbb{R}$, $|x + y| \le |x| + |y|$. (Triangle Inequality)

**Proof:** *(blank for work)*

## Section 4.4 – Proofs Involving Sets

> HW: # 40, 42, 46, 85

Recall that to prove $X \subseteq Y$, you assume $x \in X$ and show $x \in Y$. To prove $X = Y$, you must show $X \subseteq Y$ and $Y \subseteq X$. When the sets are "complicated" and using properties of sets is difficult in a proof, we use the method of element-chasing instead.

**Result 4.19:** For any sets $A$ and $B$, $A - B = A \cap \overline{B}$.

**Proof:** *(blank for work)*

**Example:** (# 44) If $A$ and $B$ are sets such that $A \cup B \ne \emptyset$, then $A \ne \emptyset$ or $B \ne \emptyset$.

**Proof:** *(blank for work)*

**Example:** (# 45) Let $A = \{n \in \mathbb{Z} \mid n \equiv 1 \pmod{2}\}$ and $B = \{n \in \mathbb{Z} \mid n \equiv 3 \pmod{4}\}$. Then $B \subseteq A$.

**Proof:** *(blank for work)*

**Result 4.21:** Let $A$ and $B$ be sets. Then $A \cup B = A$ if and only if $B \subseteq A$.

**Proof:** *(blank for work)*

## Section 4.5 – Fundamental Properties of Set Operations

> HW: # 54 (Use element-chasing), 56 (Use set properties, not element-chasing)

**Theorem 4.22:** Let all sets referred to below be subsets of a universal set $U$. For all sets $A$, $B$, and $C$:

1. Commutative Laws: $A \cap B = B \cap A$ and $A \cup B = B \cup A$
2. Associative Laws: $(A \cap B) \cap C = A \cap (B \cap C)$ and $(A \cup B) \cup C = A \cup (B \cup C)$
3. Distributive Laws: $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ and $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$
4. DeMorgan's Laws: $\overline{A \cup B} = \overline{A} \cap \overline{B}$ and $\overline{A \cap B} = \overline{A} \cup \overline{B}$

**Example:** (# 53) For every three sets $A$, $B$, and $C$, $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.

**Proof:** *(blank for work)*

**Theorem:** Let all sets referred to below be subsets of a universal set $U$. For all sets $A$, $B$, and $C$:

1. Identity Laws: $A \cup \emptyset = A$ and $A \cap U = A$
2. Complement Laws: $A \cup \overline{A} = U$ and $A \cap \overline{A} = \emptyset$
3. Double Complement Law: $\overline{\overline{A}} = A$
4. Idempotent Laws: $A \cap A = A$ and $A \cup A = A$
5. Universal Bound Laws: $A \cup U = U$ and $A \cap \emptyset = \emptyset$
6. Absorption Laws: $A \cup (A \cap B) = A$ and $A \cap (A \cup B) = A$
7. Complements of $U$ and $\emptyset$: $\overline{U} = \emptyset$ and $\overline{\emptyset} = U$
8. Set Difference Law: $A - B = A \cap \overline{B}$

**Example:** Use properties of sets (not element-chasing) to show: For all sets $A$ and $B$, $\overline{\overline{B} \cup (\overline{B} - A)} = B$.

**Proof:** *(blank for work)*

## Section 4.6 – Proofs Involving Cartesian Products of Sets

> HW: # 68, 70, 88
> (In # 70, pick specific sets for $A$ and $B$. Then compute $\overline{A \times B}$ and $\overline{A} \times \overline{B}$ and show they are not the same.)

**Example:** (# 67) For all sets $A$, $B$, and $C$, $A \times (B \cap C) = (A \times B) \cap (A \times C)$.

**Proof:** *(blank for work)*

**Result 4.25:** For all sets $A$, $B$, and $C$, $A \times (B - C) = (A \times B) - (A \times C)$.

**Proof:** *(blank for work)*

**Example:** (# 69) Let $A$, $B$, $C$, and $D$ be sets. Then $(A \times B) \cup (C \times D) \subseteq (A \cup C) \times (B \cup D)$.

**Proof:** *(blank for work)*

**Example:** (# 65) Let $A$, $B$, and $C$ be nonempty sets. Then $A \times C \subseteq B \times C$ if and only if $A \subseteq B$.

**Proof:** *(blank for work)*
