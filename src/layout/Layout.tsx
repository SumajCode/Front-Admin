'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import * as React from 'react'
import { useEffect, useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

function LayoutComponent({ children }: LayoutProps) {
  console.log('🏗️ Layout: Component rendering...')

  const [webComponentsLoaded, setWebComponentsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🏗️ Layout: Effect running - loading Web Components...')

    // Cargar Web Components de forma asíncrona
    const loadComponents = async () => {
      try {
        console.log('🏗️ Layout: Importing webComponents module...')
        const { loadWebComponents } = await import('@/lib/webComponents')

        console.log('🏗️ Layout: Calling loadWebComponents...')
        await loadWebComponents()

        console.log('✅ Layout: Web Components loaded successfully')
        setWebComponentsLoaded(true)
      } catch (error) {
        console.error('❌ Layout: Error loading web components:', error)
        console.log('⚠️ Layout: Continuing without Web Components')
        setWebComponentsLoaded(true) // Continuar sin Web Components
      }
    }

    loadComponents()
  }, [])

  useEffect(() => {
    console.log('🏗️ Layout: Setting up authentication listeners...')

    // Escuchar evento de autenticación exitosa
    const handleUserAuthenticated = (event: CustomEvent) => {
      console.log('✅ Layout: User authenticated event received:', event.detail)
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    // Escuchar evento de logout
    const handleUserLoggedOut = () => {
      console.log('🚪 Layout: User logged out event received')
      setIsAuthenticated(false)
      setIsLoading(false)
    }

    // Agregar listeners
    window.addEventListener('user-authenticated', handleUserAuthenticated as EventListener)
    window.addEventListener('userLoggedOut', handleUserLoggedOut)

    // Verificar autenticación inicial después de cargar componentes
    if (webComponentsLoaded) {
      console.log('🏗️ Layout: Checking initial authentication state...')

      // Dar tiempo para que AuthGuard se ejecute
      setTimeout(async () => {
        try {
          const { isAuthenticated: checkAuth } = await import('@/utils/authUtils')
          const authenticated = checkAuth()
          console.log('🏗️ Layout: Initial auth check result:', authenticated)

          if (authenticated) {
            setIsAuthenticated(true)
          }
          setIsLoading(false)
        } catch (error) {
          console.error('❌ Layout: Error checking initial auth:', error)
          setIsLoading(false)
        }
      }, 1000)
    }

    // Cleanup
    return () => {
      window.removeEventListener('user-authenticated', handleUserAuthenticated as EventListener)
      window.removeEventListener('userLoggedOut', handleUserLoggedOut)
    }
  }, [webComponentsLoaded])

  console.log(
    '🏗️ Layout: Current state - loading:',
    isLoading,
    'authenticated:',
    isAuthenticated,
    'components loaded:',
    webComponentsLoaded,
  )

  // Mostrar loading mientras se cargan los componentes o se verifica la autenticación
  if (isLoading || !webComponentsLoaded) {
    console.log('⏳ Layout: Showing loading state')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el AuthGuard
  if (!isAuthenticated) {
    console.log('🏗️ Layout: User not authenticated, showing AuthGuard')
    return React.createElement('auth-guard')
  }

  console.log('🏗️ Layout: User authenticated, rendering main layout')
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
