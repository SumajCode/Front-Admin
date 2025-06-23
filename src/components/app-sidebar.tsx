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
import usuarioData from '@/data/usuario.json'

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
  const user = usuarioData.usuario

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
