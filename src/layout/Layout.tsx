'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/toaster'
import {
  initializeCrossDomainAuth,
  isAuthenticated as checkAuth,
  redirectToLogin,
} from '@/utils/authUtils'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🏗️ Layout: Initializing authentication...')

    const initializeAuth = async () => {
      try {
        // Procesar tokens de query parameters o verificar localStorage
        console.log('🔐 Layout: Initializing cross-domain authentication...')
        const authResult = initializeCrossDomainAuth()
        console.log('🔐 Layout: Auth result:', authResult)

        let authenticated = false

        if (authResult.success) {
          console.log('✅ Layout: Authentication successful from query params or localStorage')
          authenticated = true
        } else {
          // Fallback: verificar localStorage
          console.log('🔍 Layout: Checking stored authentication...')
          authenticated = checkAuth()
          console.log('🏗️ Layout: Initial auth check result:', authenticated)
        }

        if (authenticated) {
          setIsAuthenticated(true)
        } else {
          console.log('❌ Layout: No authentication found, redirecting to login')
          redirectToLogin()
          return
        }
      } catch (error) {
        console.error('❌ Layout: Error during authentication:', error)
        redirectToLogin()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  console.log('🏗️ Layout: Current state - loading:', isLoading, 'authenticated:', isAuthenticated)

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    console.log('⏳ Layout: Showing loading state')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
      </div>
    )
  }

  // Si no está autenticado, mostrar mensaje de redirección
  if (!isAuthenticated) {
    console.log('🔄 Layout: Showing redirect message')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bf7d]"></div>
          <p className="text-sm text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  console.log('🏗️ Layout: User authenticated, rendering main layout')
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
