// Configuración de URLs y endpoints
const CONFIG = {
  LOGIN_URL: "https://front-loginv1-kevinurena82-6772s-projects.vercel.app",
  ADMIN_URL: "https://front-adminv1.vercel.app",
  API_BASE_URL: "https://microservice-admin.onrender.com/api",

  ENDPOINTS: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },

  TOKEN_CONFIG: {
    ACCESS_DURATION: 3600, // 1 hora
    REFRESH_DURATION: 2592000, // 30 días
    STORAGE_KEYS: {
      ACCESS_TOKEN: "access_token",
      REFRESH_TOKEN: "refresh_token",
      USER_DATA: "user_data",
      USER_ROLE: "user_role",
    },
  },
}

export interface UserData {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AuthData {
  isAuthenticated: boolean
  user: UserData | null
  token: string | null
  role: string | null
}

class AuthService {
  private static instance: AuthService
  private refreshPromise: Promise<boolean> | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Verificar si el usuario está autenticado
   */
  checkAuthentication(): AuthData {
    const accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
    const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)

    return {
      isAuthenticated: !!(accessToken && userData && userRole === "administrador"),
      user: userData ? JSON.parse(userData) : null,
      token: accessToken,
      role: userRole,
    }
  }

  /**
   * Validar token con el backend
   */
  async validateTokenWithBackend(): Promise<boolean> {
    const token = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)

    if (!token) return false

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ME}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        // Token expirado, intentar renovar
        return await this.refreshToken()
      }

      return response.ok
    } catch {
      console.error("Error validating token")
      return false
    }
  }

  /**
   * Renovar token de acceso
   */
  async refreshToken(): Promise<boolean> {
    // Si ya hay una renovación en progreso, esperar a que termine
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)

    if (!refreshToken) {
      this.logout()
      return false
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken)
    const result = await this.refreshPromise
    this.refreshPromise = null

    return result
  }

  private async performTokenRefresh(refreshToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data.data.access_token)

        // Emitir evento de token renovado
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", {
            detail: { newToken: data.data.access_token },
          }),
        )

        return true
      }

      // Refresh token también expiró
      this.logout()
      return false
    } catch {
      console.error("Error refreshing token")
      this.logout()
      return false
    }
  }

  /**
   * Verificar si un token JWT es válido (sin verificar firma)
   */
  isTokenValid(token: string): boolean {
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Math.floor(Date.now() / 1000)

      return payload.exp > currentTime
    } catch {
      return false
    }
  }

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Obtener token de acceso actual
   */
  getAccessToken(): string | null {
    return localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    const accessToken = this.getAccessToken()

    // Intentar notificar al backend sobre el logout
    if (accessToken) {
      try {
        await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
      } catch {
        console.error("Error during logout")
      }
    }

    // Limpiar localStorage
    this.cleanupSession()

    // Emitir evento de logout
    window.dispatchEvent(new CustomEvent("userLoggedOut"))

    // Redirigir al Front-Login
    window.location.href = CONFIG.LOGIN_URL
  }

  /**
   * Limpiar datos de sesión
   */
  cleanupSession(): void {
    const keysToRemove = [
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE,
    ]

    keysToRemove.forEach((key) => localStorage.removeItem(key))
    sessionStorage.clear()
  }

  /**
   * Redirigir al login
   */
  redirectToLogin(): void {
    window.location.href = CONFIG.LOGIN_URL
  }

  /**
   * Validar rol de usuario
   */
  validateUserRole(requiredRole: string): boolean {
    const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)
    const userData = this.getCurrentUser()

    return userRole === requiredRole && userData?.role === "admin"
  }
}

export default AuthService.getInstance()
