import { useState, useMemo } from "react";
import { UserData, SortColumnUser } from "@/lib/types";

export function useUserSorting(users: UserData[]) {
  const [currentSort, setCurrentSort] = useState<SortColumnUser>(null);

  const sortUsers = (field: keyof UserData | "full_name") => {
    const newDirection =
      currentSort?.columna === field && currentSort.direccion === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ columna: field, direccion: newDirection });
  };

  const sortedUsers = useMemo(() => {
    if (!currentSort) return users;

    return [...users].sort((a, b) => {
      const field = currentSort.columna;
      let valueA: string | number;
      let valueB: string | number;

      if (field === "full_name") {
        valueA = a.full_name.trim().toLowerCase();
        valueB = b.full_name.trim().toLowerCase();
      } else {
        valueA = a[field as keyof UserData]?.toString().trim().toLowerCase() || "";
        valueB = b[field as keyof UserData]?.toString().trim().toLowerCase() || "";
      }

      if (valueA < valueB) return currentSort.direccion === "asc" ? -1 : 1;
      if (valueA > valueB) return currentSort.direccion === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, currentSort]);

  const renderSortIcon = (field: keyof UserData | "full_name"): "up" | "down" | "default" => {
    if (currentSort?.columna !== field) {
      return "default";
    }
    return currentSort.direccion === "asc" ? "up" : "down";
  };

  return {
    currentSort,
    sortUsers,
    sortedUsers,
    renderSortIcon,
  };
}
