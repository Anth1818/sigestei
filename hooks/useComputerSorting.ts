import { useState } from "react";
import { ComputerEquipmentAdapted } from "@/lib/types";

type SortColumn = "id" | "asset_number" | "model" | "serial_number" | "status" | "location" | "assigned_to";
type SortDirection = "asc" | "desc";

export const useComputerSorting = (computers: ComputerEquipmentAdapted[]) => {
  const [currentSort, setCurrentSort] = useState<{
    column: SortColumn | null;
    direction: SortDirection;
  }>({ column: null, direction: "asc" });

  const sortComputers = (field: string) => {
    const newDirection =
      currentSort?.column === field && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ column: field as SortColumn, direction: newDirection });
  };

  const renderSortIcon = (field: string) => {
    if (currentSort?.column !== field) {
      return "ArrowUpDown";
    }
    return currentSort.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  const sortedComputers = [...computers].sort((a, b) => {
    if (!currentSort.column) return 0;

    const aValue = a[currentSort.column as keyof ComputerEquipmentAdapted];
    const bValue = b[currentSort.column as keyof ComputerEquipmentAdapted];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return currentSort.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return currentSort.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return {
    currentSort,
    sortComputers,
    renderSortIcon,
    sortedComputers,
  };
};
