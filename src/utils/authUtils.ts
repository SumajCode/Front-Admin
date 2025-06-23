/**
 * UTILIDADES DE AUTENTICACIÓN CROSS-DOMAIN
 * Sistema de autenticación que funciona entre diferentes dominios
 * usando query parameters para transferir tokens
 */

// Configuración de URLs y endpoints
const CONFIG = {
  LOGIN_URL: 'https://front-loginv1.vercel.app',
  ADMIN_URL: 'https://front-adminv1.vercel.app',
  API_BASE_URL: 'https://microservice-admin.onrender.com/api',

  ENDPOINTS: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  TOKEN_CONFIG: {
    ACCESS_DURATION: 3600, // 1 hora
    REFRESH_DURATION: 2592000, // 30 días
    STORAGE_KEYS: {
      ACCESS_TOKEN: 'access_token',
      REFRESH_TOKEN: 'refresh_token',
      USER_DATA: 'user_data',
      USER_ROLE: 'user_role',
      AUTH_SOURCE: 'auth_source',
      TIMESTAMP: 'auth_timestamp',
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

export interface AuthResult {
  success: boolean
  user: UserData | null
  tokens: {
    access_token: string | null
    refresh_token: string | null
  }
  source: 'query_params' | 'localStorage' | 'none'
  message: string
}

/**
 * Inicializar autenticación cross-domain
 * Verifica query params primero, luego localStorage
 */
export function initializeCrossDomainAuth(): AuthResult {
  console.log('🔧 AuthUtils: Initializing cross-domain authentication...')

  // 1. Intentar obtener tokens de query parameters (prioridad)
  const queryResult = extractTokensFromQuery()
  if (queryResult.success) {
    console.log('✅ AuthUtils: Authentication successful from query params')
    return queryResult
  }

  // 2. Intentar obtener tokens de localStorage (fallback)
  const storageResult = extractTokensFromStorage()
  if (storageResult.success) {
    console.log('✅ AuthUtils: Authentication successful from localStorage')
    return storageResult
  }

  console.log('❌ AuthUtils: No valid authentication found')
  return {
    success: false,
    user: null,
    tokens: { access_token: null, refresh_token: null },
    source: 'none',
    message: 'No authentication data found',
  }
}

/**
 * Extraer tokens de query parameters
 */
function extractTokensFromQuery(): AuthResult {
  console.log('🔍 AuthUtils: Extracting tokens from query parameters...')

  if (typeof window === 'undefined') {
    console.log('⚠️ AuthUtils: Server environment, skipping query extraction')
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Server environment',
    }
  }

  const urlParams = new URLSearchParams(window.location.search)

  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  const userData = urlParams.get('user_data')
  const userRole = urlParams.get('user_role')
  const authSource = urlParams.get('auth_source')
  const timestamp = urlParams.get('timestamp')

  console.log('🔍 AuthUtils: Query params found:')
  console.log('  - access_token:', !!accessToken)
  console.log('  - refresh_token:', !!refreshToken)
  console.log('  - user_data:', !!userData)
  console.log('  - user_role:', userRole)
  console.log('  - auth_source:', authSource)
  console.log('  - timestamp:', timestamp)

  // Validar que tenemos los datos mínimos necesarios
  if (!accessToken || !refreshToken || !userData || !userRole) {
    console.log('❌ AuthUtils: Missing required query parameters')
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Missing query parameters',
    }
  }

  try {
    // Decodificar datos del usuario
    const user: UserData = JSON.parse(decodeURIComponent(userData))
    console.log('👤 AuthUtils: User data decoded:', user.username, user.email)

    // Validar rol de administrador
    if (userRole !== 'administrador' || user.role !== 'admin') {
      console.log('❌ AuthUtils: Invalid user role:', userRole, user.role)
      return {
        success: false,
        user: null,
        tokens: { access_token: null, refresh_token: null },
        source: 'none',
        message: 'Invalid user role',
      }
    }

    // Guardar en localStorage para futuras sesiones
    console.log('💾 AuthUtils: Saving tokens to localStorage...')
    localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE, userRole)
    localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_SOURCE, authSource || 'query_params')
    localStorage.setItem(
      CONFIG.TOKEN_CONFIG.STORAGE_KEYS.TIMESTAMP,
      timestamp || new Date().toISOString(),
    )

    // Limpiar URL de query parameters sensibles
    console.log('🧹 AuthUtils: Cleaning URL from sensitive parameters...')
    cleanUrlFromTokens()

    return {
      success: true,
      user,
      tokens: { access_token: accessToken, refresh_token: refreshToken },
      source: 'query_params',
      message: 'Authentication successful from query parameters',
    }
  } catch (error) {
    console.error('❌ AuthUtils: Error parsing query parameters:', error)
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Error parsing query data',
    }
  }
}

