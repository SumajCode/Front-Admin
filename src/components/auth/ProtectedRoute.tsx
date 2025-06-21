"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "docente" | "estudiante"
}

export function ProtectedRoute({ children, requiredRole = "admin" }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("🔒 Usuario no autenticado, redirigiendo al login...")
      const loginUrl =
        process.env.NEXT_PUBLIC_LOGIN_URL || "https://front-loginv1-kevinurena82-6772s-projects.vercel.app"
      const redirectUrl = `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`
      window.location.href = redirectUrl
    }
  }, [loading, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bf7d] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Redirigiendo al login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Rol requerido: <strong>{requiredRole}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Tu rol: <strong>{user?.role}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
