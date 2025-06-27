import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import GestionAdministradoresPage from '@/app/administradores/gestion/page'
import userEvent from '@testing-library/user-event'
import * as adminService from '@/services/adminService' // ✅ Importa como namespace

jest.mock('@/services/adminService', () => ({
  getAllAdmins: jest.fn().mockResolvedValue([
    { id: 1, username: 'admin1', name: 'Admin Uno', email: 'uno@test.com', status: 'Activo' },
    { id: 2, username: 'admin2', name: 'Admin Dos', email: 'dos@test.com', status: 'Activo' },
    { id: 3, username: 'admin3', name: 'Admin Tres', email: 'tres@test.com', status: 'Activo' },
  ]),
  deleteAdmin: jest.fn().mockResolvedValue(true),
  createAdmin: jest.fn().mockResolvedValue({
    id: 4,
    username: 'admin4',
    name: 'Nuevo Admin',
    email: 'nuevo@test.com',
    status: 'Activo',
  }),
  updateAdmin: jest.fn().mockResolvedValue({
    id: 1,
    username: 'admin1',
    name: 'Admin Actualizado',
    email: 'uno@test.com',
    status: 'Activo',
  }),
  toggleAdminStatus: jest.fn().mockImplementation((id, newStatus) =>
    Promise.resolve({
      id,
      username: `admin${id}`,
      name: `Admin ${id}`,
      email: `admin${id}@test.com`,
      status: newStatus ? 'Activo' : 'Inactivo',
    }),
  ),
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

jest.mock('@/types/administrador', () => ({
  mapAdminFromAPI: (admin: any) => admin,
  mapFormDataToAPI: (data: any) => data,
  mapEditFormDataToAPI: (data: any) => data,
}))

describe('GestionAdministradoresPage', () => {
  it('renderiza el título de la página', async () => {
    render(<GestionAdministradoresPage />)
    expect(await screen.findByText('Gestión de Administradores')).toBeInTheDocument()
  })

  it('muestra los administradores correctamente', async () => {
    render(<GestionAdministradoresPage />)
    expect(await screen.findByText('Admin Uno')).toBeInTheDocument()
    expect(screen.getByText('admin1')).toBeInTheDocument()
  })

  it('abre el formulario de nuevo administrador', async () => {
    render(<GestionAdministradoresPage />)
    const nuevoAdminBtn = await screen.findByRole('button', { name: /nuevo administrador/i })
    fireEvent.click(nuevoAdminBtn)
    // Usa matcher para tolerar fragmentación de texto en el heading
    expect(
      await screen.findByRole('heading', { name: (name) => /nuevo administrador/i.test(name) }),
    ).toBeInTheDocument()
  })
})
