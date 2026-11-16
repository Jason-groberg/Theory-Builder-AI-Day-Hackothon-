import type { Problem } from '../types.ts'

const r = String.raw

export const probability: Problem[] = [
  {
    id: 'prob-1',
    category: 'probability',
    level: 1,
    title: 'Hats at the door',
    statement: r`At a party, $n$ guests check their hats. At the end of the night the hats are handed back in a uniformly random order, one per guest.

Find the expected number of guests who receive their own hat, and prove your answer. How does it depend on $n$?`,
    topics: ['Expectation', 'Random permutations'],
    techniques: ['indicators', 'linearity-of-expectation'],
    hints: [
      r`Finding the full distribution of the count is hard and unnecessary. Can the count be written as a sum of much simpler random variables?`,
      r`Use indicator variables: let $X_i = 1$ if guest $i$ gets their own hat and $0$ otherwise. Linearity of expectation holds whether or not the $X_i$ are independent.`,
      r`Work out $P(X_i = 1)$ for a single guest using symmetry, then add up $E[X_1] + \dots + E[X_n]$.`,
    ],
  },
  {
    id: 'prob-2',
    category: 'probability',
    level: 2,
    title: 'Two positive tests',
    statement: r`A condition affects $1\%$ of a population. A screening test detects it $95\%$ of the time when it is present, and gives a false positive $5\%$ of the time when it is absent.

**(a)** A randomly chosen person tests positive. What is the probability that they have the condition? Explain in a sentence why the answer is so far from $95\%$.

**(b)** The same person takes the test a second time and is positive again. Assuming the two results are independent given the person's true status, what is the probability now?`,
    topics: ['Conditional probability', 'Base rates'],
    techniques: ['bayes', 'conditioning'],
    hints: [
      r`"The test is $95\%$ accurate" describes $P(\text{positive} \mid \text{condition})$. The question asks for the reverse conditional. What else do you need to turn one into the other?`,
      r`Apply Bayes' rule, splitting $P(\text{positive})$ over the two cases: has the condition, or does not. It can help to imagine $10{,}000$ people and count.`,
      r`For (b), you can either redo Bayes' rule with the probability of two positives in each case, or use your answer to (a) as the new prior. In odds form: posterior odds $=$ prior odds $\times$ likelihood ratio.`,
    ],
  },
  {
    id: 'prob-3',
    category: 'probability',
    level: 3,
    title: 'Sampling a stream you cannot store',
    statement: r`Items $x_1, x_2, \dots$ arrive one at a time and you can store only one of them. You do not know in advance how many will arrive. You use this rule:

- keep $x_1$;
- when $x_i$ arrives (for $i \ge 2$), replace the stored item with $x_i$ with probability $1/i$, independently of everything so far; otherwise keep what you have.

Prove that after $n$ items have arrived, the stored item is equally likely to be any of $x_1, \dots, x_n$.`,
    topics: ['Randomised algorithms', 'Reservoir sampling'],
    techniques: ['induction', 'conditioning'],
    hints: [
      r`Check the claim by hand for $n = 2$ and $n = 3$. What has to happen for $x_1$ to still be stored after three items?`,
      r`Induct on $n$. Assume that after $n-1$ items each is stored with probability $\tfrac{1}{n-1}$, and ask what step $n$ does to each of those probabilities.`,
      r`For $j < n$: $x_j$ is stored after step $n$ exactly when it was stored after step $n-1$ and survived step $n$. Multiply those two probabilities.`,
    ],
  },
  {
    id: 'prob-4',
    category: 'probability',
    level: 4,
    title: 'A large cut always exists',
    statement: r`Let $G$ be any finite graph with $m$ edges. Prove that the vertices of $G$ can be split into two groups so that at least $m/2$ of the edges have one endpoint in each group.

There is no randomness in the statement, but the cleanest proof uses probability.`,
    topics: ['Graphs', 'Existence proofs'],
    techniques: ['probabilistic-method', 'indicators', 'linearity-of-expectation'],
    hints: [
      r`You only need to show that a good split exists, not to construct one. What could you say about a split chosen at random?`,
      r`Put each vertex in group $1$ or group $2$ by an independent fair coin flip, and let $X$ be the number of edges that cross. If $E[X] \ge m/2$, what does that tell you about the possible values of $X$?`,
      r`Write $X$ as a sum of indicators, one per edge. For a single edge $uv$, what is the probability that $u$ and $v$ land in different groups?`,
    ],
  },
  {
    id: 'prob-5',
    category: 'probability',
    level: 5,
    title: "Gambler's ruin",
    statement: r`A gambler starts with $k$ dollars, where $0 \le k \le N$. Each round they win or lose one dollar with probability $\tfrac12$ each, independently. They stop on reaching $0$ or $N$. You may assume the game ends with probability $1$ and that its expected length is finite.

**(a)** Prove that the probability of reaching $N$ before $0$ is $k/N$.

**(b)** Prove that the expected number of rounds played is $k(N-k)$.`,
    topics: ['Random walks', 'Markov chains'],
    techniques: ['first-step-analysis', 'conditioning', 'recurrences'],
    hints: [
      r`Treat the answer as a function of the starting amount: let $p_k$ be the probability of reaching $N$ from $k$. How are $p_{k-1}$, $p_k$ and $p_{k+1}$ related?`,
      r`Condition on the first round. This gives $p_k = \tfrac12 p_{k-1} + \tfrac12 p_{k+1}$ for $0 < k < N$, with $p_0 = 0$ and $p_N = 1$. What does this say about consecutive differences $p_{k+1} - p_k$?`,
      r`For (b), the same conditioning gives $e_k = 1 + \tfrac12 e_{k-1} + \tfrac12 e_{k+1}$ with $e_0 = e_N = 0$. Check that $k(N-k)$ satisfies it, then argue the solution is unique by looking at the difference of two solutions.`,
    ],
  },
]
