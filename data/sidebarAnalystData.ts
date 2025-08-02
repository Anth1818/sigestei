import { Home, FileText, Users, Settings, Folder} from "lucide-react";

export const dataSidebarAnalyst = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Analytics", url: "/reports/analytics" },
        { title: "Performance", url: "/reports/performance" },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  navigation: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Reportes",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      name: "Usuarios",
      url: "/admin/users",
      icon: Users,
    },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
}; 