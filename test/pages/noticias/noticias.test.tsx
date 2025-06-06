import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoticiasPage from '@/app/noticias/page'

// Mock de los datos
jest.mock('@/data/noticias.json', () => ({
  noticias: [
    {
      id: 1,
      title: 'Noticia Test',
      date: '01/01/2024',
      content: 'Contenido de prueba',
      categoria: 'Universidad Mayor de San Simón',
      fechaVencimiento: null,
      activo: true,
    },
    {
      id: 2,
      title: 'Noticia Test 2',
      date: '02/01/2024',
      content: 'Contenido de prueba 2',
      categoria: 'Facultad de Ciencias y Tecnología',
      fechaVencimiento: '31/12/2024',
      activo: true,
    },
  ],
}))

jest.mock('@/data/categorias.json', () => ({
  categorias: [
    'Universidad Mayor de San Simón',
    'Facultad de Ciencias y Tecnología',
    'Facultad de Medicina',
    'Facultad de Ciencias Económicas',
    'Facultad de Ciencias Jurídicas y Políticas',
  ],
}))

describe('NoticiasPage', () => {
  it('renders the page title', () => {
    render(<NoticiasPage />)
    expect(screen.getByText('Noticias y Anuncios')).toBeInTheDocument()
  })

  it('renders news cards', async () => {
    render(<NoticiasPage />)

    await waitFor(() => {
      expect(screen.getByText('Noticia Test')).toBeInTheDocument()
      expect(screen.getByText('Contenido de prueba')).toBeInTheDocument()
    })
  })

  it('filters news by category', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    // Abrir filtros
    const filterButton = screen.getByText(/filtrar por categorías/i)
    await user.click(filterButton)

    // Seleccionar una categoría
    const categoryCheckbox = screen.getByLabelText(/universidad mayor de san simón/i)
    await user.click(categoryCheckbox)

    await waitFor(() => {
      expect(
        screen.getByText(/mostrando.*noticia.*de.*categoría.*seleccionada/i),
      ).toBeInTheDocument()
    })
  })
})
