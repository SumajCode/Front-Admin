export interface Administrador {
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

export interface AdministradorFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  first_name: string
  last_name: string
}

export type AdministradorStatus = "Activo" | "Inactivo"

export interface AdministradorHistorial {
  _id: string
  admin_id: string
  action: "create" | "update" | "delete" | "activate" | "deactivate"
  details: Record<string, unknown>
  performed_by: string
  timestamp: string
  admin_name?: string // Campo calculado para mostrar en la UI
}

// Funciones helper para convertir entre formatos
export function formatAdminForDisplay(admin: Administrador): {
  id: string
  name: string
  email: string
  status: AdministradorStatus
} {
  return {
    id: admin._id,
    name: `${admin.first_name} ${admin.last_name}`.trim(),
    email: admin.email,
    status: admin.is_active ? "Activo" : "Inactivo",
  }
}

export function formatHistoryForDisplay(
  historyEntry: AdministradorHistorial,
  adminName?: string,
): {
  id: string
  name: string
  action: "Creación" | "Edición" | "Baja" | "Activación" | "Desactivación"
  date: string
  user: string
} {
  const actionMap = {
    create: "Creación" as const,
    update: "Edición" as const,
    delete: "Baja" as const,
    activate: "Activación" as const,
    deactivate: "Desactivación" as const,
  }

  return {
    id: historyEntry._id,
    name: adminName || "Administrador",
    action: actionMap[historyEntry.action] || "Edición",
    date: new Date(historyEntry.timestamp).toLocaleDateString("es-ES"),
    user: historyEntry.performed_by,
  }
}
