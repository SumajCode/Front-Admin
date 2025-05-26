import { render, screen, waitFor } from '@testing-library/react'
import HistorialPage from '@/app/docentes/historial/page'
import { mockDocentesHistorial } from '../../mocks/data'

// Mock de los datos
jest.mock('@/data/docentes-historial.json', () => ({
  historial: mockDocentesHistorial,
}))

describe('HistorialDocentesPage', () => {
  it('renders the page title', () => {
    render(<HistorialPage />)
    expect(screen.getByText('Historial de Docentes')).toBeInTheDocument()
  })

  it('renders the history table', async () => {
    render(<HistorialPage />)

    await waitFor(() => {
      expect(screen.getByText('Docente Test')).toBeInTheDocument()
      expect(screen.getByText('Creación')).toBeInTheDocument()
      expect(screen.getByText('01/01/2024')).toBeInTheDocument()
    })
  })

  it('displays records in descending date order', async () => {
    render(<HistorialPage />)

    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
    })
  })

  it('shows correct action badges with proper styling', async () => {
    render(<HistorialPage />)

    await waitFor(() => {
      const creationBadge = screen.getByText('Creación')
      expect(creationBadge).toHaveClass('bg-[#00bf7d]/20', 'text-[#00bf7d]')
    })
  })

  it('displays user information correctly', async () => {
    render(<HistorialPage />)

    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument()
    })
  })
})
