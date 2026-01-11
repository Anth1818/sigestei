"use client";

import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "@/hooks/useRequestFilters";

interface CatalogItem {
  id: number;
  name: string;
}

interface TechnicianItem {
  id: number;
  full_name: string;
}

interface Catalogs {
  request_statuses?: CatalogItem[];
  priority_requests?: CatalogItem[];
  request_types?: CatalogItem[];
  technicians?: TechnicianItem[];
}

interface RequestFiltersProps {
  // Valores de filtros
  hasClickedSearch: boolean;
  searchId: string;
  technicianFilter: string;
  statusFilter: string;
  priorityFilter: string;
  typeFilter: string;
  dateRange: DateRange;
  
  // Handlers
  onSearchIdChange: (value: string) => void;
  onTechnicianFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onDateRangeChange: (value: DateRange) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  
  // Estado
  isFetching: boolean;
  hasActiveFilters: boolean;
  
  // Datos de catálogos
  catalogs?: Catalogs;
}

export function RequestFilters({
  searchId,
  technicianFilter,
  statusFilter,
  priorityFilter,
  typeFilter,
  dateRange,
  onSearchIdChange,
  onTechnicianFilterChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onTypeFilterChange,
  onDateRangeChange,
  onSearch,
  onClearFilters,
  isFetching,
  hasActiveFilters,
  catalogs,
}: RequestFiltersProps) {
  const technicians = catalogs?.technicians || [];

  return (
    <div className="mb-4 space-y-4">
      {/* Búsqueda por ID */}
      <div className="flex items-end gap-2">
        <div className="w-64">
          <label htmlFor="search-id" className="text-sm font-medium block mb-1">
            Buscar por ID:
          </label>
          <div className="relative">
            <input
              id="search-id"
              type="text"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm w-full"
              placeholder="ID de solicitud"
            />
          </div>
        </div>
      </div>

      {/* Otros filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div>
          <label className="text-sm font-medium block mb-1">Técnico:</label>
          <Select 
            value={technicianFilter} 
            onValueChange={onTechnicianFilterChange}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((technician) => (
                <SelectItem key={technician.id} value={technician.id.toString()}>
                  {technician.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Estado:</label>
          <Select 
            value={statusFilter} 
            onValueChange={onStatusFilterChange}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {catalogs?.request_statuses?.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Prioridad:</label>
          <Select 
            value={priorityFilter} 
            onValueChange={onPriorityFilterChange}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {catalogs?.priority_requests?.map((priority) => (
                <SelectItem key={priority.id} value={priority.id.toString()}>
                  {priority.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tipo:</label>
          <Select 
            value={typeFilter} 
            onValueChange={onTypeFilterChange}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {catalogs?.request_types?.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Rango de Fechas:</label>
          <DateRangePicker 
            dateRange={dateRange} 
            setDateRange={onDateRangeChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          onClick={onSearch} 
          disabled={isFetching || !hasActiveFilters} 
          className="h-8"
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isFetching ? "Buscando..." : "Buscar"}
        </Button>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="h-8">
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
