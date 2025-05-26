'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavUser } from '@/components/nav-user'

const mockUser = {
  name: 'Admin Test',
  email: 'admin@test.com',
  avatar: '/test-avatar.jpg',
}

describe('NavUser', () => {
  it('renders user information', () => {
    render(<NavUser user={mockUser} />)

    expect(screen.getByText('Admin Test')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('opens dropdown menu on click', async () => {
    const user = userEvent.setup()
    render(<NavUser user={mockUser} />)

    const userButton = screen.getByText('Admin Test').closest('button')
    expect(userButton).toBeInTheDocument()

    if (userButton) {
      await user.click(userButton)
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('Log out')).toBeInTheDocument()
    }
  })

  it('renders user avatar', () => {
    render(<NavUser user={mockUser} />)

    const avatar = screen.getByAltText('Admin Test')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/test-avatar.jpg')
  })

  it('shows fallback initials when no avatar', () => {
    const userWithoutAvatar = {
      ...mockUser,
      avatar: '',
    }

    render(<NavUser user={userWithoutAvatar} />)

    expect(screen.getByText('CN')).toBeInTheDocument() // Fallback initials
  })

  it('renders dropdown menu items', async () => {
    const user = userEvent.setup()
    render(<NavUser user={mockUser} />)

    const userButton = screen.getByText('Admin Test').closest('button')
    if (userButton) {
      await user.click(userButton)

      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('Log out')).toBeInTheDocument()
    }
  })
})
