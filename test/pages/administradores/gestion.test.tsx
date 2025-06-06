import { render, screen, waitFor } from '@testing-library/react'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'

// Mock de los datos
jest.mock('@/data/administradores.json', () => ({
  administradores: [
    {
      id: 1,
      name: 'Admin Test',
      email: 'admin@test.com',
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Admin Test 2',
      email: 'admin2@test.com',
      status: 'Inactivo',
    },
  ],
}))

describe('GestionAdministradoresPage', () => {
  it('renders the page title', () => {
    render(<GestionAdministradoresPage />)
    expect(screen.getByText('Gestión de Administradores')).toBeInTheDocument()
  })

  it('renders the administrators table', async () => {
    render(<GestionAdministradoresPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin Test')).toBeInTheDocument()
      expect(screen.getByText('admin@test.com')).toBeInTheDocument()
    })
  })
})
