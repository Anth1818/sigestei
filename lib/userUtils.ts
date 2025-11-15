
export const getStatusColor = (isActive: boolean): string => {
  return isActive
    ? "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-green-900 theme-blue:bg-green-900/80 theme-blue:text-green-100 theme-violet:bg-green-900/80 theme-violet:text-green-100"
    : "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-red-900 theme-blue:bg-red-900/80 theme-blue:text-red-100 theme-violet:bg-red-900/80 theme-violet:text-red-100";
};



