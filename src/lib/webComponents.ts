// Importar todos los Web Components
import '@/components/auth/AuthGuard'
import '@/components/auth/LogoutButton'
import '@/components/auth/UserInfo'

// Importar tipos
import '@/types/web-components'

// Función para verificar si los Web Components están disponibles
export function areWebComponentsReady(): boolean {
  return !!(
    customElements.get('auth-guard') &&
    customElements.get('logout-button') &&
    customElements.get('user-info')
  )
}

// Función para esperar a que los Web Components estén listos
export function waitForWebComponents(): Promise<void> {
  return new Promise((resolve) => {
    if (areWebComponentsReady()) {
      resolve()
      return
    }

    const checkInterval = setInterval(() => {
      if (areWebComponentsReady()) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 100)

    // Timeout después de 10 segundos
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve()
    }, 10000)
  })
}

// Inicializar Web Components cuando el DOM esté listo
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Web Components de autenticación cargados')
  })
}
