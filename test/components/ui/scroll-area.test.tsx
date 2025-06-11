'use client'

import { render, screen } from '@testing-library/react'
import { ScrollArea } from '@/components/ui/scroll-area'

describe('ScrollArea Component', () => {
  it('renders scroll area with content', () => {
    render(
      <ScrollArea className="h-48 w-48">
        <div className="p-4">
          <h4>Scrollable Content</h4>
          <p>This content can be scrolled if it overflows.</p>
        </div>
      </ScrollArea>,
    )

    expect(screen.getByText('Scrollable Content')).toBeInTheDocument()
    expect(screen.getByText('This content can be scrolled if it overflows.')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ScrollArea className="custom-scroll">
        <div>Content</div>
      </ScrollArea>,
    )

    const scrollArea = screen.getByText('Content').closest('[class*="custom-scroll"]')
    expect(scrollArea).toHaveClass('custom-scroll')
  })

  it('renders with specified dimensions', () => {
    render(
      <ScrollArea className="h-32 w-64">
        <div>Sized Content</div>
      </ScrollArea>,
    )

    const scrollArea = screen.getByText('Sized Content').closest('[class*="h-32"]')
    expect(scrollArea).toHaveClass('h-32', 'w-64')
  })

  it('handles overflow content', () => {
    render(
      <ScrollArea className="h-20">
        <div style={{ height: '200px' }}>
          <p>Line 1</p>
          <p>Line 2</p>
          <p>Line 3</p>
          <p>Line 4</p>
          <p>Line 5</p>
        </div>
      </ScrollArea>,
    )

    expect(screen.getByText('Line 1')).toBeInTheDocument()
    expect(screen.getByText('Line 5')).toBeInTheDocument()
  })
})
