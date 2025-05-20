export interface Administrador {
  id: number
  name: string
  email: string
  status: 'Activo' | 'Inactivo'
}

export interface AdministradorFormData {
  nombre: string
  apellido: string
  email: string
  password: string
  confirmPassword: string
}

export type AdministradorStatus = 'Activo' | 'Inactivo'

export interface AdministradorHistorial {
  id: number
  name: string
  action: 'Creación' | 'Eliminación'
  date: string
  user: string
}
