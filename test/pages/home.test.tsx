'use client'

import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />)
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })

  it('has proper heading structure', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Hello world!')
  })

  it('applies correct styling classes', () => {
    render(<Home />)
    const heading = screen.getByText('Hello world!')
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'underline')
  })

  it('renders with proper layout structure', () => {
    render(<Home />)
    const container = screen.getByText('Hello world!').closest('div')
    expect(container).toHaveClass('grid', 'grid-rows-[20px_1fr_20px]')
  })
})
