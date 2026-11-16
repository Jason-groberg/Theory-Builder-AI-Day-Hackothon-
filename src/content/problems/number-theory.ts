import type { Problem } from '../types.ts'

const r = String.raw

export const numberTheory: Problem[] = [
  {
    id: 'nt-1',
    category: 'number-theory',
    level: 1,
    title: 'Always a multiple of six',
    statement: r`Prove that $n^3 - n$ is divisible by $6$ for every integer $n$.`,
    topics: ['Divisibility', 'Consecutive integers'],
    techniques: ['divisibility'],
    hints: [
      r`Before reaching for induction, try to factor the expression completely. What do you notice about the factors?`,
      r`$n^3 - n = (n-1)\,n\,(n+1)$ is a product of three consecutive integers. What can you say about divisibility by $2$ and by $3$ among any three consecutive integers?`,
      r`Show one of the three factors is a multiple of $3$ and at least one is even. Then explain why divisibility by both $2$ and $3$ gives divisibility by $6$.`,
    ],
  },
  {
    id: 'nt-2',
    category: 'number-theory',
    level: 2,
    title: 'Sums of two squares',
    statement: r`Prove that there are no integers $x$, $y$, $z$ with

$$x^2 + y^2 = 4z + 3.$$

In other words, a number that leaves remainder $3$ when divided by $4$ is never a sum of two squares.`,
    topics: ['Quadratic residues', 'Diophantine equations'],
    techniques: ['modular-arithmetic'],
    hints: [
      r`An equation between integers must also hold between their remainders. Which modulus does the right-hand side suggest?`,
      r`Work modulo $4$. What remainders can a perfect square leave when divided by $4$? Check even and odd numbers separately.`,
      r`Squares are $0$ or $1$ modulo $4$. List every possible value of $x^2 + y^2$ modulo $4$ and compare with the right-hand side.`,
    ],
  },
  {
    id: 'nt-3',
    category: 'number-theory',
    level: 3,
    title: 'Primes of the form 4k + 3',
    statement: r`Prove that there are infinitely many prime numbers that leave remainder $3$ when divided by $4$.`,
    topics: ['Primes', 'Arithmetic progressions'],
    techniques: ['euclid-construction', 'contradiction', 'modular-arithmetic'],
    hints: [
      r`Recall Euclid's proof that there are infinitely many primes: assume a finite list, then build a number that none of them divides. The number you build here must also force a prime factor of the right kind.`,
      r`Key fact: a product of numbers that are all $1$ modulo $4$ is again $1$ modulo $4$. So an odd number that is $3$ modulo $4$ must have at least one prime factor that is $3$ modulo $4$.`,
      r`If $p_1, \dots, p_k$ were all such primes, consider $N = 4\,p_1 p_2 \cdots p_k - 1$. Find its remainder modulo $4$, and show that none of the $p_i$ can divide it.`,
    ],
  },
  {
    id: 'nt-4',
    category: 'number-theory',
    level: 4,
    title: 'No way down',
    statement: r`**(a)** Prove that the only integer solution of

$$x^2 + y^2 = 3z^2$$

is $x = y = z = 0$.

**(b)** Deduce that the circle $X^2 + Y^2 = 3$ contains no point whose coordinates are both rational.`,
    topics: ['Diophantine equations', 'Rational points'],
    techniques: ['infinite-descent', 'modular-arithmetic', 'extremal-principle'],
    hints: [
      r`The $3$ on the right is a clue. What does the equation say about $x$ and $y$ modulo $3$?`,
      r`Squares are $0$ or $1$ modulo $3$, so $x^2 + y^2 \equiv 0 \pmod 3$ forces both $x$ and $y$ to be multiples of $3$. Substitute $x = 3a$, $y = 3b$ and see what that forces on $z$.`,
      r`You will find $z = 3c$ and $a^2 + b^2 = 3c^2$: a strictly smaller solution of the same equation. Explain why this is impossible if you start from a nonzero solution chosen as small as possible. For (b), write the rational coordinates over a common denominator.`,
    ],
  },
  {
    id: 'nt-5',
    category: 'number-theory',
    level: 5,
    title: 'Every number is nearly rational',
    statement: r`Let $\alpha$ be any real number and let $N$ be a positive integer. Prove that there are integers $p$ and $q$ with $1 \le q \le N$ such that

$$\lvert q\alpha - p \rvert < \frac{1}{N}.$$

Then deduce that $\left\lvert \alpha - \dfrac{p}{q} \right\rvert < \dfrac{1}{q^2}$ for this $p$ and $q$.`,
    topics: ['Diophantine approximation', 'Fractional parts'],
    techniques: ['pigeonhole'],
    hints: [
      r`The quantity $\lvert q\alpha - p\rvert$ is small when $q\alpha$ is close to an integer. Look at the fractional parts of the multiples $0, \alpha, 2\alpha, \dots, N\alpha$. How many are there, and where do they live?`,
      r`There are $N + 1$ fractional parts in $[0, 1)$. Cut $[0,1)$ into $N$ intervals of length $1/N$ and apply the pigeonhole principle.`,
      r`If the fractional parts of $k\alpha$ and $l\alpha$ with $k < l$ fall in the same interval, take $q = l - k$ and let $p$ be the difference of the integer parts. For the last claim, divide by $q$ and use $q \le N$.`,
    ],
  },
]
