import authService from "./authService"

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

class ApiService {
  private static instance: ApiService
  private baseURL = "https://microservice-admin.onrender.com/api"

  static getInstance(): ApiService {
    console.log("🌐 ApiService: Getting instance")
    if (!ApiService.instance) {
      console.log("🌐 ApiService: Creating new instance")
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  /**
   * Realizar llamada autenticada a la API
   */
  async authenticatedFetch(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    console.log("🌐 ApiService: Making authenticated request to:", endpoint)
    console.log("🌐 ApiService: Request options:", { method: options.method || "GET" })

    let accessToken = authService.getAccessToken()

    if (!accessToken) {
      console.log("❌ ApiService: No access token available, redirecting to login")
      authService.redirectToLogin()
      throw new Error("No access token available")
    }

    console.log("🌐 ApiService: Access token found, making first request...")

    // Primera llamada
    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    console.log("🌐 ApiService: First request response status:", response.status)

    // Si el token expiró (401), renovar automáticamente
    if (response.status === 401) {
      console.log("🔄 ApiService: Token expired (401), attempting refresh...")
      const refreshSuccess = await authService.refreshToken()
      console.log("🔄 ApiService: Token refresh result:", refreshSuccess)

      if (refreshSuccess) {
        // Obtener el nuevo token y reintentar
        console.log("🔄 ApiService: Getting new token and retrying request...")
        accessToken = authService.getAccessToken()

        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        console.log("🌐 ApiService: Retry request response status:", response.status)
      } else {
        // No se pudo renovar el token, redirigir al login
        console.log("❌ ApiService: Token refresh failed, redirecting to login")
        authService.redirectToLogin()
        throw new Error("Authentication failed")
      }
    }

    console.log("✅ ApiService: Request completed successfully")
    return response
  }

  /**
   * GET request autenticado
   */
  async get(endpoint: string): Promise<Response> {
    console.log("🌐 ApiService: GET request to:", endpoint)
    return this.authenticatedFetch(endpoint, { method: "GET" })
  }

  /**
   * POST request autenticado
   */
  async post(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    console.log("🌐 ApiService: POST request to:", endpoint)
    console.log("🌐 ApiService: POST data:", data ? "Data provided" : "No data")
    return this.authenticatedFetch(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request autenticado
   */
  async put(endpoint: string, data?: Record<string, unknown>): Promise<Response> {
    console.log("🌐 ApiService: PUT request to:", endpoint)
    console.log("🌐 ApiService: PUT data:", data ? "Data provided" : "No data")
    return this.authenticatedFetch(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request autenticado
   */
  async delete(endpoint: string): Promise<Response> {
    console.log("🌐 ApiService: DELETE request to:", endpoint)
    return this.authenticatedFetch(endpoint, { method: "DELETE" })
  }
}

export default ApiService.getInstance()
