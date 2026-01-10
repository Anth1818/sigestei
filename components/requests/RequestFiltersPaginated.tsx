import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import { Search, X } from "lucide-react";

interface CatalogItem {
  id: number;
  name: string;
}

interface TechnicianItem {
  id: number;
  full_name: string;
}

interface RequestFiltersPaginatedProps {
  // Filtros de técnicos
  technicianFilter: string;
  setTechnicianFilter: (value: string) => void;
  technicians: TechnicianItem[];
  
  // Filtros de estado
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  statuses: CatalogItem[];
  
  // Filtros de prioridad
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  priorities: CatalogItem[];
  
  // Filtros de tipo
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  types: CatalogItem[];
  
  // Filtros de fecha
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  
  // Acciones
  onSearch: () => void;
  onClearFilters: () => void;
  
  // Estado
  isSearching?: boolean;
  hasActiveFilters?: boolean;
}

export function RequestFiltersPaginated({
  technicianFilter,
  setTechnicianFilter,
  technicians,
  statusFilter,
  setStatusFilter,
  statuses,
  priorityFilter,
  setPriorityFilter,
  priorities,
  typeFilter,
  setTypeFilter,
  types,
  dateRange,
  setDateRange,
  onSearch,
  onClearFilters,
  isSearching = false,
  hasActiveFilters = false,
}: RequestFiltersPaginatedProps) {
  return (
    <div className="mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div>
          <label className="text-sm font-medium block mb-1">Técnico:</label>
          <Select
            value={technicianFilter}
            onValueChange={setTechnicianFilter}
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
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
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
            onValueChange={setPriorityFilter}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
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
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Rango de Fechas:</label>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onSearch}
          disabled={isSearching}
          className="h-8"
        >
          <Search className="mr-2 h-4 w-4" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-8"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
