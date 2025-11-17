import { useMemo, useState } from "react";
import { RequestResponse } from "@/lib/types";


export const useRequestFilters = (requests: RequestResponse[], requestIdFromParams: string | null) => {
  const [searchId, setSearchId] = useState(requestIdFromParams ? requestIdFromParams.toString() : "");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [dateFilterType, setDateFilterType] = useState<"creation" | "resolution">("creation");
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
  const getTechnicianName = (request: RequestResponse) => request.users_requests_technician_idTousers?.full_name || "";

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

    // Filtro por técnico asignado
    if (technicianFilter) {
      filtered = filtered.filter((request) => 
       getTechnicianName(request) === technicianFilter
   );
    }
    // Filtro por rango de fechas
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((request) => {
        // Determinar qué fecha usar según el tipo de filtro
        const dateToCompare = dateFilterType === "creation" 
          ? new Date(request.request_date)
          : request.resolution_date 
            ? new Date(request.resolution_date) 
            : null;
        
        // Si no hay fecha de resolución y se está filtrando por resolución, excluir
        if (dateFilterType === "resolution" && !dateToCompare) {
          return false;
        }
        
        if (!dateToCompare) return true;
        
        // Si solo hay fecha desde
        if (dateRange.from && !dateRange.to) {
          return dateToCompare >= dateRange.from;
        }
        
        // Si solo hay fecha hasta
        if (!dateRange.from && dateRange.to) {
          return dateToCompare <= dateRange.to;
        }
        
        // Si hay ambas fechas
        if (dateRange.from && dateRange.to) {
          return dateToCompare >= dateRange.from && dateToCompare <= dateRange.to;
        }
        
        return true;
      });
    }

    return filtered;
  }, [requests, searchId, statusFilter, priorityFilter, typeFilter, dateFilterType, dateRange, technicianFilter]);

  const clearFilters = () => {
    setSearchId("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
    setTechnicianFilter("");
    setDateFilterType("creation");
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
    dateFilterType,
    setDateFilterType,
    dateRange,
    setDateRange,
    filteredRequests,
    technicianFilter,
    setTechnicianFilter,
    clearFilters,
  };
};