/**
 * Extraer tokens de localStorage
 */
function extractTokensFromStorage(): AuthResult {
  console.log('🔍 AuthUtils: Extracting tokens from localStorage...')

  if (typeof window === 'undefined') {
    console.log('⚠️ AuthUtils: Server environment, skipping storage extraction')
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Server environment',
    }
  }

  const accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)
  const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
  const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)

  console.log('🔍 AuthUtils: localStorage data found:')
  console.log('  - access_token:', !!accessToken)
  console.log('  - refresh_token:', !!refreshToken)
  console.log('  - user_data:', !!userData)
  console.log('  - user_role:', userRole)

  if (!accessToken || !refreshToken || !userData || !userRole) {
    console.log('❌ AuthUtils: Missing data in localStorage')
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Missing localStorage data',
    }
  }

  try {
    const user: UserData = JSON.parse(userData)
    console.log('👤 AuthUtils: User data from storage:', user.username, user.email)

    // Validar rol
    if (userRole !== 'administrador' || user.role !== 'admin') {
      console.log('❌ AuthUtils: Invalid user role from storage:', userRole, user.role)
      return {
        success: false,
        user: null,
        tokens: { access_token: null, refresh_token: null },
        source: 'none',
        message: 'Invalid stored user role',
      }
    }

    return {
      success: true,
      user,
      tokens: { access_token: accessToken, refresh_token: refreshToken },
      source: 'localStorage',
      message: 'Authentication successful from localStorage',
    }
  } catch (error) {
    console.error('❌ AuthUtils: Error parsing localStorage data:', error)
    return {
      success: false,
      user: null,
      tokens: { access_token: null, refresh_token: null },
      source: 'none',
      message: 'Error parsing stored data',
    }
  }
}

/**
 * Limpiar URL de parámetros sensibles
 */
function cleanUrlFromTokens(): void {
  console.log('🧹 AuthUtils: Cleaning URL from sensitive parameters...')

  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const sensitiveParams = [
    'access_token',
    'refresh_token',
    'user_data',
    'user_role',
    'auth_source',
    'timestamp',
  ]

  let hasChanges = false
  sensitiveParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      hasChanges = true
    }
  })

  if (hasChanges) {
    console.log('🧹 AuthUtils: URL cleaned, updating browser history')
    window.history.replaceState({}, document.title, url.pathname + url.search)
  }
}

/**
 * Validar token con el backend
 */
export async function validateTokenWithBackend(token: string): Promise<boolean> {
  console.log('🌐 AuthUtils: Validating token with backend...')

  if (!token) {
    console.log('❌ AuthUtils: No token provided for validation')
    return false
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.ME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('🌐 AuthUtils: Backend validation response:', response.status)

    if (response.status === 401) {
      console.log('🔄 AuthUtils: Token expired, attempting refresh...')
      return await refreshAccessToken()
    }

    const isValid = response.ok
    console.log('✅ AuthUtils: Token validation result:', isValid)
    return isValid
  } catch (error) {
    console.error('❌ AuthUtils: Error validating token:', error)
    return false
  }
}

/**
 * Renovar token de acceso
 */
