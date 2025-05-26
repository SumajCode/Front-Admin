'use client'

import { render, screen } from '@testing-library/react'
import { NavSecondary } from '@/components/nav-secondary'
import { Newspaper, LifeBuoy, Send } from 'lucide-react'

const mockItems = [
  {
    title: 'Noticias y Anuncios',
    url: '/noticias',
    icon: Newspaper,
  },
  {
    title: 'Support',
    url: '#',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send,
  },
]

describe('NavSecondary', () => {
  it('renders secondary navigation items', () => {
    render(<NavSecondary items={mockItems} />)

    expect(screen.getByText('Noticias y Anuncios')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText('Feedback')).toBeInTheDocument()
  })

  it('renders links with correct href attributes', () => {
    render(<NavSecondary items={mockItems} />)

    const noticiasLink = screen.getByText('Noticias y Anuncios')
    expect(noticiasLink.closest('a')).toHaveAttribute('href', '/noticias')
  })

  it('renders icons for navigation items', () => {
    render(<NavSecondary items={mockItems} />)

    const noticiasButton = screen.getByText('Noticias y Anuncios')
    const supportButton = screen.getByText('Support')
    const feedbackButton = screen.getByText('Feedback')

    expect(noticiasButton.closest('a')).toBeInTheDocument()
    expect(supportButton.closest('a')).toBeInTheDocument()
    expect(feedbackButton.closest('a')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    render(<NavSecondary items={mockItems} className="custom-class" />)

    const container = screen.getByText('Noticias y Anuncios').closest('[data-slot="sidebar-group"]')
    expect(container).toHaveClass('custom-class')
  })
})
