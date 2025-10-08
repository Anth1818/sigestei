"use client";

import { useMemo, useState } from "react";
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

import { Notification } from "../shared/Notification";
import { ExpandableComputerRow } from "@/components/inventory/ExpandableComputerRow";
import { fetchAllEquipment } from "@/api/api";
import { 
  adaptComputerData, 
  getStatusColor,
} from "@/lib/computerUtils";

import {ComputerEquipmentAdapted, ComputerEquipmentResponse}  from "@/lib/types";

export default function ComputerTable() {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // React Query para obtener los equipos
  const { data: equipmentData, isLoading, error } = useQuery<ComputerEquipmentResponse[]>({
    queryKey: ['equipment'],
    queryFn: fetchAllEquipment,
  });

  // Adaptar datos de la API al formato del componente
  const adaptedComputers: ComputerEquipmentAdapted[] = useMemo(() => {
    if (!equipmentData) return [];
    return equipmentData.map(adaptComputerData);
  }, [equipmentData]);

  // Datos adaptados
  const computers = adaptedComputers;

  // Opciones únicas para los filtros
  const uniqueStatuses = [...new Set(computers.map((c) => c.status).filter(Boolean))] as string[];
  const uniqueBrands = [...new Set(computers.map((c) => c.brand).filter(Boolean))] as string[];
  const uniqueTypes = [...new Set(computers.map((c) => c.type).filter(Boolean))] as string[];

  const columns = [
    {
      label: "ID",
      field: "id",
    },
    {
      label: "Nombre",
      field: "name",
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

  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentSort, setCurrentSort] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showNotification, setShowNotification] = useState(false);

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const updateComputerStatus = async (id: number, newStatus: string) => {
    setShowNotification(true);
    // TODO: Implementar llamada a la API para actualizar el estado
    // const updatedComputers = computers.map((computer) => {
    //   if (computer.id === id) {
    //     return { ...computer, status: newStatus };
    //   }
    //   return computer;
    // });
    // setComputers(updatedComputers);
    const timer = setTimeout(() => {
      setShowNotification(false);
      clearTimeout(timer);
    }, 2000);
  };

  const sortComputers = (field: string) => {
    const newDirection =
      currentSort?.column === field && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ column: field, direction: newDirection });

    // TODO: Implementar sorting con react-query si es necesario
    // const sortedComputers = [...computers].sort((a, b) => {
    //   const valueA = (a[field as keyof typeof a] || "").toString().trim();
    //   const valueB = (b[field as keyof typeof b] || "").toString().trim();

    //   if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
    //   if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
    //   return 0;
    // });

    // setComputers(sortedComputers);
  };

  const renderSortIcon = (field: string) => {
    if (currentSort?.column !== field) {
      return <ArrowUpDown size={16} />;
    }
    return currentSort.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Filtros múltiples
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
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) => computer.status === statusFilter);
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) => computer.brand === brandFilter);
    }

    // Filtro por tipo de equipo
    if (typeFilter) {
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) => computer.type === typeFilter);
    }

    // Filtro por ubicación
    if (locationFilter) {
      filtered = filtered.filter((computer: ComputerEquipmentAdapted) =>
        computer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    return filtered;
  }, [computers, searchId, statusFilter, brandFilter, typeFilter, locationFilter]);

  const paginatedComputers = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return filteredComputers.slice(startIdx, endIdx);
  }, [filteredComputers, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredComputers.length / rowsPerPage));

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchId("");
    setStatusFilter("");
    setBrandFilter("");
    setTypeFilter("");
    setLocationFilter("");
    setCurrentPage(1);
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
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full"
            placeholder="ID de equipo"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tipo de equipo:</label>
          <Select value={typeFilter} onValueChange={(value) => {
            setTypeFilter(value);
            setCurrentPage(1);
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
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
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
          <Select value={brandFilter} onValueChange={(value) => {
            setBrandFilter(value);
            setCurrentPage(1);
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
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full h-8"
            placeholder="Buscar ubicación"
          />
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={clearFilters} className="h-8">
            Limpiar filtros
          </Button>
        </div>
      </div>

      {showNotification && <Notification message="Equipo actualizado" />}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.field}
                onClick={() => sortComputers(col.field)}
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
          {paginatedComputers.map((computer: ComputerEquipmentAdapted) => (
            <ExpandableComputerRow
              key={computer.id}
              computer={computer}
              expanded={expanded === computer.id}
              onToggle={() => toggleExpansion(computer.id)}
              onUpdateStatus={updateComputerStatus}
              getStatusColor={getStatusColor}
            />
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
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
    </div>
  );
}
