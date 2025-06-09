import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { act } from '@testing-library/react'


// Mock de los datos de usuario
jest.mock('@/data/usuario.json', () => ({
  usuario: {
    name: 'Admin Test',
    email: 'admin@test.com',
    avatar: '/test-avatar.jpg',
  },
}))

const renderSidebar = async () => {
  await act(async () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    )
  })
}

describe('AppSidebar', () => {
  it('renders sidebar with company branding', async () => {
    await renderSidebar()
    expect(screen.getByText('SumajCode')).toBeInTheDocument()
    expect(screen.getByText('Generacion de Software')).toBeInTheDocument()
  })

  it('renders main navigation items', async () => {
    await renderSidebar()
    expect(screen.getByText('Docentes')).toBeInTheDocument()
    expect(screen.getByText('Administradores')).toBeInTheDocument()
  })

  it('renders secondary navigation items', async () => {
    await renderSidebar()
    expect(screen.getByText('Noticias y Anuncios')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText('Feedback')).toBeInTheDocument()
  })

  it('renders user information', async () => {
    await renderSidebar()
    expect(screen.getByText('Admin Test')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('expands docentes submenu by default', async () => {
    await renderSidebar()
    expect(screen.getByText('Gestionar Docentes')).toBeInTheDocument()
    expect(screen.getByText('Historial de Docentes')).toBeInTheDocument()
  })

  it('can expand administradores submenu', async () => {
    const user = userEvent.setup()
    await renderSidebar()
    await user.click(screen.getByText('Administradores'))

    expect(screen.getByText('Gestionar Administradores')).toBeInTheDocument()
    expect(screen.getByText('Historial de Administradores')).toBeInTheDocument()
  })

  it('renders navigation links with correct hrefs', async () => {
    await renderSidebar()

    expect(screen.getByText('Gestionar Docentes').closest('a')).toHaveAttribute(
      'href',
      '/docentes/gestion',
    )
    expect(screen.getByText('Historial de Docentes').closest('a')).toHaveAttribute(
      'href',
      '/docentes/historial',
    )
    expect(screen.getByText('Noticias y Anuncios').closest('a')).toHaveAttribute(
      'href',
      '/noticias',
    )
  })
})
