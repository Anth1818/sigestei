import { useMemo, useState } from "react";
import { RequestResponse } from "@/lib/types";

export const useRequestFilters = (requests: RequestResponse[]) => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Funciones auxiliares para extraer datos
  const getStatusName = (request: RequestResponse) => request.request_statuses?.name || "";
  const getPriorityName = (request: RequestResponse) => request.request_priorities?.name || "";
  const getTypeName = (request: RequestResponse) => request.request_types?.name || "";

  // Filtros aplicados
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filtro por ID
    if (searchId.trim()) {
      filtered = filtered.filter((request) =>
        request.id.toString().includes(searchId.trim())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter((request) => getStatusName(request) === statusFilter);
    }

    // Filtro por prioridad
    if (priorityFilter) {
      filtered = filtered.filter((request) => getPriorityName(request) === priorityFilter);
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter((request) => getTypeName(request) === typeFilter);
    }

    // Filtro por rango de fechas
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.request_date);
        
        // Si solo hay fecha desde
        if (dateRange.from && !dateRange.to) {
          return requestDate >= dateRange.from;
        }
        
        // Si solo hay fecha hasta
        if (!dateRange.from && dateRange.to) {
          return requestDate <= dateRange.to;
        }
        
        // Si hay ambas fechas
        if (dateRange.from && dateRange.to) {
          return requestDate >= dateRange.from && requestDate <= dateRange.to;
        }
        
        return true;
      });
    }

    return filtered;
  }, [requests, searchId, statusFilter, priorityFilter, typeFilter, dateRange]);

  const clearFilters = () => {
    setSearchId("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
    setDateRange({ from: undefined, to: undefined });
  };

  return {
    searchId,
    setSearchId,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    dateRange,
    setDateRange,
    filteredRequests,
    clearFilters,
  };
};