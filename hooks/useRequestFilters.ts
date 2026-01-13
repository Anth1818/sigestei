import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface AppliedFilters {
  request_id?: string;
  technician_ids?: string;
  status_ids?: string;
  priority_ids?: string;
  type_ids?: string;
  date_from?: string;
  date_to?: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface UseRequestFiltersReturn {
  // Estados de filtros
  searchId: string;
  setSearchId: (value: string) => void;
  technicianFilter: string;
  setTechnicianFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  hasClickedSearch: boolean;
  
  // Estado de filtrado
  isFiltering: boolean;
  appliedFilters: AppliedFilters;
  
  // Funciones
  hasActiveFilters: () => boolean;
  executeSearch: () => void;
  clearFilters: () => void;
  resetPage: () => void;
}

interface UseRequestFiltersOptions {
  onPageReset?: () => void;
  initialSearchId?: string;
}

export function useRequestFilters(options?: UseRequestFiltersOptions): UseRequestFiltersReturn {
  const queryClient = useQueryClient();
  const { onPageReset, initialSearchId } = options || {};

  // Estado de búsqueda por ID
  const [searchId, setSearchId] = useState(initialSearchId || "");
  
  // Flag para controlar si ya se ejecutó la búsqueda inicial
  const [initialSearchExecuted, setInitialSearchExecuted] = useState(false);

  // Estado de filtros (usando IDs para el servidor)
  const [hasClickedSearch, setHadClickedSearch] = useState(false);
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Estado para controlar si se están aplicando filtros
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Estado que guarda los filtros aplicados (solo se actualiza al presionar "Buscar")
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

  // Verificar si hay filtros activos (incluyendo búsqueda por ID)
  const hasActiveFilters = useCallback(() => {
    return (
      searchId.trim() !== "" ||
      technicianFilter !== "" ||
      statusFilter !== "" ||
      priorityFilter !== "" ||
      typeFilter !== "" ||
      dateRange.from !== undefined ||
      dateRange.to !== undefined
    );
  }, [searchId, technicianFilter, statusFilter, priorityFilter, typeFilter, dateRange]);

  // Función para resetear la página
  const resetPage = useCallback(() => {
    onPageReset?.();
  }, [onPageReset]);

  // Ejecutar búsqueda con filtros
  const executeSearch = useCallback(() => {
    setHadClickedSearch(true);
    if (hasActiveFilters()) {
      // Construir los filtros a aplicar
      const filters: AppliedFilters = {};
      
      if (searchId.trim()) {
        filters.request_id = searchId.trim();
      }
      if (technicianFilter) {
        filters.technician_ids = technicianFilter;
      }
      if (statusFilter) {
        filters.status_ids = statusFilter;
      }
      if (priorityFilter) {
        filters.priority_ids = priorityFilter;
      }
      if (typeFilter) {
        filters.type_ids = typeFilter;
      }
      if (dateRange.from) {
        filters.date_from = dateRange.from.toISOString().split("T")[0];
      }
      if (dateRange.to) {
        filters.date_to = dateRange.to.toISOString().split("T")[0];
      }
      
      setAppliedFilters(filters);
      setIsFiltering(true);
      resetPage();
    }
  }, [
    hasActiveFilters,
    searchId,
    technicianFilter,
    statusFilter,
    priorityFilter,
    typeFilter,
    dateRange,
    resetPage,
  ]);

  // Ejecutar búsqueda automática si hay initialSearchId
  useEffect(() => {
    if (initialSearchId && !initialSearchExecuted) {
      setInitialSearchExecuted(true);
      // Ejecutar la búsqueda automáticamente
      const filters: AppliedFilters = { request_id: initialSearchId };
      setAppliedFilters(filters);
      setIsFiltering(true);
      setHadClickedSearch(true);
    }
  }, [initialSearchId, initialSearchExecuted]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setHadClickedSearch(false);
    setSearchId("");
    setTechnicianFilter("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
    setDateRange({ from: undefined, to: undefined });
    setAppliedFilters({});
    setIsFiltering(false);
    resetPage();
    queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
  }, [queryClient, resetPage]);

  return {
    // Estados de filtros
    hasClickedSearch,
    searchId,
    setSearchId,
    technicianFilter,
    setTechnicianFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    dateRange,
    setDateRange,
    
    // Estado de filtrado
    isFiltering,
    appliedFilters,
    
    // Funciones
    hasActiveFilters,
    executeSearch,
    clearFilters,
    resetPage,
  };
}
