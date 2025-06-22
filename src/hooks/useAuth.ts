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
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Handlers con tipos correctos
  const handleTokenRefreshed = useCallback((_event: Event) => {
    const customEvent = _event as CustomEvent<{ newToken: string }>
    console.log('Token refreshed:', customEvent.detail?.newToken)
    const newAuthData = authService.checkAuthentication()
    setAuthData(newAuthData)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = useCallback((_event: Event) => {
    setAuthData({
      isAuthenticated: false,
      user: null,
      token: null,
      role: null,
    })
  }, [])

  useEffect(() => {
    // Verificar autenticación inicial
    const checkAuth = async () => {
      setIsLoading(true)

      const initialAuthData = authService.checkAuthentication()

      if (initialAuthData.isAuthenticated) {
        // Validar token con backend
        const isValid = await authService.validateTokenWithBackend()

        if (isValid) {
          setAuthData(initialAuthData)
        } else {
          // Token inválido, limpiar datos
          setAuthData({
            isAuthenticated: false,
            user: null,
            token: null,
            role: null,
          })
        }
      } else {
        setAuthData(initialAuthData)
      }

      setIsLoading(false)
    }

    checkAuth()

    // Escuchar eventos de autenticación
    window.addEventListener('tokenRefreshed', handleTokenRefreshed)
    window.addEventListener('userLoggedOut', handleLogout)

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed)
      window.removeEventListener('userLoggedOut', handleLogout)
    }
  }, [handleTokenRefreshed, handleLogout])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  const refreshToken = useCallback(async () => {
    const success = await authService.refreshToken()
    if (success) {
      const newAuthData = authService.checkAuthentication()
      setAuthData(newAuthData)
    }
    return success
  }, [])

  const validateToken = useCallback(async () => {
    return await authService.validateTokenWithBackend()
  }, [])

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
