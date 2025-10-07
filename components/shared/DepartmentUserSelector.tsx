"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchCatalogs, fetchAllUsersByDepartment } from "@/api/api";
import { UserData } from "@/lib/types";

interface DepartmentUserSelectorProps {
  // Usuario autenticado
  currentUserId?: number;
  currentUserRoleId?: number;
  currentUserDepartmentId?: number;
  
  // Valores seleccionados
  selectedDepartmentId: string;
  selectedUserId: string;
  
  // Callbacks para actualizar valores
  onDepartmentChange: (departmentId: string) => void;
  onUserChange: (userId: string) => void;
  
  // Configuración
  showDepartmentSelect?: boolean; // Por defecto true si role_id !== 4
  filterCurrentUser?: boolean; // Filtrar el usuario actual de la lista
  
  // Labels personalizables
  departmentLabel?: string;
  userLabel?: string;
  departmentPlaceholder?: string;
  userPlaceholder?: string;
  
  // Errores de validación
  departmentError?: string;
  userError?: string;
}

export function DepartmentUserSelector({
  currentUserId,
  currentUserRoleId,
  currentUserDepartmentId,
  selectedDepartmentId,
  selectedUserId,
  onDepartmentChange,
  onUserChange,
  showDepartmentSelect = true,
  filterCurrentUser = false,
  departmentLabel = "Selecciona el departamento",
  userLabel = "Selecciona el usuario",
  departmentPlaceholder = "Selecciona un departamento",
  userPlaceholder = "Selecciona un usuario",
  departmentError,
  userError,
}: DepartmentUserSelectorProps) {
  
  // Obtener catálogos (incluye departamentos)
  const { data: catalogs, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  const departments = catalogs?.departments || [];

  // Determinar qué departamento usar para la consulta
  const departmentIdToFetch =
    currentUserRoleId === 4
      ? currentUserDepartmentId
      : selectedDepartmentId
      ? Number(selectedDepartmentId)
      : null;

  // Obtener usuarios del departamento
  const { data: departmentUsers, isLoading: departmentUsersLoading } = useQuery({
    queryKey: ["departmentUsers", departmentIdToFetch],
    queryFn: async () => {
      if (!departmentIdToFetch) {
        return [];
      }
      return await fetchAllUsersByDepartment(departmentIdToFetch);
    },
    enabled: !!departmentIdToFetch,
  });

  // Filtrar usuarios si es necesario
  const filteredUsers = filterCurrentUser && currentUserId
    ? departmentUsers?.filter((u: UserData) => u.id !== currentUserId) || []
    : departmentUsers || [];

  // Reset selectedUserId cuando cambia el departamento
  useEffect(() => {
    if (selectedDepartmentId && onUserChange) {
      onUserChange("");
    }
  }, [selectedDepartmentId]);

  // Determinar si mostrar el select de departamentos
  const shouldShowDepartmentSelect = showDepartmentSelect && currentUserRoleId !== 4;

  return (
    <>
      {/* Select de Departamento - Solo si no es role_id 4 */}
      {shouldShowDepartmentSelect && (
        <div className="mb-6">
          <Label htmlFor="department-select" className="block mb-1">
            {departmentLabel}
          </Label>
          <Select value={selectedDepartmentId} onValueChange={onDepartmentChange}>
            <SelectTrigger id="department-select" className="w-full">
              <SelectValue placeholder={departmentPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {catalogsLoading ? (
                <SelectItem value="loading" disabled>
                  Cargando departamentos...
                </SelectItem>
              ) : departments.length === 0 ? (
                <SelectItem value="not-found" disabled>
                  No hay departamentos disponibles
                </SelectItem>
              ) : (
                departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {departmentError && (
            <span className="text-red-500 text-xs">{departmentError}</span>
          )}
        </div>
      )}

      {/* Select de Usuario - Se muestra cuando hay un departamento seleccionado o role_id === 4 */}
      {(currentUserRoleId === 4 || selectedDepartmentId) && (
        <div className="mb-6">
          <Label htmlFor="user-select" className="block mb-1">
            {userLabel}
          </Label>
          <Select value={selectedUserId} onValueChange={onUserChange}>
            <SelectTrigger id="user-select" className="w-full">
              <SelectValue placeholder={userPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {departmentUsersLoading ? (
                <SelectItem value="loading" disabled>
                  Cargando usuarios...
                </SelectItem>
              ) : filteredUsers.length === 0 ? (
                <SelectItem value="not-found" disabled>
                  No hay usuarios disponibles
                </SelectItem>
              ) : (
                filteredUsers.map((u: UserData) => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.full_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {userError && (
            <span className="text-red-500 text-xs">{userError}</span>
          )}
        </div>
      )}
    </>
  );
}
