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
    name: string
    url: string
    icon: LucideIcon
    role_access: number[]
  }[]
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  console.log(user)

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
              <SidebarMenuButton asChild className={`${ pathname === item.url ? 'bg-blue-200 dark:bg-gray-700 rounded-sm' : ''} hover:bg-blue-200 dark:hover:bg-gray-700`}>
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
