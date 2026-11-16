import type { CategoryId } from '../categories.ts'
import type { Problem } from '../types.ts'
import { calculus } from './calculus.ts'
import { geometry } from './geometry.ts'
import { linearAlgebra } from './linear-algebra.ts'
import { numberTheory } from './number-theory.ts'
import { probability } from './probability.ts'
import { statistics } from './statistics.ts'

export const problems: Problem[] = [
  ...probability,
  ...linearAlgebra,
  ...calculus,
  ...geometry,
  ...statistics,
  ...numberTheory,
]

export function problemsIn(category: CategoryId): Problem[] {
  return problems.filter((p) => p.category === category).sort((a, b) => a.level - b.level)
}

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id)
}
