// Función para cargar Web Components de forma segura
export async function loadWebComponents() {
  if (typeof window === 'undefined') {
    return // No cargar en el servidor
  }

  try {
    // Importar dinámicamente los Web Components
    await Promise.all([
      import('@/components/auth/AuthGuard'),
      import('@/components/auth/LogoutButton'),
      import('@/components/auth/UserInfo'),
    ])

    console.log('Web Components de autenticación cargados')
  } catch (error) {
    console.error('Error cargando Web Components:', error)
  }
}

// Función para verificar si los Web Components están disponibles
export function areWebComponentsReady(): boolean {
  if (typeof window === 'undefined') return false

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

// Cargar automáticamente cuando el DOM esté listo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebComponents)
  } else {
    loadWebComponents()
  }
}
