'use client'

import { render, screen } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

describe('Tooltip Components', () => {
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
