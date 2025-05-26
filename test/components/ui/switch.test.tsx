'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '@/components/ui/switch'

describe('Switch Component', () => {
  it('renders switch', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('handles checked state', async () => {
    const user = userEvent.setup()
    const mockOnCheckedChange = jest.fn()

    render(<Switch onCheckedChange={mockOnCheckedChange} />)

    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)

    expect(mockOnCheckedChange).toHaveBeenCalledWith(true)
  })

  it('can be disabled', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Switch className="custom-switch" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-switch')
  })

  it('shows checked state visually', () => {
    render(<Switch checked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('shows unchecked state visually', () => {
    render(<Switch checked={false} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
  })

  it('handles controlled state', async () => {
    const user = userEvent.setup()
    const mockOnCheckedChange = jest.fn()

    render(<Switch checked={false} onCheckedChange={mockOnCheckedChange} />)

    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()

    await user.click(switchElement)
    expect(mockOnCheckedChange).toHaveBeenCalledWith(true)
  })

  it('has proper ARIA attributes', () => {
    render(<Switch aria-label="Toggle setting" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle setting')
  })
})
