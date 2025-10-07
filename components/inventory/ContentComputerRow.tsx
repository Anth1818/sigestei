import { Computer, FileText, User, ListChecks, Users } from "lucide-react";
import { useState } from "react";
import { DepartmentUserSelector } from "@/components/shared/DepartmentUserSelector";
import { useUserStore } from "@/hooks/useUserStore";
import Link from "next/link";

interface ContentComputerRowProps {
  computer: any;
}

const ContentComputerRow = ({ computer }: ContentComputerRowProps) => {
  const user = useUserStore((state) => state.user);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(
    computer.assigned_user_id?.toString() || ""
  );

  // Extraer los IDs de requests asociados
  const associatedRequests = Array.isArray(computer.requests)
    ? computer.requests
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Columna izquierda: Asignación de usuario */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">Asignación</h4>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Equipo asignado a:{" "}
            <span className="font-medium">
              {computer.assigned_to || "No asignado"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">Reasignación de equipo</h4>
        </div>

        <DepartmentUserSelector
          currentUserId={user?.id}
          currentUserRoleId={user?.role_id}
          currentUserDepartmentId={user?.department_id}
          selectedDepartmentId={selectedDepartmentId}
          selectedUserId={selectedUserId}
          onDepartmentChange={setSelectedDepartmentId}
          onUserChange={setSelectedUserId}
          filterCurrentUser={false}
          departmentLabel="Departamento"
          userLabel="Asignado a"
          departmentPlaceholder="Selecciona un departamento"
          userPlaceholder="Selecciona un usuario"
        />

        {/* Lista de solicitudes asociadas */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-lg">Solicitudes asociadas</h4>
          </div>

          {associatedRequests.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No hay solicitudes asociadas a este equipo
            </p>
          ) : (
            <ul className="space-y-2">
              {associatedRequests.map((requestId: number) => (
                <li key={requestId}>
                  <Link
                    href={`/viewRequests?id=${requestId}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Solicitud #{requestId}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Columna derecha: Especificaciones Técnicas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-lg">Especificaciones</h4>
        </div>

        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-sm text-gray-600 mb-2">
              Hardware:
            </h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <strong>CPU:</strong> {computer.hardware_specs?.cpu}
              </div>
              <div>
                <strong>RAM:</strong> {computer.hardware_specs?.ram}
              </div>
              <div>
                <strong>Almacenamiento:</strong>{" "}
                {computer.hardware_specs?.storage}
              </div>
              <div>
                <strong>GPU:</strong> {computer.hardware_specs?.gpu}
              </div>
              <div>
                <strong>Red:</strong> {computer.hardware_specs?.network}
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-sm text-gray-600 mb-2">
              Software:
            </h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <strong>Sistema Operativo:</strong> {computer.software?.os}
              </div>
              <div>
                <strong>Suite de Oficina:</strong> {computer.software?.office}
              </div>
              <div>
                <strong>Antivirus:</strong> {computer.software?.antivirus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentComputerRow };
