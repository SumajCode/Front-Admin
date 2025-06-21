"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AuthContextType, AdminData } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      const userData = localStorage.getItem("admin_data")

      if (token && userData) {
        const parsedUser = JSON.parse(userData) as AdminData
        setUser(parsedUser)
        console.log("✅ Usuario autenticado encontrado:", parsedUser)
      } else {
        console.log("❌ No hay sesión activa")
        setUser(null)
      }
    } catch (error) {
      console.error("❌ Error verificando autenticación:", error)
      setUser(null)
      // Limpiar datos corruptos
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("admin_data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function (será sobrescrita por el login remoto)
  const login = useCallback(async (email: string, password: string, role: string): Promise<boolean> => {
    console.log("🔄 Login local llamado, redirigiendo al login remoto...")
    // Redirigir al frontend de login
    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL || "https://front-loginv1-kevinurena82-6772s-projects.vercel.app"}?redirect=${encodeURIComponent(window.location.origin)}`
    return false
  }, [])

  // Logout function
  const logout = useCallback(() => {
    console.log("🚪 Cerrando sesión...")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("admin_data")
    setUser(null)
    setError(null)

    // Redirigir al login
    window.location.href =
      process.env.NEXT_PUBLIC_LOGIN_URL || "https://front-loginv1-kevinurena82-6772s-projects.vercel.app"
  }, [])

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Escuchar cambios en localStorage (para sincronizar entre tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_data" || e.key === "access_token") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [checkAuth])

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
