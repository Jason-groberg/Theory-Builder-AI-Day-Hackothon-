import type { Problem } from '../types.ts'

const r = String.raw

export const calculus: Problem[] = [
  {
    id: 'calc-1',
    category: 'calculus',
    level: 1,
    title: 'Exactly one root',
    statement: r`Prove that the equation $x^3 + x - 1 = 0$ has exactly one real solution, and that it lies between $0$ and $1$.

You are not asked to find the solution.`,
    topics: ['Continuity', 'Roots of equations'],
    techniques: ['ivt', 'monotonicity'],
    hints: [
      r`"Exactly one" is two claims: at least one, and at most one. They usually need different tools.`,
      r`For existence, use the intermediate value theorem on $f(x) = x^3 + x - 1$. For uniqueness, think about what the derivative says about the shape of $f$.`,
      r`Compute $f(0)$ and $f(1)$. Then note $f'(x) = 3x^2 + 1 > 0$ and explain why a strictly increasing function cannot have two roots.`,
    ],
  },
  {
    id: 'calc-2',
    category: 'calculus',
    level: 2,
    title: 'Sine never stretches',
    statement: r`**(a)** Prove that $\lvert \sin a - \sin b \rvert \le \lvert a - b \rvert$ for all real numbers $a$ and $b$.

**(b)** State and prove the general fact behind (a): a statement about any differentiable function $f$ whose derivative satisfies $\lvert f'(x) \rvert \le M$ for all $x$.`,
    topics: ['Derivatives', 'Lipschitz bounds'],
    techniques: ['mvt'],
    hints: [
      r`The inequality compares a change in output with a change in input. Which theorem connects $f(a) - f(b)$ to $a - b$?`,
      r`The mean value theorem gives a point $c$ between $a$ and $b$ with $f(a) - f(b) = f'(c)(a - b)$. What do you know about the size of $f'(c)$ here?`,
      r`Handle $a = b$ separately, then for $a \ne b$ take absolute values in the mean value theorem and use $\lvert \cos c \rvert \le 1$. Part (b) is the same argument with $M$ in place of $1$.`,
    ],
  },
  {
    id: 'calc-3',
    category: 'calculus',
    level: 3,
    title: 'An integral you should not compute',
    statement: r`Let $n > 0$ be any real number. Evaluate

$$I = \int_0^{\pi/2} \frac{\sin^n x}{\sin^n x + \cos^n x}\,dx.$$

No antiderivative is needed, and the answer does not depend on $n$.`,
    topics: ['Definite integrals', 'Substitution'],
    techniques: ['symmetry'],
    hints: [
      r`Finding an antiderivative is hopeless for general $n$. What symmetry do $\sin$ and $\cos$ have on the interval $[0, \pi/2]$?`,
      r`Substitute $u = \tfrac{\pi}{2} - x$, which swaps $\sin$ and $\cos$ and maps the interval to itself. You get a second expression for the same number $I$.`,
      r`Add the two expressions for $I$. What is the integrand of the sum?`,
    ],
  },
  {
    id: 'calc-4',
    category: 'calculus',
    level: 4,
    title: 'One fixed point, guaranteed',
    statement: r`Let $f : \mathbb{R} \to \mathbb{R}$ be differentiable with $\lvert f'(x) \rvert \le \tfrac12$ for every real $x$.

Prove that there is exactly one real number $c$ with $f(c) = c$.`,
    topics: ['Fixed points', 'Contractions'],
    techniques: ['mvt', 'ivt', 'monotonicity'],
    hints: [
      r`A fixed point of $f$ is a root of $g(x) = f(x) - x$. What does the bound on $f'$ tell you about $g'$?`,
      r`$g'(x) \le -\tfrac12$ everywhere, so $g$ is strictly decreasing: that gives uniqueness. Existence is the harder half, because the domain is all of $\mathbb{R}$ and you must show $g$ actually changes sign.`,
      r`Use the mean value theorem on $[0, x]$ to get $g(x) \le g(0) - \tfrac{x}{2}$ for $x > 0$, and a matching lower bound for $x < 0$. Conclude that $g$ is negative far to the right and positive far to the left, then apply the intermediate value theorem.`,
    ],
  },
  {
    id: 'calc-5',
    category: 'calculus',
    level: 5,
    title: 'Where the mass concentrates',
    statement: r`Let $f$ be a continuous function on $[0, 1]$. Prove that

$$\lim_{n \to \infty} n \int_0^1 x^n f(x)\,dx = f(1).$$`,
    topics: ['Limits of integrals', 'Continuity'],
    techniques: ['epsilon-bounding'],
    hints: [
      r`Try $f \equiv 1$ first. Then sketch $n x^n$ for large $n$: where on $[0,1]$ does almost all of its area sit?`,
      r`Since $n\int_0^1 x^n\,dx = \tfrac{n}{n+1} \to 1$, it is enough to show $n\int_0^1 x^n\,(f(x) - f(1))\,dx \to 0$. Near $x = 1$ the factor $f(x) - f(1)$ is small; away from $1$ the factor $x^n$ is tiny.`,
      r`Given $\varepsilon > 0$, choose $\delta$ so that $\lvert f(x) - f(1) \rvert < \varepsilon$ on $[1-\delta, 1]$. Split the integral at $1 - \delta$. Bound the left piece using a bound $M$ for $\lvert f \rvert$ and the fact that $(1-\delta)^n \to 0$; bound the right piece by $\varepsilon$.`,
    ],
  },
]
