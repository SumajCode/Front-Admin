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
    console.log("🔧 AuthService: Getting instance")
    if (!AuthService.instance) {
      console.log("🔧 AuthService: Creating new instance")
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Verificar si el usuario está autenticado
   */
  checkAuthentication(): AuthData {
    console.log("🔍 AuthService: Checking authentication...")

    const accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
    const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)

    console.log("🔍 AuthService: Token exists:", !!accessToken)
    console.log("🔍 AuthService: User data exists:", !!userData)
    console.log("🔍 AuthService: User role:", userRole)

    const authData = {
      isAuthenticated: !!(accessToken && userData && userRole === "administrador"),
      user: userData ? JSON.parse(userData) : null,
      token: accessToken,
      role: userRole,
    }

    console.log("🔍 AuthService: Authentication result:", authData.isAuthenticated)
    return authData
  }

  /**
   * Validar token con el backend
   */
  async validateTokenWithBackend(): Promise<boolean> {
    console.log("🌐 AuthService: Validating token with backend...")

    const token = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)

    if (!token) {
      console.log("❌ AuthService: No token found for validation")
      return false
    }

    console.log("🌐 AuthService: Making request to:", `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ME}`)

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ME}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("🌐 AuthService: Backend response status:", response.status)

      if (response.status === 401) {
        console.log("🔄 AuthService: Token expired, attempting refresh...")
        return await this.refreshToken()
      }

      const isValid = response.ok
      console.log("✅ AuthService: Token validation result:", isValid)
      return isValid
    } catch (error) {
      console.error("❌ AuthService: Error validating token:", error)
      return false
    }
  }

  /**
   * Renovar token de acceso
   */
  async refreshToken(): Promise<boolean> {
    console.log("🔄 AuthService: Starting token refresh...")

    // Si ya hay una renovación en progreso, esperar a que termine
    if (this.refreshPromise) {
      console.log("⏳ AuthService: Refresh already in progress, waiting...")
      return this.refreshPromise
    }

    const refreshToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)

    if (!refreshToken) {
      console.log("❌ AuthService: No refresh token found, logging out...")
      this.logout()
      return false
    }

    console.log("🔄 AuthService: Refresh token found, performing refresh...")
    this.refreshPromise = this.performTokenRefresh(refreshToken)
    const result = await this.refreshPromise
    this.refreshPromise = null

    console.log("🔄 AuthService: Token refresh completed:", result)
    return result
  }

  private async performTokenRefresh(refreshToken: string): Promise<boolean> {
    console.log("🔄 AuthService: Performing token refresh request...")

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      })

      console.log("🔄 AuthService: Refresh response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ AuthService: New token received")

        localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data.data.access_token)

        // Emitir evento de token renovado
        console.log("📡 AuthService: Emitting tokenRefreshed event")
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", {
            detail: { newToken: data.data.access_token },
          }),
        )

        return true
      }

      // Refresh token también expiró
      console.log("❌ AuthService: Refresh token expired, logging out...")
      this.logout()
      return false
    } catch (error) {
      console.error("❌ AuthService: Error refreshing token:", error)
      this.logout()
      return false
    }
  }

  /**
   * Verificar si un token JWT es válido (sin verificar firma)
   */
  isTokenValid(token: string): boolean {
    console.log("🔍 AuthService: Checking token validity...")

    if (!token) {
      console.log("❌ AuthService: No token provided")
      return false
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const isValid = payload.exp > currentTime

      console.log("🔍 AuthService: Token expiry:", new Date(payload.exp * 1000))
      console.log("🔍 AuthService: Current time:", new Date(currentTime * 1000))
      console.log("🔍 AuthService: Token valid:", isValid)

      return isValid
    } catch (error) {
      console.error("❌ AuthService: Error parsing token:", error)
      return false
    }
  }

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser(): UserData | null {
    console.log("👤 AuthService: Getting current user data...")

    const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
    const user = userData ? JSON.parse(userData) : null

    console.log("👤 AuthService: User data found:", !!user)
    if (user) {
      console.log("👤 AuthService: User:", user.username, user.email)
    }

    return user
  }

  /**
   * Obtener token de acceso actual
   */
  getAccessToken(): string | null {
    console.log("🔑 AuthService: Getting access token...")

    const token = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    console.log("🔑 AuthService: Token exists:", !!token)

    return token
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    console.log("🚪 AuthService: Starting logout process...")

    const accessToken = this.getAccessToken()

    // Intentar notificar al backend sobre el logout
    if (accessToken) {
      console.log("🌐 AuthService: Notifying backend about logout...")
      try {
        await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        console.log("✅ AuthService: Backend notified successfully")
      } catch (error) {
        console.error("❌ AuthService: Error notifying backend:", error)
      }
    }

    // Limpiar localStorage
    console.log("🧹 AuthService: Cleaning up session...")
    this.cleanupSession()

    // Emitir evento de logout
    console.log("📡 AuthService: Emitting userLoggedOut event")
    window.dispatchEvent(new CustomEvent("userLoggedOut"))

    // Redirigir al Front-Login
    console.log("🔄 AuthService: Redirecting to login...")
    window.location.href = CONFIG.LOGIN_URL
  }

  /**
   * Limpiar datos de sesión
   */
  cleanupSession(): void {
    console.log("🧹 AuthService: Cleaning up session data...")

    const keysToRemove = [
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA,
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE,
    ]

    keysToRemove.forEach((key) => {
      console.log("🧹 AuthService: Removing key:", key)
      localStorage.removeItem(key)
    })

    sessionStorage.clear()
    console.log("✅ AuthService: Session cleanup completed")
  }

  /**
   * Redirigir al login
   */
  redirectToLogin(): void {
    console.log("🔄 AuthService: Redirecting to login URL:", CONFIG.LOGIN_URL)
    window.location.href = CONFIG.LOGIN_URL
  }

  /**
   * Validar rol de usuario
   */
  validateUserRole(requiredRole: string): boolean {
    console.log("🔍 AuthService: Validating user role:", requiredRole)

    const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)
    const userData = this.getCurrentUser()

    console.log("🔍 AuthService: Stored role:", userRole)
    console.log("🔍 AuthService: User data role:", userData?.role)

    const isValid = userRole === requiredRole && userData?.role === "admin"
    console.log("🔍 AuthService: Role validation result:", isValid)

    return isValid
  }
}

export default AuthService.getInstance()
