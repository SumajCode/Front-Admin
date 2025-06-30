import apiService from './apiService'

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

export interface CreateAdminRequest {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: string
  [key: string]: unknown
}

export interface UpdateAdminRequest {
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
  data: AdminFromAPI | AdminFromAPI[] | null
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
  async getAllAdmins(): Promise<AdminFromAPI[]> {
    console.log('👥 AdminService: Getting all admins...')

    try {
      const response = await apiService.get('/admins/')
      console.log('👥 AdminService: Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AdminResponse = await response.json()
      console.log('👥 AdminService: Response data:', data)

      if (data.success && data.data && Array.isArray((data.data as any).admins)) {
        const admins = (data.data as any).admins
        console.log('✅ AdminService: Successfully retrieved', admins.length, 'admins')
        return admins
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Invalid response format')
      }
    } catch (error) {
      console.error('❌ AdminService: Error getting admins:', error)
      throw error
    }
  }

  /**
   * Obtener un administrador por ID
   */
  async getAdminById(id: string): Promise<AdminFromAPI> {
    console.log('👥 AdminService: Getting admin by ID:', id)

    try {
      const response = await apiService.get(`/admins/${id}`)
      console.log('👥 AdminService: Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AdminResponse = await response.json()
      console.log('👥 AdminService: Response data:', data)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Successfully retrieved admin')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Admin not found')
      }
    } catch (error) {
      console.error('❌ AdminService: Error getting admin:', error)
      throw error
    }
  }

  /**
   * Crear un nuevo administrador
   */
  async createAdmin(adminData: CreateAdminRequest): Promise<AdminFromAPI> {
    console.log('👥 AdminService: Creating admin:', adminData.email)

    try {
      const response = await apiService.post('/admins/', adminData)
      console.log('👥 AdminService: Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ AdminService: Create error:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: AdminResponse = await response.json()
      console.log('👥 AdminService: Response data:', data)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Successfully created admin')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Failed to create admin')
      }
    } catch (error) {
      console.error('❌ AdminService: Error creating admin:', error)
      throw error
    }
  }

  /**
   * Actualizar un administrador
   */
  async updateAdmin(id: string, adminData: UpdateAdminRequest): Promise<AdminFromAPI> {
    console.log('👥 AdminService: Updating admin:', id)

    try {
      const response = await apiService.put(`/admins/${id}`, adminData)
      console.log('👥 AdminService: Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ AdminService: Update error:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: AdminResponse = await response.json()
      console.log('👥 AdminService: Response data:', data)

      if (data.success && data.data && !Array.isArray(data.data)) {
        console.log('✅ AdminService: Successfully updated admin')
        return data.data
      } else {
        console.error('❌ AdminService: Invalid response format:', data)
        throw new Error(data.message || 'Failed to update admin')
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
      console.log('👥 AdminService: Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ AdminService: Delete error:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: AdminResponse = await response.json()
      console.log('👥 AdminService: Response data:', data)

      if (data.success) {
        console.log('✅ AdminService: Successfully deleted admin')
      } else {
        console.error('❌ AdminService: Delete failed:', data)
        throw new Error(data.message || 'Failed to delete admin')
      }
    } catch (error) {
      console.error('❌ AdminService: Error deleting admin:', error)
      throw error
    }
  }

  /**
   * Activar/Desactivar un administrador
   */
  async toggleAdminStatus(id: string, isActive: boolean): Promise<AdminFromAPI> {
    console.log('👥 AdminService: Toggling admin status:', id, 'to', isActive)

    return this.updateAdmin(id, { is_active: isActive })
  }
}

export default AdminService.getInstance()
