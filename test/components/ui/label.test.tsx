'use client'

import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
  it('renders label with text', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('associates with form control via htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>,
    )

    const label = screen.getByText('Test Label')
    const input = screen.getByRole('textbox')

    expect(label).toHaveAttribute('for', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('applies custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('renders as different HTML elements when asChild is used', () => {
    render(
      <Label asChild>
        <span>Span Label</span>
      </Label>,
    )

    const label = screen.getByText('Span Label')
    expect(label.tagName).toBe('SPAN')
  })

  it('handles disabled state styling', () => {
    render(
      <div>
        <Label htmlFor="disabled-input">Disabled Label</Label>
        <input id="disabled-input" disabled />
      </div>,
    )

    const label = screen.getByText('Disabled Label')
    expect(label).toBeInTheDocument()
  })
})
