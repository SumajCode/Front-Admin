'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocenteForm } from '@/components/docentes/docente-form'

// Mock de los datos de facultades
jest.mock('@/data/facultades.json', () => ({
  facultades: [
    'Facultad de Ciencias y Tecnología',
    'Facultad de Medicina',
    'Facultad de Ciencias Económicas',
  ],
}))

describe('DocenteForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/célular/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/facultades/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /guardar docente/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('validates phone number format', async () => {
    const user = userEvent.setup()
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    const phoneInput = screen.getByLabelText(/célular/i)
    await user.type(phoneInput, '123')

    const submitButton = screen.getByRole('button', { name: /guardar docente/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/ingrese un número de célular válido/i)).toBeInTheDocument()
    })
  })

  it('allows faculty selection', async () => {
    const user = userEvent.setup()
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    const facultyCheckbox = screen.getByLabelText(/facultad de ciencias y tecnología/i)
    await user.click(facultyCheckbox)

    expect(facultyCheckbox).toBeChecked()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/nombre/i), 'Juan')
    await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/célular/i), '12345678')

    const facultyCheckbox = screen.getByLabelText(/facultad de ciencias y tecnología/i)
    await user.click(facultyCheckbox)

    const submitButton = screen.getByRole('button', { name: /guardar docente/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(true)
    })
  })

  it('renders in edit mode with existing data', () => {
    const mockDocente = {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '12345678',
      facultades: ['Facultad de Ciencias y Tecnología'],
      status: 'Activo' as const,
    }

    render(<DocenteForm onSubmit={mockOnSubmit} docente={mockDocente} isEditMode={true} />)

    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actualizar docente/i })).toBeInTheDocument()
  })
})
