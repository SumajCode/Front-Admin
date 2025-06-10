'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdministradorForm } from '@/components/administradores/administrador-form'

describe('AdministradorForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
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

  it('submits form with valid data (simulateSuccess true)', async () => {
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

  it('submits form with simulateSuccess false', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const toggle = screen.getByRole('switch')
    await user.click(toggle)

    await user.type(screen.getByLabelText(/nombre/i), 'Ana')
    await user.type(screen.getByLabelText(/apellido/i), 'Gómez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password123!')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(false)
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

  it('toggles confirm password visibility', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    const toggleButton = screen.getAllByText(/mostrar/i)[1]

    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getAllByText(/ocultar/i)[1])
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })
})
