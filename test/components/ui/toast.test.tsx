'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '@/components/ui/toast'

describe('Toast Components', () => {
  it('renders toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Toast Title</ToastTitle>
          <ToastDescription>Toast Description</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )

    expect(screen.getByText('Toast Title')).toBeInTheDocument()
    expect(screen.getByText('Toast Description')).toBeInTheDocument()
  })

  it('closes toast when close button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()

    render(
      <ToastProvider>
        <Toast open onOpenChange={mockOnOpenChange}>
          <ToastTitle>Closable Toast</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders toast action button', async () => {
    const user = userEvent.setup()
    const mockAction = jest.fn()

    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Action Toast</ToastTitle>
          <ToastAction onClick={mockAction}>Action</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )

    const actionButton = screen.getByText('Action')
    await user.click(actionButton)

    expect(mockAction).toHaveBeenCalled()
  })

  it('applies variant styling', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive" open>
          <ToastTitle>Error Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )

    const toast = screen.getByText('Error Toast').closest('[role="status"]')
    expect(toast).toHaveClass('destructive')
  })

  it('applies success variant styling', () => {
    render(
      <ToastProvider>
        <Toast variant="success" open>
          <ToastTitle>Success Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )

    const toast = screen.getByText('Success Toast').closest('[role="status"]')
    expect(toast).toHaveClass('border-[#00bf7d]')
  })

  it('renders viewport correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="toast-viewport" />
      </ToastProvider>,
    )

    expect(screen.getByTestId('toast-viewport')).toBeInTheDocument()
  })
})
