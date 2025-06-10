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
    {
      id: 3,
      title: 'Noticia Inactiva',
      date: '01/01/2024',
      content: 'No se debería mostrar',
      categoria: 'Facultad de Medicina',
      fechaVencimiento: null,
      activo: false,
    },
    {
      id: 4,
      title: 'Noticia Vencida',
      date: '01/01/2023',
      content: 'Tampoco debería mostrarse',
      categoria: 'Facultad de Ciencias Jurídicas y Políticas',
      fechaVencimiento: '01/01/2023',
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

  it('renders news cards and excludes inactive or expired', async () => {
    render(<NoticiasPage />)

    await waitFor(() => {
      expect(screen.getByText('Noticia Test')).toBeInTheDocument()
      expect(screen.getByText('Contenido de prueba')).toBeInTheDocument()
    })

    expect(screen.queryByText('Noticia Inactiva')).not.toBeInTheDocument()
    expect(screen.queryByText('Noticia Vencida')).not.toBeInTheDocument()
  })

  it('filters news by category', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const filterButton = screen.getByText(/filtrar por categorías/i)
    await user.click(filterButton)

    const categoryCheckbox = screen.getByLabelText(/universidad mayor de san simón/i)
    await user.click(categoryCheckbox)

    await waitFor(() => {
      expect(
        screen.getByText(/mostrando.*noticia.*de.*categoría.*seleccionada/i),
      ).toBeInTheDocument()
    })
  })

  it('shows message when no news match the selected categories', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const filterButton = screen.getByText(/filtrar por categorías/i)
    await user.click(filterButton)

    const checkbox = screen.getByLabelText(/facultad de ciencias económicas/i)
    await user.click(checkbox)

    await waitFor(() => {
      expect(screen.getByText(/no hay noticias disponibles/i)).toBeInTheDocument()
    })
  })

  it('opens new noticia form when clicking "Nueva Noticia"', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const newButton = screen.getByRole('button', { name: /^nueva noticia$/i })
    await user.click(newButton)

    expect(screen.getByRole('heading', { name: /nueva noticia/i })).toBeInTheDocument()
    expect(screen.getByText(/complete el formulario/i)).toBeInTheDocument()
  })

  it('opens edit form when clicking "Editar"', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const editButtons = await screen.findAllByRole('button', { name: /editar/i })
    await user.click(editButtons[0])

    expect(screen.getByRole('heading', { name: /editar noticia/i })).toBeInTheDocument()
    expect(screen.getByText(/modifique los datos/i)).toBeInTheDocument()
  })

  it('opens delete dialog and deletes a noticia successfully', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const deleteButtons = await screen.findAllByRole('button', { name: /^eliminar$/i })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/¿está seguro de eliminar esta noticia\?/i)).toBeInTheDocument()
    })

    const confirmButton = screen.getAllByRole('button', { name: /^eliminar$/i }).pop()
    await user.click(confirmButton!)

    await waitFor(() => {
      expect(screen.queryByText('Noticia Test')).not.toBeInTheDocument()
    })
  })

  it('cancels deletion and does not remove noticia', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const deleteButtons = await screen.findAllByRole('button', { name: /^eliminar$/i })
    await user.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: /^cancelar$/i })
    await user.click(cancelButton)

    expect(screen.getByText('Noticia Test')).toBeInTheDocument()
  })

  it('shows error when simulateDeleteSuccess is false', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const deleteButtons = await screen.findAllByRole('button', { name: /^eliminar$/i })
    await user.click(deleteButtons[0])

    const switchToggle = screen.getByLabelText(/simular eliminación exitosa/i)
    await user.click(switchToggle)

    await waitFor(() => {
      expect(screen.getByText(/¿está seguro de eliminar esta noticia\?/i)).toBeInTheDocument()
    })

    const confirmButton = screen.getAllByRole('button', { name: /^eliminar$/i }).pop()
    await user.click(confirmButton!)
  })

  it('toggles simulate delete success switch', async () => {
    const user = userEvent.setup()
    render(<NoticiasPage />)

    const deleteButtons = await screen.findAllByRole('button', { name: /^eliminar$/i })
    await user.click(deleteButtons[0])

    const switchToggle = screen.getByLabelText(/simular eliminación exitosa/i)
    await user.click(switchToggle)
  })

  it('displays "Anuncio para toda la universidad" for UMSS category', async () => {
    render(<NoticiasPage />)

    await waitFor(() => {
      expect(screen.getByText(/anuncio para.*universidad/i)).toBeInTheDocument()
    })
  })
})
