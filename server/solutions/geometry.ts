import type { Solution } from '../../src/content/types.ts'

const r = String.raw

export const geometry: Solution[] = [
  {
    id: 'geo-1',
    solution: r`Draw the radius $OC$. Since $A$, $B$, $C$ are on the circle, $OA = OB = OC$.

Triangle $OAC$ is isosceles with $OA = OC$, so its base angles are equal: $\angle OAC = \angle OCA = \alpha$. Likewise triangle $OBC$ is isosceles, with $\angle OBC = \angle OCB = \beta$.

Because $O$ lies on segment $AB$, the ray $CO$ lies inside angle $ACB$, so $\angle ACB = \alpha + \beta$, while $\angle CAB = \alpha$ and $\angle CBA = \beta$. The angles of triangle $ABC$ sum to $180^\circ$:

$$\alpha + \beta + (\alpha + \beta) = 180^\circ,$$

so $\angle ACB = \alpha + \beta = 90^\circ$.

*Vector version.* With $O$ as origin, $\mathbf{b} = -\mathbf{a}$ and $\lvert\mathbf{c}\rvert = \lvert\mathbf{a}\rvert$, so $(\mathbf{a} - \mathbf{c})\cdot(\mathbf{b} - \mathbf{c}) = (\mathbf{a} - \mathbf{c})\cdot(-\mathbf{a} - \mathbf{c}) = \lvert\mathbf{c}\rvert^2 - \lvert\mathbf{a}\rvert^2 = 0$.`,
    rubric: {
      keyIdeas: [
        'Uses OA = OB = OC (all radii), typically by drawing OC.',
        'Identifies two isosceles triangles and their equal base angles.',
        'Expresses the angle at C as the sum of the two base angles.',
        'Uses the angle sum of triangle ABC to conclude 90°. A correct vector or coordinate proof is equally acceptable.',
      ],
      commonErrors: [
        'Cites the inscribed angle theorem, of which this is a special case, without proving anything.',
        'Assumes a special position for C, such as the midpoint of the arc.',
        'Uses the conclusion (a right angle) somewhere in the argument.',
      ],
    },
  },
  {
    id: 'geo-2',
    answer: r`$P$ is the point where $\ell$ meets the segment from $A$ to the reflection of $B$ in $\ell$.`,
    solution: r`**(a)** Let $B'$ be the reflection of $B$ across $\ell$. Every point $P$ on $\ell$ is equidistant from $B$ and $B'$, so

$$AP + PB = AP + PB' \ge AB'$$

by the triangle inequality, with equality exactly when $P$ lies on the segment $AB'$. Since $A$ and $B'$ are on opposite sides of $\ell$, the segment $AB'$ meets $\ell$ in exactly one point $P_0$. So $P_0$ is the unique minimiser, and the minimum value is $AB'$.

**(b)** At $P_0$, the points $A$, $P_0$, $B'$ are collinear. The angle between $P_0A$ and $\ell$ equals the angle between $P_0B'$ and $\ell$ on the other side (vertical angles). Reflection in $\ell$ fixes $\ell$ and carries $P_0B'$ to $P_0B$, preserving angles, so the angle between $P_0B'$ and $\ell$ equals the angle between $P_0B$ and $\ell$. Hence $P_0A$ and $P_0B$ make equal angles with $\ell$.`,
    rubric: {
      keyIdeas: [
        'Reflects one of the points across the line.',
        'Uses PB = PB′ for every P on the line to rewrite the total length.',
        'Applies the triangle inequality to get the lower bound AB′, and identifies when equality holds.',
        'Notes the segment AB′ really does cross the line, so the optimal point exists.',
        'For (b), combines vertical angles with the fact that reflection preserves angles.',
      ],
      commonErrors: [
        'Describes the reflected construction but never proves other points are worse.',
        'Uses calculus on coordinates. Acceptable if complete, including why the critical point is a minimum; nudge towards the reflection.',
        'Chooses the foot of the perpendicular from A or B, or the midpoint of the two feet.',
        'Assumes the equal-angle property in order to prove optimality (circular).',
      ],
    },
  },
  {
    id: 'geo-3',
    solution: r`**(a)** Draw the diagonal $AC$. In triangle $ABC$, $K$ and $L$ are the midpoints of $AB$ and $BC$, so by the midline theorem $KL \parallel AC$ and $KL = \tfrac12 AC$. In triangle $ACD$, $N$ and $M$ are the midpoints of $DA$ and $CD$, so $NM \parallel AC$ and $NM = \tfrac12 AC$.

So $KL$ and $NM$ are parallel and equal in length, which makes $KLMN$ a parallelogram.

*(Vector version: $\vec{KL} = \tfrac12(\mathbf{b} + \mathbf{c}) - \tfrac12(\mathbf{a} + \mathbf{b}) = \tfrac12(\mathbf{c} - \mathbf{a})$ and $\vec{NM} = \tfrac12(\mathbf{c} + \mathbf{d}) - \tfrac12(\mathbf{d} + \mathbf{a}) = \tfrac12(\mathbf{c} - \mathbf{a})$.)*

**(b)** Write $[\cdot]$ for area. Triangle $KBL$ is similar to triangle $ABC$ with ratio $\tfrac12$ (same angle at $B$, sides halved), so $[KBL] = \tfrac14[ABC]$. Likewise $[MDN] = \tfrac14[CDA]$. Since the quadrilateral is convex, the diagonal $AC$ splits it into triangles $ABC$ and $CDA$, so

$$[KBL] + [MDN] = \tfrac14\big([ABC] + [CDA]\big) = \tfrac14[ABCD].$$

Using the other diagonal $BD$ in the same way, $[NAK] + [LCM] = \tfrac14\big([DAB] + [BCD]\big) = \tfrac14[ABCD]$.

Convexity also ensures the four corner triangles lie inside $ABCD$ and do not overlap, and removing them leaves $KLMN$. Therefore

$$[KLMN] = [ABCD] - \tfrac14[ABCD] - \tfrac14[ABCD] = \tfrac12[ABCD].$$`,
    rubric: {
      keyIdeas: [
        'Draws a diagonal to create triangles in which the midpoints are midpoints of two sides.',
        'Uses the midline theorem (or vectors) to show a pair of opposite sides of KLMN is parallel and equal.',
        'For (b), shows each corner triangle has a quarter of the area of the triangle cut off by a diagonal.',
        'Pairs opposite corners with the appropriate diagonal so the corner areas total half of ABCD.',
        'Subtracts the corners from the whole.',
      ],
      commonErrors: [
        'Shows only that opposite sides are parallel to diagonals without concluding the parallelogram property properly (one pair parallel and equal, or both pairs parallel).',
        'Assumes ABCD is a special quadrilateral (rectangle, parallelogram, kite).',
        'In (b), claims each corner triangle is a quarter of the whole quadrilateral.',
        'Not mentioning where convexity is used is a minor omission only.',
      ],
    },
  },
  {
    id: 'geo-4',
    solution: r`Place the origin at the circumcentre $O$ and let $\mathbf{a}, \mathbf{b}, \mathbf{c}$ be the position vectors of $A, B, C$. Then $\lvert\mathbf{a}\rvert = \lvert\mathbf{b}\rvert = \lvert\mathbf{c}\rvert = R$, the circumradius.

**(a)** Define $H$ by $\mathbf{h} = \mathbf{a} + \mathbf{b} + \mathbf{c}$. Then

$$\overrightarrow{AH}\cdot\overrightarrow{BC} = (\mathbf{b} + \mathbf{c})\cdot(\mathbf{c} - \mathbf{b}) = \lvert\mathbf{c}\rvert^2 - \lvert\mathbf{b}\rvert^2 = R^2 - R^2 = 0.$$

So either $H = A$ or the line $AH$ is perpendicular to $BC$; in both cases $H$ lies on the altitude from $A$. The expression for $\mathbf{h}$ is symmetric in the three vertices, so the same calculation shows $H$ lies on the altitudes from $B$ and from $C$. Hence the three altitudes pass through $H$.

**(b)** The centroid has position vector $\mathbf{g} = \tfrac13(\mathbf{a} + \mathbf{b} + \mathbf{c})$. With $O$ as origin this says

$$\overrightarrow{OH} = \mathbf{h} = 3\mathbf{g} = 3\,\overrightarrow{OG}.$$

So $O$, $G$, $H$ are collinear, with $G$ one third of the way from $O$ to $H$. (In an equilateral triangle all three points coincide and the statement is trivially true.)`,
    rubric: {
      keyIdeas: [
        'Chooses the circumcentre as origin so the three position vectors have equal length.',
        'Proposes h = a + b + c (or derives the equivalent) as the candidate orthocentre.',
        'Verifies AH ⊥ BC with a dot product that reduces to |c|² − |b|².',
        'Extends to the other two altitudes by symmetry or by repeating the computation.',
        'Uses g = (a + b + c)/3 to conclude OH = 3 OG.',
      ],
      commonErrors: [
        'Assumes the altitudes are concurrent and only proves collinearity.',
        'Places the origin elsewhere and loses the equal-length property.',
        'Checks only one altitude without appeal to symmetry.',
        'A synthetic proof (medial or anticomplementary triangle, or the homothety at G with ratio −2) is fully acceptable if complete.',
      ],
    },
  },
  {
    id: 'geo-5',
    solution: r`**(a)** Let $\rho$ be the rotation about $B$ through $60^\circ$ in the direction that sends $C$ to $A'$ (it exists because triangle $BCA'$ is equilateral: $BC = BA'$ and $\angle CBA' = 60^\circ$). Let $P' = \rho(P)$.

- $BP = BP'$ and $\angle PBP' = 60^\circ$, so triangle $BPP'$ is equilateral (or $P = P' = B$). In either case $PB = PP'$.
- Rotations preserve distance, and $\rho$ sends $P \mapsto P'$ and $C \mapsto A'$, so $PC = P'A'$.

Therefore

$$PA + PB + PC = AP + PP' + P'A' \ \ge\ AA',$$

since the left side is the length of a broken path from $A$ to $A'$ through $P$ and $P'$, and a straight segment is the shortest path (the triangle inequality, applied twice).

**(b)** Equality in the triangle inequality forces $A, P, P', A'$ to lie on the segment $AA'$ in this order. Since $P$ is not a vertex, $P \ne B$, so triangle $BPP'$ is a genuine equilateral triangle and $P \ne P'$; also $P \ne A$. So $P$ lies strictly between $A$ and $P'$ on a line, and

$$\angle APB = 180^\circ - \angle BPP' = 180^\circ - 60^\circ = 120^\circ.$$

(The same argument at $P'$ gives $\angle BP'A' = 120^\circ$, which rotates back to $\angle BPC = 120^\circ$: at the optimal point all three sides are seen under $120^\circ$.)`,
    rubric: {
      keyIdeas: [
        'Uses the 60° rotation about B (or C) that carries one vertex of the equilateral triangle to A′.',
        'Shows PB = PP′ via the equilateral triangle BPP′.',
        'Shows PC = P′A′ because rotation preserves length.',
        'Rewrites the sum as a broken path from A to A′ and applies the triangle inequality.',
        'For (b), uses the collinearity forced by equality together with the 60° angle of triangle BPP′.',
      ],
      commonErrors: [
        'Rotates in the direction that does not send C to A′, so the path does not end at A′.',
        'Asserts the minimiser sees each side at 120° (a known fact about the Fermat point) instead of proving the inequality.',
        'Uses calculus or gradients on the sum of distances without completing the argument.',
        'In (b), forgets to exclude degenerate cases such as P = P′; minor if the main argument is right.',
      ],
    },
  },
]
