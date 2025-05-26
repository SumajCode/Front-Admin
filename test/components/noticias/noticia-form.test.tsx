'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoticiaForm } from '@/components/noticias/noticia-form'

// Mock de los datos de categorías
jest.mock('@/data/categorias.json', () => ({
  categorias: [
    'Universidad Mayor de San Simón',
    'Facultad de Ciencias y Tecnología',
    'Facultad de Medicina',
  ],
}))

describe('NoticiaForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<NoticiaForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/título de la noticia/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contenido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/noticia permanente/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<NoticiaForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /publicar noticia/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el título debe tener al menos 5 caracteres/i)).toBeInTheDocument()
    })
  })

  it('shows expiration date field when not permanent', async () => {
    const user = userEvent.setup()
    render(<NoticiaForm onSubmit={mockOnSubmit} />)

    const permanentSwitch = screen.getByLabelText(/noticia permanente/i)
    expect(permanentSwitch).not.toBeChecked()

    expect(screen.getByLabelText(/fecha de vencimiento/i)).toBeInTheDocument()

    await user.click(permanentSwitch)
    expect(screen.queryByLabelText(/fecha de vencimiento/i)).not.toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<NoticiaForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/título de la noticia/i), 'Noticia de prueba')
    await user.type(screen.getByLabelText(/contenido/i), 'Contenido de la noticia de prueba')

    const categorySelect = screen.getByRole('combobox')
    await user.click(categorySelect)
    await user.click(screen.getByText('Universidad Mayor de San Simón'))

    const submitButton = screen.getByRole('button', { name: /publicar noticia/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(true)
    })
  })

  it('renders in edit mode with existing data', () => {
    const mockNoticia = {
      id: 1,
      title: 'Noticia existente',
      date: '01/01/2024',
      content: 'Contenido existente',
      categoria: 'Universidad Mayor de San Simón',
      fechaVencimiento: null,
      activo: true,
    }

    render(<NoticiaForm onSubmit={mockOnSubmit} noticia={mockNoticia} isEditMode={true} />)

    expect(screen.getByDisplayValue('Noticia existente')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Contenido existente')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actualizar noticia/i })).toBeInTheDocument()
  })
})
