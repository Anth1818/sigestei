export const parseRoleName = (roleName: string) => {
  switch (roleName) {
    case "admin":
      return "Administrador";
    case "manager":
      return "Coordinador";
    case "technician":
      return "Técnico";
    case "user":
      return "Usuario";
    default:
      return roleName;
  }
};

export const getStatusColor = (isActive: boolean): string => {
  return isActive
    ? "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-green-900"
    : "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-red-900";
};


