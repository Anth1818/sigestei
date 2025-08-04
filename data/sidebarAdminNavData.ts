import { Home, FileText, Users, Settings, Folder} from "lucide-react";

export const dataAdmin = {
  // navMain: [
  //   {
  //     title: "Dashboard",
  //     url: "/dashboard",
  //     icon: Home,
  //     isActive: true,
  //   },
  //   {
  //     title: "Reports",
  //     url: "/reports",
  //     icon: FileText,
  //     items: [
  //       { title: "Analytics", url: "/reports/analytics" },
  //       { title: "Performance", url: "/reports/performance" },
  //     ],
  //   },
  //   {
  //     title: "Users",
  //     url: "/users",
  //     icon: Users,
  //   },
  //   {
  //     title: "Settings",
  //     url: "/settings",
  //     icon: Settings,
  //   },
  // ],
  navigation: [
    {
      name: "Dashboard",
      url: "dashboard",
      icon: Home,
    },
    // {
    //   name: "Solicitudes",
    //   url: "requests",
    //   icon: FileText,
    // },
    {
      name: "Usuarios",
      url: "admin/users",
      icon: Users,
    },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
}; 