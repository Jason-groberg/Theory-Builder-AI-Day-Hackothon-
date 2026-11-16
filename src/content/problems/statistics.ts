import type { Problem } from '../types.ts'

const r = String.raw

export const statistics: Problem[] = [
  {
    id: 'stat-1',
    category: 'statistics',
    level: 1,
    title: 'What averaging buys you',
    statement: r`Let $X_1, \dots, X_n$ be independent observations from a distribution with mean $\mu$ and variance $\sigma^2$, and let $\bar X = \tfrac1n \sum_{i=1}^n X_i$.

**(a)** Prove that $E[\bar X] = \mu$ and $\operatorname{Var}(\bar X) = \sigma^2 / n$. Say clearly which step uses independence.

**(b)** If the observations were dependent, would $\bar X$ still be unbiased for $\mu$?

**(c)** How many times more data do you need to cut the standard error of $\bar X$ in half?`,
    topics: ['Sample mean', 'Standard error'],
    techniques: ['expectation-algebra'],
    hints: [
      r`Two different rules are at work: one for the expectation of a sum, and one for the variance of a sum. Only one of them needs independence.`,
      r`$E[aX + bY] = aE[X] + bE[Y]$ always. $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)$ needs the covariance to vanish. And $\operatorname{Var}(aX) = a^2\operatorname{Var}(X)$.`,
      r`Write $\operatorname{Var}(\bar X) = \tfrac{1}{n^2}\operatorname{Var}\!\big(\sum X_i\big)$. For (c), the standard error is $\sigma/\sqrt{n}$; solve for the new sample size.`,
    ],
  },
  {
    id: 'stat-2',
    category: 'statistics',
    level: 2,
    title: 'Why n − 1?',
    statement: r`Let $X_1, \dots, X_n$ be independent observations with mean $\mu$ and variance $\sigma^2$, and let $\bar X$ be their sample mean.

**(a)** Prove that

$$E\!\left[\sum_{i=1}^n (X_i - \bar X)^2\right] = (n-1)\,\sigma^2.$$

**(b)** Explain in words why dividing this sum by $n$ gives an estimate of $\sigma^2$ that is too small on average.`,
    topics: ['Sample variance', 'Unbiased estimation'],
    techniques: ['expectation-algebra', 'bias-variance'],
    hints: [
      r`You know how the $X_i$ behave around $\mu$, not around $\bar X$. Can you rewrite the deviations from $\bar X$ in terms of deviations from $\mu$?`,
      r`Write $X_i - \bar X = (X_i - \mu) - (\bar X - \mu)$, expand the square and sum over $i$. The cross term simplifies because $\sum (X_i - \mu) = n(\bar X - \mu)$.`,
      r`You should reach $\sum (X_i - \bar X)^2 = \sum (X_i - \mu)^2 - n(\bar X - \mu)^2$. Take expectations, using $E[(\bar X - \mu)^2] = \operatorname{Var}(\bar X) = \sigma^2/n$.`,
    ],
  },
  {
    id: 'stat-3',
    category: 'statistics',
    level: 3,
    title: 'When a biased estimator wins',
    statement: r`**(a)** Let $\hat\theta$ be any estimator of a fixed number $\theta$. Prove the decomposition

$$E\big[(\hat\theta - \theta)^2\big] = \operatorname{Var}(\hat\theta) + \big(E[\hat\theta] - \theta\big)^2.$$

**(b)** Let $\bar X$ be the mean of $n$ independent observations with mean $\mu \ne 0$ and variance $\sigma^2 > 0$. Consider the family of estimators $c\bar X$ of $\mu$, for a constant $c$. Find the value of $c$ that minimises the mean squared error, and show that it is strictly less than $1$.

**(c)** Why can't this optimal estimator be used directly in practice? What does the result still tell you?`,
    topics: ['Mean squared error', 'Shrinkage'],
    techniques: ['bias-variance', 'expectation-algebra', 'optimisation'],
    hints: [
      r`In (a), $\theta$ is a constant but $\hat\theta$ is random. Which fixed number is natural to add and subtract inside the square?`,
      r`Write $\hat\theta - \theta = (\hat\theta - E[\hat\theta]) + (E[\hat\theta] - \theta)$ and expand. The second bracket is a constant, and the first has expectation zero, so the cross term disappears.`,
      r`For (b), the bias of $c\bar X$ is $(c-1)\mu$ and its variance is $c^2\sigma^2/n$. The mean squared error is a quadratic in $c$; minimise it.`,
    ],
  },
  {
    id: 'stat-4',
    category: 'statistics',
    level: 4,
    title: 'Twenty tests, one false alarm',
    statement: r`A test rejects the null hypothesis $H_0$ when a statistic $T$ is large. Under $H_0$, $T$ has a continuous, strictly increasing distribution function $F$, and the p-value is $p = 1 - F(T)$.

**(a)** Prove that under $H_0$ the p-value is uniformly distributed on $(0, 1)$: $P(p \le u) = u$ for $0 < u < 1$.

**(b)** A lab runs $20$ independent tests, each at level $0.05$, and in fact every null hypothesis is true. What is the probability that at least one test rejects? Interpret the number.

**(c)** Now run $m$ tests that may be dependent in any way, all nulls true, and reject test $i$ only when $p_i \le \alpha/m$. Prove that the probability of at least one rejection is at most $\alpha$.`,
    topics: ['p-values', 'Multiple testing'],
    techniques: ['distribution-functions', 'union-bound'],
    hints: [
      r`For (a), translate the event $\{p \le u\}$ step by step into an event about $T$ itself, whose distribution you know.`,
      r`$p \le u$ means $F(T) \ge 1 - u$. Because $F$ is continuous and strictly increasing it has an inverse, so this is $T \ge F^{-1}(1-u)$. Now use the definition of $F$.`,
      r`For (b), compute the probability that none of the tests rejects. For (c), independence is not available, so use $P(E_1 \cup \dots \cup E_m) \le P(E_1) + \dots + P(E_m)$ together with (a).`,
    ],
  },
  {
    id: 'stat-5',
    category: 'statistics',
    level: 5,
    title: 'Estimating the edge of a distribution',
    statement: r`Let $X_1, \dots, X_n$ be independent and uniformly distributed on $[0, \theta]$, where $\theta > 0$ is unknown, and let $M = \max(X_1, \dots, X_n)$.

**(a)** Find $P(M \le x)$ for $0 \le x \le \theta$, and use it to show $E[M] = \dfrac{n}{n+1}\,\theta$. Why is it obvious without calculation that $M$ underestimates $\theta$?

**(b)** Two unbiased estimators of $\theta$ are

$$\hat\theta_1 = \frac{n+1}{n}\,M \qquad\text{and}\qquad \hat\theta_2 = 2\bar X.$$

Find the variance of each and decide which is better. (A uniform variable on $[0,\theta]$ has variance $\theta^2/12$.)

**(c)** The two variances shrink at different rates as $n$ grows. Give an intuitive reason why the maximum carries so much more information about $\theta$ than the mean does.`,
    topics: ['Estimator comparison', 'Maximum likelihood'],
    techniques: ['order-statistics', 'distribution-functions', 'bias-variance'],
    hints: [
      r`The maximum is at most $x$ exactly when every single observation is at most $x$.`,
      r`So $P(M \le x) = (x/\theta)^n$. Differentiate to get the density $n x^{n-1}/\theta^n$ on $[0, \theta]$, then integrate to find $E[M]$ and $E[M^2]$.`,
      r`You should find $E[M^2] = \tfrac{n}{n+2}\theta^2$, hence $\operatorname{Var}(M) = \dfrac{n\,\theta^2}{(n+1)^2(n+2)}$. Scale by $\big(\tfrac{n+1}{n}\big)^2$ for $\hat\theta_1$ and compare with $\operatorname{Var}(2\bar X) = 4 \cdot \tfrac{\theta^2}{12n}$.`,
    ],
  },
]
