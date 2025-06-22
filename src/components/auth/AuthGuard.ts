// Solo registrar el Web Component en el cliente
if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  console.log('🛡️ AuthGuard: Registering Web Component...')

  class AuthGuard extends HTMLElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private authData: any = null
    private checkInterval: number | null = null
    private boundHandlers: {
      tokenRefreshed: (event: Event) => void
      logout: (event: Event) => void
      storageChange: (event: StorageEvent) => void
    }

    constructor() {
      super()
      console.log('🛡️ AuthGuard: Constructor called')
      this.attachShadow({ mode: 'open' })

      // Bind handlers para poder removerlos correctamente
      this.boundHandlers = {
        tokenRefreshed: this.handleTokenRefreshed.bind(this),
        logout: this.handleLogout.bind(this),
        storageChange: this.handleStorageChange.bind(this),
      }
    }

    connectedCallback() {
      console.log('🛡️ AuthGuard: Connected to DOM')
      this.initializeAuth()
      this.setupEventListeners()
      this.startTokenValidation()
    }

    disconnectedCallback() {
      console.log('🛡️ AuthGuard: Disconnected from DOM')
      this.cleanup()
    }

    private async initializeAuth() {
      console.log('🛡️ AuthGuard: Initializing cross-domain authentication...')

      try {
        console.log('🛡️ AuthGuard: Importing authUtils...')
        const { initializeCrossDomainAuth, redirectToLogin, validateTokenWithBackend } =
          await import('../../utils/authUtils')

        // 1. Inicializar autenticación cross-domain
        console.log('🛡️ AuthGuard: Step 1 - Cross-domain auth initialization')
        const authResult = initializeCrossDomainAuth()
        console.log('🛡️ AuthGuard: Auth result:', authResult)

        if (!authResult.success) {
          console.log('❌ AuthGuard: Authentication failed, redirecting to login')
          redirectToLogin()
          return
        }

        // 2. Validar token con backend
        console.log('🛡️ AuthGuard: Step 2 - Backend token validation')
        const isValid = await validateTokenWithBackend(authResult.tokens.access_token!)
        console.log('🛡️ AuthGuard: Backend validation result:', isValid)

        if (!isValid) {
          console.log('❌ AuthGuard: Backend validation failed, redirecting to login')
          redirectToLogin()
          return
        }

        // 3. Autenticación exitosa
        console.log('✅ AuthGuard: Authentication successful!')
        this.authData = authResult
        this.emitAuthSuccess()

        // Ocultar el componente (ya cumplió su función)
        this.style.display = 'none'
      } catch (error) {
        console.error('❌ AuthGuard: Error initializing auth:', error)
        const { redirectToLogin } = await import('../../utils/authUtils')
        redirectToLogin()
      }
    }

    private setupEventListeners() {
      console.log('🛡️ AuthGuard: Setting up event listeners...')

      // Escuchar eventos de renovación de token
      window.addEventListener('tokenRefreshed', this.boundHandlers.tokenRefreshed)
      console.log('🛡️ AuthGuard: tokenRefreshed listener added')

      // Escuchar eventos de logout
      window.addEventListener('userLoggedOut', this.boundHandlers.logout)
      console.log('🛡️ AuthGuard: userLoggedOut listener added')

      // Escuchar cambios en localStorage (para detectar logout en otras pestañas)
      window.addEventListener('storage', this.boundHandlers.storageChange)
      console.log('🛡️ AuthGuard: storage listener added')
    }

    private startTokenValidation() {
      console.log('🛡️ AuthGuard: Starting periodic token validation (5 min intervals)')

      // Validar token cada 5 minutos
      this.checkInterval = window.setInterval(
        async () => {
          console.log('🛡️ AuthGuard: Periodic token validation...')
          try {
            const { validateTokenWithBackend, redirectToLogin } = await import('@/utils/authUtils')
            const accessToken = localStorage.getItem('access_token')

            if (!accessToken) {
              console.log('❌ AuthGuard: No access token for periodic validation')
              redirectToLogin()
              return
            }

            const isValid = await validateTokenWithBackend(accessToken)
            console.log('🛡️ AuthGuard: Periodic validation result:', isValid)

            if (!isValid) {
              console.log('❌ AuthGuard: Periodic validation failed, redirecting')
              redirectToLogin()
            }
          } catch (error) {
            console.error('❌ AuthGuard: Error in periodic validation:', error)
          }
        },
        5 * 60 * 1000,
      ) // 5 minutos
    }

    private handleTokenRefreshed(_event: Event) {
      console.log('🛡️ AuthGuard: Token refreshed event received')
      const customEvent = _event as CustomEvent<{ newToken: string }>
      console.log(
        '🛡️ AuthGuard: New token received:',
        customEvent.detail?.newToken?.substring(0, 20) + '...',
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleLogout(_event: Event) {
      console.log('🛡️ AuthGuard: Logout event received')
      this.cleanup()
      this.redirectToLogin()
    }

    private handleStorageChange(event: StorageEvent) {
      console.log('🛡️ AuthGuard: Storage change detected:', event.key)
      // Si se eliminó el token en otra pestaña, cerrar sesión aquí también
      if (event.key === 'access_token' && !event.newValue) {
        console.log('🛡️ AuthGuard: Access token removed in another tab, logging out')
        this.handleLogout(event)
      }
    }

    private emitAuthSuccess() {
      console.log('🛡️ AuthGuard: Emitting auth success events...')

      // Evento estándar de AuthGuard
      const authGuardEvent = new CustomEvent('authGuardSuccess', {
        detail: {
          user: this.authData?.user,
          tokens: this.authData?.tokens,
          source: this.authData?.source,
          timestamp: new Date().toISOString(),
        },
        bubbles: true,
      })

      // Evento compatible con el sistema cross-domain
      const userAuthenticatedEvent = new CustomEvent('user-authenticated', {
        detail: {
          user: this.authData?.user,
          tokens: this.authData?.tokens,
          source: this.authData?.source,
        },
        bubbles: true,
      })

      this.dispatchEvent(authGuardEvent)
      this.dispatchEvent(userAuthenticatedEvent)
      window.dispatchEvent(authGuardEvent)
      window.dispatchEvent(userAuthenticatedEvent)

      console.log('✅ AuthGuard: Auth success events emitted')
    }

    private async redirectToLogin() {
      console.log('🛡️ AuthGuard: Redirecting to login...')
      try {
        const { redirectToLogin } = await import('@/utils/authUtils')
        redirectToLogin()
      } catch (error) {
        console.error('❌ AuthGuard: Error redirecting to login:', error)
        console.log('🛡️ AuthGuard: Fallback redirect to login URL')
        window.location.href = 'https://front-loginv1-kevinurena82-6772s-projects.vercel.app'
      }
    }

    private cleanup() {
      console.log('🛡️ AuthGuard: Cleaning up...')

      if (this.checkInterval) {
        console.log('🛡️ AuthGuard: Clearing interval')
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }

      console.log('🛡️ AuthGuard: Removing event listeners')
      window.removeEventListener('tokenRefreshed', this.boundHandlers.tokenRefreshed)
      window.removeEventListener('userLoggedOut', this.boundHandlers.logout)
      window.removeEventListener('storage', this.boundHandlers.storageChange)

      console.log('✅ AuthGuard: Cleanup completed')
    }

    // Método público para obtener datos de autenticación
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAuthData(): any {
      console.log('🛡️ AuthGuard: Getting auth data:', this.authData?.success)
      return this.authData
    }

    // Método público para forzar validación
    async forceValidation(): Promise<boolean> {
      console.log('🛡️ AuthGuard: Force validation requested')
      try {
        const { validateTokenWithBackend } = await import('@/utils/authUtils')
        const accessToken = localStorage.getItem('access_token')

        if (!accessToken) {
          console.log('❌ AuthGuard: No access token for force validation')
          return false
        }

        const result = await validateTokenWithBackend(accessToken)
        console.log('🛡️ AuthGuard: Force validation result:', result)
        return result
      } catch (error) {
        console.error('❌ AuthGuard: Error forcing validation:', error)
        return false
      }
    }
  }

  // Registrar el Web Component solo si no está ya registrado
  if (!customElements.get('auth-guard')) {
    customElements.define('auth-guard', AuthGuard)
    console.log('✅ AuthGuard: Web Component registered successfully')
  } else {
    console.log('ℹ️ AuthGuard: Web Component already registered')
  }
} else {
  console.log('⚠️ AuthGuard: Not in browser environment, skipping registration')
}

export default typeof window !== 'undefined' ? customElements.get('auth-guard') : null
