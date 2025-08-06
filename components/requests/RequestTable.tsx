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
import { Request, SortColumnRequest } from "@/lib/types";
import { ExpandableRequestRow } from "./ExpandableRequestRow";
import { mockRequests } from "@/data/mockRequests";

export default function RequestTable() {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  const [requests, setRequests] = useState<Request[]>(mockRequests);

  const columns = [
    {
      label: "ID",
      field: "id",
    },
    {
      label: "Tipo",
      field: "request_type",
    },
    {
      label: "Prioridad",
      field: "priority",
    },
    {
      label: "Estado",
      field: "status",
    },
    {
      label: "Solicitante",
      field: "requestor_name",
    },
    {
      label: "Beneficiario",
      field: "beneficiary_name",
    },
    {
      label: "Fecha",
      field: "request_date",
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentSort, setCurrentSort] = useState<SortColumnRequest>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showNotification, setShowNotification] = useState(false);

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const updateRequestStatus = async (id: number, newStatus: string) => {
    setShowNotification(true);
    const updatedRequests = requests.map((request) => {
      if (request.id === id) {
        return { ...request, status: newStatus as any };
      }
      return request;
    });
    setRequests(updatedRequests);
    
    const timer = setTimeout(() => {
      setShowNotification(false);
      clearTimeout(timer);
    }, 2000);
  };

  const sortRequests = (field: keyof Request | "requestor_name" | "beneficiary_name") => {
    const newDirection =
      currentSort?.column === field && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ column: field, direction: newDirection });

    const sortedRequests = [...requests].sort((a, b) => {
      let valueA: string, valueB: string;

      if (field === "requestor_name") {
        valueA = a.user.full_name.trim();
        valueB = b.user.full_name.trim();
      } else if (field === "beneficiary_name") {
        valueA = a.third_party?.full_name || a.user.full_name;
        valueB = b.third_party?.full_name || b.user.full_name;
      } else {
        valueA = (a[field as keyof Request] || "").toString().trim();
        valueB = (b[field as keyof Request] || "").toString().trim();
      }

      if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setRequests(sortedRequests);
  };

  const renderSortIcon = (field: keyof Request | "requestor_name" | "beneficiary_name") => {
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
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filtro por ID
    if (searchId.trim()) {
      filtered = filtered.filter((request) =>
        request.id.toString().includes(searchId.trim())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Filtro por prioridad
    if (priorityFilter) {
      filtered = filtered.filter((request) => request.priority === priorityFilter);
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter((request) => request.request_type === typeFilter);
    }

    return filtered;
  }, [requests, searchId, statusFilter, priorityFilter, typeFilter]);

  const paginatedRequests = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return filteredRequests.slice(startIdx, endIdx);
  }, [filteredRequests, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / rowsPerPage));

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchId("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "text-red-600 font-semibold";
      case "Media": return "text-yellow-600 font-semibold";
      case "Baja": return "text-green-600 font-semibold";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs";
      case "En progreso": return "text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs";
      case "Completada": return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
      case "Cancelada": return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
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
            placeholder="ID de solicitud"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Estado:</label>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Prioridad:</label>
          <Select value={priorityFilter} onValueChange={(value) => {
            setPriorityFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tipo:</label>
          <Select value={typeFilter} onValueChange={(value) => {
            setTypeFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="Instalación">Instalación</SelectItem>
              <SelectItem value="Reparación">Reparación</SelectItem>
              <SelectItem value="Actualización">Actualización</SelectItem>
              <SelectItem value="Soporte">Soporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={clearFilters} className="h-8">
            Limpiar filtros
          </Button>
        </div>
      </div>

      {showNotification && <Notification message="Solicitud actualizada" />}
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.field}
                onClick={() => sortRequests(col.field as any)}
                className="cursor-pointer p-2"
              >
                {col.label}
                {renderSortIcon(col.field as any)}
              </TableHead>
            ))}
            <TableHead className="p-2">Acciones</TableHead>
            <TableHead className="p-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRequests.map((request) => (
            <ExpandableRequestRow
              key={request.id}
              request={request}
              expanded={expanded === request.id}
              onToggle={() => toggleExpansion(request.id)}
              onUpdateStatus={updateRequestStatus}
              getPriorityColor={getPriorityColor}
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
