import { Home, FileText, Users, Folder, ComputerIcon } from "lucide-react";


export const dataNav = {
  navigation: [
    {
      role_access: [1, 2,],
      name: "Dashboard",
      url: "dashboard",
      icon: Home,
    },
    ,
    {
      role_access: [1, 2, 3, 4],
      name: "Solicitudes",
      url: "viewRequests",
      icon: FileText,
    },
    {
      role_access: [1, 2, 3],
      name: "Inventario",
      url: "viewInventory",
      icon: ComputerIcon,
    },
    {
      role_access: [1, 2,],
      name:"Reportes",
      url:"reports",
      icon: Folder
    },
    {role_access: [1],
      name: "Usuarios",
      url: "viewUsers",
      icon: Users,
    },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
};
