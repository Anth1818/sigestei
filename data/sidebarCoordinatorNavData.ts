import { Home, FileText, ComputerIcon} from "lucide-react";

export const dataCoordinator = {
  navigation: [
    {
      name: "Dashboard",
      url: "dashboard",
      icon: Home,
    },
    {
      name: "Solicitudes",
      url: "viewRequests",
      icon: FileText,
    },
    {
      name: "inventario",
      url: "viewInventory",
      icon: ComputerIcon,
    },
    // {
    //   name: "Usuarios",
    //   url: "viewUsers",
    //   icon: Users,
    // },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
}; 