import { render, screen, waitFor } from '@testing-library/react'
import HistorialPage from '@/app/docentes/historial/page'

// Mock de datos con todas las ramas posibles de acción
jest.mock('@/data/docentes-historial.json', () => ({
  historial: [
    {
      id: 1,
      name: 'Docente Creado',
      action: 'Creación',
      date: '01/01/2024',
      user: 'creador@test.com',
    },
    {
      id: 2,
      name: 'Docente Editado',
      action: 'Edición',
      date: '02/01/2024',
      user: 'editor@test.com',
    },
    {
      id: 3,
      name: 'Docente Eliminado',
      action: 'Eliminación',
      date: '03/01/2024',
      user: 'eliminador@test.com',
    },
  ],
}))

describe('HistorialDocentesPage', () => {
  it('renderiza el título principal', () => {
    render(<HistorialPage />)
    expect(screen.getByText('Historial de Docentes')).toBeInTheDocument()
  })

  it('renderiza subtítulo y encabezado del card', () => {
    render(<HistorialPage />)
    expect(screen.getByText('Registro de Actividades')).toBeInTheDocument()
    expect(screen.getByText(/acciones realizadas/)).toBeInTheDocument()
  })

  it('renderiza todas las filas correctamente', async () => {
    render(<HistorialPage />)
    await waitFor(() => {
      expect(screen.getByText('Docente Creado')).toBeInTheDocument()
      expect(screen.getByText('Docente Editado')).toBeInTheDocument()
      expect(screen.getByText('Docente Eliminado')).toBeInTheDocument()
    })
  })

  it('muestra correctamente los estilos de acción', async () => {
    render(<HistorialPage />)
    await waitFor(() => {
      expect(screen.getByText('Creación')).toHaveClass('bg-[#00bf7d]/20', 'text-[#00bf7d]')
      expect(screen.getByText('Edición')).toHaveClass('bg-[#0073e6]/20', 'text-[#0073e6]')
      expect(screen.getByText('Eliminación')).toHaveClass('bg-red-100', 'text-red-800')
    })
  })

  it('muestra las fechas y usuarios correctamente', async () => {
    render(<HistorialPage />)
    await waitFor(() => {
      expect(screen.getByText('01/01/2024')).toBeInTheDocument()
      expect(screen.getByText('03/01/2024')).toBeInTheDocument()
      expect(screen.getByText('editor@test.com')).toBeInTheDocument()
    })
  })

  it('ordena los registros de forma descendente por fecha', async () => {
    render(<HistorialPage />)
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      const firstDataRow = rows[1]
      expect(firstDataRow).toHaveTextContent('Docente Eliminado')
    })
  })

  it('renderiza correctamente los índices en la columna №', async () => {
    render(<HistorialPage />)
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })
})
