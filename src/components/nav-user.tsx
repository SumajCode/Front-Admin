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
  console.log('🟡 [NavUser] Rendering with user:', user)

  const { isMobile } = useSidebar()
  console.log('📱 [NavUser] isMobile:', isMobile)

  const avatarSrc = user.avatar && user.avatar.trim() !== '' ? user.avatar : '/placeholder.svg'
  console.log('🖼️ [NavUser] avatarSrc:', avatarSrc)

  const handleBeforeLogout = () => {
    console.log('🚪 [NavUser] Iniciando proceso de logout...')
  }

  const handleLogoutComplete = () => {
    console.log('✅ [NavUser] Logout completado exitosamente')
  }

  const handleLogoutError = (error: string) => {
    console.error('❌ [NavUser] Error durante logout:', error)
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
              console.log('🔽 [NavUser] Rendering sidebar menu button')
              <Avatar className="h-8 w-8 rounded-lg border-2 border-[#00b4c5]">
                <AvatarImage
                  src={avatarSrc}
                  alt={user.name}
                  onError={(e) => {
                    const fallback = '/placeholder.svg'
                    console.warn('⚠️ [AvatarImage] Error cargando imagen:', e.currentTarget.src)
                    if (!e.currentTarget.src.includes(fallback)) {
                      e.currentTarget.src = fallback
                    }
                  }}
                />
                <AvatarFallback className="rounded-lg bg-[#2546f0] text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
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
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatarSrc}
                    alt={user.name}
                    onError={(e) => {
                      const fallback = '/placeholder.svg'
                      console.warn('⚠️ [Dropdown AvatarImage] Error cargando imagen:', e.currentTarget.src)
                      if (!e.currentTarget.src.includes(fallback)) {
                        e.currentTarget.src = fallback
                      }
                    }}
                  />
                  <AvatarFallback className="rounded-lg bg-[#2546f0] text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
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
              <LogoutButtonReact
                text="Cerrar Sesión"
                className="logout-btn minimal"
                showIcon={true}
                confirm={true}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onBeforeLogout={handleBeforeLogout}
                onLogoutComplete={handleLogoutComplete}
                onLogoutError={handleLogoutError}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export const NavUser = React.memo(NavUserComponent)
