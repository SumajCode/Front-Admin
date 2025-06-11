'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea Component', () => {
  it('renders textarea', () => {
    render(<Textarea placeholder="Enter text here" />)
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const mockOnChange = jest.fn()

    render(<Textarea onChange={mockOnChange} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'test content')

    expect(mockOnChange).toHaveBeenCalled()
    expect(textarea).toHaveValue('test content')
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-textarea" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('can be disabled', () => {
    render(<Textarea disabled />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('handles controlled value', () => {
    render(<Textarea value="controlled value" readOnly />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('controlled value')
  })

  it('supports different sizes', () => {
    render(<Textarea className="min-h-[120px]" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('min-h-[120px]')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const mockOnFocus = jest.fn()
    const mockOnBlur = jest.fn()

    render(<Textarea onFocus={mockOnFocus} onBlur={mockOnBlur} />)

    const textarea = screen.getByRole('textbox')
    await user.click(textarea)
    expect(mockOnFocus).toHaveBeenCalled()

    await user.tab()
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('supports resize behavior', () => {
    render(<Textarea className="resize-none" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('resize-none')
  })
})
