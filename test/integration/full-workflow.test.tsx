'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'

// Mock de los datos
jest.mock('@/data/administradores.json', () => ({
  administradores: [
    {
      id: 1,
      name: 'Admin Test',
      email: 'admin@test.com',
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Admin Test 2',
      email: 'admin2@test.com',
      status: 'Inactivo',
    },
  ],
}))

describe('Full Workflow Integration Tests', () => {
  describe('Administrator Management Workflow', () => {
    it('prevents deletion when insufficient administrators', async () => {
      const user = userEvent.setup()
      render(<GestionAdministradoresPage />)

      await waitFor(() => {
        // Buscar los botones de eliminar por el texto oculto en el span
        const deleteButtons = screen
          .getAllByRole('button')
          .filter((btn) =>
            Array.from(btn.querySelectorAll('span')).some(
              (span) => span.textContent === 'Eliminar',
            ),
          )
        expect(deleteButtons.length).toBeGreaterThan(0)
      })

      // Try to delete when there are insufficient active admins
      const deleteButton = screen
        .getAllByRole('button')
        .find((btn) =>
          Array.from(btn.querySelectorAll('span')).some((span) => span.textContent === 'Eliminar'),
        )
      expect(deleteButton).toBeDefined()
      await user.click(deleteButton!)

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
})
