"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
import { RequestFilters } from "./RequestFilters";
import {
  fetchRequestsPaginated,
  fetchRequestsFiltered,
  fetchCatalogs,
  fecthAllRequestByUser,
  fecthAllRequestForTechnician,
} from "@/api/api";
import { useRequestActions } from "@/hooks/useRequestActions";
import { useRequestFilters } from "@/hooks/useRequestFilters";
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
  const actions = useRequestActions();
  const searchParams = useSearchParams();
  
  // Obtener el ID de la URL si existe
  const initialRequestId = searchParams.get("id") || undefined;

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Hook de filtros con ID inicial desde URL
  const filters = useRequestFilters({
    onPageReset: () => setCurrentPage(1),
    initialSearchId: initialRequestId,
  });

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

  // Query para solicitudes paginadas (sin filtros) - Para admin y coordinador
  const paginatedQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-paginated", currentPage, rowsPerPage],
    queryFn: () => fetchRequestsPaginated(currentPage, rowsPerPage),
    enabled: !isSpecialRole && !filters.isFiltering,
    staleTime: 30000,
  });

  // Query para solicitudes filtradas - Para admin y coordinador
  // Solo se ejecuta cuando isFiltering es true y hay filtros aplicados
  const filteredQuery = useQuery<PaginatedResponse<RequestResponse>>({
    queryKey: ["requests-filtered", { ...filters.appliedFilters, page: currentPage, limit: rowsPerPage }],
    queryFn: () => fetchRequestsFiltered({ ...filters.appliedFilters, page: currentPage, limit: rowsPerPage }),
    enabled: !isSpecialRole && filters.isFiltering,
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
    if (filters.searchId.trim()) {
      allRequests = allRequests.filter((r) =>
        r.id.toString().includes(filters.searchId.trim())
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
  } else if (filters.isFiltering) {
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
      status: filters.statusFilter ? catalogs?.request_statuses?.find(s => s.id.toString() === filters.statusFilter)?.name : undefined,
      priority: filters.priorityFilter ? catalogs?.priority_requests?.find(p => p.id.toString() === filters.priorityFilter)?.name : undefined,
      type: filters.typeFilter ? catalogs?.request_types?.find(t => t.id.toString() === filters.typeFilter)?.name : undefined,
      dateRange: filters.dateRange.from || filters.dateRange.to
        ? {
            start: filters.dateRange.from,
            end: filters.dateRange.to,
          }
        : undefined,
    });
  };

  const validateDisabledOfButtonDownloadPDF = () => {
    if (!filters.hasActiveFilters()) {
      return true;
    }
    if(filters.hasActiveFilters() && !filters.hasClickedSearch) {
      return true;
    }

    if (filters.hasActiveFilters() && requests.length === 0) {
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
            <RequestFilters
              hasClickedSearch={filters.hasClickedSearch}
              searchId={filters.searchId}
              technicianFilter={filters.technicianFilter}
              statusFilter={filters.statusFilter}
              priorityFilter={filters.priorityFilter}
              typeFilter={filters.typeFilter}
              dateRange={filters.dateRange}
              onSearchIdChange={filters.setSearchId}
              onTechnicianFilterChange={filters.setTechnicianFilter}
              onStatusFilterChange={filters.setStatusFilter}
              onPriorityFilterChange={filters.setPriorityFilter}
              onTypeFilterChange={filters.setTypeFilter}
              onDateRangeChange={filters.setDateRange}
              onSearch={filters.executeSearch}
              onClearFilters={filters.clearFilters}
              isFetching={isFetching}
              hasActiveFilters={filters.hasActiveFilters()}
              catalogs={catalogs}
            />
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
                    No se encontraron solicitudes {filters.isFiltering ? "con los criterios proporcionados." : "."}
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
