// Solo registrar el Web Component en el cliente
if (typeof window !== "undefined" && typeof HTMLElement !== "undefined") {
  console.log("🚪 LogoutButton: Registering Web Component...")

  class LogoutButton extends HTMLElement {
    private isLoggingOut = false

    constructor() {
      super()
      console.log("🚪 LogoutButton: Constructor called")
      this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
      console.log("🚪 LogoutButton: Connected to DOM")
      this.render()
      this.setupEventListeners()
    }

    private render() {
      console.log("🚪 LogoutButton: Rendering component...")

      const buttonText = this.getAttribute("text") || "Cerrar Sesión"
      const buttonClass = this.getAttribute("class") || "logout-btn"
      const showIcon = this.getAttribute("show-icon") !== "false"

      console.log("🚪 LogoutButton: Button text:", buttonText)
      console.log("🚪 LogoutButton: Show icon:", showIcon)
      console.log("🚪 LogoutButton: Is logging out:", this.isLoggingOut)

      this.shadowRoot!.innerHTML = `
        <style>
          .logout-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease;
            text-decoration: none;
          }
          
          .logout-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
          }
          
          .logout-btn:active {
            transform: translateY(0);
          }
          
          .logout-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          
          .logout-btn.loading {
            opacity: 0.8;
            cursor: wait;
          }
          
          .icon {
            width: 1rem;
            height: 1rem;
          }
          
          .spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          
          /* Estilos para diferentes variantes */
          .logout-btn.ghost {
            background: transparent;
            color: #6b7280;
            border: 1px solid #d1d5db;
          }
          
          .logout-btn.ghost:hover {
            background: #f3f4f6;
            color: #374151;
          }
          
          .logout-btn.minimal {
            background: transparent;
            color: #6b7280;
            padding: 0.25rem 0.5rem;
            border: none;
          }
          
          .logout-btn.minimal:hover {
            color: #ef4444;
          }
        </style>
        
        <button class="${buttonClass}" ${this.isLoggingOut ? "disabled" : ""}>
          ${
            this.isLoggingOut
              ? '<div class="spinner"></div>'
              : showIcon
                ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>'
                : ""
          }
          <span>${this.isLoggingOut ? "Cerrando sesión..." : buttonText}</span>
        </button>
      `
    }

    private setupEventListeners() {
      console.log("🚪 LogoutButton: Setting up event listeners...")
      const button = this.shadowRoot!.querySelector("button")
      button?.addEventListener("click", this.handleLogout.bind(this))
      console.log("🚪 LogoutButton: Click listener added")
    }

    private async handleLogout() {
      console.log("🚪 LogoutButton: Logout button clicked")

      if (this.isLoggingOut) {
        console.log("🚪 LogoutButton: Already logging out, ignoring click")
        return
      }

      // Confirmar logout si está habilitado
      const confirmLogout = this.getAttribute("confirm") === "true"
      console.log("🚪 LogoutButton: Confirm required:", confirmLogout)

      if (confirmLogout) {
        const confirmed = confirm("¿Estás seguro de que quieres cerrar sesión?")
        console.log("🚪 LogoutButton: User confirmation:", confirmed)
        if (!confirmed) return
      }

      console.log("🚪 LogoutButton: Starting logout process...")
      this.isLoggingOut = true
      this.render() // Re-renderizar con estado de loading

      try {
        // Emitir evento antes del logout
        console.log("🚪 LogoutButton: Emitting beforeLogout event")
        this.dispatchEvent(
          new CustomEvent("beforeLogout", {
            bubbles: true,
            detail: { timestamp: new Date().toISOString() },
          }),
        )

        // Importar dinámicamente el servicio de auth
        console.log("🚪 LogoutButton: Importing authService...")
        const { default: authService } = await import("@/services/authService")

        console.log("🚪 LogoutButton: Calling authService.logout()...")
        await authService.logout()

        // El logout redirige automáticamente, pero por si acaso:
        console.log("🚪 LogoutButton: Emitting logoutComplete event")
        this.dispatchEvent(
          new CustomEvent("logoutComplete", {
            bubbles: true,
            detail: { timestamp: new Date().toISOString() },
          }),
        )
      } catch (error) {
        console.error("❌ LogoutButton: Error during logout:", error)

        // En caso de error, limpiar sesión localmente y redirigir
        console.log("🚪 LogoutButton: Fallback cleanup and redirect...")
        const { default: authService } = await import("@/services/authService")
        authService.cleanupSession()
        authService.redirectToLogin()

        console.log("🚪 LogoutButton: Emitting logoutError event")
        this.dispatchEvent(
          new CustomEvent("logoutError", {
            bubbles: true,
            detail: {
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString(),
            },
          }),
        )
      } finally {
        console.log("🚪 LogoutButton: Logout process completed")
        this.isLoggingOut = false
      }
    }

    // Método público para triggear logout programáticamente
    async triggerLogout() {
      console.log("🚪 LogoutButton: Programmatic logout triggered")
      await this.handleLogout()
    }
  }

  // Registrar el Web Component solo si no está ya registrado
  if (!customElements.get("logout-button")) {
    customElements.define("logout-button", LogoutButton)
    console.log("✅ LogoutButton: Web Component registered successfully")
  } else {
    console.log("ℹ️ LogoutButton: Web Component already registered")
  }
} else {
  console.log("⚠️ LogoutButton: Not in browser environment, skipping registration")
}

export default typeof window !== "undefined" ? customElements.get("logout-button") : null
