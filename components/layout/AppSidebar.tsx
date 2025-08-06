import * as React from "react";
import { Navigation } from "@/components/navigation/navigation";
import { NavUser } from "@/components/navigation/nav-user";
// import { dataAdmin} from "@/data/sidebarAdminNavData";
import { dataCoordinator } from "@/data/sidebarCoordinatorNavData";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h2
          className={`text-xl font-bold text-center text-gray-800 dark:text-white pt-2 ${open ? "text-[30px]" : "text-[8px]"}`}
        >
          {open ? "SIGESTEI" : "S I G E S T E I"}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <Navigation navigation={dataCoordinator.navigation} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <div className="flex justify-center">
          <span className="text-xs">
            {open ? `Ultima conexión: 27 de junio de 2025` : ""}
          </span>
        </div>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <NavUser user={dataCoordinator.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
