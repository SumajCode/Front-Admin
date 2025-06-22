// Solo registrar el Web Component en el cliente
if (typeof window !== "undefined" && typeof HTMLElement !== "undefined") {
  interface UserData {
    first_name: string
    last_name: string
    email: string
    username?: string
  }

  class UserInfo extends HTMLElement {
    private user: UserData | null = null

    constructor() {
      super()
      this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
      this.loadUserData()
      this.render()
      this.setupEventListeners()
    }

    private async loadUserData() {
      try {
        const { default: authService } = await import("@/services/authService")
        this.user = authService.getCurrentUser()
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    private setupEventListeners() {
      // Actualizar cuando se renueve el token
      window.addEventListener("tokenRefreshed", () => {
        this.loadUserData()
        this.render()
      })
    }

    private render() {
      if (!this.user) {
        this.shadowRoot!.innerHTML = "<div>No hay información de usuario disponible</div>"
        return
      }

      const showAvatar = this.getAttribute("show-avatar") !== "false"
      const showEmail = this.getAttribute("show-email") !== "false"
      const showRole = this.getAttribute("show-role") !== "false"
      const layout = this.getAttribute("layout") || "horizontal" // horizontal | vertical

      this.shadowRoot!.innerHTML = `
        <style>
          .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
          }
          
          .user-info.vertical {
            flex-direction: column;
            text-align: center;
          }
          
          .avatar {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background: linear-gradient(135deg, #00bf7d, #2546f0);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1rem;
          }
          
          .user-details {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
          }
          
          .user-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.875rem;
          }
          
          .user-email {
            color: #6b7280;
            font-size: 0.75rem;
          }
          
          .user-role {
            background: #00bf7d;
            color: white;
            padding: 0.125rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.625rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            width: fit-content;
          }
          
          .vertical .user-role {
            align-self: center;
          }
        </style>
        
        <div class="user-info ${layout}">
          ${
            showAvatar
              ? `
            <div class="avatar">
              ${this.getInitials()}
            </div>
          `
              : ""
          }
          
          <div class="user-details">
            <div class="user-name">
              ${this.user.first_name} ${this.user.last_name}
            </div>
            
            ${
              showEmail
                ? `
              <div class="user-email">
                ${this.user.email}
              </div>
            `
                : ""
            }
            
            ${
              showRole
                ? `
              <div class="user-role">
                Administrador
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
    }

    private getInitials(): string {
      if (!this.user) return "?"

      const firstInitial = this.user.first_name?.charAt(0)?.toUpperCase() || ""
      const lastInitial = this.user.last_name?.charAt(0)?.toUpperCase() || ""

      return firstInitial + lastInitial || this.user.username?.charAt(0)?.toUpperCase() || "?"
    }

    // Método público para actualizar datos
    async refresh() {
      await this.loadUserData()
      this.render()
    }
  }

  // Registrar el Web Component solo si no está ya registrado
  if (!customElements.get("user-info")) {
    customElements.define("user-info", UserInfo)
  }
}

export default typeof window !== "undefined" ? customElements.get("user-info") : null
