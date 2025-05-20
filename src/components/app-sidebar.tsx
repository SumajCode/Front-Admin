'use client'

import * as React from 'react'
import {
  BookUser,
  Command,
  Frame,
  LifeBuoy,
  Map,
  Newspaper,
  PieChart,
  Send,
  Users,
} from 'lucide-react'

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

const data = {
  user: {
    name: 'Admin',
    email: 'admin@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Docentes',
      url: '#',
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: 'Gestionar Docentes',
          url: '/admin/docentes/gestion',
        },
        {
          title: 'Historial de Docentes',
          url: '/admin/docentes/historial',
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
          url: '/admin/administradores/gestion',
        },
        {
          title: 'Historial de Administradores',
          url: '/admin/administradores/historial',
        },
      ],
    },
    /*Por si es necesario
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },*/
  ],
  navSecondary: [
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
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export const AppSidebar = React.memo(AppSidebarComponent)
