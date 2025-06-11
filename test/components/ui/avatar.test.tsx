'use client'

import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar Components', () => {
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
