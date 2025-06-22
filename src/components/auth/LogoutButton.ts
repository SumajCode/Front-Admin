import authService from "@/services/authService"

class LogoutButton extends HTMLElement {
  private isLoggingOut = false

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  private render() {
    const buttonText = this.getAttribute("text") || "Cerrar Sesión"
    const buttonClass = this.getAttribute("class") || "logout-btn"
    const showIcon = this.getAttribute("show-icon") !== "false"

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
    const button = this.shadowRoot!.querySelector("button")
    button?.addEventListener("click", this.handleLogout.bind(this))
  }

  private async handleLogout() {
    if (this.isLoggingOut) return

    // Confirmar logout si está habilitado
    const confirmLogout = this.getAttribute("confirm") === "true"

    if (confirmLogout) {
      const confirmed = confirm("¿Estás seguro de que quieres cerrar sesión?")
      if (!confirmed) return
    }

    this.isLoggingOut = true
    this.render() // Re-renderizar con estado de loading

    try {
      // Emitir evento antes del logout
      this.dispatchEvent(
        new CustomEvent("beforeLogout", {
          bubbles: true,
          detail: { timestamp: new Date().toISOString() },
        }),
      )

      await authService.logout()

      // El logout redirige automáticamente, pero por si acaso:
      this.dispatchEvent(
        new CustomEvent("logoutComplete", {
          bubbles: true,
          detail: { timestamp: new Date().toISOString() },
        }),
      )
    } catch (error) {
      console.error("Error during logout:", error)

      // En caso de error, limpiar sesión localmente y redirigir
      authService.cleanupSession()
      authService.redirectToLogin()

      this.dispatchEvent(
        new CustomEvent("logoutError", {
          bubbles: true,
          detail: { 
            error: (error && typeof error === "object" && "message" in error) ? (error as { message: string }).message : String(error),
            timestamp: new Date().toISOString()
          },
        }),
      )
    } finally {
      this.isLoggingOut = false
    }
  }

  // Método público para triggear logout programáticamente
  async triggerLogout() {
    await this.handleLogout()
  }
}

// Registrar el Web Component
customElements.define("logout-button", LogoutButton)

export default LogoutButton
