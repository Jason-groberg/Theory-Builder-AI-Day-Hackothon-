import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const linearAlgebra: Solution[] = [
  {
    id: 'la-1',
    solution: r`**(a)** Let $w \in \operatorname{im} T$, so $w = T(v)$ for some $v$. Then $T(w) = T(T(v)) = 0$, so $w \in \ker T$. Hence $\operatorname{im} T \subseteq \ker T$.

**(b)** A subspace has dimension at most that of a space containing it, so $\operatorname{rank}(T) = \dim \operatorname{im} T \le \dim \ker T$. By rank–nullity, $\dim\ker T = n - \operatorname{rank}(T)$. Therefore $\operatorname{rank}(T) \le n - \operatorname{rank}(T)$, i.e. $\operatorname{rank}(T) \le n/2$.

**(c)** Take $T = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$. Then $T^2 = 0$ and $\operatorname{rank}(T) = 1 = n/2$.`,
    rubric: {
      keyIdeas: [
        'Takes a general element T(v) of the image and shows T sends it to 0.',
        'Converts the inclusion into an inequality of dimensions.',
        'Invokes rank–nullity to replace dim ker T with n − rank T.',
        'Gives a valid nonzero 2×2 example with square zero.',
      ],
      commonErrors: [
        'Asserts im T = ker T rather than containment (true only when rank is exactly n/2).',
        'Argues with a specific matrix instead of a general T.',
        'Offers the zero matrix for (c): it has rank 0, not 1.',
      ],
    },
  },
  {
    id: 'la-2',
    solution: r`Suppose, for contradiction, that the vectors are linearly dependent. Among all nontrivial relations $\sum c_i v_i = 0$ choose one involving the fewest vectors; after relabelling it reads

$$c_1 v_1 + \dots + c_r v_r = 0, \qquad \text{all } c_i \ne 0.$$

Here $r \ge 2$, because $r = 1$ would give $c_1 v_1 = 0$ with $c_1 \ne 0$, contradicting $v_1 \ne 0$ (eigenvectors are nonzero).

Apply $T - \lambda_r I$ to the relation. Since $(T - \lambda_r I)v_i = (\lambda_i - \lambda_r)v_i$, the last term vanishes and

$$c_1(\lambda_1 - \lambda_r)v_1 + \dots + c_{r-1}(\lambda_{r-1} - \lambda_r)v_{r-1} = 0.$$

The eigenvalues are distinct, so every coefficient $c_i(\lambda_i - \lambda_r)$ is nonzero. This is a nontrivial relation among fewer vectors, contradicting minimality. Hence the vectors are independent.

(Equivalently: induct on $k$, using the same step to reduce $k$ vectors to $k-1$.)`,
    rubric: {
      keyIdeas: [
        'Uses that eigenvectors are nonzero (base case or r ≥ 2).',
        'Produces a second relation by applying T, or T − λI, to a dependence relation.',
        'Eliminates one vector to get a shorter relation.',
        'Uses distinctness of eigenvalues to show the shorter relation is still nontrivial.',
        'Has a sound overall structure: induction, or minimal counterexample.',
      ],
      commonErrors: [
        'Proves only the case k = 2 and says "similarly".',
        'Applies T but never combines the two relations.',
        'Does not check the new coefficients are nonzero, so the contradiction is not established.',
        'Assumes the eigenvalues are nonzero; this is not given and not needed.',
      ],
    },
  },
  {
    id: 'la-3',
    solution: r`**(a)** We show $\ker(A^{\mathsf T}A) = \ker A$.

If $Ax = 0$ then $A^{\mathsf T}Ax = 0$, so $\ker A \subseteq \ker(A^{\mathsf T}A)$.

Conversely, suppose $A^{\mathsf T}Ax = 0$. Then
$$0 = x^{\mathsf T}A^{\mathsf T}Ax = (Ax)^{\mathsf T}(Ax) = \lVert Ax \rVert^2.$$
Over the reals $\lVert y \rVert^2 = \sum y_i^2$ is zero only when $y = 0$, so $Ax = 0$.

Both $A$ and $A^{\mathsf T}A$ have $n$ columns, so by rank–nullity
$$\operatorname{rank}(A^{\mathsf T}A) = n - \dim\ker(A^{\mathsf T}A) = n - \dim\ker A = \operatorname{rank}(A).$$

**(b)** The step "$y^{\mathsf T}y = 0 \Rightarrow y = 0$" fails over $\mathbb{C}$. Take $A = \begin{pmatrix} 1 \\ i \end{pmatrix}$. Then $A^{\mathsf T}A = 1 + i^2 = 0$ has rank $0$, while $A$ has rank $1$.`,
    rubric: {
      keyIdeas: [
        'Reduces the rank statement to equality of null spaces, using that both matrices have n columns and rank–nullity.',
        'Proves the easy inclusion ker A ⊆ ker AᵀA.',
        'Proves the reverse inclusion via xᵀAᵀAx = ‖Ax‖².',
        'Identifies positivity of the real norm as the step that needs real entries.',
        'Gives a valid complex counterexample for the plain transpose.',
      ],
      commonErrors: [
        'Argues rank(AᵀA) ≤ rank(A) only, without the reverse.',
        'Assumes A is square or invertible.',
        'Cancels Aᵀ from AᵀAx = 0 as if it were invertible.',
        'For (b), uses the conjugate transpose, for which the statement is true.',
      ],
    },
  },
  {
    id: 'la-4',
    solution: r`**(a)** Let $\lambda \ne 0$ and $v \ne 0$ with $ABv = \lambda v$. Put $w = Bv$. Then

$$BAw = B(ABv) = B(\lambda v) = \lambda w.$$

Also $w \ne 0$: if $Bv = 0$ then $\lambda v = ABv = 0$, impossible since $\lambda \ne 0$ and $v \ne 0$. So $w$ is an eigenvector of $BA$ with eigenvalue $\lambda$.

**(b)** Let $A = \begin{pmatrix} 1 & 0 \end{pmatrix}$ and $B = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$. Then $AB = (1)$, whose only eigenvalue is $1$, while $BA = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ has eigenvalue $0$.

**(c)** A square matrix $I - M$ fails to be invertible exactly when $(I - M)v = 0$ for some $v \ne 0$, i.e. when $1$ is an eigenvalue of $M$. Since $1 \ne 0$, part (a) and the same statement with the roles of $A$ and $B$ exchanged show that $1$ is an eigenvalue of $AB$ if and only if it is an eigenvalue of $BA$. Hence $I_m - AB$ is singular if and only if $I_n - BA$ is.`,
    rubric: {
      keyIdeas: [
        'Proposes w = Bv as the candidate eigenvector and verifies BAw = λw.',
        'Proves w ≠ 0, and uses λ ≠ 0 to do so.',
        'Gives a valid example where 0 is an eigenvalue of exactly one of AB, BA (necessarily with m ≠ n).',
        'Translates invertibility of I − M into "1 is not an eigenvalue of M".',
        'Uses the symmetric version of (a) to get both directions in (c).',
      ],
      commonErrors: [
        'Never checks that Bv is nonzero.',
        'Uses det(AB) = det(A)det(B) or characteristic polynomials as if A and B were square.',
        'Offers square matrices for (b): for square A, B the eigenvalue 0 is shared, so no such example exists.',
        'Proves only one direction of (c).',
      ],
    },
  },
  {
    id: 'la-5',
    solution: r`Write $E_\lambda(A)$ and $E_\mu(B)$ for the eigenspaces. Since $A$ and $B$ are diagonalizable,
$$\mathbb{C}^n = \bigoplus_\lambda E_\lambda(A) = \bigoplus_\mu E_\mu(B).$$

**Step 1: each matrix preserves the other's eigenspaces.** If $Bw = \mu w$ then $B(Aw) = A(Bw) = \mu(Aw)$, so $A$ maps $E_\mu(B)$ into itself. Hence so does $A - \lambda I$ for any $\lambda$.

**Step 2: $E_\lambda(A)$ is the direct sum of the subspaces $E_\lambda(A) \cap E_\mu(B)$.** Let $v \in E_\lambda(A)$ and write $v = \sum_\mu w_\mu$ with $w_\mu \in E_\mu(B)$. Then
$$0 = (A - \lambda I)v = \sum_\mu (A - \lambda I)w_\mu,$$
and by Step 1 the $\mu$-th term lies in $E_\mu(B)$. Because the sum of the $E_\mu(B)$ is direct, every term is zero: $(A - \lambda I)w_\mu = 0$. So each $w_\mu \in E_\lambda(A) \cap E_\mu(B)$. The sum is direct because it sits inside the direct sum of the $E_\mu(B)$.

**Step 3: assemble the basis.** Combining,
$$\mathbb{C}^n = \bigoplus_\lambda E_\lambda(A) = \bigoplus_{\lambda,\mu} \big(E_\lambda(A) \cap E_\mu(B)\big).$$
Choose a basis of each nonzero $E_\lambda(A) \cap E_\mu(B)$ and take the union. It is a basis of $\mathbb{C}^n$, and every vector in it is an eigenvector of $A$ (eigenvalue $\lambda$) and of $B$ (eigenvalue $\mu$).`,
    rubric: {
      keyIdeas: [
        'Uses commutativity to show an eigenspace of one matrix is invariant under the other.',
        'Recognises that invariance alone is not enough: must show B restricted to E_λ(A) is diagonalizable (or equivalently that E_λ(A) splits into joint eigenspaces).',
        'Justifies that restriction step, e.g. by decomposing v over the eigenspaces of B and using directness, or via the minimal polynomial having distinct roots.',
        'Assembles a basis of the whole space from bases of the joint eigenspaces.',
      ],
      commonErrors: [
        'Says "B preserves E_λ(A), so pick eigenvectors of B inside it" without justifying that enough exist.',
        'Assumes A has n distinct eigenvalues (then every eigenspace is a line and the problem is easy).',
        'Claims every eigenvector of A is an eigenvector of B; false when an eigenspace has dimension above 1 (take A = I).',
        'Diagonalises A and B with separate bases and asserts they coincide.',
      ],
    },
  },
]
