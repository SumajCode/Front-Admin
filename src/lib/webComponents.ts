// Función para cargar Web Components de forma segura
export async function loadWebComponents() {
  console.log("🔧 WebComponents: Starting to load Web Components...")

  if (typeof window === "undefined") {
    console.log("⚠️ WebComponents: Server environment detected, skipping load")
    return // No cargar en el servidor
  }

  console.log("🔧 WebComponents: Client environment confirmed, proceeding with load")

  try {
    console.log("🔧 WebComponents: Importing Web Component modules...")

    // Importar dinámicamente los Web Components
    const imports = await Promise.all([
      import("@/components/auth/AuthGuard").then(() => console.log("✅ WebComponents: AuthGuard imported")),
      import("@/components/auth/LogoutButton").then(() => console.log("✅ WebComponents: LogoutButton imported")),
      import("@/components/auth/UserInfo").then(() => console.log("✅ WebComponents: UserInfo imported")),
    ])

    console.log("✅ WebComponents: All Web Components loaded successfully")
  } catch (error) {
    console.error("❌ WebComponents: Error loading Web Components:", error)
    throw error
  }
}

// Función para verificar si los Web Components están disponibles
export function areWebComponentsReady(): boolean {
  console.log("🔍 WebComponents: Checking if Web Components are ready...")

  if (typeof window === "undefined") {
    console.log("⚠️ WebComponents: Server environment, components not ready")
    return false
  }

  const authGuardReady = !!customElements.get("auth-guard")
  const logoutButtonReady = !!customElements.get("logout-button")
  const userInfoReady = !!customElements.get("user-info")

  console.log("🔍 WebComponents: AuthGuard ready:", authGuardReady)
  console.log("🔍 WebComponents: LogoutButton ready:", logoutButtonReady)
  console.log("🔍 WebComponents: UserInfo ready:", userInfoReady)

  const allReady = authGuardReady && logoutButtonReady && userInfoReady
  console.log("🔍 WebComponents: All components ready:", allReady)

  return allReady
}

// Función para esperar a que los Web Components estén listos
export function waitForWebComponents(): Promise<void> {
  console.log("⏳ WebComponents: Waiting for Web Components to be ready...")

  return new Promise((resolve) => {
    if (areWebComponentsReady()) {
      console.log("✅ WebComponents: Components already ready")
      resolve()
      return
    }

    console.log("⏳ WebComponents: Starting polling for component readiness...")
    let attempts = 0
    const maxAttempts = 100 // 10 segundos con intervalos de 100ms

    const checkInterval = setInterval(() => {
      attempts++
      console.log(`⏳ WebComponents: Check attempt ${attempts}/${maxAttempts}`)

      if (areWebComponentsReady()) {
        console.log("✅ WebComponents: Components ready after", attempts, "attempts")
        clearInterval(checkInterval)
        resolve()
      } else if (attempts >= maxAttempts) {
        console.log("⚠️ WebComponents: Timeout waiting for components after", attempts, "attempts")
        clearInterval(checkInterval)
        resolve() // Resolver de todos modos para no bloquear la aplicación
      }
    }, 100)
  })
}

// Cargar automáticamente cuando el DOM esté listo
if (typeof window !== "undefined") {
  console.log("🔧 WebComponents: Setting up auto-load...")

  if (document.readyState === "loading") {
    console.log("🔧 WebComponents: DOM still loading, waiting for DOMContentLoaded")
    document.addEventListener("DOMContentLoaded", () => {
      console.log("🔧 WebComponents: DOMContentLoaded fired, loading components")
      loadWebComponents()
    })
  } else {
    console.log("🔧 WebComponents: DOM already loaded, loading components immediately")
    loadWebComponents()
  }
} else {
  console.log("⚠️ WebComponents: Server environment, skipping auto-load setup")
}
