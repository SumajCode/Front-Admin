export interface DocenteAPI {
  id: number
  nombre: string
  apellidos: string
  celular: number
  correo: string
  nacimiento: string
  usuario: string
  password?: string
}

export interface Docente {
  id: number
  name: string
  email: string
  telefono?: string
  fechaNacimiento?: string
  usuario?: string
  facultades: string[]
  status: "Activo" | "Inactivo"
}

export interface DocenteFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaNacimiento: string
  usuario: string
  password: string
  confirmPassword: string
  facultades: string[]
}

export type DocenteStatus = "Activo" | "Inactivo"

export interface DocenteHistorial {
  id: number
  name: string
  action: "Creación" | "Edición" | "Baja"
  date: string
  user: string
}

// Funciones helper para mapear entre API y UI
export const mapAPIToDocente = (apiDocente: DocenteAPI): Docente => {
  return {
    id: apiDocente.id,
    name: `${apiDocente.nombre} ${apiDocente.apellidos}`,
    email: apiDocente.correo,
    telefono: apiDocente.celular?.toString(),
    fechaNacimiento: apiDocente.nacimiento,
    usuario: apiDocente.usuario,
    facultades: [], // Las facultades se manejan por separado
    status: "Activo", // Por defecto activo, se puede ajustar según la lógica
  }
}

export const mapFormToAPICreate = (formData: DocenteFormData) => {
  return {
    nombre: formData.nombre,
    apellidos: formData.apellido,
    celular: formData.telefono,
    correo: formData.email,
    nacimiento: formData.fechaNacimiento,
    usuario: formData.usuario,
    password: formData.password,
  }
}

export const mapFormToAPIUpdate = (formData: DocenteFormData, id: number) => {
  return {
    id: id,
    nombre: formData.nombre,
    apellidos: formData.apellido,
    celular: formData.telefono,
    correo: formData.email,
    nacimiento: formData.fechaNacimiento,
    usuario: formData.usuario,
    ...(formData.password && { password: formData.password }),
  }
}
