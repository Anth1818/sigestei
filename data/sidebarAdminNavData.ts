import { Home, FileText, Users, Settings, Folder, ComputerIcon } from "lucide-react";

export const dataAdmin = {
  navigation: [
    {
      name: "Dashboard",
      url: "dashboard",
      icon: Home,
    },
    ,
    // {
    //   name: "Solicitudes",
    //   url: "requests",
    //   icon: FileText,
    // },
    // {
    //   name: "inventario",
    //   url: "inventory",
    //   icon: ComputerIcon,
    // },
    {
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
