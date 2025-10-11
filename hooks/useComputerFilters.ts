import { useState, useMemo } from "react";
import { ComputerEquipmentAdapted } from "@/lib/types";

export const useComputerFilters = (computers: ComputerEquipmentAdapted[]) => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredComputers = useMemo(() => {
    let filtered: ComputerEquipmentAdapted[] = computers;

    // Filtro por ID
    if (searchId.trim()) {
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) =>
        computer.id.toString().includes(searchId.trim())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(
        (computer: ComputerEquipmentAdapted) => computer.status === statusFilter
      );
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter(
        (computer: ComputerEquipmentAdapted) => computer.brand === brandFilter
      );
    }

    // Filtro por tipo de equipo
    if (typeFilter) {
      filtered = filtered.filter(
        (computer: ComputerEquipmentAdapted) => computer.type === typeFilter
      );
    }

    // Filtro por ubicación
    if (locationFilter) {
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) =>
        computer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    return filtered;
  }, [computers, searchId, statusFilter, brandFilter, typeFilter, locationFilter]);

  const clearFilters = () => {
    setSearchId("");
    setStatusFilter("");
    setBrandFilter("");
    setTypeFilter("");
    setLocationFilter("");
  };

  return {
    searchId,
    setSearchId,
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    locationFilter,
    setLocationFilter,
    typeFilter,
    setTypeFilter,
    filteredComputers,
    clearFilters,
  };
};
