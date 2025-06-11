import { render, screen, waitFor } from '@testing-library/react'
import HistorialAdministradoresPage from '@/app/administradores/historial/page'

// Mock con múltiples tipos de acción para cubrir todas las ramas
jest.mock('@/data/administradores-historial.json', () => ({
  historial: [
    {
      id: 1,
      name: 'Admin Creado',
      action: 'Creación',
      date: '01/01/2024',
      user: 'creador@test.com',
    },
    {
      id: 2,
      name: 'Admin Editado',
      action: 'Edición',
      date: '02/01/2024',
      user: 'editor@test.com',
    },
    {
      id: 3,
      name: 'Admin Eliminado',
      action: 'Eliminación',
      date: '03/01/2024',
      user: 'eliminador@test.com',
    },
  ],
}))

describe('HistorialAdministradoresPage', () => {
  it('renderiza el título de la página', () => {
    render(<HistorialAdministradoresPage />)
    expect(screen.getByText('Historial de Administradores')).toBeInTheDocument()
  })

  it('muestra todos los registros de historial', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      expect(screen.getByText('Admin Creado')).toBeInTheDocument()
      expect(screen.getByText('Admin Editado')).toBeInTheDocument()
      expect(screen.getByText('Admin Eliminado')).toBeInTheDocument()
    })
  })

  it('muestra las fechas correctamente', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      expect(screen.getByText('01/01/2024')).toBeInTheDocument()
      expect(screen.getByText('02/01/2024')).toBeInTheDocument()
      expect(screen.getByText('03/01/2024')).toBeInTheDocument()
    })
  })

  it('renderiza las acciones con sus estilos correspondientes', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      expect(screen.getByText('Creación')).toHaveClass('bg-[#00bf7d]/20', 'text-[#00bf7d]')
      expect(screen.getByText('Edición')).toHaveClass('bg-[#0073e6]/20', 'text-[#0073e6]')
      expect(screen.getByText('Eliminación')).toHaveClass('bg-red-100', 'text-red-800')
    })
  })

  it('muestra correctamente el número de fila', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      const firstCell = screen.getByText('1')
      const thirdCell = screen.getByText('3')
      expect(firstCell).toBeInTheDocument()
      expect(thirdCell).toBeInTheDocument()
    })
  })

  it('muestra los usuarios relacionados a las acciones', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      expect(screen.getByText('creador@test.com')).toBeInTheDocument()
      expect(screen.getByText('editor@test.com')).toBeInTheDocument()
      expect(screen.getByText('eliminador@test.com')).toBeInTheDocument()
    })
  })

  it('ordena los registros de forma descendente por fecha', async () => {
    render(<HistorialAdministradoresPage />)
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // Filas de datos (excluyendo el header)
      const dataRows = rows.slice(1)

      const firstRow = dataRows[0]
      expect(firstRow).toHaveTextContent('Admin Eliminado')
    })
  })
})
