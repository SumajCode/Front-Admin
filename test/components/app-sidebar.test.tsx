import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { act } from '@testing-library/react'

// Mock de localStorage para simular usuario
beforeAll(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'user_data') {
      return JSON.stringify({
        first_name: 'Admin',
        last_name: 'Test',
        email: 'admin@test.com',
      })
    }
    return null
  })
})

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

  it('renders user information', async () => {
    await renderSidebar()
    expect(screen.getByText('Admin Test')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })

  it('shows only available submenu items', async () => {
    await renderSidebar()
    expect(screen.getByText('Gestionar Docentes')).toBeInTheDocument()
    expect(screen.queryByText('Historial de Docentes')).not.toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByText('Administradores'))
    expect(screen.getByText('Gestionar Administradores')).toBeInTheDocument()
    expect(screen.queryByText('Historial de Administradores')).not.toBeInTheDocument()
  })

  it('renders navigation links with correct hrefs', async () => {
    await renderSidebar()
    expect(screen.getByText('Gestionar Docentes').closest('a')).toHaveAttribute(
      'href',
      '/docentes/gestion',
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('Administradores'))
    expect(screen.getByText('Gestionar Administradores').closest('a')).toHaveAttribute(
      'href',
      '/administradores/gestion',
    )
  })
})
