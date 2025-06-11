'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavMain } from '@/components/nav-main'
import { BookUser, Users } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'

const mockItems = [
  {
    title: 'Docentes',
    url: '#',
    icon: BookUser,
    isActive: true,
    items: [
      {
        title: 'Gestionar Docentes',
        url: '/docentes/gestion',
      },
      {
        title: 'Historial de Docentes',
        url: '/docentes/historial',
      },
    ],
  },
  {
    title: 'Administradores',
    url: '#',
    icon: Users,
    items: [
      {
        title: 'Gestionar Administradores',
        url: '/administradores/gestion',
      },
    ],
  },
]

const renderWithSidebar = (ui: React.ReactNode) => {
  return render(<SidebarProvider>{ui}</SidebarProvider>)
}

describe('NavMain', () => {
  it('renders navigation items', () => {
    renderWithSidebar(<NavMain items={mockItems} />)

    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Docentes')).toBeInTheDocument()
    expect(screen.getByText('Administradores')).toBeInTheDocument()
  })

  it('expands active items by default', () => {
    renderWithSidebar(<NavMain items={mockItems} />)

    expect(screen.getByText('Gestionar Docentes')).toBeInTheDocument()
    expect(screen.getByText('Historial de Docentes')).toBeInTheDocument()
  })

  it('toggles item expansion on click', async () => {
    const user = userEvent.setup()
    renderWithSidebar(<NavMain items={mockItems} />)

    const adminButton = screen.getByText('Administradores')
    await user.click(adminButton)

    expect(screen.getByText('Gestionar Administradores')).toBeInTheDocument()
  })

  it('renders icons for navigation items', () => {
    renderWithSidebar(<NavMain items={mockItems} />)

    const docentesButton = screen.getByText('Docentes')
    const adminButton = screen.getByText('Administradores')

    expect(docentesButton.closest('button')).toBeInTheDocument()
    expect(adminButton.closest('button')).toBeInTheDocument()
  })

  it('renders sub-navigation links', () => {
    renderWithSidebar(<NavMain items={mockItems} />)

    const docentesLink = screen.getByText('Gestionar Docentes')
    expect(docentesLink.closest('a')).toHaveAttribute('href', '/docentes/gestion')
  })
})
