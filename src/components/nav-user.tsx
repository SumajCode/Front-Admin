'use client'

import * as React from 'react'
import { BadgeCheck, Bell, ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { LogoutButtonReact } from '@/components/auth/LogoutButtonReact'

function NavUserComponent({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const handleBeforeLogout = () => {
    console.log('Iniciando proceso de logout...')
  }

  const handleLogoutComplete = () => {
    console.log('Logout completado exitosamente')
  }

  const handleLogoutError = (error: string) => {
    console.error('Error durante logout:', error)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[#00bf7d] data-[state=open]:text-white"
            >
              <Avatar className="h-8 w-8 rounded-lg border-2 border-[#00b4c5]">
                <AvatarImage
                  src={
                    user.avatar && user.avatar.trim() !== ''
                      ? user.avatar
                      : '/placeholder.svg?height=32&width=32'
                  }
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg?height=32&width=32'
                  }}
                />
                <AvatarFallback className="rounded-lg bg-[#2546f0] text-white">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
            className="min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.avatar && user.avatar.trim() !== ''
                        ? user.avatar
                        : '/placeholder.svg?height=32&width=32'
                    }
                    alt={user.name}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg?height=32&width=32'
                    }}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="p-1">
              {/* <LogoutButtonReact
                text="Cerrar Sesión"
                className="logout-btn minimal"
                showIcon={true}
                confirm={true}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onBeforeLogout={handleBeforeLogout}
                onLogoutComplete={handleLogoutComplete}
                onLogoutError={handleLogoutError}
              /> */}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export const NavUser = React.memo(NavUserComponent)
