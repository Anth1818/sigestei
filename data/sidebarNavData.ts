import { Home, FileText, Users, ComputerIcon } from "lucide-react";

export const dataNav = {
  navigation: [
    {
      role_access: [1, 2],
      name: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      role_access: [1, 2, 3, 4],
      name: "Solicitudes",
      url: "/viewRequests",
      icon: FileText,
    },
    {
      role_access: [1, 2, 3],
      name: "Inventario",
      url: "/viewInventory",
      icon: ComputerIcon,
    },
    { role_access: [1], name: "Usuarios", url: "/viewUsers", icon: Users }
  ],
};
