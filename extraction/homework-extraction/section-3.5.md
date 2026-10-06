# Section 3.5 – Proof Evaluations

*Exercise text copied from photos of the textbook's Section 3.5 Exercises (page 101 and the page before it). Homework: 42, 44, 46.*

## 42

Below is given a proof of a result. Which result is being proved?

***Proof*** Assume that $x$ is even. Then $x = 2a$ for some integer $a$. So,

$$3x^2 - 4x - 5 = 3(2a)^2 - 4(2a) - 5 = 12a^2 - 8a - 5 = 2(6a^2 - 4a - 3) + 1.$$

Since $6a^2 - 4a - 3$ is an integer, $3x^2 - 4x - 5$ is odd.

For the converse, assume that $x$ is odd. So, $x = 2b + 1$, where $b \in \mathbb{Z}$. Therefore,

$$
\begin{aligned}
3x^2 - 4x - 5 &= 3(2b + 1)^2 - 4(2b + 1) - 5 = 3(4b^2 + 4b + 1) - 8b - 4 - 5 \\
&= 12b^2 + 4b - 6 = 2(6b^2 + 2b - 3).
\end{aligned}
$$

Since $6b^2 + 2b - 3$ is an integer, $3x^2 - 4x - 5$ is even. ∎

## 44

Evaluate the proof of the following result.

**Result** Let $a, b \in \mathbb{Z}$. Then $a - b$ is even if and only if $a$ and $b$ are of the same parity.

***Proof*** We consider two cases.

Case 1. *$a$ and $b$ are of the same parity.* We now consider two subcases.

Subcase 1.1. *$a$ and $b$ are both even.* Then $a = 2x$ and $b = 2y$, where $x, y \in \mathbb{Z}$. Then $a - b = 2x - 2y = 2(x - y)$. Since $x - y$ is an integer, $a - b$ is even.

Subcase 1.2. *$a$ and $b$ are both odd.* Then $a = 2x + 1$ and $b = 2y + 1$, where $x, y \in \mathbb{Z}$. Then $a - b = (2x + 1) - (2y + 1) = 2(x - y)$. Since $x - y$ is an integer, $a - b$ is even.

Case 2. *$a$ and $b$ are of opposite parity.* We again have two subcases.

Subcase 2.1. *$a$ is odd and $b$ is even.* Then $a = 2x + 1$ and $b = 2y$, where $x, y \in \mathbb{Z}$. Then $a - b = (2x + 1) - 2y = 2(x - y) + 1$. Since $x - y$ is an integer, $a - b$ is odd.

Subcase 2.2. *$a$ is even and $b$ is odd.* Then $a = 2x$ and $b = 2y + 1$, where $x, y \in \mathbb{Z}$. Then $a - b = 2x - (2y + 1) = 2x - 2y - 1 = 2(x - y - 1) + 1$. Since $x - y - 1$ is an integer, $a - b$ is odd. ∎

## 46

Given below is a proof of a result. What is the result?

***Proof*** Assume, without loss of generality, that $x$ and $y$ are even. Then $x = 2a$ and $y = 2b$ for integers $a$ and $b$. Therefore,

$$xy + xz + yz = (2a)(2b) + (2a)z + (2b)z = 2(2ab + az + bz).$$

Since $2ab + az + bz$ is an integer, $xy + xz + yz$ is even. ∎
