import * as React from "react";
import { Navigation } from "@/components/navigation/navigation";
import { NavUser } from "@/components/navigation/nav-user";
import { dataNav } from "@/data/sidebarNavData";
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

  const navigation = dataNav.navigation;
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
        <Navigation navigation={navigation} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
