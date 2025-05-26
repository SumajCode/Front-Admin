'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdministradorForm } from '@/components/administradores/administrador-form'

describe('AdministradorForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByLabelText(/correo electrónico/i)
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/ingrese un correo electrónico válido/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)

    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'DifferentPassword123!')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/nombre/i), 'Juan')
    await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password123!')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(true)
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    const toggleButton = screen.getAllByText(/mostrar/i)[0]

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getAllByText(/ocultar/i)[0])
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
