type RandomType = 'alphabet' | 'alphabetNumeric' | 'numeric'

export interface GenerateRandom {
  type?: RandomType
  length?: number
}
