export interface Docente {
  id: number
  name: string
  email: string
  telefono?: string
  facultades: string[]
  status: 'Activo' | 'Inactivo'
}

export interface DocenteFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  facultades: string[]
}

export type DocenteStatus = 'Activo' | 'Inactivo'

export interface DocenteHistorial {
  id: number
  name: string
  action: 'Creación' | 'Edición' | 'Baja'
  date: string
  user: string
}
