// Server-only. Import this from Netlify functions, never from src/.
import type { Solution } from '../../src/content/types.ts'
import { calculus } from './calculus.ts'
import { geometry } from './geometry.ts'
import { linearAlgebra } from './linear-algebra.ts'
import { numberTheory } from './number-theory.ts'
import { probability } from './probability.ts'
import { statistics } from './statistics.ts'

export const solutions: Solution[] = [
  ...probability,
  ...linearAlgebra,
  ...calculus,
  ...geometry,
  ...statistics,
  ...numberTheory,
]

export function getSolution(id: string): Solution | undefined {
  return solutions.find((s) => s.id === id)
}
