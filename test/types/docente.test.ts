import type { Docente, DocenteFormData, DocenteHistorial } from '@/types/docente'

describe('Docente Types', () => {
  it('should define Docente interface correctly', () => {
    const docente: Docente = {
      id: 1,
      name: 'Test Docente',
      email: 'docente@test.com',
      telefono: '12345678',
      facultades: ['Facultad de Ciencias y Tecnología'],
      status: 'Activo',
    }

    expect(docente.id).toBe(1)
    expect(docente.name).toBe('Test Docente')
    expect(docente.email).toBe('docente@test.com')
    expect(docente.telefono).toBe('12345678')
    expect(docente.facultades).toEqual(['Facultad de Ciencias y Tecnología'])
    expect(docente.status).toBe('Activo')
  })

  it('should define DocenteFormData interface correctly', () => {
    const formData: DocenteFormData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '12345678',
      facultades: ['Facultad de Medicina'],
    }

    expect(formData.nombre).toBe('Juan')
    expect(formData.apellido).toBe('Pérez')
    expect(formData.email).toBe('juan@example.com')
    expect(formData.telefono).toBe('12345678')
    expect(formData.facultades).toEqual(['Facultad de Medicina'])
  })

  it('should define DocenteHistorial interface correctly', () => {
    const historial: DocenteHistorial = {
      id: 1,
      name: 'Test Docente',
      action: 'Creación',
      date: '01/01/2024',
      user: 'admin@example.com',
    }

    expect(historial.id).toBe(1)
    expect(historial.name).toBe('Test Docente')
    expect(historial.action).toBe('Creación')
    expect(historial.date).toBe('01/01/2024')
    expect(historial.user).toBe('admin@example.com')
  })

  it('should allow optional telefono field', () => {
    const docenteWithoutPhone: Docente = {
      id: 1,
      name: 'Test Docente',
      email: 'docente@test.com',
      facultades: ['Facultad de Ciencias y Tecnología'],
      status: 'Activo',
    }

    expect(docenteWithoutPhone.telefono).toBeUndefined()
  })

  it('should only allow valid status values', () => {
    const activeDocente: Docente = {
      id: 1,
      name: 'Active Docente',
      email: 'active@example.com',
      facultades: ['Facultad de Medicina'],
      status: 'Activo',
    }

    const inactiveDocente: Docente = {
      id: 2,
      name: 'Inactive Docente',
      email: 'inactive@example.com',
      facultades: ['Facultad de Medicina'],
      status: 'Inactivo',
    }

    expect(activeDocente.status).toBe('Activo')
    expect(inactiveDocente.status).toBe('Inactivo')
  })
})
