import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const numberTheory: Solution[] = [
  {
    id: 'nt-1',
    solution: r`Factor: $n^3 - n = n(n^2 - 1) = (n-1)\,n\,(n+1)$, a product of three consecutive integers.

- Among any two consecutive integers one is even, so the product is divisible by $2$.
- Among any three consecutive integers exactly one is a multiple of $3$ (their remainders modulo $3$ are $0, 1, 2$ in some order), so the product is divisible by $3$.

Since $2$ and $3$ are coprime, a number divisible by both is divisible by $2 \cdot 3 = 6$. Hence $6 \mid n^3 - n$ for every integer $n$.`,
    rubric: {
      keyIdeas: [
        'Factors the expression as a product of three consecutive integers (or does a complete case check modulo 6, or modulo 2 and 3 separately).',
        'Justifies divisibility by 2.',
        'Justifies divisibility by 3.',
        'Combines the two using that 2 and 3 are coprime.',
      ],
      commonErrors: [
        'Checks a few values of n and declares the pattern.',
        'Shows divisibility by 2 and 3 but does not say why that gives 6. Minor, but worth a prompt.',
        'An induction proof that only covers n ≥ 0 or n ≥ 1; the claim is for all integers.',
        'A correct induction, or Fermat’s little theorem for p = 2 and p = 3, is acceptable.',
      ],
    },
  },
  {
    id: 'nt-2',
    solution: r`Work modulo $4$. Every integer is even or odd:

- if $x = 2k$ then $x^2 = 4k^2 \equiv 0 \pmod 4$;
- if $x = 2k + 1$ then $x^2 = 4k^2 + 4k + 1 \equiv 1 \pmod 4$.

So every square is congruent to $0$ or $1$ modulo $4$, and a sum of two squares is congruent to $0 + 0$, $0 + 1$ or $1 + 1$, that is, to $0$, $1$ or $2$. It is never congruent to $3$.

But $4z + 3 \equiv 3 \pmod 4$ for every integer $z$. So $x^2 + y^2 = 4z + 3$ has no integer solutions.`,
    rubric: {
      keyIdeas: [
        'Reduces the equation modulo 4.',
        'Shows squares are 0 or 1 modulo 4, with justification (parity cases or checking residues 0–3).',
        'Enumerates the possible sums and observes 3 is not among them.',
        'Concludes there is no solution.',
      ],
      commonErrors: [
        'States "squares are 0 or 1 mod 4" without any justification. Ask for it once, then accept.',
        'Works modulo 2 or modulo 3, where no contradiction arises.',
        'Considers only positive integers or only odd x, y.',
      ],
    },
  },
  {
    id: 'nt-3',
    solution: r`Suppose, for contradiction, that there are only finitely many primes congruent to $3$ modulo $4$, say $p_1, \dots, p_k$ (the list is non-empty: it contains $3$). Let

$$N = 4\,p_1 p_2 \cdots p_k - 1.$$

Then $N \ge 11$, $N$ is odd, and $N \equiv -1 \equiv 3 \pmod 4$.

**$N$ has a prime factor congruent to $3$ modulo $4$.** Every prime factor of $N$ is odd, hence congruent to $1$ or $3$ modulo $4$. If all of them were congruent to $1$, then $N$, being a product of such primes, would be congruent to $1$ modulo $4$, since $1 \cdot 1 \equiv 1$. That contradicts $N \equiv 3$. So some prime $q \equiv 3 \pmod 4$ divides $N$.

**$q$ is not on the list.** Each $p_i$ divides $4p_1\cdots p_k = N + 1$. If $p_i$ also divided $N$, it would divide $(N + 1) - N = 1$, which is impossible. So $q \ne p_i$ for every $i$.

Thus $q$ is a prime congruent to $3$ modulo $4$ that is missing from the supposedly complete list, a contradiction. Therefore there are infinitely many such primes.`,
    rubric: {
      keyIdeas: [
        'Assumes a finite complete list and builds a number that is 3 modulo 4 and coprime to every prime on the list (e.g. 4p₁⋯p_k − 1).',
        'Proves the closure fact: a product of numbers that are 1 modulo 4 is 1 modulo 4.',
        'Deduces N has a prime factor that is 3 modulo 4.',
        'Shows that factor cannot be on the list.',
      ],
      commonErrors: [
        'Uses p₁⋯p_k + 1 unchanged from Euclid, which need not be 3 modulo 4.',
        'Claims N itself is prime.',
        'Skips the closure fact, jumping from "N is 3 mod 4" to "N has a prime factor that is 3 mod 4".',
        'Uses 4p₁⋯p_k + 3 while 3 is on the list (then 3 divides N). The variant 4p₂⋯p_k + 3 with 3 excluded from the product is fine.',
        'Tries the same proof shape for 1 modulo 4, where it does not work.',
      ],
    },
  },
  {
    id: 'nt-4',
    solution: r`**(a)** *Squares modulo 3.* If $t \equiv 0$ then $t^2 \equiv 0$; if $t \equiv \pm 1$ then $t^2 \equiv 1 \pmod 3$. So a sum of two squares is divisible by $3$ only if both squares are $\equiv 0$, that is, only if both numbers are divisible by $3$ (the other sums are $1$ and $2$).

*Descent.* Suppose there is a solution other than $(0,0,0)$. Among all such solutions choose one with $\lvert x\rvert + \lvert y\rvert + \lvert z\rvert$ as small as possible; this is a positive integer, so a smallest one exists.

Since $x^2 + y^2 = 3z^2 \equiv 0 \pmod 3$, both $x$ and $y$ are divisible by $3$: write $x = 3a$, $y = 3b$. Then

$$9a^2 + 9b^2 = 3z^2 \quad\Longrightarrow\quad z^2 = 3(a^2 + b^2),$$

so $3 \mid z^2$ and hence $3 \mid z$; write $z = 3c$. Substituting, $9c^2 = 3(a^2 + b^2)$, i.e.

$$a^2 + b^2 = 3c^2.$$

So $(a, b, c) = (x/3, y/3, z/3)$ is again an integer solution. It is not $(0,0,0)$, and $\lvert a\rvert + \lvert b\rvert + \lvert c\rvert = \tfrac13(\lvert x\rvert + \lvert y\rvert + \lvert z\rvert)$ is strictly smaller. This contradicts minimality. Hence the only solution is $(0, 0, 0)$.

**(b)** Suppose $(X, Y)$ is a rational point with $X^2 + Y^2 = 3$. Write $X = x/z$ and $Y = y/z$ with integers $x, y$ and a common denominator $z \ge 1$. Multiplying by $z^2$ gives $x^2 + y^2 = 3z^2$ with $z \ne 0$, contradicting (a). So the circle has no rational points.`,
    rubric: {
      keyIdeas: [
        'Uses squares modulo 3 to show x and y must both be multiples of 3.',
        'Substitutes and deduces z is also a multiple of 3.',
        'Observes (x/3, y/3, z/3) is another solution of the same equation.',
        'Closes the argument rigorously: minimal solution, infinite descent, or dividing out a common factor at the start.',
        'For (b), clears denominators to produce a nonzero integer solution.',
      ],
      commonErrors: [
        'Shows 3 divides x, y, z and stops, without explaining why that is contradictory.',
        'Says "repeat forever" with no reference to the impossibility of an infinitely decreasing sequence of positive integers. Prompt for the missing sentence.',
        'Assumes gcd(x, y, z) = 1 without noting this can be arranged for a nonzero solution.',
        'Uses modulo 4 instead of modulo 3. This can be made to work (it forces all three even) and is acceptable if complete.',
        'For (b), uses different denominators for X and Y and mishandles the algebra.',
      ],
    },
  },
  {
    id: 'nt-5',
    solution: r`Write $\{t\} = t - \lfloor t\rfloor \in [0, 1)$ for the fractional part of $t$.

Consider the $N + 1$ numbers $\{0\cdot\alpha\}, \{1\cdot\alpha\}, \dots, \{N\alpha\}$, all in $[0, 1)$. Divide $[0, 1)$ into the $N$ intervals

$$\Big[0, \tfrac1N\Big),\ \Big[\tfrac1N, \tfrac2N\Big),\ \dots,\ \Big[\tfrac{N-1}{N}, 1\Big).$$

By the pigeonhole principle two of the $N + 1$ numbers lie in the same interval: there are integers $0 \le k < l \le N$ with

$$\big\lvert \{l\alpha\} - \{k\alpha\} \big\rvert < \frac1N.$$

(The intervals are half-open of length $\tfrac1N$, so two points in the same one differ by strictly less than $\tfrac1N$.)

Let $q = l - k$ and $p = \lfloor l\alpha\rfloor - \lfloor k\alpha\rfloor$. Then $1 \le q \le N$, and

$$q\alpha - p = (l\alpha - \lfloor l\alpha\rfloor) - (k\alpha - \lfloor k\alpha\rfloor) = \{l\alpha\} - \{k\alpha\},$$

so $\lvert q\alpha - p\rvert < \tfrac1N$.

**Deduction.** Dividing by $q > 0$ and using $q \le N$, i.e. $\tfrac1N \le \tfrac1q$,

$$\Big\lvert \alpha - \frac pq\Big\rvert < \frac{1}{qN} \le \frac{1}{q^2}.$$`,
    rubric: {
      keyIdeas: [
        'Considers the fractional parts of the N + 1 multiples 0, α, …, Nα.',
        'Partitions [0, 1) into N intervals of length 1/N and applies the pigeonhole principle.',
        'Takes q as the difference of the two indices and p as the difference of the integer parts.',
        'Verifies 1 ≤ q ≤ N and |qα − p| < 1/N (strict).',
        'Divides by q and uses q ≤ N for the final bound.',
      ],
      commonErrors: [
        'Uses only N multiples (1 to N), so the pigeonhole principle does not apply directly.',
        'Gets ≤ 1/N instead of < 1/N by using closed intervals.',
        'Assumes α is irrational, or positive; neither is given or needed.',
        'Picks p as the nearest integer to qα for a hoped-for q without showing a suitable q exists.',
        'Forgets to check q ≥ 1 (the two indices must be different).',
      ],
    },
  },
]
