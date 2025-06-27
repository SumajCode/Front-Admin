'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavUser } from '@/components/nav-user'
import { SidebarProvider } from '@/components/ui/sidebar'

// Usuario sin avatar para validar AvatarFallback
const mockUserWithoutAvatar = {
  name: 'Sin Avatar',
  email: 'sin.avatar@test.com',
  avatar: '',
}

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

  it('renders avatar fallback when no avatar is provided', () => {
    render(
      <SidebarProvider>
        <NavUser user={mockUserWithoutAvatar} />
      </SidebarProvider>,
    )

    // 'S' por 'Sin Avatar'
    expect(screen.getAllByText('S')[0]).toBeInTheDocument()
  })

  it('shows dropdown on click and displays logout option', async () => {
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

      // Asegura que el dropdown contiene el botón de cerrar sesión
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    }
  })
})
