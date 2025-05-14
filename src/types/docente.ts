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
