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

import { ExpandableRow } from "./ExpandableUserRow";
import { UserData } from "@/lib/types";
import { fetchAllUsers } from "@/api/api";
import { useUserFilters } from "@/hooks/useUserFilters";
import { useUserSorting } from "@/hooks/useUserSorting";
import { useUserActions } from "@/hooks/useUserActions";
import { usePagination } from "@/hooks/usePagination";
import { ContentUserRow } from "./ContentUserRow";
import { parse } from "path";
import { parseRoleName } from "@/lib/userUtils";

export default function UserTable() {
  // React Query para obtener los usuarios
  const { data: usersData, isLoading, error } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const users = usersData || [];

  // Custom hooks para separar la lógica
  const sorting = useUserSorting(users);
  const filters = useUserFilters(sorting.sortedUsers);
  const pagination = usePagination(filters.filteredUsers);
  const actions = useUserActions();

  // Opciones únicas para los filtros
  const uniqueRoles = useMemo(() => {
    return [...new Set(users.map((u) => u.role_name).filter(Boolean))] as string[];
  }, [users]);

  const uniqueDepartments = useMemo(() => {
    return [...new Set(users.map((u) => u.department_name).filter(Boolean))] as string[];
  }, [users]);

  // Columnas de la tabla
  const columns = [
    { label: "Cédula", field: "identity_card" as keyof UserData },
    { label: "Email", field: "email" as keyof UserData },
    { label: "Nombre Completo", field: "full_name" as keyof UserData },
    { label: "Rol", field: "role_name" as keyof UserData },
    { label: "Estado", field: "is_active" as keyof UserData },
  ];

  // Loading y error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>Error al cargar usuarios: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Búsqueda por cédula */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar por cédula..."
            className="w-full p-2 border rounded"
            value={filters.searchId}
            onChange={(e) => filters.setSearchId(e.target.value)}
          />
        </div>

        {/* Filtro por rol */}
        <Select
          value={filters.roleFilter}
          onValueChange={filters.setRoleFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {parseRoleName(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por departamento */}
        <Select
          value={filters.departmentFilter}
          onValueChange={filters.setDepartmentFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {uniqueDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por estado */}
        <Select
          value={filters.statusFilter}
          onValueChange={filters.setStatusFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón limpiar filtros */}
        <Button variant="outline" onClick={filters.clearFilters}>
          Limpiar filtros
        </Button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.field}>
                  <Button
                    variant="ghost"
                    onClick={() => sorting.sortUsers(col.field)}
                    className="font-semibold"
                  >
                    {col.label}
                    {sorting.renderSortIcon(col.field) === "up" && (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    )}
                    {sorting.renderSortIcon(col.field) === "down" && (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                    {sorting.renderSortIcon(col.field) === "default" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              ))}
              <TableHead>Acciones</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedItems.length === 0 ? (
              <TableRow>
                <td colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios
                </td>
              </TableRow>
            ) : (
              pagination.paginatedItems.map((user: UserData) => (
                <ExpandableRow
                  key={user.id}
                  user={user}
                  expanded={actions.expanded === user.id}
                  onToggle={() => actions.toggleExpansion(user.id)}
                  onToggleActive={(identityCard) => actions.handleStatusChange(identityCard)}
                >
                  <ContentUserRow user={user} />
                </ExpandableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
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
            onClick={() => pagination.setCurrentPage(pagination.currentPage - 1)}
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
            onClick={() => pagination.setCurrentPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>

      {/* Dialog de confirmación de cambio de estado */}
      <Dialog
        open={actions.isStatusDialogOpen}
        onOpenChange={(open) => {
          if (!open) actions.cancelStatusUpdate();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cambiar el estado de este usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={actions.cancelStatusUpdate}>
              Cancelar
            </Button>
            <Button onClick={actions.confirmStatusUpdate}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}