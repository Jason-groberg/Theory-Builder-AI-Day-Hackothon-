export type CategoryId =
  | 'probability'
  | 'linear-algebra'
  | 'calculus'
  | 'geometry'
  | 'statistics'

export interface Category {
  id: CategoryId
  name: string
  symbol: string
  blurb: string
  techniques: string[]
}

export const categories: Category[] = [
  {
    id: 'probability',
    name: 'Probability & Data Science',
    symbol: 'ℙ',
    blurb: 'Condition well, count cleverly, and let expectation do the work.',
    techniques: ['Conditioning', 'Linearity of expectation', 'Indicators', 'Bayes'],
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    symbol: 'λ',
    blurb: 'Reason about maps and subspaces, not rows of numbers.',
    techniques: ['Rank–nullity', 'Eigen-structure', 'Change of basis', 'Invariant subspaces'],
  },
  {
    id: 'calculus',
    name: 'Calculus',
    symbol: '∫',
    blurb: 'Pick the right theorem and make the estimate that matters.',
    techniques: ['Mean value theorem', 'Intermediate value theorem', 'Bounding', 'Convergence'],
  },
  {
    id: 'geometry',
    name: 'Geometry',
    symbol: '△',
    blurb: 'Find the invariant, the symmetry, or the construction that unlocks it.',
    techniques: ['Angle chasing', 'Transformations', 'Invariants', 'Auxiliary constructions'],
  },
  {
    id: 'statistics',
    name: 'Statistics',
    symbol: 'σ',
    blurb: 'Judge estimators and tests by what they can and cannot show.',
    techniques: ['Bias and variance', 'Sampling distributions', 'Test design', 'Interpretation'],
  },
]
