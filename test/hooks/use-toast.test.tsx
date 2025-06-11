'use client'

import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

describe('useToast', () => {
  it('starts with empty toasts array', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toEqual([])
  })

  it('adds a toast with title and description', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Test Toast', description: 'Test Description' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Test Toast')
    expect(result.current.toasts[0].description).toBe('Test Description')
  })

  it('limits to max 5 toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.toast({ title: `Toast ${i}` })
      }
    })

    expect(result.current.toasts).toHaveLength(5)
    expect(result.current.toasts[0].title).toBe('Toast 6') // El último añadido
    expect(result.current.toasts[4].title).toBe('Toast 2') // El más antiguo visible
  })

  it('removes a toast using dismiss()', () => {
    const { result } = renderHook(() => useToast())

    let id: string = ''
    act(() => {
      const { id: toastId } = result.current.toast({ title: 'To Remove' })
      id = toastId
    })

    act(() => {
      result.current.dismiss(id)
    })

    expect(result.current.toasts[0]?.open).toBe(false)
  })

  it('removes all toasts if no id is passed to dismiss()', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })

    act(() => {
      result.current.dismiss()
    })

    expect(result.current.toasts.every((t) => t.open === false)).toBe(true)
  })

  it('dismisses a toast through onOpenChange callback', () => {
    const { result } = renderHook(() => useToast())
    let dismissFn: () => void

    act(() => {
      const toastObj = result.current.toast({ title: 'Auto Dismiss' })
      dismissFn = toastObj.dismiss
    })

    // simulate close
    act(() => {
      dismissFn()
    })

    expect(result.current.toasts[0]?.open).toBe(false)
  })

  it('updates a toast using the returned update()', () => {
    const { result } = renderHook(() => useToast())

    let updateFn: (props: any) => void

    act(() => {
      const toastObj = result.current.toast({ title: 'Initial' })
      updateFn = toastObj.update
    })

    act(() => {
      updateFn({ title: 'Updated' })
    })

    expect(result.current.toasts[0]?.title).toBe('Updated')
  })

  it('returns an id from toast()', () => {
    const { result } = renderHook(() => useToast())

    let id: string = ''

    act(() => {
      const toastObj = result.current.toast({ title: 'With ID' })
      id = toastObj.id
    })

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})
