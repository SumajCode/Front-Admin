import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'
import userEvent from '@testing-library/user-event'

// Mock de datos
jest.mock('@/data/administradores.json', () => ({
  administradores: [
    {
      id: 1,
      name: 'Admin Activo',
      email: 'activo@test.com',
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Admin Inactivo',
      email: 'inactivo@test.com',
      status: 'Inactivo',
    },
  ],
}))

// Simula toasts
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: ({ title, description }: any) => {
      const message = `${title ?? ''} ${description ?? ''}`.trim()
      const container = document.createElement('div')
      container.setAttribute('data-testid', 'toast-message')
      container.textContent = message
      document.body.appendChild(container)
    },
  }),
}))

describe('GestionAdministradoresPage', () => {
  it('renderiza el título de la página', () => {
    render(<GestionAdministradoresPage />)
    expect(screen.getByText('Gestión de Administradores')).toBeInTheDocument()
  })

  it('muestra los administradores en la tabla', async () => {
    render(<GestionAdministradoresPage />)
    await waitFor(() => {
      expect(screen.getByText('Admin Activo')).toBeInTheDocument()
      expect(screen.getByText('activo@test.com')).toBeInTheDocument()
    })
  })

  it('abre el formulario de nuevo administrador', async () => {
    render(<GestionAdministradoresPage />)
    fireEvent.click(screen.getByRole('button', { name: /nuevo administrador/i }))
    expect(await screen.findByRole('heading', { name: 'Nuevo Administrador' })).toBeInTheDocument()
  })

  it('cierra el formulario de nuevo administrador al cancelar', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)
    fireEvent.click(screen.getByRole('button', { name: /nuevo administrador/i }))
    expect(await screen.findByText(/Complete el formulario/i)).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByText(/Complete el formulario/i)).not.toBeInTheDocument()
    })
  })

  it('muestra el diálogo de eliminación cuando hay suficientes administradores', async () => {
    render(<GestionAdministradoresPage />)
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    fireEvent.click(deleteButtons[1])
    expect(
      await screen.findByText(/¿Está seguro de eliminar este administrador/i),
    ).toBeInTheDocument()
  })

  it('muestra el diálogo de seguridad si se intenta eliminar el único admin activo restante', async () => {
    render(<GestionAdministradoresPage />)
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    fireEvent.click(deleteButtons[0])
    expect(await screen.findByText(/no se puede eliminar el administrador/i)).toBeInTheDocument()
  })

  it('simula eliminación fallida al desactivar el switch', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    fireEvent.click(deleteButtons[1])

    const switchToggle = await screen.findByRole('switch')
    await user.click(switchToggle)

    const eliminarBtn = await screen.findByRole('button', { name: /^eliminar$/i })
    await user.click(eliminarBtn)

    await waitFor(() => {
      const toast = screen.getByTestId('toast-message')
      expect(toast.textContent?.toLowerCase()).toContain('error al eliminar')
    })
  })
  it('simula eliminación exitosa', async () => {
    const user = userEvent.setup()
    render(<GestionAdministradoresPage />)

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
    fireEvent.click(deleteButtons[1]) // Inactivo

    const eliminarBtn = await screen.findByRole('button', { name: /^eliminar$/i })
    await user.click(eliminarBtn)

    await waitFor(() => {
      const toasts = screen.getAllByTestId('toast-message')
      const successToast = toasts.find((toast) =>
        toast.textContent?.toLowerCase().includes('administrador eliminado'),
      )
      expect(successToast).toBeDefined()
    })
  })
})
