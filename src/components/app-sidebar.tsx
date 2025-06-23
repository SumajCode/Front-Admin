'use client'

import * as React from 'react'
import { BookUser, Command, LifeBuoy, Newspaper, Send, Users } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import authService from '@/services/authService'

const navMainData = [
  {
    title: 'Docentes',
    url: '#',
    icon: BookUser,
    isActive: true,
    items: [
      {
        title: 'Gestionar Docentes',
        url: '/docentes/gestion',
      },
      {
        title: 'Historial de Docentes',
        url: '/docentes/historial',
      },
    ],
  },
  {
    title: 'Administradores',
    url: '#',
    icon: Users,
    items: [
      {
        title: 'Gestionar Administradores',
        url: '/administradores/gestion',
      },
      {
        title: 'Historial de Administradores',
        url: '/administradores/historial',
      },
    ],
  },
]

const navSecondaryData = [
  {
    title: 'Noticias y Anuncios',
    url: '/noticias',
    icon: Newspaper,
  },
  {
    title: 'Support',
    url: '#',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send,
  },
]

function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Obtener datos del usuario actual desde el servicio de autenticación
  const currentUser = authService.getCurrentUser()

  // Mapear datos del usuario para el componente NavUser
  const user = currentUser
    ? {
        name: `${currentUser.first_name} ${currentUser.last_name}`,
        email: currentUser.email,
        avatar: '/placeholder.svg?height=32&width=32',
      }
    : {
        name: 'Usuario',
        email: 'usuario@admin.com',
        avatar: '/placeholder.svg?height=32&width=32',
      }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-[#2546f0] text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SumajCode</span>
                  <span className="truncate text-xs text-muted">Generacion de Software</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export const AppSidebar = React.memo(AppSidebarComponent)
