// Actualizar tipos para usar datos reales de la base de datos
export interface Admin {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface AdminFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  first_name: string
  last_name: string
}

export type AdminStatus = boolean // true = activo, false = inactivo

export interface AdminHistorial {
  id: string
  admin_id: string
  action: 'Creación' | 'Edición' | 'Activación' | 'Desactivación' | 'Eliminación'
  date: string
  user: string
  details?: string
}

// Mapear datos de la API a formato de UI
export function mapAdminToUI(admin: Admin) {
  return {
    id: admin._id,
    name: `${admin.first_name} ${admin.last_name}`,
    email: admin.email,
    username: admin.username,
    status: admin.is_active ? 'Activo' : ('Inactivo' as 'Activo' | 'Inactivo'),
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  }
}

// Mapear datos del formulario a formato de API
export function mapFormToAPI(formData: AdminFormData) {
  return {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    first_name: formData.first_name,
    last_name: formData.last_name,
  }
}
