import { Computer, FileText, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

interface ContentComputerRowProps {
  computer: any;
}

const technicians = [
  "Carlos Rodríguez",
  "Ana García",
  "Luis Martínez",
  "Pedro Fernández",
];

const ContentComputerRow = ({ computer }: ContentComputerRowProps) => {
  const [assignedTo, setAssignedTo] = useState(computer.assigned_to);
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Información del Equipo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Computer className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">
            Detalles del Equipo
          </h4>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-sm text-gray-600">
                Marca:
              </span>
              <p className="text-sm">{computer.brand}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-600">
                Modelo:
              </span>
              <p className="text-sm">{computer.model}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-600">
                Número de Serie:
              </span>
              <p className="text-sm">{computer.serial_number}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-600">
                Ubicación:
              </span>
              <p className="text-sm">{computer.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-600">
                Asignado a:
              </span>
              <Select
                value={assignedTo}
                onValueChange={setAssignedTo}
              >
                <SelectTrigger className="h-7 min-w-[180px] w-auto">
                  <SelectValue placeholder="Asignar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-600">
                Número de Bien:
              </span>
              <p className="text-sm">{computer.asset_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Especificaciones Técnicas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-lg">Especificaciones</h4>
        </div>

        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-sm text-gray-600 mb-2">Hardware:</h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><strong>CPU:</strong> {computer.hardware_specs?.cpu}</div>
              <div><strong>RAM:</strong> {computer.hardware_specs?.ram}</div>
              <div><strong>Almacenamiento:</strong> {computer.hardware_specs?.storage}</div>
              <div><strong>GPU:</strong> {computer.hardware_specs?.gpu}</div>
              <div><strong>Red:</strong> {computer.hardware_specs?.network}</div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-sm text-gray-600 mb-2">Software:</h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><strong>Sistema Operativo:</strong> {computer.software?.os}</div>
              <div><strong>Suite de Oficina:</strong> {computer.software?.office}</div>
              <div><strong>Antivirus:</strong> {computer.software?.antivirus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentComputerRow };
