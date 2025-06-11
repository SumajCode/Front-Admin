'use client'

import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset window size
    mockInnerWidth(1024)
  })

  it('returns false for desktop width', () => {
    mockInnerWidth(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true for mobile width', () => {
    mockInnerWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns true for tablet width (below 768px)', () => {
    mockInnerWidth(700)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false for width exactly at breakpoint', () => {
    mockInnerWidth(768)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
