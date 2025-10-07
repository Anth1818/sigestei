"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpandableRequestRow } from "./ExpandableRequestRow";
import { DateRangePicker } from "./DateRangePicker";
import { fetchRequests } from "@/api/api";
import { useRequestFilters } from "@/hooks/useRequestFilters";
import { usePagination } from "@/hooks/usePagination";
import { useRequestActions } from "@/hooks/useRequestActions";
import { useRequestSorting } from "@/hooks/useRequestSorting";
import { adaptRequestData, getPriorityColor, getStatusColor } from "@/lib/requestUtils";
import { RequestResponse } from "@/lib/types";
import {useUserStore} from "@/hooks/useUserStore";

export default function RequestTable() {

  const user = useUserStore((state) => state.user);
  // React Query para obtener las requests
  const { data: requestsData, isLoading, error } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRequests,
  });

  // Datos de la API
  const requests: RequestResponse[] = requestsData || [];

  // Custom hooks para separar la lógica
  const sorting = useRequestSorting(requests);
  const filters = useRequestFilters(sorting.sortedRequests);
  const pagination = usePagination(filters.filteredRequests);
  const actions = useRequestActions();

  const columns = [
    { label: "ID", field: "id" },
    { label: "Tipo", field: "request_type" },
    { label: "Prioridad", field: "priority" },
    { label: "Estado", field: "status" },
    { label: "Solicitante", field: "requestor_name" },
    { label: "Beneficiario", field: "beneficiary_name" },
    { label: "Fecha de creación", field: "request_date" },
  ];

  // Opciones únicas para los filtros
  // uniqueStatusesRaw para poner primero "Pendiente" y último "Cancelada"
  const uniqueStatusesRaw = [...new Set(requests.map((r: RequestResponse) => r.request_statuses?.name).filter(Boolean))] as string[];
  const uniqueStatuses =
    uniqueStatusesRaw.length > 1
      ? [
          uniqueStatusesRaw[uniqueStatusesRaw.length - 1],
          ...uniqueStatusesRaw.slice(1, uniqueStatusesRaw.length - 1),
          uniqueStatusesRaw[0],
        ]
      : uniqueStatusesRaw;
  const uniquePriorities = [...new Set(requests.map((r: RequestResponse) => r.request_priorities?.name).filter(Boolean))] as string[];
  const uniqueTypes = [...new Set(requests.map((r: RequestResponse) => r.request_types?.name).filter(Boolean))] as string[];
  const uniqueTechnicians = [...new Set(requests.map((r: RequestResponse) => r.users_requests_technician_idTousers?.full_name).filter(Boolean))] as string[];

  const renderSortIcon = (field: string) => {
    const iconName = sorting.renderSortIcon(field as any);
    switch (iconName) {
      case "ChevronUp":
        return <ChevronUp size={16} />;
      case "ChevronDown":
        return <ChevronDown size={16} />;
      default:
        return <ArrowUpDown size={16} />;
    }
  };

  return (
    <div className="container mx-auto py-1">
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">Cargando solicitudes...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">Error al cargar las solicitudes</div>
        </div>
      )}

      {/* Main content - only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Filtros */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label htmlFor="search-id" className="text-sm font-medium block mb-1">
                Buscar por ID:
              </label>
              <input
                id="search-id"
                type="text"
                value={filters.searchId}
                onChange={(e) => {
                  filters.setSearchId(e.target.value);
                  pagination.setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="ID de solicitud"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Estado:</label>
              <Select value={filters.statusFilter} onValueChange={(value) => {
                filters.setStatusFilter(value);
                pagination.setCurrentPage(1);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Prioridad:</label>
              <Select value={filters.priorityFilter} onValueChange={(value) => {
                filters.setPriorityFilter(value);
                pagination.setCurrentPage(1);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {uniquePriorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Tipo:</label>
              <Select value={filters.typeFilter} onValueChange={(value) => {
                filters.setTypeFilter(value);
                pagination.setCurrentPage(1);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Filtrar fechas por:</label>
              <div className="flex gap-4 items-center h-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="dateFilterType"
                    value="creation"
                    checked={filters.dateFilterType === "creation"}
                    onChange={() => filters.setDateFilterType("creation")}
                    className="cursor-pointer"
                  />
                  Creación
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="dateFilterType"
                    value="resolution"
                    checked={filters.dateFilterType === "resolution"}
                    onChange={() => filters.setDateFilterType("resolution")}
                    className="cursor-pointer"
                  />
                  Resolución
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Rango de Fechas:</label>
              <DateRangePicker 
                dateRange={filters.dateRange} 
                setDateRange={filters.setDateRange} 
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                filters.clearFilters();
                pagination.setCurrentPage(1);
              }} className="h-8">
                Limpiar filtros
              </Button>
            </div>
          </div>
                   
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.field}
                    onClick={() => sorting.sortRequests(col.field as any)}
                    className="cursor-pointer p-2"
                  >
                    {col.label}
                    {renderSortIcon(col.field)}
                  </TableHead>
                ))}
                {user?.role_id != 4 && <TableHead className="p-2">Acciones</TableHead>}
                <TableHead className="p-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.map((request) => (
                <ExpandableRequestRow
                  key={request.id}
                  request={adaptRequestData(request)}
                  expanded={actions.expanded === request.id}
                  onToggle={() => actions.toggleExpansion(request.id)}
                  onUpdateStatus={actions.updateRequestStatus}
                  onUpdatePriority={actions.updateRequestPriority}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  itemsToSelectStatuses={uniqueStatuses}
                  itemsToSelectPriorities={uniquePriorities}
                  itemsToSelectTechinicians={uniqueTechnicians}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Filas por página</p>
              <Select
                value={pagination.rowsPerPage.toString()}
                onValueChange={(value) => pagination.changeRowsPerPage(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.rowsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100, 250, 500].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.changePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              <div className="text-sm font-medium">
                Página {pagination.currentPage} de {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.changePage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Página siguiente</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}