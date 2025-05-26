import type {
  Administrador,
  AdministradorFormData,
  AdministradorHistorial,
} from '@/types/administrador'

describe('Administrador Types', () => {
  it('should define Administrador interface correctly', () => {
    const admin: Administrador = {
      id: 1,
      name: 'Test Admin',
      email: 'test@example.com',
      status: 'Activo',
    }

    expect(admin.id).toBe(1)
    expect(admin.name).toBe('Test Admin')
    expect(admin.email).toBe('test@example.com')
    expect(admin.status).toBe('Activo')
  })

  it('should define AdministradorFormData interface correctly', () => {
    const formData: AdministradorFormData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    expect(formData.nombre).toBe('Juan')
    expect(formData.apellido).toBe('Pérez')
    expect(formData.email).toBe('juan@example.com')
    expect(formData.password).toBe('password123')
    expect(formData.confirmPassword).toBe('password123')
  })

  it('should define AdministradorHistorial interface correctly', () => {
    const historial: AdministradorHistorial = {
      id: 1,
      name: 'Test Admin',
      action: 'Creación',
      date: '01/01/2024',
      user: 'admin@example.com',
    }

    expect(historial.id).toBe(1)
    expect(historial.name).toBe('Test Admin')
    expect(historial.action).toBe('Creación')
    expect(historial.date).toBe('01/01/2024')
    expect(historial.user).toBe('admin@example.com')
  })

  it('should only allow valid status values', () => {
    const activeAdmin: Administrador = {
      id: 1,
      name: 'Active Admin',
      email: 'active@example.com',
      status: 'Activo',
    }

    const inactiveAdmin: Administrador = {
      id: 2,
      name: 'Inactive Admin',
      email: 'inactive@example.com',
      status: 'Inactivo',
    }

    expect(activeAdmin.status).toBe('Activo')
    expect(inactiveAdmin.status).toBe('Inactivo')
  })
})
