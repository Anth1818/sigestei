"use client";

import { useMemo, useState } from "react";
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
import { mockComputerEquipment } from "@/data/mockComputerEquipment";

export default function ComputerTable() {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  
  const [computers, setComputers] = useState(mockComputerEquipment);

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
    const updatedComputers = computers.map((computer) => {
      if (computer.id === id) {
        return { ...computer, status: newStatus };
      }
      return computer;
    });
    setComputers(updatedComputers);
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

    const sortedComputers = [...computers].sort((a, b) => {
      const valueA = (a[field as keyof typeof a] || "").toString().trim();
      const valueB = (b[field as keyof typeof b] || "").toString().trim();

      if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setComputers(sortedComputers);
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
    let filtered = computers;

    // Filtro por ID
    if (searchId.trim()) {
      filtered = filtered.filter((computer) =>
        computer.id.toString().includes(searchId.trim())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter((computer) => computer.status === statusFilter);
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter((computer) => computer.brand === brandFilter);
    }

    // Filtro por ubicación
    if (locationFilter) {
      filtered = filtered.filter((computer) => 
        computer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    return filtered;
  }, [computers, searchId, statusFilter, brandFilter, locationFilter]);

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
    setLocationFilter("");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo": return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
      case "En mantenimiento": return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs";
      case "En reparación": return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs";
      case "Inactivo": return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto py-1">
      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <label className="text-sm font-medium block mb-1">Estado:</label>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="En mantenimiento">En mantenimiento</SelectItem>
              <SelectItem value="En reparación">En reparación</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
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
              <SelectItem value="Dell">Dell</SelectItem>
              <SelectItem value="HP">HP</SelectItem>
              <SelectItem value="Lenovo">Lenovo</SelectItem>
              <SelectItem value="Acer">Acer</SelectItem>
              <SelectItem value="ASUS">ASUS</SelectItem>
              <SelectItem value="MSI">MSI</SelectItem>
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
          {paginatedComputers.map((computer) => (
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
    </div>
  );
}
