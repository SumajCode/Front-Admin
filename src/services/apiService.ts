class ApiService {
  private static instance: ApiService
  private baseURL = 'https://microservice-admin.onrender.com/api'

  static getInstance(): ApiService {
    console.log('🌐 ApiService: Getting instance')
    if (!ApiService.instance) {
      console.log('🌐 ApiService: Creating new instance')
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  /**
   * Realizar llamada autenticada a la API usando authUtils
   */
  async authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    console.log('🌐 ApiService: Making authenticated request to:', endpoint)
    console.log('🌐 ApiService: Request options:', { method: options.method || 'GET' })

    try {
      // Importar dinámicamente las utilidades de auth
      const { authenticatedFetch } = await import('@/utils/authUtils')

      const fullUrl = `${this.baseURL}${endpoint}`
      console.log('🌐 ApiService: Full URL:', fullUrl)

      const response = await authenticatedFetch(fullUrl, options)
      console.log('✅ ApiService: Request completed successfully')

      return response
    } catch (error) {
      console.error('❌ ApiService: Request failed:', error)
      throw error
    }
  }

  /**
   * GET request autenticado
   */
  async get(endpoint: string): Promise<Response> {
    console.log('🌐 ApiService: GET request to:', endpoint)
    return this.authenticatedFetch(endpoint, { method: 'GET' })
  }

  /**
   * POST request autenticado
   */
  async post(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    console.log('🌐 ApiService: POST request to:', endpoint)
    console.log('🌐 ApiService: POST data:', data ? 'Data provided' : 'No data')
    return this.authenticatedFetch(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request autenticado
   */
  async put(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    console.log('🌐 ApiService: PUT request to:', endpoint)
    console.log('🌐 ApiService: PUT data:', data ? 'Data provided' : 'No data')
    return this.authenticatedFetch(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request autenticado
   */
  async delete(endpoint: string): Promise<Response> {
    console.log('🌐 ApiService: DELETE request to:', endpoint)
    return this.authenticatedFetch(endpoint, { method: 'DELETE' })
  }
}

export default ApiService.getInstance()
