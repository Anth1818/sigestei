import { useState, useMemo } from "react";
import { UserData } from "@/lib/types";

export function useUserFilters(users: UserData[]) {
  const [searchId, setSearchId] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Filtrar por cédula
    if (searchId.trim()) {
      filtered = filtered.filter((user) =>
        user.identity_card.toString().includes(searchId.trim())
      );
    }

    // Filtrar por rol
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role_name === roleFilter);
    }

    // Filtrar por departamento
    if (departmentFilter && departmentFilter !== "all") {
      filtered = filtered.filter((user) => user.department_name === departmentFilter);
    }

    // Filtrar por estado
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    return filtered;
  }, [users, searchId, roleFilter, departmentFilter, statusFilter]);

  const clearFilters = () => {
    setSearchId("");
    setRoleFilter("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  return {
    searchId,
    setSearchId,
    roleFilter,
    setRoleFilter,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    clearFilters,
  };
}
