'use client'

import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar Components', () => {
  it('renders avatar with image', () => {
    render(
      <Avatar>
        <AvatarImage src="/test-avatar.jpg" alt="Test User" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>,
    )

    const image = screen.getByAltText('Test User')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-avatar.jpg')
  })

  it('renders fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="/invalid-image.jpg" alt="Test User" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>,
    )

    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>,
    )

    const avatar = screen.getByText('TU').closest('[data-slot="avatar"]')
    expect(avatar).toHaveClass('custom-avatar')
  })

  it('renders with different sizes', () => {
    render(
      <Avatar className="size-12">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>,
    )

    const avatar = screen.getByText('LG').closest('[data-slot="avatar"]')
    expect(avatar).toHaveClass('size-12')
  })
})
