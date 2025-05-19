import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

function NavSecondaryComponent({
  items,
  ...props
}: {
  items: Array<{
    title: string
    url: string
    icon: LucideIcon
  }>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                className="hover:bg-[#5928ed]/20 hover:text-white"
              >
                <a href={item.url}>
                  <item.icon className="text-[#00b4c5]" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export const NavSecondary = React.memo(NavSecondaryComponent)
