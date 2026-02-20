import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRequestsPaginated, fetchRequestsFiltered } from "@/api/api";
import { PaginatedResponse, RequestResponse, PaginationInfo } from "@/lib/types";

export interface RequestFilterState {
  technicianIds: number[];
  statusIds: number[];
  priorityIds: number[];
  typeIds: number[];
  dateFrom: string;
  dateTo: string;
}

const initialFilterState: RequestFilterState = {
  technicianIds: [],
  statusIds: [],
  priorityIds: [],
  typeIds: [],
  dateFrom: "",
  dateTo: "",
};

export const usePaginatedRequests = (initialLimit: number = 10) => {
  const queryClient = useQueryClient();
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialLimit);
  
  // Estado de filtros
  const [filters, setFilters] = useState<RequestFilterState>(initialFilterState);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Estado para controlar si se está buscando
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Función para construir parámetros de filtro
  const buildFilterParams = useCallback(() => {
    const params: {
      technician_ids?: string;
      status_ids?: string;
      priority_ids?: string;
      type_ids?: string;
      date_from?: string;
      date_to?: string;
      page: number;
      limit: number;
    } = {
      page: currentPage,
      limit: rowsPerPage,
    };

    if (filters.technicianIds.length > 0) {
      params.technician_ids = filters.technicianIds.join(",");
    }
    if (filters.statusIds.length > 0) {
      params.status_ids = filters.statusIds.join(",");
    }
    if (filters.priorityIds.length > 0) {
      params.priority_ids = filters.priorityIds.join(",");
    }
    if (filters.typeIds.length > 0) {
      params.type_ids = filters.typeIds.join(",");
    }
    if (filters.dateFrom) {
      params.date_from = filters.dateFrom;
    }
    if (filters.dateTo) {
      params.date_to = filters.dateTo;
    }

    return params;
  }, [currentPage, rowsPerPage, filters]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useCallback(() => {
    return (
      filters.technicianIds.length > 0 ||
      filters.statusIds.length > 0 ||
      filters.priorityIds.length > 0 ||
      filters.typeIds.length > 0 ||
      filters.dateFrom !== "" ||
      filters.dateTo !== ""
    );
  }, [filters]);

  // Query para obtener datos paginados (sin filtros)
  const paginatedQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-paginated", currentPage, rowsPerPage],
    queryFn: () => fetchRequestsPaginated(currentPage, rowsPerPage),
    enabled: !isFiltering,
    staleTime: 30000, // 30 segundos
  });

  // Query para obtener datos filtrados
  const filteredQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-filtered", buildFilterParams(), searchTrigger],
    queryFn: () => fetchRequestsFiltered(buildFilterParams()),
    enabled: isFiltering && searchTrigger > 0,
    staleTime: 30000,
  });

  // Seleccionar la query activa
  const activeQuery = isFiltering ? filteredQuery : paginatedQuery;

  // Datos y paginación
  const requests: RequestResponse[] = activeQuery.data?.data || [];
  const pagination: PaginationInfo | null = activeQuery.data?.pagination || null;

  // Funciones de navegación
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination?.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pagination?.hasPreviousPage]);

  const changeRowsPerPage = useCallback((newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  // Funciones de filtrado
  const updateFilter = useCallback(<K extends keyof RequestFilterState>(
    key: K,
    value: RequestFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setTechnicianFilter = useCallback((ids: number[]) => {
    updateFilter("technicianIds", ids);
  }, [updateFilter]);

  const setStatusFilter = useCallback((ids: number[]) => {
    updateFilter("statusIds", ids);
  }, [updateFilter]);

  const setPriorityFilter = useCallback((ids: number[]) => {
    updateFilter("priorityIds", ids);
  }, [updateFilter]);

  const setTypeFilter = useCallback((ids: number[]) => {
    updateFilter("typeIds", ids);
  }, [updateFilter]);

  const setDateRange = useCallback((from: string, to: string) => {
    setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }));
  }, []);

  // Ejecutar búsqueda con filtros
  const executeSearch = useCallback(() => {
    if (hasActiveFilters()) {
      setIsFiltering(true);
      setCurrentPage(1);
      setSearchTrigger((prev) => prev + 1);
    }
  }, [hasActiveFilters]);

  // Limpiar filtros y volver a paginación normal
  const clearFilters = useCallback(async () => {
    setFilters(initialFilterState);
    setIsFiltering(false);
    setCurrentPage(1);
    setSearchTrigger(0);
    // Invalidar queries filtradas
    await queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
  }, [queryClient]);

  // Refrescar datos
  const refresh = useCallback(async () => {
    if (isFiltering) {
      await queryClient.invalidateQueries({ queryKey: ["requests-filtered"] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
    }
  }, [isFiltering, queryClient]);

  return {
    // Datos
    requests,
    pagination,
    
    // Estados de carga
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    error: activeQuery.error,
    
    // Paginación
    currentPage,
    rowsPerPage,
    totalPages: pagination?.totalPages || 1,
    total: pagination?.total || 0,
    hasNextPage: pagination?.hasNextPage || false,
    hasPreviousPage: pagination?.hasPreviousPage || false,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeRowsPerPage,
    
    // Filtros
    filters,
    isFiltering,
    hasActiveFilters: hasActiveFilters(),
    setTechnicianFilter,
    setStatusFilter,
    setPriorityFilter,
    setTypeFilter,
    setDateRange,
    updateFilter,
    executeSearch,
    clearFilters,
    
    // Utilidades
    refresh,
  };
};
