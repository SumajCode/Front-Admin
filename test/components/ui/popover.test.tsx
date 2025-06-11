'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

describe('Popover Components', () => {
  it('renders popover when triggered', async () => {
    const user = userEvent.setup()

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>,
    )

    const trigger = screen.getByText('Open Popover')
    await user.click(trigger)

    expect(screen.getByText('Popover Content')).toBeInTheDocument()
  })

  it('closes popover when clicking outside', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover Content</PopoverContent>
        </Popover>
        <div>Outside Content</div>
      </div>,
    )

    await user.click(screen.getByText('Open Popover'))
    expect(screen.getByText('Popover Content')).toBeInTheDocument()

    await user.click(screen.getByText('Outside Content'))
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument()
  })

  it('handles controlled open state', () => {
    render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Always Open Content</PopoverContent>
      </Popover>,
    )

    expect(screen.getByText('Always Open Content')).toBeInTheDocument()
  })

  it('calls onOpenChange when popover state changes', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()

    render(
      <Popover onOpenChange={mockOnOpenChange}>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    )

    await user.click(screen.getByText('Open Popover'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })

  it('applies custom className to content', async () => {
    const user = userEvent.setup()

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent className="custom-popover">Custom Content</PopoverContent>
      </Popover>,
    )

    await user.click(screen.getByText('Open Popover'))
    const content = screen.getByText('Custom Content')
    expect(content).toHaveClass('custom-popover')
  })
})
