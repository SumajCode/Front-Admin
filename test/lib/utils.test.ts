import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden')
    expect(result).toBe('base conditional')
  })

  it('merges Tailwind classes correctly', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toBe('base end')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles objects with boolean values', () => {
    const result = cn({
      class1: true,
      class2: false,
      class3: true,
    })
    expect(result).toBe('class1 class3')
  })
})
