import apiService from "./apiService"

export interface AdminData {
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

export interface CreateAdminData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  [key: string]: unknown
}

export interface UpdateAdminData {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  [key: string]: unknown
}

export interface AdminHistoryEntry {
  _id: string
  admin_id: string
  action: "create" | "update" | "delete" | "activate" | "deactivate"
  details: Record<string, unknown>
  performed_by: string
  timestamp: string
}

class AdminService {
  private static instance: AdminService

  static getInstance(): AdminService {
    console.log("👥 AdminService: Getting instance")
    if (!AdminService.instance) {
      console.log("👥 AdminService: Creating new instance")
      AdminService.instance = new AdminService()
    }
    return AdminService.instance
  }

  /**
   * Obtener todos los administradores
   */
  async getAllAdmins(): Promise<AdminData[]> {
    console.log("👥 AdminService: Getting all admins...")

    try {
      const response = await apiService.get("/admins")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admins retrieved successfully")

      return data.data || []
    } catch (error) {
      console.error("❌ AdminService: Error getting admins:", error)
      throw error
    }
  }

  /**
   * Obtener un administrador por ID
   */
  async getAdminById(id: string): Promise<AdminData> {
    console.log("👥 AdminService: Getting admin by ID:", id)

    try {
      const response = await apiService.get(`/admins/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admin retrieved successfully")

      return data.data
    } catch (error) {
      console.error("❌ AdminService: Error getting admin:", error)
      throw error
    }
  }

  /**
   * Crear un nuevo administrador
   */
  async createAdmin(adminData: CreateAdminData): Promise<AdminData> {
    console.log("👥 AdminService: Creating new admin...")

    try {
      const response = await apiService.post("/admins", adminData)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admin created successfully")

      return data.data
    } catch (error) {
      console.error("❌ AdminService: Error creating admin:", error)
      throw error
    }
  }

  /**
   * Actualizar un administrador
   */
  async updateAdmin(id: string, adminData: UpdateAdminData): Promise<AdminData> {
    console.log("👥 AdminService: Updating admin:", id)

    try {
      const response = await apiService.put(`/admins/${id}`, adminData)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admin updated successfully")

      return data.data
    } catch (error) {
      console.error("❌ AdminService: Error updating admin:", error)
      throw error
    }
  }

  /**
   * Eliminar un administrador
   */
  async deleteAdmin(id: string): Promise<void> {
    console.log("👥 AdminService: Deleting admin:", id)

    try {
      const response = await apiService.delete(`/admins/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      console.log("✅ AdminService: Admin deleted successfully")
    } catch (error) {
      console.error("❌ AdminService: Error deleting admin:", error)
      throw error
    }
  }

  /**
   * Activar/Desactivar un administrador
   */
  async toggleAdminStatus(id: string, isActive: boolean): Promise<AdminData> {
    console.log("👥 AdminService: Toggling admin status:", id, isActive)

    try {
      const response = await apiService.put(`/admins/${id}`, { is_active: isActive })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admin status updated successfully")

      return data.data
    } catch (error) {
      console.error("❌ AdminService: Error updating admin status:", error)
      throw error
    }
  }

  /**
   * Obtener historial de administradores
   */
  async getAdminHistory(): Promise<AdminHistoryEntry[]> {
    console.log("👥 AdminService: Getting admin history...")

    try {
      const response = await apiService.get("/admins/history")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AdminService: Admin history retrieved successfully")

      return data.data || []
    } catch (error) {
      console.error("❌ AdminService: Error getting admin history:", error)
      throw error
    }
  }

  /**
   * Validar si se puede eliminar un administrador
   */
  async canDeleteAdmin(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    console.log("👥 AdminService: Checking if admin can be deleted:", id)

    try {
      // Obtener todos los administradores activos
      const admins = await this.getAllAdmins()
      const activeAdmins = admins.filter((admin) => admin.is_active)

      // No permitir eliminar si quedan menos de 2 administradores activos
      if (activeAdmins.length <= 2) {
        const adminToDelete = admins.find((admin) => admin._id === id)
        if (adminToDelete?.is_active) {
          return {
            canDelete: false,
            reason: "No se puede eliminar. El sistema debe mantener al menos 2 administradores activos.",
          }
        }
      }

      return { canDelete: true }
    } catch (error) {
      console.error("❌ AdminService: Error checking delete permission:", error)
      return {
        canDelete: false,
        reason: "Error al verificar permisos de eliminación.",
      }
    }
  }
}

export default AdminService.getInstance()
