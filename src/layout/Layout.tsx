'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import * as React from 'react'
import { useAuth } from '@/hooks/useAuth'
import '@/components/auth/AuthGuard'
import '@/types/web-components'

interface LayoutProps {
  children: React.ReactNode
}

function LayoutComponent({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
      </div>
    )
  }

  // Si no está autenticado, el AuthGuard se encargará de la redirección
  if (!isAuthenticated) {
    return React.createElement('auth-guard')
  }

  return (
    <>
      {React.createElement('auth-guard')}
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
      </SidebarProvider>
    </>
  )
}

export default React.memo(LayoutComponent)
