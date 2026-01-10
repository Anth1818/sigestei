"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  FileDown,
  Search,
  X,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpandableRequestRow } from "./ExpandableRequestRow";
import { DateRangePicker } from "./DateRangePicker";
import {
  fetchRequestsPaginated,
  fetchRequestsFiltered,
  fetchCatalogs,
  fecthAllRequestByUser,
  fecthAllRequestForTechnician,
} from "@/api/api";
import { useRequestActions } from "@/hooks/useRequestActions";
import {
  adaptRequestData,
  getPriorityColor,
  getStatusColor,
} from "@/lib/requestUtils";
import { RequestResponse, PaginatedResponse } from "@/lib/types";
import { useUserStore } from "@/hooks/useUserStore";
import { generateRequestsPDF } from "@/lib/pdfUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CatalogItem {
  id: number;
  name: string;
}

interface TechnicianItem {
  id: number;
  full_name: string;
}

interface Catalogs {
  request_statuses?: CatalogItem[];
  priority_requests?: CatalogItem[];
  request_types?: CatalogItem[];
  technicians?: TechnicianItem[];
}

export default function RequestTable() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const actions = useRequestActions();

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estado de búsqueda por ID
  const [searchId, setSearchId] = useState("");

  // Estado de filtros (usando IDs para el servidor)
  const [technicianFilter, setTechnicianFilter] = useState("");
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

  // Estado para controlar si se están aplicando filtros
  const [isFiltering, setIsFiltering] = useState(false);
  // Estado que guarda los filtros aplicados (solo se actualiza al presionar "Buscar")
  const [appliedFilters, setAppliedFilters] = useState<{
    request_id?: string;
    technician_ids?: string;
    status_ids?: string;
    priority_ids?: string;
    type_ids?: string;
    date_from?: string;
    date_to?: string;
  }>({});

  // Verificar si el usuario es técnico o usuario institucional (para ellos se usa el endpoint antiguo)
  const isSpecialRole = user?.role_id === 3 || user?.role_id === 4;

  // Query para catálogos (estados, prioridades, tipos, técnicos)
  const { data: catalogs } = useQuery<Catalogs>({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Obtener técnicos del catálogo
  const technicians = catalogs?.technicians || [];

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

  // Query para solicitudes paginadas (sin filtros) - Para admin y coordinador
  const paginatedQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-paginated", currentPage, rowsPerPage],
    queryFn: () => fetchRequestsPaginated(currentPage, rowsPerPage),
    enabled: !isSpecialRole && !isFiltering,
    staleTime: 30000,
  });

  // Query para solicitudes filtradas - Para admin y coordinador
  // Solo se ejecuta cuando isFiltering es true y hay filtros aplicados
  const filteredQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-filtered", { ...appliedFilters, page: currentPage, limit: rowsPerPage }],
    queryFn: () => fetchRequestsFiltered({ ...appliedFilters, page: currentPage, limit: rowsPerPage }),
    enabled: !isSpecialRole && isFiltering,
    staleTime: 30000,
  });

  // Query para usuarios especiales (técnicos y usuarios institucionales)
  const specialRoleQuery = useQuery<RequestResponse[]>({
    queryKey: ["requests-special", user?.id],
    queryFn: () => {
      if (user?.role_id === 4) {
        return fecthAllRequestByUser(user.id);
      }
      if (user?.role_id === 3) {
        return fecthAllRequestForTechnician(user.id);
      }
      return Promise.resolve([]);
    },
    enabled: isSpecialRole,
  });

  // Seleccionar la query activa y los datos
  let requests: RequestResponse[] = [];
  let total = 0;
  let totalPages = 1;
  let isLoading = false;
  let isFetching = false;
  let error: Error | null = null;

  if (isSpecialRole) {
    // Para técnicos y usuarios institucionales
    let allRequests = specialRoleQuery.data || [];
    
    // Filtrar por ID localmente si hay búsqueda activa (para usuarios especiales)
    if (searchId.trim()) {
      allRequests = allRequests.filter((r) =>
        r.id.toString().includes(searchId.trim())
      );
    }
    
    total = allRequests.length;
    totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    isLoading = specialRoleQuery.isLoading;
    isFetching = specialRoleQuery.isFetching;
    error = specialRoleQuery.error as Error | null;
    
    // Paginación local para usuarios especiales
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    requests = allRequests.slice(startIdx, endIdx);
  } else if (isFiltering) {
    // Para admin/coordinador con filtros (incluyendo búsqueda por ID)
    requests = filteredQuery.data?.data || [];
    total = filteredQuery.data?.pagination?.total || 0;
    totalPages = filteredQuery.data?.pagination?.totalPages || 1;
    isLoading = filteredQuery.isLoading;
    isFetching = filteredQuery.isFetching;
    error = filteredQuery.error as Error | null;
  } else {
    // Para admin/coordinador sin filtros
    requests = paginatedQuery.data?.data || [];
    total = paginatedQuery.data?.pagination?.total || 0;
    totalPages = paginatedQuery.data?.pagination?.totalPages || 1;
    isLoading = paginatedQuery.isLoading;
    isFetching = paginatedQuery.isFetching;
    error = paginatedQuery.error as Error | null;
  }

  // Ejecutar búsqueda con filtros
  const executeSearch = () => {
    if (hasActiveFilters()) {
      // Construir los filtros a aplicar
      const filters: typeof appliedFilters = {};
      
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
      setCurrentPage(1);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchId("");
    setTechnicianFilter("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
    setDateRange({ from: undefined, to: undefined });
    setAppliedFilters({});
    setIsFiltering(false);
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
  };

  // Cambiar página
  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Cambiar filas por página
  const changeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Obtener listas únicas para los filtros de estados, prioridades, tipos (para ExpandableRequestRow)
  const uniqueStatuses = catalogs?.request_statuses?.map((s) => s.name) || [];
  const uniquePriorities = catalogs?.priority_requests?.map((p) => p.name) || [];
  const uniqueTypes = catalogs?.request_types?.map((t) => t.name) || [];
  const uniqueTechnicians = technicians?.map((t) => t.full_name) || [];

  // Columnas de la tabla
  const columns = [
    { label: "ID", field: "id" },
    { label: "Tipo", field: "request_type" },
    { label: "Equipo", field: "equipment" },
    { label: "Prioridad", field: "priority" },
    { label: "Estado", field: "status" },
    { label: "Solicitante", field: "requestor_name" },
    { label: "Beneficiario", field: "beneficiary_name" },
    { label: "Fecha de creación", field: "request_date" },
  ];

  // Función para generar el PDF
  const handleExportPDF = () => {
    generateRequestsPDF(requests, {
      status: statusFilter ? catalogs?.request_statuses?.find(s => s.id.toString() === statusFilter)?.name : undefined,
      priority: priorityFilter ? catalogs?.priority_requests?.find(p => p.id.toString() === priorityFilter)?.name : undefined,
      type: typeFilter ? catalogs?.request_types?.find(t => t.id.toString() === typeFilter)?.name : undefined,
      dateRange: dateRange.from || dateRange.to
        ? {
            start: dateRange.from,
            end: dateRange.to,
          }
        : undefined,
    });
  };

  const validateDisabledOfButtonDownloadPDF = () => {
    if (!hasActiveFilters()) {
      return true;
    }
    if (hasActiveFilters() && requests.length === 0) {
      return true;
    }
    return false;
  };

  return (
    <div className="container mx-auto py-1">
      {/* Loading state inicial */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <div className="text-lg">Cargando solicitudes...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">
            Error al cargar las solicitudes: {error.message}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!isLoading && !error && (
        <>
          {/* Filtros - Solo mostrar para admin y coordinador */}
          {!isSpecialRole && (
            <div className="mb-4 space-y-4">
              {/* Búsqueda por ID */}
              <div className="flex items-end gap-2">
                <div className="w-64">
                  <label htmlFor="search-id" className="text-sm font-medium block mb-1">
                    Buscar por ID:
                  </label>
                  <div className="relative">
                    <input
                      id="search-id"
                      type="text"
                      value={searchId}
                      onChange={(e) => {
                        setSearchId(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border rounded px-3 py-1.5 text-sm w-full"
                      placeholder="ID de solicitud"
                    />
                  </div>
                </div>
              </div>

              {/* Otros filtros */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <div>
                  <label className="text-sm font-medium block mb-1">Técnico:</label>
                  <Select 
                    value={technicianFilter} 
                    onValueChange={setTechnicianFilter}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id.toString()}>
                          {technician.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Estado:</label>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogs?.request_statuses?.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Prioridad:</label>
                  <Select 
                    value={priorityFilter} 
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogs?.priority_requests?.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id.toString()}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Tipo:</label>
                  <Select 
                    value={typeFilter} 
                    onValueChange={setTypeFilter}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogs?.request_types?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Rango de Fechas:</label>
                  <DateRangePicker 
                    dateRange={dateRange} 
                    setDateRange={setDateRange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={executeSearch} 
                  disabled={isFetching || !hasActiveFilters()} 
                  className="h-8"
                >
                  {isFetching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  {isFetching ? "Buscando..." : "Buscar"}
                </Button>

                {hasActiveFilters() && (
                  <Button variant="outline" onClick={clearFilters} className="h-8">
                    <X className="mr-2 h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Indicador de carga durante fetching */}
          {isFetching && !isLoading && (
            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Actualizando datos...
            </div>
          )}

          {/* Botón de exportar PDF */}
          { (user?.role_id !== 4 && user?.role_id !== 3) &&
          <div className="flex justify-end mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-block"
                  aria-disabled={validateDisabledOfButtonDownloadPDF()}
                >
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    className="ml-4"
                    disabled={validateDisabledOfButtonDownloadPDF()}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </span>
              </TooltipTrigger>
              {validateDisabledOfButtonDownloadPDF() && (
                <TooltipContent side="right">
                  <span>
                    Para exportar el PDF, aplica al menos un filtro y realiza
                    una búsqueda.
                  </span>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
          }     

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.field} className="p-2">
                    {col.label}
                  </TableHead>
                ))}
                {user?.role_id !== 4 && <TableHead className="p-2">Acciones</TableHead>}
                <TableHead className="p-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                    No se encontraron solicitudes {isFiltering ? "con los criterios proporcionados." : "."}
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <ExpandableRequestRow
                    key={request.id}
                    requestFullFromApi={request}
                    requestAdapted={adaptRequestData(request)}
                    expanded={actions.expanded === request.id}
                    onToggle={() => actions.toggleExpansion(request.id)}
                    onUpdateStatus={actions.handleStatusChange}
                    onUpdatePriority={actions.handlePriorityChange}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    itemsToSelectStatuses={uniqueStatuses}
                    itemsToSelectPriorities={uniquePriorities}
                    itemsToSelectTechinicians={uniqueTechnicians}
                  />
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <p className="text-sm font-medium">Filas por página</p>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => changeRowsPerPage(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={rowsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 25, 50, 100, 250, 500].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p>Total de resultados: {total}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>
                <div className="text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Página siguiente</span>
                </Button>
              </div>
            </div>
        </>
      )}

      {/* Dialog de confirmación para cambio de estado */}
      <Dialog
        open={actions.isStatusDialogOpen}
        onOpenChange={actions.cancelStatusUpdate}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cambiar el estado de esta solicitud?
            </DialogDescription>
          </DialogHeader>

          {actions.pendingStatusUpdate && (
            <div className="py-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Nuevo estado:</strong>{" "}
                <span className={getStatusColor(actions.pendingStatusUpdate.newStatus)}>
                  {actions.pendingStatusUpdate.newStatus}
                </span>
              </p>
              {(actions.pendingStatusUpdate.newStatus === "Completada" ||
                actions.pendingStatusUpdate.newStatus === "Cancelada") && (
                <p className="text-sm text-gray-300 mt-2">
                  Se registrará automáticamente la fecha de resolución.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={actions.cancelStatusUpdate}
              disabled={actions.updateStatusMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={actions.confirmStatusUpdate}
              disabled={actions.updateStatusMutation.isPending}
            >
              {actions.updateStatusMutation.isPending ? "Actualizando..." : "Confirmar cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para cambio de prioridad */}
      <Dialog
        open={actions.isPriorityDialogOpen}
        onOpenChange={actions.cancelPriorityUpdate}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de prioridad</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cambiar la prioridad de esta solicitud?
            </DialogDescription>
          </DialogHeader>

          {actions.pendingPriorityUpdate && (
            <div className="py-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Nueva prioridad:</strong>{" "}
                <span className={getPriorityColor(actions.pendingPriorityUpdate.newPriority)}>
                  {actions.pendingPriorityUpdate.newPriority}
                </span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={actions.cancelPriorityUpdate}
              disabled={actions.updatePriorityMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={actions.confirmPriorityUpdate}
              disabled={actions.updatePriorityMutation.isPending}
            >
              {actions.updatePriorityMutation.isPending ? "Actualizando..." : "Confirmar cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
