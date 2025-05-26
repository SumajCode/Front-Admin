import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoticiasPage from '@/app/noticias/page'
import { mockNoticias, mockCategorias } from '../../mocks/data'

// Mock de los datos
jest.mock('@/data/noticias.json', () => ({
  noticias: mockNoticias,
}))

jest.mock('@/data/categorias.json', () => ({
  categorias: mockCategorias,
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

  it('opens new news form', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const newButton = screen.getByRole('button', { name: /nueva noticia/i })
    await user.click(newButton)

    expect(screen.getByText('Nueva Noticia')).toBeInTheDocument()
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

  it('shows edit and delete buttons for news items', async () => {
    render(<NoticiasPage />)

    await waitFor(() => {
      expect(screen.getAllByLabelText(/editar/i)).toHaveLength(1)
      expect(screen.getAllByLabelText(/eliminar/i)).toHaveLength(1)
    })
  })
})
