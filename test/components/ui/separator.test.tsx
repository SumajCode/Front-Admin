'use client'

import { render, screen } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

describe('Separator Component', () => {
  it('renders horizontal separator by default', () => {
    render(<Separator data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders vertical separator when specified', () => {
    render(<Separator orientation="vertical" data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
  })

  it('applies custom className', () => {
    render(<Separator className="custom-separator" data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).toHaveClass('custom-separator')
  })

  it('is decorative by default', () => {
    render(<Separator data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
  })

  it('can be non-decorative', () => {
    render(<Separator decorative={false} data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('renders with proper ARIA role', () => {
    render(<Separator decorative={false} data-testid="separator" />)
    const separator = screen.getByTestId('separator')
    expect(separator).toHaveAttribute('role', 'separator')
  })
})
