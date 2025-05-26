'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppSidebar } from '@/components/app-sidebar'

// Mock de los datos de usuario
jest.mock('@/data/usuario.json', () => ({
  usuario: {
    name: 'Admin Test',
    email: 'admin@test.com',
    avatar: '/test-avatar.jpg',
  },
}))

describe('AppSidebar', () => {
  it('renders sidebar with company branding', () => {
    render(<AppSidebar />)

    expect(screen.getByText('SumajCode')).toBeInTheDocument()
    expect(screen.getByText('Generacion de Software')).toBeInTheDocument()
  })

  it('renders main navigation items', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Docentes')).toBeInTheDocument()
    expect(screen.getByText('Administradores')).toBeInTheDocument()
  })

  it('renders secondary navigation items', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Noticias y Anuncios')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText('Feedback')).toBeInTheDocument()
  })

  it('renders user information', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Admin Test')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('expands docentes submenu by default', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Gestionar Docentes')).toBeInTheDocument()
    expect(screen.getByText('Historial de Docentes')).toBeInTheDocument()
  })

  it('can expand administradores submenu', async () => {
    const user = userEvent.setup()
    render(<AppSidebar />)

    const adminButton = screen.getByText('Administradores')
    await user.click(adminButton)

    expect(screen.getByText('Gestionar Administradores')).toBeInTheDocument()
    expect(screen.getByText('Historial de Administradores')).toBeInTheDocument()
  })

  it('renders navigation links with correct hrefs', () => {
    render(<AppSidebar />)

    const docentesGestionLink = screen.getByText('Gestionar Docentes')
    expect(docentesGestionLink.closest('a')).toHaveAttribute('href', '/docentes/gestion')

    const docentesHistorialLink = screen.getByText('Historial de Docentes')
    expect(docentesHistorialLink.closest('a')).toHaveAttribute('href', '/docentes/historial')

    const noticiasLink = screen.getByText('Noticias y Anuncios')
    expect(noticiasLink.closest('a')).toHaveAttribute('href', '/noticias')
  })
})
