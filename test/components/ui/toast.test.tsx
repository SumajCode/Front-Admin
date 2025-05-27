'use client'

import { render, screen } from '@testing-library/react'
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
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
