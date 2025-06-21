"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { handleAuthRedirect } from "@/utils/authRedirect"

export function AuthRedirectHandler() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Manejar redirección de autenticación
    handleAuthRedirect()

    // Verificar autenticación después de manejar la redirección
    checkAuth()
  }, [checkAuth])

  return null
}
