"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {usePathname} from "next/navigation"
import { useUserStore } from "@/hooks/useUserStore";

export function Navigation({
  navigation,
}: {
  navigation: {
    role_access: number[]
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  // console.log(user)

  // Filtra los enlaces según el role_id del usuario
  const filteredNavigation = user
    ? navigation.filter((item) => item.role_access.includes(user.role_id))
    : [];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      <SidebarMenu>
        {filteredNavigation.map((item) => {
          return (
            <SidebarMenuItem key={item.name} >
              <SidebarMenuButton asChild className={`${ pathname === item.url ? 'bg-blue-200 dark:bg-gray-700 theme-blue:bg-blue-700 theme-violet:bg-purple-700 rounded-sm theme-orange:bg-orange-700' : ''} hover:bg-blue-200 dark:hover:bg-gray-700 theme-blue:hover:bg-blue-700 theme-violet:hover:bg-purple-700 theme-orange:hover:bg-orange-700`}>
                <Link href={item.url} >
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
