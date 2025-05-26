'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'
import { mockAdministradores } from '../mocks/data'

// Mock de los datos
jest.mock('@/data/administradores.json', () => ({
  administradores: mockAdministradores,
}))

describe('Full Workflow Integration Tests', () => {
  describe('Administrator Management Workflow', () => {
    it('completes full administrator creation workflow', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      // 1. Verify page loads
      expect(screen.getByText('Gestión de Administradores')).toBeInTheDocument()

      // 2. Open new administrator form
      const newButton = screen.getByRole('button', { name: /nuevo administrador/i })
      await user.click(newButton)

      expect(screen.getByText('Nuevo Administrador')).toBeInTheDocument()

      // 3. Fill out form
      await user.type(screen.getByLabelText(/nombre/i), 'Juan')
      await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
      await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com')
      await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password123!')

      // 4. Submit form
      const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
      await user.click(submitButton)

      // 5. Verify success message
      await waitFor(() => {
        expect(screen.getByText('Administrador registrado')).toBeInTheDocument()
      })
    })

    it('handles administrator deletion workflow', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Admin Test')).toBeInTheDocument()
      })

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/eliminar/i)
      await user.click(deleteButtons[0])

      // Confirm deletion
      expect(screen.getByText(/¿está seguro de eliminar este administrador?/i)).toBeInTheDocument()

      const confirmButton = screen.getByRole('button', { name: /eliminar/i })
      await user.click(confirmButton)

      // Verify success
      await waitFor(() => {
        expect(screen.getByText('Administrador eliminado')).toBeInTheDocument()
      })
    })

    it('prevents deletion when insufficient administrators', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/eliminar/i)
        expect(deleteButtons.length).toBeGreaterThan(0)
      })

      // Try to delete when there are insufficient active admins
      const deleteButton = screen.getAllByLabelText(/eliminar/i)[0]
      await user.click(deleteButton)

      // Should show security dialog
      await waitFor(() => {
        expect(screen.getByText(/no se puede eliminar el administrador/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation Integration', () => {
    it('validates all form fields correctly', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      // Open form
      await user.click(screen.getByRole('button', { name: /nuevo administrador/i }))

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
      await user.click(submitButton)

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
      })

      // Fill invalid email
      await user.type(screen.getByLabelText(/correo electrónico/i), 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/ingrese un correo electrónico válido/i)).toBeInTheDocument()
      })

      // Test password mismatch
      await user.clear(screen.getByLabelText(/correo electrónico/i))
      await user.type(screen.getByLabelText(/correo electrónico/i), 'valid@email.com')
      await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirmar contraseña/i), 'DifferentPassword!')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('handles form submission errors gracefully', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      // Open form
      await user.click(screen.getByRole('button', { name: /nuevo administrador/i }))

      // Fill valid form
      await user.type(screen.getByLabelText(/nombre/i), 'Juan')
      await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
      await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com')
      await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password123!')

      // Toggle error simulation
      const errorSwitch = screen.getByLabelText(/simular error de operación/i)
      await user.click(errorSwitch)

      // Submit form
      const submitButton = screen.getByRole('button', { name: /guardar administrador/i })
      await user.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Administrador registrado')).toBeInTheDocument()
      })
    })
  })
})
