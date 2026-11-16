import type { Problem } from '../types.ts'

const r = String.raw

export const linearAlgebra: Problem[] = [
  {
    id: 'la-1',
    category: 'linear-algebra',
    level: 1,
    title: 'A map that squares to zero',
    statement: r`Let $V$ be a vector space of dimension $n$ and let $T : V \to V$ be a linear map with $T \circ T = 0$.

**(a)** Show that the image of $T$ is contained in the kernel of $T$.

**(b)** Deduce that $\operatorname{rank}(T) \le n/2$.

**(c)** Give an example with $n = 2$ where equality holds.`,
    topics: ['Linear maps', 'Dimension'],
    techniques: ['kernel-image', 'rank-nullity', 'counterexample'],
    hints: [
      r`Unpack what $T \circ T = 0$ says about a vector of the form $T(v)$.`,
      r`Once $\operatorname{im} T \subseteq \ker T$, compare their dimensions and bring in the rank–nullity theorem: $\operatorname{rank}(T) + \dim \ker T = n$.`,
      r`From (a), $\operatorname{rank}(T) \le \dim\ker T = n - \operatorname{rank}(T)$. For (c), try a $2 \times 2$ matrix with a single nonzero entry.`,
    ],
  },
  {
    id: 'la-2',
    category: 'linear-algebra',
    level: 2,
    title: 'Distinct eigenvalues, independent eigenvectors',
    statement: r`Let $T : V \to V$ be linear, and let $v_1, \dots, v_k$ be eigenvectors of $T$ with eigenvalues $\lambda_1, \dots, \lambda_k$ that are all different.

Prove that $v_1, \dots, v_k$ are linearly independent.`,
    topics: ['Eigenvectors', 'Linear independence'],
    techniques: ['eigen-structure', 'contradiction', 'extremal-principle'],
    hints: [
      r`Try $k = 2$ first. If $c_1 v_1 + c_2 v_2 = 0$, what new equation do you get by applying $T$ to both sides?`,
      r`You have two relations among the same vectors. Combine them to eliminate one vector; equivalently, apply $T - \lambda_k I$, which kills $v_k$ and rescales the others.`,
      r`Suppose the vectors are dependent and take a dependence relation $\sum c_i v_i = 0$ that uses as few vectors as possible. Apply $T - \lambda_j I$ for one of the vectors involved, and show you get a shorter relation that is still nontrivial.`,
    ],
  },
  {
    id: 'la-3',
    category: 'linear-algebra',
    level: 3,
    title: 'The rank of AᵀA',
    statement: r`Let $A$ be a real $m \times n$ matrix.

**(a)** Prove that $\operatorname{rank}(A^{\mathsf T} A) = \operatorname{rank}(A)$.

**(b)** Your proof must use the fact that the entries are real. Show this by finding a complex matrix $A$ for which $\operatorname{rank}(A^{\mathsf T} A) \ne \operatorname{rank}(A)$, where $A^{\mathsf T}$ is the plain transpose with no conjugation.`,
    topics: ['Rank', 'Gram matrices', 'Least squares'],
    techniques: ['kernel-image', 'rank-nullity', 'inner-product', 'counterexample'],
    hints: [
      r`Both $A$ and $A^{\mathsf T}A$ have $n$ columns. Rather than comparing ranks directly, what could you compare instead?`,
      r`Show the two matrices have the same null space. One inclusion is immediate. For the other, if $A^{\mathsf T}Ax = 0$, multiply on the left by $x^{\mathsf T}$ and interpret the result as a length.`,
      r`$x^{\mathsf T}A^{\mathsf T}Ax = \lVert Ax \rVert^2$, and over the reals a vector of length zero is the zero vector. For (b), look for a nonzero complex column vector $A$ with $A^{\mathsf T}A = 0$.`,
    ],
  },
  {
    id: 'la-4',
    category: 'linear-algebra',
    level: 4,
    title: 'AB versus BA',
    statement: r`Let $A$ be an $m \times n$ matrix and $B$ an $n \times m$ matrix, so that $AB$ is $m \times m$ and $BA$ is $n \times n$.

**(a)** Prove that every nonzero eigenvalue of $AB$ is also an eigenvalue of $BA$.

**(b)** Show by example that this can fail for the eigenvalue $0$.

**(c)** Deduce that $I_m - AB$ is invertible if and only if $I_n - BA$ is invertible.`,
    topics: ['Eigenvalues', 'Rectangular matrices'],
    techniques: ['eigen-structure', 'counterexample'],
    hints: [
      r`Start from $ABv = \lambda v$ with $v \ne 0$. You need a vector that $BA$ scales by $\lambda$. Which vector can you build from $v$ using the matrices you have?`,
      r`Try $w = Bv$ and compute $BAw$. An eigenvector must be nonzero, so you also need to rule out $Bv = 0$. This is where $\lambda \ne 0$ matters.`,
      r`For (b), take $m = 1$ and $n = 2$. For (c), restate "$I - M$ is not invertible" as a statement about a particular eigenvalue of $M$.`,
    ],
  },
  {
    id: 'la-5',
    category: 'linear-algebra',
    level: 5,
    title: 'Diagonalising two matrices at once',
    statement: r`Let $A$ and $B$ be $n \times n$ complex matrices that are each diagonalizable and that commute: $AB = BA$.

Prove that there is a single basis of $\mathbb{C}^n$ in which every basis vector is an eigenvector of both $A$ and $B$.

You may use that a matrix is diagonalizable if and only if the whole space is the direct sum of its eigenspaces.`,
    topics: ['Diagonalization', 'Commuting operators'],
    techniques: ['eigen-structure', 'invariant-subspaces'],
    hints: [
      r`Take an eigenvector $v$ of $A$ with eigenvalue $\lambda$. Using $AB = BA$, what can you say about the vector $Bv$?`,
      r`Each eigenspace $E_\lambda(A)$ is invariant under $B$. So the problem reduces to finding, inside each $E_\lambda(A)$, a basis of eigenvectors of $B$.`,
      r`Take $v \in E_\lambda(A)$ and split it as $v = \sum_\mu w_\mu$ with $w_\mu$ in the eigenspace $E_\mu(B)$. Apply $A - \lambda I$ and use the fact that the sum of the $E_\mu(B)$ is direct to show each $w_\mu$ is itself in $E_\lambda(A)$.`,
    ],
  },
]
