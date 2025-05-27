'use client'

import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

describe('useToast', () => {
  it('starts with empty toasts array', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toEqual([])
  })

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test Description',
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Test Toast')
    expect(result.current.toasts[0].description).toBe('Test Description')
  })

  it('limits the number of toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      // Add more than the limit (5)
      for (let i = 0; i < 7; i++) {
        result.current.toast({
          title: `Toast ${i}`,
        })
      }
    })

    expect(result.current.toasts).toHaveLength(5)
  })
})
