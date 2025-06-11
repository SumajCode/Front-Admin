'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { jest } from '@jest/globals'

describe('Collapsible Components', () => {
  it('renders collapsible content when open', () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Collapsible Content</CollapsibleContent>
      </Collapsible>,
    )

    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.getByText('Collapsible Content')).toBeInTheDocument()
  })

  it('hides content when closed', () => {
    render(
      <Collapsible open={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Collapsible Content</CollapsibleContent>
      </Collapsible>,
    )

    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.queryByText('Collapsible Content')).not.toBeInTheDocument()
  })

  it('toggles content on trigger click', async () => {
    const user = userEvent.setup()

    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Collapsible Content</CollapsibleContent>
      </Collapsible>,
    )

    const trigger = screen.getByText('Toggle')
    await user.click(trigger)

    expect(screen.getByText('Collapsible Content')).toBeInTheDocument()
  })

  it('calls onOpenChange when toggled', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()

    render(
      <Collapsible onOpenChange={mockOnOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    )

    await user.click(screen.getByText('Toggle'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })
})
