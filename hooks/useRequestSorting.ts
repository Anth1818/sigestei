import { useState, useMemo } from "react";
import { Request, SortColumnRequest, RequestResponse } from "@/lib/types";
import { getRequesterName, getBeneficiaryName } from "@/lib/requestUtils";

export const useRequestSorting = (requests: RequestResponse[]) => {
  const [currentSort, setCurrentSort] = useState<SortColumnRequest>(null);

  const sortRequests = (field: keyof Request | "requestor_name" | "beneficiary_name") => {
    const newDirection =
      currentSort?.column === field && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ column: field, direction: newDirection });
  };

  const sortedRequests = useMemo(() => {
    if (!currentSort) return requests;

    const sorted = [...requests].sort((a, b) => {
      let valueA: string | number, valueB: string | number;

      if (currentSort.column === "requestor_name") {
        valueA = getRequesterName(a);
        valueB = getRequesterName(b);
      } else if (currentSort.column === "beneficiary_name") {
        valueA = getBeneficiaryName(a);
        valueB = getBeneficiaryName(b);
      } else if (currentSort.column === "id") {
        valueA = a.id;
        valueB = b.id;
      } else if (currentSort.column === "request_date") {
        valueA = new Date(a.request_date).getTime();
        valueB = new Date(b.request_date).getTime();
      } else if (currentSort.column === "status") {
        valueA = a.request_statuses?.name || "";
        valueB = b.request_statuses?.name || "";
      } else if (currentSort.column === "priority") {
        valueA = a.request_priorities?.name || "";
        valueB = b.request_priorities?.name || "";
      } else if (currentSort.column === "request_type") {
        valueA = a.request_types?.name || "";
        valueB = b.request_types?.name || "";
      } else {
        // Fallback para otros campos
        valueA = "";
        valueB = "";
      }

      // Convertir a string para comparación si no es número
      const strA = typeof valueA === "number" ? valueA : valueA.toString().toLowerCase();
      const strB = typeof valueB === "number" ? valueB : valueB.toString().toLowerCase();

      if (strA < strB) return currentSort.direction === "asc" ? -1 : 1;
      if (strA > strB) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [requests, currentSort]);

  const renderSortIcon = (field: keyof Request | "requestor_name" | "beneficiary_name") => {
    if (currentSort?.column !== field) {
      return "ArrowUpDown";
    }
    return currentSort.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  return {
    currentSort,
    sortRequests,
    renderSortIcon,
    sortedRequests,
  };
};