"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import * as React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: React.ReactNode
}

function LayoutComponent({ children }: LayoutProps) {
  console.log("🏗️ Layout: Component rendering...")

  const { isAuthenticated, isLoading } = useAuth()
  const [webComponentsLoaded, setWebComponentsLoaded] = useState(false)

  console.log("🏗️ Layout: Auth state - authenticated:", isAuthenticated, "loading:", isLoading)

  useEffect(() => {
    console.log("🏗️ Layout: Effect running - loading Web Components...")

    // Cargar Web Components de forma asíncrona
    const loadComponents = async () => {
      try {
        console.log("🏗️ Layout: Importing webComponents module...")
        const { loadWebComponents } = await import("@/lib/webComponents")

        console.log("🏗️ Layout: Calling loadWebComponents...")
        await loadWebComponents()

        console.log("✅ Layout: Web Components loaded successfully")
        setWebComponentsLoaded(true)
      } catch (error) {
        console.error("❌ Layout: Error loading web components:", error)
        console.log("⚠️ Layout: Continuing without Web Components")
        setWebComponentsLoaded(true) // Continuar sin Web Components
      }
    }

    loadComponents()
  }, [])

  // Mostrar loading mientras se verifica la autenticación o se cargan los componentes
  if (isLoading || !webComponentsLoaded) {
    console.log(
      "⏳ Layout: Showing loading state - auth loading:",
      isLoading,
      "components loaded:",
      webComponentsLoaded,
    )
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el AuthGuard
  if (!isAuthenticated) {
    console.log("🏗️ Layout: User not authenticated, showing AuthGuard")
    return React.createElement("auth-guard")
  }

  console.log("🏗️ Layout: User authenticated, rendering main layout")
  return (
    <>
      {React.createElement("auth-guard")}
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
