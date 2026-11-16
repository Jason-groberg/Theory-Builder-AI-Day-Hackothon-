import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const probability: Solution[] = [
  {
    id: 'prob-1',
    answer: r`$1$, for every $n$.`,
    solution: r`For each guest $i$ let $X_i = 1$ if guest $i$ receives their own hat and $X_i = 0$ otherwise. The number of guests with their own hat is $X = X_1 + \dots + X_n$.

In a uniformly random arrangement, guest $i$ is equally likely to receive any of the $n$ hats, so $E[X_i] = P(X_i = 1) = \tfrac1n$.

By linearity of expectation, which needs no independence,

$$E[X] = \sum_{i=1}^n E[X_i] = n \cdot \frac1n = 1.$$

So on average exactly one guest gets their own hat, whatever $n$ is.`,
    rubric: {
      keyIdeas: [
        'Writes the count as a sum of indicator variables, one per guest.',
        'Justifies P(guest i gets own hat) = 1/n by symmetry or by counting permutations.',
        'Applies linearity of expectation and notes, or at least does not contradict, that independence is not required.',
        'Concludes the expectation is 1 and does not depend on n.',
      ],
      commonErrors: [
        'Claims the indicators are independent or that the count is binomial. The mean still comes out right, but the reasoning is wrong.',
        'Tries to compute the full distribution via derangements and gets lost.',
        'Answers 1/n (the probability for one guest) instead of the expected count.',
      ],
    },
  },
  {
    id: 'prob-2',
    answer: r`(a) $19/118 \approx 16.1\%$. (b) $361/460 \approx 78.5\%$.`,
    solution: r`Let $D$ be the event that the person has the condition and $+$ a positive test. We have $P(D) = 0.01$, $P(+ \mid D) = 0.95$, $P(+ \mid D^c) = 0.05$.

**(a)** By Bayes' rule,

$$P(D \mid +) = \frac{0.95 \times 0.01}{0.95 \times 0.01 + 0.05 \times 0.99} = \frac{0.0095}{0.0590} = \frac{19}{118} \approx 0.161.$$

The answer is low because the condition is rare: healthy people outnumber affected people $99$ to $1$, so even a $5\%$ false positive rate produces about five times as many false positives ($495$ per $10{,}000$) as true positives ($95$ per $10{,}000$).

**(b)** Given the true status the two results are independent, so two positives have probability $0.95^2 = 0.9025$ if $D$ and $0.05^2 = 0.0025$ otherwise:

$$P(D \mid ++) = \frac{0.9025 \times 0.01}{0.9025 \times 0.01 + 0.0025 \times 0.99} = \frac{0.009025}{0.0115} = \frac{361}{460} \approx 0.785.$$

In odds form: prior odds $1 : 99$, each positive multiplies the odds by the likelihood ratio $0.95/0.05 = 19$, giving $19 : 99$ and then $361 : 99$.`,
    rubric: {
      keyIdeas: [
        'Distinguishes P(positive | condition) from P(condition | positive).',
        'Uses Bayes’ rule with the total probability of a positive split over both cases (or an equivalent frequency count).',
        'Explains the low answer through the base rate: false positives from the large healthy group outnumber true positives.',
        'For (b), uses conditional independence correctly, either by squaring the likelihoods or by updating from the answer to (a).',
      ],
      commonErrors: [
        'Answers 95% (confusing the two conditionals).',
        'Forgets the false-positive term in the denominator.',
        'In (b), squares the answer to (a) or treats the tests as unconditionally independent.',
        'Arithmetic slips: accept fractions or decimals rounded sensibly.',
      ],
    },
  },
  {
    id: 'prob-3',
    solution: r`Induct on $n$. For $n = 1$ the stored item is $x_1$ with probability $1$.

Suppose that after $n - 1$ items each of $x_1, \dots, x_{n-1}$ is stored with probability $\tfrac{1}{n-1}$. When $x_n$ arrives:

- $x_n$ becomes the stored item with probability $\tfrac1n$, by the rule.
- For $j < n$, $x_j$ is stored after step $n$ exactly when it was stored after step $n-1$ and was not replaced. The replacement decision is independent of the past, so
$$P(x_j \text{ stored after } n) = \frac{1}{n-1}\cdot\left(1 - \frac1n\right) = \frac{1}{n-1}\cdot\frac{n-1}{n} = \frac1n.$$

So every item is stored with probability $\tfrac1n$, completing the induction.

*Direct version.* $x_j$ is stored at the end exactly when it was chosen at step $j$ and survived steps $j+1, \dots, n$:
$$\frac1j \cdot \frac{j}{j+1}\cdot\frac{j+1}{j+2}\cdots\frac{n-1}{n} = \frac1n,$$
a telescoping product.`,
    rubric: {
      keyIdeas: [
        'Sets up induction on n (or a direct product over steps) with a correct base case.',
        'Handles the newest item: stored with probability 1/n.',
        'Handles an older item: probability it was stored before, times probability it survives the new step, using independence of the replacement decision.',
        'Carries out the simplification to 1/n.',
      ],
      commonErrors: [
        'Only checks small cases without a general argument.',
        'Forgets the survival factor (1 − 1/n) for older items, or forgets the factor 1/j for being chosen in the first place.',
        'Proves the probabilities sum to 1 and treats that as proof of uniformity.',
      ],
    },
  },
  {
    id: 'prob-4',
    solution: r`Assign each vertex to group $1$ or group $2$ by an independent fair coin flip. For each edge $e = uv$ let $X_e = 1$ if $u$ and $v$ are in different groups, and $0$ otherwise. Of the four equally likely assignments of $(u, v)$, two separate them, so $E[X_e] = \tfrac12$.

Let $X = \sum_e X_e$ be the number of crossing edges. By linearity of expectation,

$$E[X] = \sum_e E[X_e] = \frac m2.$$

A random variable cannot be strictly smaller than its expectation in every outcome: if $X < m/2$ always, then $E[X] < m/2$. So at least one of the finitely many assignments has $X \ge m/2$. That assignment is a split of the vertices with at least $m/2$ crossing edges.`,
    rubric: {
      keyIdeas: [
        'Introduces a random split with each vertex assigned independently and uniformly.',
        'Shows each edge crosses with probability 1/2.',
        'Uses linearity of expectation to get expected crossing count m/2 (edges are not independent, and need not be).',
        'States the existence step explicitly: some outcome is at least the expectation.',
      ],
      commonErrors: [
        'Stops at "the expected cut is m/2" without arguing that a split achieving it exists.',
        'Claims a random split always, or typically, has m/2 crossing edges.',
        'Assumes the edge indicators are independent when justifying the expectation.',
        'A correct greedy or local-improvement proof (move a vertex if it increases the cut) is also fully acceptable.',
      ],
    },
  },
  {
    id: 'prob-5',
    solution: r`**(a)** Let $p_k$ be the probability of reaching $N$ before $0$ starting from $k$. Then $p_0 = 0$, $p_N = 1$, and conditioning on the first round gives, for $0 < k < N$,

$$p_k = \tfrac12 p_{k-1} + \tfrac12 p_{k+1}, \qquad\text{that is,}\qquad p_{k+1} - p_k = p_k - p_{k-1}.$$

So all consecutive differences equal a common value $d$, and $p_k = p_0 + kd = kd$. From $p_N = 1$ we get $d = 1/N$, hence $p_k = k/N$.

**(b)** Let $e_k$ be the expected number of rounds starting from $k$, finite by assumption. Then $e_0 = e_N = 0$, and conditioning on the first round (which uses up one round),

$$e_k = 1 + \tfrac12 e_{k-1} + \tfrac12 e_{k+1} \qquad (0 < k < N).$$

*The formula satisfies this.* Let $g_k = k(N-k)$. Then $g_0 = g_N = 0$ and
$$g_{k-1} + g_{k+1} = (k-1)(N-k+1) + (k+1)(N-k-1) = 2k(N-k) - 2,$$
so $\tfrac12 g_{k-1} + \tfrac12 g_{k+1} + 1 = g_k$.

*The solution is unique.* If $e$ and $g$ both satisfy the recurrence and boundary values, then $h = e - g$ satisfies $h_k = \tfrac12 h_{k-1} + \tfrac12 h_{k+1}$ with $h_0 = h_N = 0$. As in (a), $h$ is linear in $k$, and a linear function vanishing at $0$ and $N$ is zero. Hence $e_k = k(N-k)$.`,
    rubric: {
      keyIdeas: [
        'Treats the quantity as a function of the starting point and conditions on the first step.',
        'States correct boundary conditions for both parts.',
        'For (a), deduces constant differences (linearity in k) and fixes the slope from the boundary.',
        'For (b), includes the +1 for the round just played.',
        'For (b), both verifies (or derives) k(N−k) and addresses uniqueness of the solution.',
      ],
      commonErrors: [
        'Verifies that k/N or k(N−k) satisfies the recurrence but never argues it is the only solution.',
        'Omits the +1 in the recurrence for the expected duration.',
        'Wrong or missing boundary conditions.',
        'A martingale / optional stopping argument is acceptable if the stopping-theorem conditions are acknowledged.',
      ],
    },
  },
]
