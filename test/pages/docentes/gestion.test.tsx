import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DocentesPage from '@/app/docentes/gestion/page'
import { mockDocentes } from '../../mocks/data'

// Mock de los datos
jest.mock('@/data/docentes.json', () => ({
  docentes: mockDocentes,
}))

describe('DocentesPage', () => {
  it('renders the page title', () => {
    render(<DocentesPage />)
    expect(screen.getByText('Gestión de Docentes')).toBeInTheDocument()
  })

  it('renders the teachers table', async () => {
    render(<DocentesPage />)

    await waitFor(() => {
      expect(screen.getByText('Docente Test')).toBeInTheDocument()
      expect(screen.getByText('docente@test.com')).toBeInTheDocument()
    })
  })

  it('opens new teacher form', async () => {
    const user = userEvent.setup()
    render(<DocentesPage />)

    const newButton = screen.getByRole('button', { name: /nuevo docente/i })
    await user.click(newButton)

    expect(screen.getByText('Nuevo Docente')).toBeInTheDocument()
  })

  it('opens edit teacher form', async () => {
    const user = userEvent.setup()
    render(<DocentesPage />)

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText(/editar/i)
      expect(editButtons.length).toBeGreaterThan(0)
    })

    const editButton = screen.getAllByLabelText(/editar/i)[0]
    await user.click(editButton)

    expect(screen.getByText('Editar Docente')).toBeInTheDocument()
  })

  it('shows delete confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<DocentesPage />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar/i)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    const deleteButton = screen.getAllByLabelText(/eliminar/i)[0]
    await user.click(deleteButton)

    expect(screen.getByText(/¿está seguro de eliminar este docente?/i)).toBeInTheDocument()
  })
})
