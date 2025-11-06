"use client";

import { useMemo } from "react";
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

import { ExpandableEquipmentRow } from "@/components/inventory/ExpandableEquipmentRow";
import { fetchAllEquipment, fetchCatalogs } from "@/api/api";
import { adaptEquipmentData, getStatusColor } from "@/lib/equipmentUtils";
import { EquipmentAdapted, EquipmentResponse } from "@/lib/types";
import { useEquipmentFilters } from "@/hooks/useEquipmentFilters";
import { useEquipmentSorting } from "@/hooks/useEquipmentSorting";
import { useEquipmentActions } from "@/hooks/useEquipmentActions";
import { usePagination } from "@/hooks/usePagination";
import type { CatalogData } from "@/lib/types";

export default function EquipmentTable() {

  // React Query para obtener los equipos
  const { data: equipmentData, isLoading, error } = useQuery<EquipmentResponse[]>({
    queryKey: ['equipments'],
    queryFn: fetchAllEquipment,
  });

  // Obtener catálogos para los estados
  const { data: catalogsData } = useQuery<CatalogData>({
    queryKey: ['catalogs'],
    queryFn: fetchCatalogs,
  });

  // Adaptar datos de la API al formato del componente
  const adaptEquipment: EquipmentAdapted[] = useMemo(() => {
    if (!equipmentData) return [];
    return equipmentData.map(adaptEquipmentData);
  }, [equipmentData]);

  // Custom hooks para separar la lógica
  const sorting = useEquipmentSorting(adaptEquipment);
  const filters = useEquipmentFilters(sorting.sortedEquipments);
  const pagination = usePagination(filters.filteredEquipments);
  const actions = useEquipmentActions();

  // Opciones únicas para los filtros
  const uniqueStatuses = [...new Set(adaptEquipment.map((c) => c.status).filter(Boolean))] as string[];
  const uniqueBrands = [...new Set(adaptEquipment.map((c) => c.brand).filter(Boolean))] as string[];
  const uniqueTypes = [...new Set(adaptEquipment.map((c) => c.type_name).filter(Boolean))] as string[];

  const columns = [
    {
      label: "ID",
      field: "id",
    },
    {
      label: "Tipo",
      field: "type_name",
    },
    {
      label: "Número de bien",
      field: "asset_number",
    },
    {
      label: "Marca",
      field: "brand",
    },
    {
      label: "Modelo",
      field: "model",
    },
    {
      label: "Serial",
      field: "serial_number",
    },
    {
      label: "Estado",
      field: "status",
    },
    {
      label: "Ubicación",
      field: "location",
    },
    {
      label: "Asignado a",
      field: "assigned_to",
    },
  ];

  const renderSortIcon = (field: string) => {
    const iconName = sorting.renderSortIcon(field);
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
          <div className="text-lg">Cargando equipos...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">Error al cargar los equipos</div>
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
            placeholder="ID de equipo"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tipo de equipo:</label>
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
          <label className="text-sm font-medium block mb-1">Marca:</label>
          <Select value={filters.brandFilter} onValueChange={(value) => {
            filters.setBrandFilter(value);
            pagination.setCurrentPage(1);
          }}>
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Ubicación:</label>
          <input
            type="text"
            value={filters.locationFilter}
            onChange={(e) => {
              filters.setLocationFilter(e.target.value);
              pagination.setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full h-8"
            placeholder="Buscar ubicación"
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


      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.field}
                onClick={() => sorting.sortEquipments(col.field)}
                className="cursor-pointer p-2"
              >
                {col.label}
                {renderSortIcon(col.field)}
              </TableHead>
            ))}
            <TableHead className="p-2">Acciones</TableHead>
            <TableHead className="p-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagination.paginatedItems.map((equipment: EquipmentAdapted) => (
            <ExpandableEquipmentRow
              key={equipment.id}
              equipment={equipment}
              expanded={actions.expanded === equipment.id}
              onToggle={() => actions.toggleExpansion(equipment.id)}
              onUpdateStatus={actions.handleStatusChange}
              getStatusColor={getStatusColor}
              equipmentStatuses={catalogsData?.equipment_statuses || []}
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
              ¿Estás seguro de que deseas cambiar el estado de este equipo?
            </DialogDescription>
          </DialogHeader>

          {actions.pendingStatusUpdate && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <strong>Nuevo estado:</strong> {actions.pendingStatusUpdate.newStatusName}
              </p>
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
    </div>
  );
}
