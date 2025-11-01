import { useState, useMemo } from "react";
import { EquipmentAdapted } from "@/lib/types";

export const useEquipmentFilters = (equipments: EquipmentAdapted[]) => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredEquipments = useMemo(() => {
    let filtered: EquipmentAdapted[] = equipments;

    // Filtro por ID
    if (searchId.trim()) {
      filtered = filtered.filter((equipment: EquipmentAdapted) =>
        equipment.id.toString().includes(searchId.trim())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(
        (equipment: EquipmentAdapted) => equipment.status === statusFilter
      );
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter(
        (equipment: EquipmentAdapted) => equipment.brand === brandFilter
      );
    }

    // Filtro por tipo de equipo
    if (typeFilter) {
      filtered = filtered.filter(
        (equipment: EquipmentAdapted) => equipment.type_name === typeFilter
      );
    }

    // Filtro por ubicación
    if (locationFilter) {
      filtered = filtered.filter((computer: EquipmentAdapted) =>
        computer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    return filtered;
  }, [equipments, searchId, statusFilter, brandFilter, typeFilter, locationFilter]);

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
    filteredEquipments,
    clearFilters,
  };
};
