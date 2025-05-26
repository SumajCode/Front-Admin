'use client'

import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toHaveClass('bg-primary')
  })

  it('applies secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    const badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass('bg-secondary')
  })

  it('applies destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    const badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass('bg-destructive')
  })

  it('applies outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    const badge = screen.getByText('Outline Badge')
    expect(badge).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-class')
  })
})
