
export const getStatusColor = (isActive: boolean): string => {
  return isActive
    ? "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-green-900"
    : "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold dark:text-white dark:bg-red-900";
};


