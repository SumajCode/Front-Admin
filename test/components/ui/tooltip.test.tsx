'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

describe('Tooltip Components', () => {
  it('renders tooltip when hovered', async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)

    expect(screen.getByText('Tooltip content')).toBeInTheDocument()
  })

  it('hides tooltip when not hovered', async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)
    expect(screen.getByText('Tooltip content')).toBeInTheDocument()

    await user.unhover(trigger)
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
  })

  it('renders tooltip with custom delay', async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Quick tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)

    expect(screen.getByText('Quick tooltip')).toBeInTheDocument()
  })

  it('applies custom className to content', async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-tooltip">Custom content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)

    const content = screen.getByText('Custom content')
    expect(content).toHaveClass('custom-tooltip')
  })

  it('handles different side positions', async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent side="left">Left tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)

    expect(screen.getByText('Left tooltip')).toBeInTheDocument()
  })

  it('renders tooltip trigger as button by default', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Button trigger</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText('Button trigger')
    expect(trigger.tagName).toBe('BUTTON')
  })
})
