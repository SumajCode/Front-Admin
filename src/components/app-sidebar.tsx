'use client'

import * as React from 'react'
import { BookUser, Command, Users, CircleUser } from 'lucide-react'
import { NavUser } from '@/components/nav-user'
import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

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
      /*{
        title: 'Historial de Docentes',
        url: '/docentes/historial',
      },*/
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
      /*{
        title: 'Historial de Administradores',
        url: '/administradores/historial',
      },*/
    ],
  },
]

/*const navSecondaryData = [
  {
    title: 'Noticias y Anuncios',
    url: '/noticias',
    icon: Newspaper,
  },/*
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
]*/

function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; email: string; avatar: string }>({
    name: '',
    email: '',
    avatar: '/placeholder.svg?height=32&width=32',
  })

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem('user_data')
      if (userDataString) {
        try {
          const parsed = JSON.parse(userDataString)
          const fullName = `${parsed.first_name} ${parsed.last_name}`
          setUser({
            name: fullName,
            email: parsed.email,
            avatar: '', // Si tienes una URL, puedes usar parsed.avatar o similar
          })
        } catch (err) {
          console.error('Error parsing user_data:', err)
        }
      }
    }
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
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
        {/*<NavSecondary items={navSecondaryData} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export const AppSidebar = React.memo(AppSidebarComponent)
