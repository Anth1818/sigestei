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

export function Navigation({
  navigation,
}: {
  navigation: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      <SidebarMenu>
        {navigation.map((item) => {
          return (
            <SidebarMenuItem key={item.name} >
              <SidebarMenuButton asChild className={`${pathname === "/" + item.url ? 'bg-blue-200 dark:bg-gray-700 rounded-sm' : ''} hover:bg-blue-200 dark:hover:bg-gray-700`}>
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
