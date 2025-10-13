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

// export const getRoleColor = (roleName: string): string => {
//   switch (roleName) {
//     case "admin":
//       return "text-white bg-gradient-to-r from-red-500 to-red-700 px-2 py-1 rounded-full text-xs font-semibold shadow";
//     case "manager":
//       return "text-white bg-gradient-to-r from-purple-500 to-purple-700 px-2 py-1 rounded-full text-xs font-semibold shadow";
//     case "technician":
//       return "text-white bg-gradient-to-r from-blue-500 to-blue-700 px-2 py-1 rounded-full text-xs font-semibold shadow";
//     case "user":
//       return "text-gray-800 bg-gradient-to-r from-gray-200 to-gray-400 px-2 py-1 rounded-full text-xs font-semibold";
//     default:
//       return "text-gray-800 bg-gradient-to-r from-gray-200 to-gray-400 px-2 py-1 rounded-full text-xs font-semibold";
//   }
// };

export const getStatusColor = (isActive: boolean): string => {
  return isActive
    ? "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold"
    : "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold";
};

