import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const statistics: Solution[] = [
  {
    id: 'stat-1',
    answer: r`(b) Yes. (c) Four times as much data.`,
    solution: r`**(a)** By linearity of expectation,
$$E[\bar X] = \frac1n\sum_{i=1}^n E[X_i] = \frac1n \cdot n\mu = \mu.$$

For the variance, constants come out squared, and the variance of a sum of *independent* variables is the sum of the variances:
$$\operatorname{Var}(\bar X) = \frac{1}{n^2}\operatorname{Var}\!\Big(\sum_{i=1}^n X_i\Big) = \frac{1}{n^2}\sum_{i=1}^n \operatorname{Var}(X_i) = \frac{n\sigma^2}{n^2} = \frac{\sigma^2}{n}.$$
Independence is used only in the middle equality, to drop the covariance terms.

**(b)** Yes. The expectation calculation used only linearity, which holds for any random variables. Dependence changes the variance of $\bar X$, not its mean.

**(c)** The standard error is $\sigma/\sqrt{n}$. To halve it we need $\sqrt{n}$ to double, so $n$ must be multiplied by $4$.`,
    rubric: {
      keyIdeas: [
        'Uses linearity of expectation for the mean.',
        'Pulls the constant 1/n out of the variance as 1/n².',
        'Uses additivity of variance and pinpoints that this is the step needing independence (zero covariance).',
        'Answers (b) yes, with the reason that linearity needs no independence.',
        'Answers (c) with a factor of 4, from the square-root law.',
      ],
      commonErrors: [
        'Pulls 1/n out of the variance without squaring, getting σ².',
        'Says independence is needed for the expectation.',
        'Answers "twice as much data" for (c).',
        'Assumes the data are normal; not needed.',
      ],
    },
  },
  {
    id: 'stat-2',
    solution: r`**(a)** Write $X_i - \bar X = (X_i - \mu) - (\bar X - \mu)$. Then

$$\sum_{i=1}^n (X_i - \bar X)^2 = \sum_{i=1}^n (X_i - \mu)^2 - 2(\bar X - \mu)\sum_{i=1}^n (X_i - \mu) + n(\bar X - \mu)^2.$$

Since $\sum (X_i - \mu) = n(\bar X - \mu)$, the middle term is $-2n(\bar X - \mu)^2$, and

$$\sum_{i=1}^n (X_i - \bar X)^2 = \sum_{i=1}^n (X_i - \mu)^2 - n(\bar X - \mu)^2.$$

Take expectations. $E[(X_i - \mu)^2] = \sigma^2$, and $E[(\bar X - \mu)^2] = \operatorname{Var}(\bar X) = \sigma^2/n$ (using independence). So

$$E\Big[\sum (X_i - \bar X)^2\Big] = n\sigma^2 - n\cdot\frac{\sigma^2}{n} = (n-1)\sigma^2.$$

**(b)** The sample mean is computed from the same data, and it is the point that makes the sum of squared deviations as small as possible. So deviations from $\bar X$ are systematically smaller than deviations from the true mean $\mu$: by exactly $n(\bar X - \mu)^2$ in total, as the identity shows. Dividing by $n$ would give expectation $\tfrac{n-1}{n}\sigma^2 < \sigma^2$. One "degree of freedom" has been spent estimating the centre, and dividing by $n - 1$ corrects for it.`,
    rubric: {
      keyIdeas: [
        'Re-centres the deviations at μ: X_i − X̄ = (X_i − μ) − (X̄ − μ).',
        'Simplifies the cross term using Σ(X_i − μ) = n(X̄ − μ).',
        'Uses E[(X̄ − μ)²] = Var(X̄) = σ²/n.',
        'Reaches (n − 1)σ².',
        'For (b), explains that X̄ sits closer to the data than μ does (it minimises the sum of squares), so the spread is underestimated.',
      ],
      commonErrors: [
        'Treats X_i and X̄ as independent when expanding.',
        'Drops the cross term instead of simplifying it.',
        'For (b), says only "because of degrees of freedom" with no explanation of what that means.',
        'An equivalent route via E[X_i²] and E[X̄²] is fine.',
      ],
    },
  },
  {
    id: 'stat-3',
    answer: r`$c^* = \dfrac{\mu^2}{\mu^2 + \sigma^2/n}$, which is strictly less than $1$.`,
    solution: r`**(a)** Let $m = E[\hat\theta]$. Then $\hat\theta - \theta = (\hat\theta - m) + (m - \theta)$, where $m - \theta$ is a constant. Expanding,

$$E[(\hat\theta - \theta)^2] = E[(\hat\theta - m)^2] + 2(m - \theta)\,E[\hat\theta - m] + (m - \theta)^2.$$

The first term is $\operatorname{Var}(\hat\theta)$, the middle term vanishes because $E[\hat\theta - m] = 0$, and the last is the squared bias.

**(b)** $E[c\bar X] = c\mu$, so the bias is $(c - 1)\mu$; and $\operatorname{Var}(c\bar X) = c^2\sigma^2/n$. By (a),

$$\operatorname{MSE}(c) = \frac{c^2\sigma^2}{n} + (c-1)^2\mu^2.$$

This is a quadratic in $c$ with positive leading coefficient, so it is minimised where its derivative vanishes:

$$\frac{2c\sigma^2}{n} + 2(c - 1)\mu^2 = 0 \quad\Longrightarrow\quad c^* = \frac{\mu^2}{\mu^2 + \sigma^2/n}.$$

Since $\sigma^2/n > 0$, the denominator exceeds the numerator and $c^* < 1$ (and $c^* > 0$ as $\mu \ne 0$). So shrinking the unbiased estimator $\bar X$ slightly towards zero strictly lowers the mean squared error.

**(c)** $c^*$ depends on $\mu$ and $\sigma^2$, the very quantities we do not know, so $c^*\bar X$ is not a usable estimator. The lesson is that unbiasedness is not the same as accuracy: accepting a little bias can buy a larger reduction in variance. This is the idea behind shrinkage and regularisation (ridge regression, James–Stein), where the amount of shrinkage is estimated from the data. Note also $c^* \to 1$ as $n \to \infty$: with lots of data the gain disappears.`,
    rubric: {
      keyIdeas: [
        'Adds and subtracts E[θ̂] and shows the cross term vanishes.',
        'Computes bias (c − 1)μ and variance c²σ²/n for cX̄.',
        'Minimises the quadratic to get c* = μ² / (μ² + σ²/n).',
        'Argues c* < 1 from σ²/n > 0.',
        'For (c), notes c* depends on unknown parameters, and draws the bias–variance trade-off lesson.',
      ],
      commonErrors: [
        'Treats θ̂ as a constant or θ as random in (a).',
        'Forgets to square the bias, or uses variance cσ²/n.',
        'Concludes c = 1 because "unbiased is best".',
        'For (c), says only "it is biased" without noting it is not computable from data.',
      ],
    },
  },
  {
    id: 'stat-4',
    answer: r`(b) $1 - 0.95^{20} \approx 0.64$.`,
    solution: r`**(a)** Fix $0 < u < 1$. Since $F$ is continuous and strictly increasing, it has an inverse on $(0,1)$; let $t = F^{-1}(1 - u)$. Then

$$p \le u \iff 1 - F(T) \le u \iff F(T) \ge 1 - u \iff T \ge t.$$

Under $H_0$, and using continuity of $F$ (so $P(T = t) = 0$),

$$P(p \le u) = P(T \ge t) = 1 - F(t) = 1 - (1 - u) = u.$$

So $p$ is uniform on $(0,1)$. In particular, rejecting when $p \le 0.05$ has false-positive probability exactly $0.05$.

**(b)** Each test fails to reject with probability $0.95$, and the tests are independent, so

$$P(\text{at least one rejection}) = 1 - 0.95^{20} \approx 1 - 0.358 = 0.642.$$

Even though every null is true, it is more likely than not (about $64\%$) that the lab sees at least one "significant" result. A single significant result among many tests is weak evidence unless the multiplicity is accounted for.

**(c)** Let $E_i = \{p_i \le \alpha/m\}$. By (a), $P(E_i) = \alpha/m$ for each $i$. The union bound holds for any events, dependent or not:

$$P(E_1 \cup \dots \cup E_m) \le \sum_{i=1}^m P(E_i) = m\cdot\frac{\alpha}{m} = \alpha.$$

This is the Bonferroni correction.`,
    rubric: {
      keyIdeas: [
        'Rewrites {p ≤ u} as an event about T using monotonicity of F.',
        'Uses the definition of F (and continuity) to evaluate that event’s probability as u.',
        'For (b), computes via the complement, using independence: 1 − 0.95²⁰ ≈ 0.64.',
        'Interprets (b): false positives are likely when many tests are run.',
        'For (c), applies the union bound and notes it needs no independence.',
      ],
      commonErrors: [
        'Describes a p-value as "the probability the null is true".',
        'Answers (b) with 20 × 0.05 = 1, or with 0.05.',
        'Uses independence in (c), e.g. 1 − (1 − α/m)^m; correct under independence but not what was asked.',
        'In (a), inequality direction errors when applying F or its inverse.',
      ],
    },
  },
  {
    id: 'stat-5',
    answer: r`$\operatorname{Var}(\hat\theta_1) = \dfrac{\theta^2}{n(n+2)}$ and $\operatorname{Var}(\hat\theta_2) = \dfrac{\theta^2}{3n}$; $\hat\theta_1$ is better for every $n \ge 2$.`,
    solution: r`**(a)** $M \le x$ exactly when every $X_i \le x$, so by independence, for $0 \le x \le \theta$,

$$P(M \le x) = \Big(\frac{x}{\theta}\Big)^n.$$

Differentiating, $M$ has density $n x^{n-1}/\theta^n$ on $[0,\theta]$, and

$$E[M] = \int_0^\theta x\cdot\frac{n x^{n-1}}{\theta^n}\,dx = \frac{n}{n+1}\,\theta.$$

It is obvious that $M$ underestimates: every observation is at most $\theta$, so $M \le \theta$ always, and $M < \theta$ with probability $1$. An estimator that is never too large and almost always too small must be too small on average.

**(b)** Similarly $E[M^2] = \displaystyle\int_0^\theta x^2\cdot\frac{n x^{n-1}}{\theta^n}\,dx = \frac{n}{n+2}\,\theta^2$, so

$$\operatorname{Var}(M) = \theta^2\Big(\frac{n}{n+2} - \frac{n^2}{(n+1)^2}\Big) = \frac{n\,\theta^2}{(n+1)^2(n+2)},$$

using $n(n+1)^2 - n^2(n+2) = n$. Hence

$$\operatorname{Var}(\hat\theta_1) = \Big(\frac{n+1}{n}\Big)^2\operatorname{Var}(M) = \frac{\theta^2}{n(n+2)}, \qquad \operatorname{Var}(\hat\theta_2) = 4\cdot\frac{\theta^2}{12\,n} = \frac{\theta^2}{3n}.$$

Both are unbiased, so the one with smaller variance is better. $\dfrac{1}{n(n+2)} < \dfrac{1}{3n}$ exactly when $n + 2 > 3$, i.e. $n > 1$. So $\hat\theta_1$ is strictly better for all $n \ge 2$ (they coincide at $n = 1$), and dramatically so for large $n$: its variance falls like $1/n^2$ rather than $1/n$.

**(c)** $\theta$ is the edge of the distribution, and the largest observation is the one nearest that edge: the gap $\theta - M$ is typically about $\theta/n$, because $n$ points spread over $[0,\theta]$ leave gaps of that size. The mean instead locates the *centre* $\theta/2$ by averaging out noise of size $\theta/\sqrt{12}$ per observation, which only improves like $1/\sqrt{n}$. Once the maximum is known, the other observations are just uniform below it and say nothing more about $\theta$.`,
    rubric: {
      keyIdeas: [
        'Gets the distribution function of the maximum from "all observations ≤ x" and independence.',
        'Derives the density and computes E[M] = nθ/(n+1).',
        'Gives the direct reason for the downward bias: M can never exceed θ.',
        'Computes E[M²] and Var(M), then scales to Var(θ̂₁) = θ²/(n(n+2)).',
        'Computes Var(2X̄) = θ²/(3n) and compares, noting the 1/n² versus 1/n rates.',
        'For (c), gives an intuition: the maximum sits within about θ/n of the edge, whereas averaging only achieves 1/√n accuracy.',
      ],
      commonErrors: [
        'Uses the density of a single observation for the maximum.',
        'Forgets to square the factor (n+1)/n when scaling the variance.',
        'Algebra slips in Var(M); the simplification n(n+1)² − n²(n+2) = n is the key step.',
        'Compares the biased M directly with 2X̄ without correcting it.',
        'For (c), restates the formulas without an intuitive reason.',
      ],
    },
  },
]