export async function refreshAccessToken(): Promise<boolean> {
  console.log('🔄 AuthUtils: Refreshing access token...')

  const refreshToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)

  if (!refreshToken) {
    console.log('❌ AuthUtils: No refresh token available')
    return false
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.REFRESH}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('🔄 AuthUtils: Refresh response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      const newAccessToken = data.data.access_token

      console.log('✅ AuthUtils: New access token received')
      localStorage.setItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, newAccessToken)

      // Emitir evento de token renovado
      window.dispatchEvent(
        new CustomEvent('tokenRefreshed', {
          detail: { newToken: newAccessToken },
        }),
      )

      return true
    }

    console.log('❌ AuthUtils: Refresh token expired')
    return false
  } catch (error) {
    console.error('❌ AuthUtils: Error refreshing token:', error)
    return false
  }
}

/**
 * Realizar fetch autenticado con renovación automática
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  console.log('🌐 AuthUtils: Making authenticated request to:', url)

  let accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)

  if (!accessToken) {
    console.log('❌ AuthUtils: No access token for request')
    throw new Error('No access token available')
  }

  // Primera llamada
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  console.log('🌐 AuthUtils: First request response:', response.status)

  // Si token expiró, renovar y reintentar
  if (response.status === 401) {
    console.log('🔄 AuthUtils: Token expired, refreshing...')
    const refreshSuccess = await refreshAccessToken()

    if (refreshSuccess) {
      console.log('🔄 AuthUtils: Retrying request with new token...')
      accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('🌐 AuthUtils: Retry response:', response.status)
    } else {
      console.log('❌ AuthUtils: Refresh failed, redirecting to login')
      redirectToLogin()
      throw new Error('Authentication failed')
    }
  }

  return response
}

/**
 * Redirigir al login
 */
export function redirectToLogin(): void {
  console.log('🔄 AuthUtils: Redirecting to login...')
  console.log('🔄 AuthUtils: Login URL:', CONFIG.LOGIN_URL)

  // Limpiar datos locales antes de redirigir
  clearAuthData()

  // Redirigir con URL de retorno
  const returnUrl = encodeURIComponent(window.location.href)
  const loginUrl = `${CONFIG.LOGIN_URL}?return_url=${returnUrl}`

  console.log('🔄 AuthUtils: Full login URL:', loginUrl)
  window.location.href = loginUrl
}

/**
 * Logout y redirigir
 */
export async function logoutAndRedirect(): Promise<void> {
  console.log('🚪 AuthUtils: Starting logout process...')

  const accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)

  // Notificar al backend
  if (accessToken) {
    console.log('🌐 AuthUtils: Notifying backend about logout...')
    try {
      await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ AuthUtils: Backend notified')
    } catch (error) {
      console.error('❌ AuthUtils: Error notifying backend:', error)
    }
  }

  // Limpiar datos locales
  clearAuthData()

  // Emitir evento de logout
  window.dispatchEvent(new CustomEvent('userLoggedOut'))

  // Redirigir al login
  console.log('🔄 AuthUtils: Redirecting to login after logout...')
  window.location.href = CONFIG.LOGIN_URL
}

/**
 * Limpiar datos de autenticación
 */
export function clearAuthData(): void {
  console.log('🧹 AuthUtils: Clearing authentication data...')

  const keysToRemove = [
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA,
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE,
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_SOURCE,
    CONFIG.TOKEN_CONFIG.STORAGE_KEYS.TIMESTAMP,
  ]

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key)
    console.log('🧹 AuthUtils: Removed:', key)
  })

  sessionStorage.clear()
  console.log('✅ AuthUtils: Auth data cleared')
}

/**
 * Obtener usuario actual
 */
export function getCurrentUser(): UserData | null {
  console.log('👤 AuthUtils: Getting current user...')

  const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
  if (!userData) {
    console.log('❌ AuthUtils: No user data found')
    return null
  }

  try {
    const user = JSON.parse(userData)
    console.log('👤 AuthUtils: Current user:', user.username, user.email)
    return user
  } catch (error) {
    console.error('❌ AuthUtils: Error parsing user data:', error)
    return null
  }
}

/**
 * Verificar si está autenticado
 */
export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
  const userData = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_DATA)
  const userRole = localStorage.getItem(CONFIG.TOKEN_CONFIG.STORAGE_KEYS.USER_ROLE)

  const authenticated = !!(accessToken && userData && userRole === 'administrador')
  console.log('🔍 AuthUtils: Is authenticated:', authenticated)

  return authenticated
}
