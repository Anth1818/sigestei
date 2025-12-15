import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";

interface RequestFiltersProps {
  searchId: string;
  setSearchId: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFilterType: "creation" | "resolution";
  setDateFilterType: (value: "creation" | "resolution") => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  clearFilters: () => void;
  uniqueStatuses: string[];
  uniquePriorities: string[];
  uniqueTypes: string[];
  uniqueTechnicians: string[];
  onPageReset: () => void;
  technicianFilter: string;
  setTechnicianFilter: (value: string) => void;
}

export function RequestFilters({
  searchId,
  setSearchId,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  typeFilter,
  setTypeFilter,
  technicianFilter,
  setTechnicianFilter,
  dateFilterType,
  setDateFilterType,
  dateRange,
  setDateRange,
  clearFilters,
  uniqueStatuses,
  uniquePriorities,
  uniqueTypes,
  uniqueTechnicians,
  onPageReset,
}: RequestFiltersProps) {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
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
            onPageReset();
          }}
          className="border rounded px-2 py-1 text-sm w-full"
          placeholder="ID de solicitud"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Técnicos:</label>
        <Select
          value={technicianFilter}
          onValueChange={(value) => {
            setTechnicianFilter(value);
            onPageReset();
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            {uniqueTechnicians.map((technician) => (
              <SelectItem key={technician} value={technician}>
                {technician}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Estado:</label>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            onPageReset();
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Prioridad:</label>
        <Select
          value={priorityFilter}
          onValueChange={(value) => {
            setPriorityFilter(value);
            onPageReset();
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            {uniquePriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Tipo:</label>
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value);
            onPageReset();
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Filtrar fechas por:
        </label>
        <div className="flex gap-4 items-center h-8">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="dateFilterType"
              value="creation"
              checked={dateFilterType === "creation"}
              onChange={() => setDateFilterType("creation")}
              className="cursor-pointer"
            />
            Creación
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="dateFilterType"
              value="resolution"
              checked={dateFilterType === "resolution"}
              onChange={() => setDateFilterType("resolution")}
              className="cursor-pointer"
            />
            Resolución
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Rango de Fechas:</label>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <div className="flex items-end">
        <Button
          variant="outline"
          onClick={() => {
            clearFilters();
            onPageReset();
          }}
          className="h-8"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
