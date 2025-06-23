import apiService from './apiService'

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

export interface AdminResponse {
  success: boolean
  message: string
  data: AdminData | AdminData[] | null
}

class AdminService {
  private static instance: AdminService

  static getInstance(): AdminService {
    console.log('👥 AdminService: Getting instance')
    if (!AdminService.instance) {
      console.log('👥 AdminService: Creating new instance')
      AdminService.instance = new AdminService()
    }
    return AdminService.instance
  }

  /**
   * Obtener todos los administradores
   */
  async getAllAdmins(): Promise<AdminData[]> {
    console.log('👥 AdminService: Getting all admins...')

    try {
      const response = await apiService.get('/admins/')
      const data: AdminResponse = await response.json()

      console.log('👥 AdminService: Response received:', data.success)

      if (data.success && Array.isArray(data.data)) {
        console.log('✅ AdminService: Admins loaded successfully:', data.data.length)
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Error al obtener administradores')
      }
    } catch (error) {
      console.error('❌ AdminService: Error getting admins:', error)
      throw error
    }
  }

  /**
   * Obtener un administrador por ID
   */
  async getAdminById(id: string): Promise<AdminData> {
    console.log('👥 AdminService: Getting admin by ID:', id)

    try {
      const response = await apiService.get(`/admins/${id}`)
      const data: AdminResponse = await response.json()

      console.log('👥 AdminService: Admin response received:', data.success)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Admin loaded successfully')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Error al obtener administrador')
      }
    } catch (error) {
      console.error('❌ AdminService: Error getting admin:', error)
      throw error
    }
  }

  /**
   * Crear un nuevo administrador
   */
  async createAdmin(adminData: CreateAdminData): Promise<AdminData> {
    console.log('👥 AdminService: Creating new admin...')
    console.log('👥 AdminService: Admin data:', { ...adminData, password: '[HIDDEN]' })

    try {
      const response = await apiService.post('/admins/', adminData)
      const data: AdminResponse = await response.json()

      console.log('👥 AdminService: Create response received:', data.success)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Admin created successfully')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Error al crear administrador')
      }
    } catch (error) {
      console.error('❌ AdminService: Error creating admin:', error)
      throw error
    }
  }

  /**
   * Actualizar un administrador
   */
  async updateAdmin(id: string, adminData: UpdateAdminData): Promise<AdminData> {
    console.log('👥 AdminService: Updating admin:', id)
    console.log('👥 AdminService: Update data:', adminData)

    try {
      const response = await apiService.put(`/admins/${id}`, adminData)
      const data: AdminResponse = await response.json()

      console.log('👥 AdminService: Update response received:', data.success)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Admin updated successfully')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Error al actualizar administrador')
      }
    } catch (error) {
      console.error('❌ AdminService: Error updating admin:', error)
      throw error
    }
  }

  /**
   * Eliminar un administrador
   */
  async deleteAdmin(id: string): Promise<void> {
    console.log('👥 AdminService: Deleting admin:', id)

    try {
      const response = await apiService.delete(`/admins/${id}`)
      const data: AdminResponse = await response.json()

      console.log('👥 AdminService: Delete response received:', data.success)

      if (data.success) {
        console.log('✅ AdminService: Admin deleted successfully')
      } else {
        console.error('❌ AdminService: Delete failed:', data)
        throw new Error(data.message || 'Error al eliminar administrador')
      }
    } catch (error) {
      console.error('❌ AdminService: Error deleting admin:', error)
      throw error
    }
  }

  /**
   * Cambiar estado activo/inactivo de un administrador
   */
  async toggleAdminStatus(id: string, isActive: boolean): Promise<AdminData> {
    console.log('👥 AdminService: Toggling admin status:', id, 'to', isActive)

    return this.updateAdmin(id, { is_active: isActive })
  }

  /**
   * Obtener estadísticas de administradores
   */
  async getAdminStats(): Promise<{ total: number; active: number; inactive: number }> {
    console.log('👥 AdminService: Getting admin statistics...')

    try {
      const admins = await this.getAllAdmins()
      const active = admins.filter((admin) => admin.is_active).length
      const inactive = admins.filter((admin) => !admin.is_active).length

      const stats = {
        total: admins.length,
        active,
        inactive,
      }

      console.log('📊 AdminService: Stats calculated:', stats)
      return stats
    } catch (error) {
      console.error('❌ AdminService: Error getting stats:', error)
      throw error
    }
  }
}

export default AdminService.getInstance()
