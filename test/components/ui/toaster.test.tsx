'use client'

import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { act } from '@testing-library/react'

function TestToasterComponent() {
  const { toast } = useToast()

  return (
    <div>
      <button
        onClick={() =>
          toast({
            title: 'Test Toast',
            description: 'This is a test toast',
          })
        }
      >
        Show Toast
      </button>
      <Toaster />
    </div>
  )
}

describe('Toaster Component', () => {
  it('renders toaster component', () => {
    render(<Toaster />)
    // Toaster renders viewport which may not be visible without toasts
    expect(document.querySelector('[data-slot="toast-viewport"]')).toBeInTheDocument()
  })

  it('displays toast when triggered', async () => {
    render(<TestToasterComponent />)

    const button = screen.getByText('Show Toast')

    act(() => {
      button.click()
    })

    expect(screen.getByText('Test Toast')).toBeInTheDocument()
    expect(screen.getByText('This is a test toast')).toBeInTheDocument()
  })

  it('renders multiple toasts', () => {
    const { toast } = useToast()

    render(<Toaster />)

    act(() => {
      toast({ title: 'Toast 1' })
      toast({ title: 'Toast 2' })
    })

    expect(screen.getByText('Toast 1')).toBeInTheDocument()
    expect(screen.getByText('Toast 2')).toBeInTheDocument()
  })

  it('handles toast with action', () => {
    const { toast } = useToast()

    render(<Toaster />)

    act(() => {
      toast({
        title: 'Action Toast',
        action: <button>Undo</button>,
      })
    })

    expect(screen.getByText('Action Toast')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
  })
})
