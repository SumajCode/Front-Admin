'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import authService from '@/services/authService'

interface AuthGuardReactProps {
  children: React.ReactNode
}

export function AuthGuardReact({ children }: AuthGuardReactProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [isValidating, setIsValidating] = useState(true)
  const [hasValidRole, setHasValidRole] = useState(false)

  useEffect(() => {
    const validateAuth = async () => {
      if (!isAuthenticated) {
        setIsValidating(false)
        return
      }

      // Validar token con backend
      const isValid = await authService.validateTokenWithBackend()
      if (!isValid) {
        authService.redirectToLogin()
        return
      }

      // Verificar rol de administrador
      const hasRole = authService.validateUserRole('administrador')
      setHasValidRole(hasRole)
      setIsValidating(false)
    }

    validateAuth()
  }, [isAuthenticated])

  // Mostrar loading
  if (isLoading || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    authService.redirectToLogin()
    return null
  }

  // Mostrar mensaje de no autorizado si no tiene el rol correcto
  if (!hasValidRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <h1 className="text-4xl font-bold mb-4">🚫 Acceso No Autorizado</h1>
        <p className="text-xl mb-8 opacity-90">
          No tienes permisos para acceder a esta aplicación.
        </p>
        <button
          onClick={() => authService.redirectToLogin()}
          className="bg-white/20 border-2 border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/30 hover:border-white/50 transition-all duration-300"
        >
          Volver al Login
        </button>
      </div>
    )
  }

  return <>{children}</>
}
