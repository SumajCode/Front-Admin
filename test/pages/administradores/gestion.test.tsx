import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'
import { mockAdministradores } from '../../mocks/data'

// Mock de los datos
jest.mock('@/data/administradores.json', () => ({
  administradores: mockAdministradores,
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

  it('opens new administrator form', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)

    const newButton = screen.getByRole('button', { name: /nuevo administrador/i })
    await user.click(newButton)

    expect(screen.getByText('Nuevo Administrador')).toBeInTheDocument()
  })

  it('shows delete confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar/i)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    const deleteButton = screen.getAllByLabelText(/eliminar/i)[0]
    await user.click(deleteButton)

    expect(screen.getByText(/¿está seguro de eliminar este administrador?/i)).toBeInTheDocument()
  })

  it('prevents deletion when insufficient active admins', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar/i)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    // Simular que solo hay 1 admin activo
    const deleteButton = screen.getAllByLabelText(/eliminar/i)[0]
    await user.click(deleteButton)

    // Debería mostrar el diálogo de seguridad en lugar del de confirmación
    await waitFor(() => {
      expect(screen.getByText(/no se puede eliminar el administrador/i)).toBeInTheDocument()
    })
  })
})
