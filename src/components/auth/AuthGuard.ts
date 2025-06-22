// Solo registrar el Web Component en el cliente
if (typeof window !== "undefined" && typeof HTMLElement !== "undefined") {
  console.log("🛡️ AuthGuard: Registering Web Component...")

  interface AuthData {
    isAuthenticated: boolean
    user: any
    token: string | null
    role: string | null
  }

  class AuthGuard extends HTMLElement {
    private authData: AuthData | null = null
    private checkInterval: number | null = null
    private boundHandlers: {
      tokenRefreshed: (event: Event) => void
      logout: (event: Event) => void
      storageChange: (event: StorageEvent) => void
    }

    constructor() {
      super()
      console.log("🛡️ AuthGuard: Constructor called")
      this.attachShadow({ mode: "open" })

      // Bind handlers para poder removerlos correctamente
      this.boundHandlers = {
        tokenRefreshed: this.handleTokenRefreshed.bind(this),
        logout: this.handleLogout.bind(this),
        storageChange: this.handleStorageChange.bind(this),
      }
    }

    connectedCallback() {
      console.log("🛡️ AuthGuard: Connected to DOM")
      this.initializeAuth()
      this.setupEventListeners()
      this.startTokenValidation()
    }

    disconnectedCallback() {
      console.log("🛡️ AuthGuard: Disconnected from DOM")
      this.cleanup()
    }

    private async initializeAuth() {
      console.log("🛡️ AuthGuard: Initializing authentication...")

      try {
        console.log("🛡️ AuthGuard: Importing authService...")
        const { default: authService } = await import("@/services/authService")

        // 1. Verificar autenticación básica
        console.log("🛡️ AuthGuard: Step 1 - Basic authentication check")
        this.authData = authService.checkAuthentication()
        console.log("🛡️ AuthGuard: Basic auth result:", this.authData.isAuthenticated)

        if (!this.authData.isAuthenticated) {
          console.log("❌ AuthGuard: Not authenticated, redirecting to login")
          this.redirectToLogin()
          return
        }

        // 2. Validar token con backend
        console.log("🛡️ AuthGuard: Step 2 - Backend token validation")
        const isValid = await authService.validateTokenWithBackend()
        console.log("🛡️ AuthGuard: Backend validation result:", isValid)

        if (!isValid) {
          console.log("❌ AuthGuard: Backend validation failed, redirecting to login")
          this.redirectToLogin()
          return
        }

        // 3. Verificar rol de administrador
        console.log("🛡️ AuthGuard: Step 3 - Role validation")
        const roleValid = authService.validateUserRole("administrador")
        console.log("🛡️ AuthGuard: Role validation result:", roleValid)

        if (!roleValid) {
          console.log("❌ AuthGuard: Role validation failed, showing unauthorized message")
          this.showUnauthorizedMessage()
          return
        }

        // 4. Autenticación exitosa, emitir evento
        console.log("✅ AuthGuard: Authentication successful!")
        this.emitAuthSuccess()
      } catch (error) {
        console.error("❌ AuthGuard: Error initializing auth:", error)
        this.redirectToLogin()
      }
    }

    private setupEventListeners() {
      console.log("🛡️ AuthGuard: Setting up event listeners...")

      // Escuchar eventos de renovación de token
      window.addEventListener("tokenRefreshed", this.boundHandlers.tokenRefreshed)
      console.log("🛡️ AuthGuard: tokenRefreshed listener added")

      // Escuchar eventos de logout
      window.addEventListener("userLoggedOut", this.boundHandlers.logout)
      console.log("🛡️ AuthGuard: userLoggedOut listener added")

      // Escuchar cambios en localStorage (para detectar logout en otras pestañas)
      window.addEventListener("storage", this.boundHandlers.storageChange)
      console.log("🛡️ AuthGuard: storage listener added")
    }

    private startTokenValidation() {
      console.log("🛡️ AuthGuard: Starting periodic token validation (5 min intervals)")

      // Validar token cada 5 minutos
      this.checkInterval = window.setInterval(
        async () => {
          console.log("🛡️ AuthGuard: Periodic token validation...")
          try {
            const { default: authService } = await import("@/services/authService")
            const isValid = await authService.validateTokenWithBackend()
            console.log("🛡️ AuthGuard: Periodic validation result:", isValid)

            if (!isValid) {
              console.log("❌ AuthGuard: Periodic validation failed, redirecting")
              this.redirectToLogin()
            }
          } catch (error) {
            console.error("❌ AuthGuard: Error in periodic validation:", error)
          }
        },
        5 * 60 * 1000,
      ) // 5 minutos
    }

    private handleTokenRefreshed(_event: Event) {
      console.log("🛡️ AuthGuard: Token refreshed event received")
      const customEvent = _event as CustomEvent<{ newToken: string }>
      console.log("🛡️ AuthGuard: New token received:", customEvent.detail?.newToken?.substring(0, 20) + "...")
      // Actualizar datos de autenticación
      this.loadAuthData()
    }

    private async loadAuthData() {
      console.log("🛡️ AuthGuard: Loading auth data...")
      try {
        const { default: authService } = await import("@/services/authService")
        this.authData = authService.checkAuthentication()
        console.log("🛡️ AuthGuard: Auth data loaded:", this.authData.isAuthenticated)
      } catch (error) {
        console.error("❌ AuthGuard: Error loading auth data:", error)
      }
    }

    private handleLogout(_event: Event) {
      console.log("🛡️ AuthGuard: Logout event received")
      this.cleanup()
      this.redirectToLogin()
    }

    private handleStorageChange(event: StorageEvent) {
      console.log("🛡️ AuthGuard: Storage change detected:", event.key)
      // Si se eliminó el token en otra pestaña, cerrar sesión aquí también
      if (event.key === "access_token" && !event.newValue) {
        console.log("🛡️ AuthGuard: Access token removed in another tab, logging out")
        this.handleLogout(event)
      }
    }

    private emitAuthSuccess() {
      console.log("🛡️ AuthGuard: Emitting auth success event...")

      const authSuccessEvent = new CustomEvent("authGuardSuccess", {
        detail: {
          user: this.authData?.user,
          token: this.authData?.token,
          role: this.authData?.role,
          timestamp: new Date().toISOString(),
        },
        bubbles: true,
      })

      this.dispatchEvent(authSuccessEvent)
      window.dispatchEvent(authSuccessEvent)
      console.log("✅ AuthGuard: Auth success event emitted")
    }

    private async redirectToLogin() {
      console.log("🛡️ AuthGuard: Redirecting to login...")
      try {
        const { default: authService } = await import("@/services/authService")
        authService.redirectToLogin()
      } catch (error) {
        console.error("❌ AuthGuard: Error redirecting to login:", error)
        console.log("🛡️ AuthGuard: Fallback redirect to login URL")
        window.location.href = "https://front-loginv1-kevinurena82-6772s-projects.vercel.app"
      }
    }

    private showUnauthorizedMessage() {
      console.log("🛡️ AuthGuard: Showing unauthorized message")
      this.shadowRoot!.innerHTML = `
        <style>
          .unauthorized {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .unauthorized h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .unauthorized p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          .unauthorized button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .unauthorized button:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
          }
        </style>
        <div class="unauthorized">
          <h1>🚫 Acceso No Autorizado</h1>
          <p>No tienes permisos para acceder a esta aplicación.</p>
          <button onclick="window.location.href='https://front-loginv1-kevinurena82-6772s-projects.vercel.app'">
            Volver al Login
          </button>
        </div>
      `
    }

    private cleanup() {
      console.log("🛡️ AuthGuard: Cleaning up...")

      if (this.checkInterval) {
        console.log("🛡️ AuthGuard: Clearing interval")
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }

      console.log("🛡️ AuthGuard: Removing event listeners")
      window.removeEventListener("tokenRefreshed", this.boundHandlers.tokenRefreshed)
      window.removeEventListener("userLoggedOut", this.boundHandlers.logout)
      window.removeEventListener("storage", this.boundHandlers.storageChange)

      console.log("✅ AuthGuard: Cleanup completed")
    }

    // Método público para obtener datos de autenticación
    getAuthData(): AuthData | null {
      console.log("🛡️ AuthGuard: Getting auth data:", this.authData?.isAuthenticated)
      return this.authData
    }

    // Método público para forzar validación
    async forceValidation(): Promise<boolean> {
      console.log("🛡️ AuthGuard: Force validation requested")
      try {
        const { default: authService } = await import("@/services/authService")
        const result = await authService.validateTokenWithBackend()
        console.log("🛡️ AuthGuard: Force validation result:", result)
        return result
      } catch (error) {
        console.error("❌ AuthGuard: Error forcing validation:", error)
        return false
      }
    }
  }

  // Registrar el Web Component solo si no está ya registrado
  if (!customElements.get("auth-guard")) {
    customElements.define("auth-guard", AuthGuard)
    console.log("✅ AuthGuard: Web Component registered successfully")
  } else {
    console.log("ℹ️ AuthGuard: Web Component already registered")
  }
} else {
  console.log("⚠️ AuthGuard: Not in browser environment, skipping registration")
}

export default typeof window !== "undefined" ? customElements.get("auth-guard") : null
