import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const calculus: Solution[] = [
  {
    id: 'calc-1',
    solution: r`Let $f(x) = x^3 + x - 1$, a polynomial and therefore continuous and differentiable everywhere.

**Existence.** $f(0) = -1 < 0$ and $f(1) = 1 > 0$. By the intermediate value theorem there is $c \in (0, 1)$ with $f(c) = 0$.

**Uniqueness.** $f'(x) = 3x^2 + 1 > 0$ for all $x$, so $f$ is strictly increasing on $\mathbb{R}$ and takes each value at most once. (Alternatively: two roots would, by Rolle's theorem, force $f'$ to vanish somewhere between them, which it never does.)

So there is exactly one real root, and it lies in $(0, 1)$.`,
    rubric: {
      keyIdeas: [
        'Separates existence from uniqueness.',
        'Existence: sign change on [0, 1] plus continuity, citing the intermediate value theorem.',
        'Uniqueness: f′ > 0 everywhere, so f is strictly increasing (or Rolle’s theorem).',
        'Concludes the root is in (0, 1).',
      ],
      commonErrors: [
        'Shows a sign change and stops, without addressing uniqueness.',
        'Argues from a sketch or a cubic "having one or three roots" without proof.',
        'Tries to solve the cubic explicitly.',
        'Uses the intermediate value theorem without mentioning continuity (minor: point it out, do not fail on it).',
      ],
    },
  },
  {
    id: 'calc-2',
    solution: r`**(a)** If $a = b$ both sides are $0$. Otherwise, $\sin$ is differentiable on $\mathbb{R}$, so by the mean value theorem there is $c$ between $a$ and $b$ with

$$\sin a - \sin b = \cos(c)\,(a - b).$$

Taking absolute values and using $\lvert\cos c\rvert \le 1$ gives $\lvert \sin a - \sin b\rvert \le \lvert a - b\rvert$.

**(b)** *Claim.* If $f$ is differentiable on an interval and $\lvert f'(x)\rvert \le M$ there, then $\lvert f(a) - f(b)\rvert \le M\lvert a - b\rvert$ for all $a, b$ in the interval.

*Proof.* For $a \ne b$ the mean value theorem gives $c$ between them with $f(a) - f(b) = f'(c)(a - b)$, so $\lvert f(a) - f(b)\rvert = \lvert f'(c)\rvert\,\lvert a - b\rvert \le M\lvert a - b\rvert$. The case $a = b$ is trivial.`,
    rubric: {
      keyIdeas: [
        'Identifies the mean value theorem as the link between a change in f and a change in x.',
        'Applies it correctly on the interval between a and b, with the intermediate point c.',
        'Bounds |cos c| ≤ 1 and takes absolute values.',
        'States the general Lipschitz bound |f(a) − f(b)| ≤ M|a − b| and proves it the same way.',
      ],
      commonErrors: [
        'Uses sin x ≤ x, which only handles b = 0 and x ≥ 0.',
        'Uses the sum-to-product identity but then needs |sin t| ≤ |t|, assumed without proof. (Acceptable if that inequality is itself justified.)',
        'States (b) with the bound on f rather than on f′.',
        'Ignores the case a = b; minor.',
      ],
    },
  },
  {
    id: 'calc-3',
    answer: r`$I = \pi/4$.`,
    solution: r`On $[0, \pi/2]$ both $\sin x$ and $\cos x$ are non-negative and never zero together, so the denominator is positive and the integrand is continuous.

Substitute $u = \tfrac{\pi}{2} - x$. Then $\sin x = \cos u$, $\cos x = \sin u$, $dx = -du$, and the limits swap, so

$$I = \int_0^{\pi/2} \frac{\cos^n u}{\cos^n u + \sin^n u}\,du.$$

Adding this to the original expression for $I$ (and renaming $u$ to $x$),

$$2I = \int_0^{\pi/2} \frac{\sin^n x + \cos^n x}{\sin^n x + \cos^n x}\,dx = \int_0^{\pi/2} 1\,dx = \frac{\pi}{2}.$$

Hence $I = \pi/4$, independent of $n$.`,
    rubric: {
      keyIdeas: [
        'Uses the reflection x ↦ π/2 − x, which swaps sin and cos and preserves the interval.',
        'Obtains a second expression for the same integral.',
        'Adds the two expressions so the integrand becomes 1.',
        'Concludes I = π/4.',
      ],
      commonErrors: [
        'Sign or limit errors in the substitution (the minus sign from dx is cancelled by swapping the limits).',
        'Checks one value of n (such as n = 1 or 2) and generalises without argument.',
        'Attempts an antiderivative, e.g. dividing through by cosⁿ x.',
      ],
    },
  },
  {
    id: 'calc-4',
    solution: r`Let $g(x) = f(x) - x$. Fixed points of $f$ are exactly the zeros of $g$. Since $f'(x) \le \tfrac12$, we have $g'(x) = f'(x) - 1 \le -\tfrac12$ for all $x$.

**Uniqueness.** $g' < 0$ everywhere, so $g$ is strictly decreasing and has at most one zero.

**Existence.** For $x > 0$ the mean value theorem gives $\xi \in (0, x)$ with
$$g(x) - g(0) = g'(\xi)\,x \le -\tfrac{x}{2}, \qquad\text{so}\qquad g(x) \le g(0) - \tfrac{x}{2}.$$
Thus $g(x) < 0$ as soon as $x > 2\lvert g(0)\rvert$.

For $x < 0$, similarly $g(x) - g(0) = g'(\xi)\,x \ge -\tfrac{x}{2} = \tfrac{\lvert x\rvert}{2}$ (multiplying $g'(\xi) \le -\tfrac12$ by the negative number $x$ reverses the inequality). Thus $g(x) > 0$ as soon as $x < -2\lvert g(0)\rvert$.

So $g$ takes a positive value and a negative value. It is continuous (being differentiable), so by the intermediate value theorem it has a zero $c$, and $f(c) = c$.

*Alternative.* By the mean value theorem $\lvert f(a) - f(b)\rvert \le \tfrac12\lvert a - b\rvert$, so $f$ is a contraction. Iterating $x_{k+1} = f(x_k)$ gives a Cauchy sequence whose limit is the fixed point.`,
    rubric: {
      keyIdeas: [
        'Uniqueness: via g strictly decreasing, or via |f(a) − f(b)| ≤ ½|a − b| applied to two fixed points.',
        'Recognises that existence needs a separate argument because the domain is unbounded.',
        'Existence: quantitative bounds showing g is negative for large positive x and positive for large negative x, then the intermediate value theorem. Or a complete contraction-mapping iteration argument.',
        'Uses continuity of g when invoking the intermediate value theorem.',
      ],
      commonErrors: [
        'Proves uniqueness only.',
        'Says "g is decreasing, so it must cross zero". A decreasing function need not (e.g. e^(−x)); the bound g′ ≤ −½ is what forces a crossing.',
        'Cites the contraction mapping theorem by name without having shown f is a contraction, or applies it on an interval f does not map into itself.',
        'Sign error when multiplying the derivative bound by a negative x.',
      ],
    },
  },
  {
    id: 'calc-5',
    solution: r`Since $n\int_0^1 x^n\,dx = \dfrac{n}{n+1} \to 1$, we have

$$n\int_0^1 x^n f(x)\,dx - \frac{n}{n+1}f(1) = n\int_0^1 x^n\big(f(x) - f(1)\big)\,dx,$$

so it suffices to show the right-hand side tends to $0$.

Let $\varepsilon > 0$. By continuity at $1$ there is $\delta \in (0, 1)$ with $\lvert f(x) - f(1)\rvert < \varepsilon$ for $x \in [1 - \delta, 1]$. A continuous function on $[0,1]$ is bounded; let $\lvert f \rvert \le M$, so $\lvert f(x) - f(1)\rvert \le 2M$ everywhere.

*Far from 1:*
$$\left\lvert n\int_0^{1-\delta} x^n\big(f(x) - f(1)\big)\,dx\right\rvert \le 2M \cdot n\int_0^{1-\delta} x^n\,dx = 2M\,\frac{n}{n+1}(1-\delta)^{n+1} \le 2M(1-\delta)^{n+1},$$
which tends to $0$ as $n \to \infty$ because $0 < 1 - \delta < 1$.

*Near 1:*
$$\left\lvert n\int_{1-\delta}^{1} x^n\big(f(x) - f(1)\big)\,dx\right\rvert \le \varepsilon \cdot n\int_0^1 x^n\,dx \le \varepsilon.$$

So for all large $n$ the whole expression is at most $2\varepsilon$ in absolute value. As $\varepsilon$ was arbitrary it tends to $0$, and therefore

$$\lim_{n\to\infty} n\int_0^1 x^n f(x)\,dx = \lim_{n \to \infty}\frac{n}{n+1}f(1) = f(1).$$`,
    rubric: {
      keyIdeas: [
        'Computes the f ≡ 1 case, n/(n+1) → 1, and reduces to showing the integral against f(x) − f(1) vanishes.',
        'Splits the integral at 1 − δ, with δ chosen from continuity of f at 1 before letting n grow.',
        'Controls the piece away from 1 using boundedness of f and (1 − δ)ⁿ → 0.',
        'Controls the piece near 1 by ε times a quantity bounded by 1.',
        'Orders the quantifiers correctly: ε, then δ, then n large.',
      ],
      commonErrors: [
        'Swaps limit and integral without justification, or argues "n xⁿ is a delta function" informally.',
        'Integrates by parts, which needs f differentiable; only continuity is given.',
        'Lets δ depend on n.',
        'Forgets f is bounded, or bounds the far piece by something that does not go to zero.',
        'A substitution proof (t = xⁿ⁺¹ and uniform continuity / bounded convergence) is acceptable if justified.',
      ],
    },
  },
]
