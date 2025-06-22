import authService from './authService'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

class ApiService {
  private static instance: ApiService
  private baseURL = 'https://microservice-admin.onrender.com/api'

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  /**
   * Realizar llamada autenticada a la API
   */
  async authenticatedFetch(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    let accessToken = authService.getAccessToken()

    if (!accessToken) {
      authService.redirectToLogin()
      throw new Error('No access token available')
    }

    // Primera llamada
    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    // Si el token expiró (401), renovar automáticamente
    if (response.status === 401) {
      const refreshSuccess = await authService.refreshToken()

      if (refreshSuccess) {
        // Obtener el nuevo token y reintentar
        accessToken = authService.getAccessToken()

        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      } else {
        // No se pudo renovar el token, redirigir al login
        authService.redirectToLogin()
        throw new Error('Authentication failed')
      }
    }

    return response
  }

  /**
   * GET request autenticado
   */
  async get(endpoint: string): Promise<Response> {
    return this.authenticatedFetch(endpoint, { method: 'GET' })
  }

  /**
   * POST request autenticado
   */
  async post(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    return this.authenticatedFetch(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request autenticado
   */
  async put(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    return this.authenticatedFetch(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request autenticado
   */
  async delete(endpoint: string): Promise<Response> {
    return this.authenticatedFetch(endpoint, { method: 'DELETE' })
  }
}

export default ApiService.getInstance()
