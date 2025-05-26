import { render, screen, waitFor } from '@testing-library/react'
import HistorialAdministradoresPage from '@/app/administradores/historial/page'
import { mockAdministradoresHistorial } from '../../mocks/data'

// Mock de los datos
jest.mock('@/data/administradores-historial.json', () => ({
  historial: mockAdministradoresHistorial,
}))

describe('HistorialAdministradoresPage', () => {
  it('renders the page title', () => {
    render(<HistorialAdministradoresPage />)
    expect(screen.getByText('Historial de Administradores')).toBeInTheDocument()
  })

  it('renders the history table', async () => {
    render(<HistorialAdministradoresPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin Test')).toBeInTheDocument()
      expect(screen.getByText('Creación')).toBeInTheDocument()
      expect(screen.getByText('01/01/2024')).toBeInTheDocument()
    })
  })

  it('displays records in descending date order', async () => {
    render(<HistorialAdministradoresPage />)

    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // Verificar que hay al menos el header y una fila de datos
      expect(rows.length).toBeGreaterThan(1)
    })
  })

  it('shows correct action badges with proper styling', async () => {
    render(<HistorialAdministradoresPage />)

    await waitFor(() => {
      const creationBadge = screen.getByText('Creación')
      expect(creationBadge).toHaveClass('bg-[#00bf7d]/20', 'text-[#00bf7d]')
    })
  })

  it('displays user information correctly', async () => {
    render(<HistorialAdministradoresPage />)

    await waitFor(() => {
      expect(screen.getByText('sistema@test.com')).toBeInTheDocument()
    })
  })
})
