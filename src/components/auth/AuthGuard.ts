// Solo registrar el Web Component en el cliente
if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  interface AuthData {
    isAuthenticated: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.attachShadow({ mode: 'open' })

      // Bind handlers para poder removerlos correctamente
      this.boundHandlers = {
        tokenRefreshed: this.handleTokenRefreshed.bind(this),
        logout: this.handleLogout.bind(this),
        storageChange: this.handleStorageChange.bind(this),
      }
    }

    connectedCallback() {
      this.initializeAuth()
      this.setupEventListeners()
      this.startTokenValidation()
    }

    disconnectedCallback() {
      this.cleanup()
    }

    private async initializeAuth() {
      try {
        const { default: authService } = await import('@/services/authService')

        // 1. Verificar autenticación básica
        this.authData = authService.checkAuthentication()

        if (!this.authData.isAuthenticated) {
          this.redirectToLogin()
          return
        }

        // 2. Validar token con backend
        const isValid = await authService.validateTokenWithBackend()

        if (!isValid) {
          this.redirectToLogin()
          return
        }

        // 3. Verificar rol de administrador
        if (!authService.validateUserRole('administrador')) {
          this.showUnauthorizedMessage()
          return
        }

        // 4. Autenticación exitosa, emitir evento
        this.emitAuthSuccess()
      } catch (error) {
        console.error('Error initializing auth:', error)
        this.redirectToLogin()
      }
    }

    private setupEventListeners() {
      // Escuchar eventos de renovación de token
      window.addEventListener('tokenRefreshed', this.boundHandlers.tokenRefreshed)

      // Escuchar eventos de logout
      window.addEventListener('userLoggedOut', this.boundHandlers.logout)

      // Escuchar cambios en localStorage (para detectar logout en otras pestañas)
      window.addEventListener('storage', this.boundHandlers.storageChange)
    }

    private startTokenValidation() {
      // Validar token cada 5 minutos
      this.checkInterval = window.setInterval(
        async () => {
          try {
            const { default: authService } = await import('@/services/authService')
            const isValid = await authService.validateTokenWithBackend()
            if (!isValid) {
              this.redirectToLogin()
            }
          } catch (error) {
            console.error('Error validating token:', error)
          }
        },
        5 * 60 * 1000,
      ) // 5 minutos
    }

    private handleTokenRefreshed(_event: Event) {
      const customEvent = _event as CustomEvent<{ newToken: string }>
      console.log('Token refreshed successfully:', customEvent.detail?.newToken)
      // Actualizar datos de autenticación
      this.loadAuthData()
    }

    private async loadAuthData() {
      try {
        const { default: authService } = await import('@/services/authService')
        this.authData = authService.checkAuthentication()
      } catch (error) {
        console.error('Error loading auth data:', error)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleLogout(_event: Event) {
      this.cleanup()
      this.redirectToLogin()
    }

    private handleStorageChange(event: StorageEvent) {
      // Si se eliminó el token en otra pestaña, cerrar sesión aquí también
      if (event.key === 'access_token' && !event.newValue) {
        this.handleLogout(event)
      }
    }

    private emitAuthSuccess() {
      const authSuccessEvent = new CustomEvent('authGuardSuccess', {
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
    }

    private async redirectToLogin() {
      try {
        const { default: authService } = await import('@/services/authService')
        authService.redirectToLogin()
      } catch (error) {
        console.error('Error redirecting to login:', error)
        window.location.href = 'https://front-loginv1-kevinurena82-6772s-projects.vercel.app'
      }
    }

    private showUnauthorizedMessage() {
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
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }

      window.removeEventListener('tokenRefreshed', this.boundHandlers.tokenRefreshed)
      window.removeEventListener('userLoggedOut', this.boundHandlers.logout)
      window.removeEventListener('storage', this.boundHandlers.storageChange)
    }

    // Método público para obtener datos de autenticación
    getAuthData(): AuthData | null {
      return this.authData
    }

    // Método público para forzar validación
    async forceValidation(): Promise<boolean> {
      try {
        const { default: authService } = await import('@/services/authService')
        return await authService.validateTokenWithBackend()
      } catch (error) {
        console.error('Error forcing validation:', error)
        return false
      }
    }
  }

  // Registrar el Web Component solo si no está ya registrado
  if (!customElements.get('auth-guard')) {
    customElements.define('auth-guard', AuthGuard)
  }
}

export default typeof window !== 'undefined' ? customElements.get('auth-guard') : null
