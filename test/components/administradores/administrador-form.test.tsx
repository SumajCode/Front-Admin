'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdministradorForm } from '@/components/administradores/administrador-form'

describe('AdministradorForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('valida campos requeridos', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('valida confirmación de contraseña', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText('Contraseña'), 'Password123!')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'DifferentPassword123!')
    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Gómez')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana_gomez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
  })

  it('envía formulario con datos válidos', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText('Nombre'), 'Juan')
    await user.type(screen.getByLabelText('Apellido'), 'Pérez')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'juan_perez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@example.com')
    await user.type(screen.getByLabelText('Contraseña'), 'Password123!')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Password123!')

    const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(true, expect.any(Object))
    })
  })

  it('permite mostrar y ocultar la contraseña', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const passwordInput = screen.getByLabelText('Contraseña')
    const toggleBtns = screen.getAllByRole('button', { name: /mostrar/i })
    const toggleBtn = toggleBtns[0] // el primer botón controla 'Contraseña'

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')

    const hideBtn = screen.getAllByRole('button', { name: /ocultar/i })[0]
    await user.click(hideBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('permite mostrar y ocultar la confirmación de contraseña', async () => {
    const user = userEvent.setup()
    render(<AdministradorForm onSubmit={mockOnSubmit} />)

    const confirmInput = screen.getByLabelText('Confirmar contraseña')
    const toggleBtns = screen.getAllByRole('button', { name: /mostrar/i })
    const toggleBtn = toggleBtns[1] // segundo botón controla confirmPassword

    expect(confirmInput).toHaveAttribute('type', 'password')

    await user.click(toggleBtn)
    expect(confirmInput).toHaveAttribute('type', 'text')

    const hideBtn = screen.getAllByRole('button', { name: /ocultar/i })[1]
    await user.click(hideBtn)
    expect(confirmInput).toHaveAttribute('type', 'password')
  })
})
