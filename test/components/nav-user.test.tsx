'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavUser } from '@/components/nav-user'
import { SidebarProvider } from '@/components/ui/sidebar'

const mockUser = {
  name: 'Admin Test',
  email: 'admin@test.com',
  avatar: '/test-avatar.jpg',
}

describe('NavUser', () => {
  it('renders user information', () => {
    render(
      <SidebarProvider>
        <NavUser user={mockUser} />
      </SidebarProvider>,
    )

    expect(screen.getByText('Admin Test')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('opens dropdown menu on click', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider>
        <NavUser user={mockUser} />
      </SidebarProvider>,
    )

    const userButton = screen.getByText('Admin Test').closest('button')
    expect(userButton).toBeInTheDocument()

    if (userButton) {
      await user.click(userButton)
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('Log out')).toBeInTheDocument()
    }
  })

  it('renders dropdown menu items', async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider>
        <NavUser user={mockUser} />
      </SidebarProvider>,
    )

    const userButton = screen.getByText('Admin Test').closest('button')
    if (userButton) {
      await user.click(userButton)

      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('Log out')).toBeInTheDocument()
    }
  })
})
