// Tipos para la API
export interface AdminFromAPI {
  _id: string
  username: string
  email: string
  password?: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

// Tipo para mostrar en la UI (adaptado de la API)
export interface Administrador {
  id: string
  name: string
  email: string
  username: string
  status: "Activo" | "Inactivo"
  created_at: string
  updated_at?: string
}

// Formulario para crear administrador
export interface AdministradorFormData {
  nombre: string
  apellido: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

// Formulario para editar administrador
export interface AdministradorEditFormData {
  nombre: string
  apellido: string
  email: string
  username: string
}

export type AdministradorStatus = "Activo" | "Inactivo"

export interface AdministradorHistorial {
  id: number
  name: string
  action: "Creación" | "Edición" | "Baja"
  date: string
  user: string
}

// Función helper para convertir datos de API a formato UI
export function mapAdminFromAPI(apiAdmin: AdminFromAPI): Administrador {
  return {
    id: apiAdmin._id,
    name: `${apiAdmin.first_name} ${apiAdmin.last_name}`,
    email: apiAdmin.email,
    username: apiAdmin.username,
    status: apiAdmin.is_active ? "Activo" : "Inactivo",
    created_at: apiAdmin.created_at,
    updated_at: apiAdmin.updated_at,
  }
}

// Función helper para convertir datos de formulario a formato API
export function mapFormDataToAPI(formData: AdministradorFormData): {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: string
} {
  return {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    first_name: formData.nombre,
    last_name: formData.apellido,
    role: "admin",
  }
}

// Función helper para convertir datos de edición a formato API
export function mapEditFormDataToAPI(formData: AdministradorEditFormData): {
  username: string
  email: string
  first_name: string
  last_name: string
} {
  return {
    username: formData.username,
    email: formData.email,
    first_name: formData.nombre,
    last_name: formData.apellido,
  }
}
