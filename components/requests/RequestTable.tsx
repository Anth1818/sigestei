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
import { fecthAllRequestByUser, fecthAllRequestForTechnician, fetchRequests } from "@/api/api";
import { useRequestFilters } from "@/hooks/useRequestFilters";
import { usePagination } from "@/hooks/usePagination";
import { useRequestActions } from "@/hooks/useRequestActions";
import { useRequestSorting } from "@/hooks/useRequestSorting";
import { adaptRequestData, getPriorityColor, getStatusColor } from "@/lib/requestUtils";
import { RequestResponse } from "@/lib/types";
import { useUserStore } from "@/hooks/useUserStore";
import { useSearchParams } from "next/navigation";

export default function RequestTable() {
  const searchParams = useSearchParams();
  const requestIdFromParams = searchParams.get("id");
  const user = useUserStore((state) => state.user);

  const fecthDependsOnUserRole = () => {
    // Para las solicitudes de usuario institucional
    if (user?.role_id === 4 ) {
      return fecthAllRequestByUser(user.id);
    }

    // Para las solicitudes de técnico
    if(user?.role_id === 3) {
      return fecthAllRequestForTechnician(user.id);
    }

    // Para otros roles (admin, coordinador)
    return fetchRequests();
  };
  // React Query para obtener las requests
  const { data: requestsData, isLoading, error } = useQuery({
    queryKey: ['requests'],
    queryFn: fecthDependsOnUserRole,
  });

  // Datos de la API
  const requests: RequestResponse[] = requestsData || [];
  
  // Custom hooks para separar la lógica
  const sorting = useRequestSorting(requests);
  const filters = useRequestFilters(sorting.sortedRequests, requestIdFromParams);
  const pagination = usePagination(filters.filteredRequests);
  const actions = useRequestActions();

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

      {/*Contenido principal - mostrar solo cuando no este cargando o no haya error */}
      {!isLoading && !error && (
        <>
          {/* Filtros */}
          <RequestFilters
            searchId={filters.searchId}
            setSearchId={filters.setSearchId}
            statusFilter={filters.statusFilter}
            setStatusFilter={filters.setStatusFilter}
            priorityFilter={filters.priorityFilter}
            setPriorityFilter={filters.setPriorityFilter}
            typeFilter={filters.typeFilter}
            setTypeFilter={filters.setTypeFilter}
            dateFilterType={filters.dateFilterType}
            technicianFilter={filters.technicianFilter}
            setTechnicianFilter={filters.setTechnicianFilter}
            setDateFilterType={filters.setDateFilterType}
            dateRange={filters.dateRange}
            setDateRange={filters.setDateRange}
            clearFilters={filters.clearFilters}
            uniqueStatuses={uniqueStatuses}
            uniquePriorities={uniquePriorities}
            uniqueTypes={uniqueTypes}
            uniqueTechnicians={uniqueTechnicians}
            onPageReset={() => pagination.setCurrentPage(1)}
          />
                   
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
                  onUpdateStatus={actions.handleStatusChange}
                  onUpdatePriority={actions.handlePriorityChange}
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

      {/* Dialog de confirmación para cambio de estado */}
      <Dialog open={actions.isStatusDialogOpen} onOpenChange={actions.cancelStatusUpdate}>
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
              {actions.updateStatusMutation.isPending
                ? "Actualizando..."
                : "Confirmar cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para cambio de prioridad */}
      <Dialog open={actions.isPriorityDialogOpen} onOpenChange={actions.cancelPriorityUpdate}>
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
              {actions.updatePriorityMutation.isPending
                ? "Actualizando..."
                : "Confirmar cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}