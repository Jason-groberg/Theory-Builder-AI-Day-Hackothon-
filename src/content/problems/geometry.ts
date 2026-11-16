import type { Problem } from '../types.ts'

const r = String.raw

export const geometry: Problem[] = [
  {
    id: 'geo-1',
    category: 'geometry',
    level: 1,
    title: 'The angle in a semicircle',
    statement: r`Let $AB$ be a diameter of a circle with centre $O$, and let $C$ be any other point on the circle.

Prove that $\angle ACB = 90^\circ$.`,
    topics: ['Circles', 'Inscribed angles'],
    techniques: ['angle-chasing', 'auxiliary-construction'],
    hints: [
      r`The only thing you know about $C$ is that it lies on the circle. Which lengths does that make equal?`,
      r`Draw the segment $OC$. It splits triangle $ABC$ into two isosceles triangles, since $OA = OC = OB$.`,
      r`Name the equal base angles $\alpha$ (in triangle $OAC$) and $\beta$ (in triangle $OBC$). Write the angle sum of triangle $ABC$ in terms of $\alpha$ and $\beta$.`,
    ],
  },
  {
    id: 'geo-2',
    category: 'geometry',
    level: 2,
    title: 'The shortest detour',
    statement: r`Points $A$ and $B$ lie on the same side of a straight line $\ell$. You must walk from $A$ to some point $P$ on $\ell$ and then on to $B$.

**(a)** Describe the point $P$ that makes $AP + PB$ as small as possible, and prove that it is optimal.

**(b)** Show that at the optimal point, the segments $PA$ and $PB$ make equal angles with $\ell$.`,
    topics: ['Shortest paths', 'Reflections'],
    techniques: ['transformations', 'triangle-inequality'],
    hints: [
      r`If $A$ and $B$ were on opposite sides of $\ell$, the problem would be trivial. Can you turn this problem into that one without changing any of the lengths involved?`,
      r`Reflect $B$ across $\ell$ to get $B'$. For every point $P$ on $\ell$, $PB = PB'$, so you are minimising $AP + PB'$.`,
      r`By the triangle inequality $AP + PB' \ge AB'$, with equality exactly when $P$ lies on segment $AB'$. For (b), combine vertical angles at $P$ with the fact that reflection preserves angles.`,
    ],
  },
  {
    id: 'geo-3',
    category: 'geometry',
    level: 3,
    title: 'The midpoint quadrilateral',
    statement: r`Let $ABCD$ be a convex quadrilateral, and let $K$, $L$, $M$, $N$ be the midpoints of the sides $AB$, $BC$, $CD$, $DA$ respectively.

**(a)** Prove that $KLMN$ is a parallelogram.

**(b)** Prove that the area of $KLMN$ is exactly half the area of $ABCD$.`,
    topics: ['Quadrilaterals', 'Midlines'],
    techniques: ['auxiliary-construction', 'area-arguments'],
    hints: [
      r`Nothing is known about the quadrilateral itself, so look for triangles. Which segment could you draw so that $K$ and $L$ become midpoints of two sides of a triangle?`,
      r`Draw the diagonal $AC$. In triangle $ABC$ the segment $KL$ joins two midpoints, so it is parallel to $AC$ and half as long. Say the same for $NM$ in triangle $ACD$.`,
      r`For (b), compute the area of what is cut off. Triangle $KBL$ is similar to triangle $ABC$ with ratio $\tfrac12$, so it has a quarter of its area. Do the same at each corner and add, using one diagonal for two of the corners and the other diagonal for the other two.`,
    ],
  },
  {
    id: 'geo-4',
    category: 'geometry',
    level: 4,
    title: 'The Euler line',
    statement: r`Let $ABC$ be a triangle with circumcentre $O$ (the centre of the circle through $A$, $B$, $C$) and centroid $G$ (the intersection of the medians).

**(a)** Prove that the three altitudes of the triangle pass through a common point $H$.

**(b)** Prove that $O$, $G$ and $H$ lie on one line, with $\overrightarrow{OH} = 3\,\overrightarrow{OG}$.

You may use that the centroid is the average of the three vertices.`,
    topics: ['Triangle centres', 'Concurrency'],
    techniques: ['vectors'],
    hints: [
      r`The defining property of $O$ is that it is the same distance from all three vertices. Choose coordinates that make this as easy as possible to use.`,
      r`Put the origin at $O$ and write $\mathbf{a}, \mathbf{b}, \mathbf{c}$ for the position vectors of the vertices, so $\lvert\mathbf{a}\rvert = \lvert\mathbf{b}\rvert = \lvert\mathbf{c}\rvert$. Guess a simple symmetric formula for $H$ and test whether $AH \perp BC$.`,
      r`Try $\mathbf{h} = \mathbf{a} + \mathbf{b} + \mathbf{c}$. Then $\mathbf{h} - \mathbf{a} = \mathbf{b} + \mathbf{c}$, and $(\mathbf{b} + \mathbf{c}) \cdot (\mathbf{c} - \mathbf{b}) = \lvert\mathbf{c}\rvert^2 - \lvert\mathbf{b}\rvert^2$. Compare $\mathbf{h}$ with the position vector of $G$.`,
    ],
  },
  {
    id: 'geo-5',
    category: 'geometry',
    level: 5,
    title: 'Three roads to one point',
    statement: r`Let $ABC$ be a triangle. Construct the equilateral triangle $BCA'$ on side $BC$, with $A'$ on the opposite side of line $BC$ from $A$.

**(a)** Prove that for every point $P$ in the plane,

$$PA + PB + PC \ \ge\ AA'.$$

**(b)** Suppose equality holds for a point $P$ that is not a vertex of the triangle. Prove that $\angle APB = 120^\circ$.`,
    topics: ['Fermat point', 'Geometric inequalities'],
    techniques: ['transformations', 'triangle-inequality', 'auxiliary-construction'],
    hints: [
      r`Three segments meeting at $P$ are hard to compare with one segment. Could you rearrange the three lengths, without changing them, into a single broken path from $A$ to $A'$?`,
      r`The equilateral triangle suggests a rotation by $60^\circ$. Rotate about $B$ so that $C$ lands on $A'$, and let $P'$ be the image of $P$. What kind of triangle is $BPP'$?`,
      r`You get $PB = PP'$ (triangle $BPP'$ is equilateral) and $PC = P'A'$ (rotations preserve length). So $PA + PB + PC = AP + PP' + P'A'$, a path from $A$ to $A'$. For (b), equality means $A, P, P', A'$ lie on a line in that order; use $\angle BPP' = 60^\circ$.`,
    ],
  },
]
