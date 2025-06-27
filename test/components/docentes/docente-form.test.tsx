'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocenteForm } from '@/components/docentes/docente-form'

describe('DocenteForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
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

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<DocenteForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/nombre/i), 'Juan')
    await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/célular/i), '12345678')
    await user.type(screen.getByLabelText(/fecha de nacimiento/i), '15/10/2000')
    await user.type(screen.getByLabelText(/usuario/i), 'juan_perez')

    const passwordInputs = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordInputs[0], '123456') // Contraseña
    await user.type(passwordInputs[1], '123456') // Confirmar contraseña

    const submitButton = screen.getByRole('button', { name: /guardar docente/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
      const submittedData = mockOnSubmit.mock.calls[0][0]
      expect(submittedData.nombre).toBe('Juan')
      expect(submittedData.apellido).toBe('Pérez')
      expect(submittedData.email).toBe('juan@example.com')
      expect(submittedData.telefono).toBe('12345678')
      expect(submittedData.fechaNacimiento).toBe('15/10/2000')
      expect(submittedData.usuario).toBe('juan_perez')
      expect(submittedData.password).toBe('123456')
      expect(submittedData.confirmPassword).toBe('123456')
    })
  })

  it('renders in edit mode with existing data', () => {
    const mockDocente = {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '12345678',
      fechaNacimiento: '2000-10-15',
      usuario: 'juan_perez',
      status: 'Activo' as const,
    }

    render(<DocenteForm onSubmit={mockOnSubmit} docente={mockDocente} isEditMode={true} />)

    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument()
    expect(screen.getByDisplayValue('juan_perez')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actualizar docente/i })).toBeInTheDocument()
  })
})
