import { render, screen, waitFor } from '@testing-library/react'
import DocentesPage from '@/app/docentes/gestion/page'

// Mock de los datos
jest.mock('@/data/docentes.json', () => ({
  docentes: [
    {
      id: 1,
      name: 'Docente Test',
      email: 'docente@test.com',
      telefono: '12345678',
      facultades: ['Facultad de Ciencias y Tecnología'],
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Docente Test 2',
      email: 'docente2@test.com',
      telefono: '87654321',
      facultades: ['Facultad de Medicina'],
      status: 'Inactivo',
    },
  ],
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
})
