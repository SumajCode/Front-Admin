'use client'

import { useState, useEffect, useCallback } from 'react'
import authService, { type AuthData, type UserData } from '@/services/authService'

interface UseAuthReturn {
  isAuthenticated: boolean
  user: UserData | null
  token: string | null
  role: string | null
  isLoading: boolean
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  validateToken: () => Promise<boolean>
}

export function useAuth(): UseAuthReturn {
  console.log('🪝 useAuth: Hook initialized')

  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Handlers con tipos correctos
  const handleTokenRefreshed = useCallback((_event: Event) => {
    console.log('🪝 useAuth: Token refreshed event received')
    const customEvent = _event as CustomEvent<{ newToken: string }>
    console.log('🪝 useAuth: New token:', customEvent.detail?.newToken?.substring(0, 20) + '...')

    const newAuthData = authService.checkAuthentication()
    console.log('🪝 useAuth: Updated auth data:', newAuthData.isAuthenticated)
    setAuthData(newAuthData)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = useCallback((_event: Event) => {
    console.log('🪝 useAuth: Logout event received')
    setAuthData({
      isAuthenticated: false,
      user: null,
      token: null,
      role: null,
    })
  }, [])

  useEffect(() => {
    console.log('🪝 useAuth: Effect running - checking authentication')

    // Verificar autenticación inicial
    const checkAuth = async () => {
      console.log('🪝 useAuth: Starting authentication check...')
      setIsLoading(true)

      const initialAuthData = authService.checkAuthentication()
      console.log('🪝 useAuth: Initial auth data:', initialAuthData.isAuthenticated)

      if (initialAuthData.isAuthenticated) {
        console.log('🪝 useAuth: User appears authenticated, validating with backend...')
        // Validar token con backend
        const isValid = await authService.validateTokenWithBackend()
        console.log('🪝 useAuth: Backend validation result:', isValid)

        if (isValid) {
          console.log('✅ useAuth: Authentication confirmed')
          setAuthData(initialAuthData)
        } else {
          console.log('❌ useAuth: Backend validation failed, clearing auth data')
          // Token inválido, limpiar datos
          setAuthData({
            isAuthenticated: false,
            user: null,
            token: null,
            role: null,
          })
        }
      } else {
        console.log('❌ useAuth: User not authenticated')
        setAuthData(initialAuthData)
      }

      console.log('🪝 useAuth: Authentication check completed')
      setIsLoading(false)
    }

    checkAuth()

    // Escuchar eventos de autenticación
    console.log('🪝 useAuth: Setting up event listeners')
    window.addEventListener('tokenRefreshed', handleTokenRefreshed)
    window.addEventListener('userLoggedOut', handleLogout)

    return () => {
      console.log('🪝 useAuth: Cleaning up event listeners')
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed)
      window.removeEventListener('userLoggedOut', handleLogout)
    }
  }, [handleTokenRefreshed, handleLogout])

  const logout = useCallback(async () => {
    console.log('🪝 useAuth: Logout function called')
    await authService.logout()
  }, [])

  const refreshToken = useCallback(async () => {
    console.log('🪝 useAuth: Refresh token function called')
    const success = await authService.refreshToken()
    console.log('🪝 useAuth: Refresh token result:', success)

    if (success) {
      const newAuthData = authService.checkAuthentication()
      console.log('🪝 useAuth: Updated auth data after refresh:', newAuthData.isAuthenticated)
      setAuthData(newAuthData)
    }
    return success
  }, [])

  const validateToken = useCallback(async () => {
    console.log('🪝 useAuth: Validate token function called')
    const result = await authService.validateTokenWithBackend()
    console.log('🪝 useAuth: Token validation result:', result)
    return result
  }, [])

  console.log(
    '🪝 useAuth: Current state - authenticated:',
    authData.isAuthenticated,
    'loading:',
    isLoading,
  )

  return {
    isAuthenticated: authData.isAuthenticated,
    user: authData.user,
    token: authData.token,
    role: authData.role,
    isLoading,
    logout,
    refreshToken,
    validateToken,
  }
}
