import { Computer, FileText, User, MessageSquare } from "lucide-react"
import { Request } from "@/lib/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ContentRequestRowProps {
  request: Request;
}

const technicians = [
  "Carlos Rodríguez",
  "Ana García",
  "Luis Martínez",
  "Pedro Fernández",
];

const ContentRequestRow = ({ request }: ContentRequestRowProps) => {
  const [assignedTo, setAssignedTo] = useState(request.assigned_to);
  const [technicianComments, setTechnicianComments] = useState("");
  
  const isCompletedOrCancelled = request.status === "Completada" || request.status === "Cancelada";
  
  const handleSaveComments = () => {
    // Aquí podrías hacer una llamada a la API para guardar los comentarios
    console.log("Guardando comentarios:", technicianComments);
    // Ejemplo: updateRequestComments(request.id, technicianComments);
  };

  return <div className="grid grid-cols-2 gap-6">
    {/* Información de la Solicitud */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-lg">
          Detalles de la Solicitud
        </h4>
      </div>

      <div className="space-y-2">
        <div>
          <span className="font-medium text-sm text-gray-400">
            Descripción:
          </span>
          <div className="w-full">
            <textarea className="text-sm mt-1 p-2 bg-white dark:text-black rounded border h-48 w-sm md:w-md scroll-auto resize-none" disabled>
              {request.description}
            </textarea>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-400">
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
        </div>
      </div>
    </div>

    {/* Información del Solicitante */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-5 w-5 text-green-600" />
        <h4 className="font-semibold text-lg">Solicitante</h4>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-sm text-gray-400">
              Nombre:
            </span>
            <p className="text-sm">{request.user.full_name}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">
              Cédula:
            </span>
            <p className="text-sm">
              {request.user.identity_card}
            </p>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">
              Email:
            </span>
            <p className="text-sm">{request.user.email}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">
              Cargo:
            </span>
            <p className="text-sm">{request.user.position}</p>
          </div>
        </div>
        <div>
          <span className="font-medium text-sm text-gray-400">
            Departamento:
          </span>
          <p className="text-sm">{request.user.department}</p>
        </div>
      </div>
    </div>

    {/* Información del Equipo Principal */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Computer className="h-5 w-5 text-purple-600" />
        <h4 className="font-semibold text-lg">
          Equipo Principal
        </h4>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-sm text-gray-400">
              Nombre:
            </span>
            <p className="text-sm">
              {request.computer_equipment.name}
            </p>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">
              Modelo:
            </span>
            <p className="text-sm">
              {request.computer_equipment.model}
            </p>
          </div>
        </div>
        <div>
          <span className="font-medium text-sm text-gray-400">
            N° Serie:
          </span>
          <p className="text-sm">
            {request.computer_equipment.serial_number}
          </p>
        </div>
      </div>
      <div>
        <span className="font-medium text-sm text-gray-400">
          N° de Bien:
        </span>
        <p className="text-sm">
          {request.computer_equipment_id}
        </p>
      </div>
    </div>

    {/* Información del Beneficiario (si es tercero) */}
    {request.third_party && (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-orange-600" />
          <h4 className="font-semibold text-lg">
            Beneficiario Final
          </h4>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-sm text-gray-400">
                Nombre:
              </span>
              <p className="text-sm">
                {request.third_party.full_name}
              </p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">
                Cédula:
              </span>
              <p className="text-sm">
                {request.third_party.identity_card}
              </p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">
                Email:
              </span>
              <p className="text-sm">
                {request.third_party.email}
              </p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">
                Cargo:
              </span>
              <p className="text-sm">
                {request.third_party.position}
              </p>
            </div>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">
              Departamento:
            </span>
            <p className="text-sm">
              {request.third_party.department}
            </p>
          </div>

          {/* Equipo del Beneficiario */}
          <div className="mt-4 p-3 bg-white dark:text-black rounded border">
            <div className="flex items-center gap-2 mb-2">
              <Computer className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-sm">
                Equipo del Beneficiario
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-700">Nombre:</span>
                <p>
                  {request.third_party.computer_equipment.name}
                </p>
              </div>
              <div>
                <span className="text-gray-700">Modelo:</span>
                <p>
                  {request.third_party.computer_equipment.model}
                </p>
              </div>
              <div>
                <span className="text-gray-700">N° Serie:</span>
                <p>
                  {
                    request.third_party.computer_equipment
                      .serial_number
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-700">
                  N° de Bien:
                </span>
                <p className="text-sm">
                  {request.computer_equipment_id}
                </p>
              </div>
              <div>
                <span className="text-gray-700">Ubicación:</span>
                <p>
                  {
                    request.third_party.computer_equipment
                      .location
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Comentarios del Técnico */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-5 w-5 text-indigo-600" />
        <h4 className="font-semibold text-lg">Comentarios del Técnico</h4>
      </div>

      <div className="space-y-3">
        <div>
          <span className="font-medium text-sm text-gray-400 mb-2 block">
            Observaciones y comentarios:
          </span>
          <textarea 
            className={`w-full h-32 p-3 border rounded-md text-sm resize-none ${
              isCompletedOrCancelled 
                ? 'bg-white border-gray-300 dark:border-gray-600 text-black' 
                : 'bg-gray-100 border-gray-200 cursor-not-allowed text-black'
            }`}
            placeholder={isCompletedOrCancelled ? "Escriba los comentarios del técnico..." : "Los comentarios solo pueden editarse cuando el estado sea 'Completada' o 'Cancelada'"}
            value={technicianComments}
            onChange={(e) => setTechnicianComments(e.target.value)}
            disabled={!isCompletedOrCancelled}
          />
        </div>
        
        {isCompletedOrCancelled && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveComments}
              size="sm"
              
            >
              Guardar Comentarios
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
}
export default ContentRequestRow;