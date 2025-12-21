import { FileText, User, ListChecks, Users, History } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DepartmentUserSelector } from "@/components/shared/DepartmentUserSelector";
import { useUserStore } from "@/hooks/useUserStore";
import Link from "next/link";
import { EquipmentAdapted, EquipmentAuditHistory } from "@/lib/types";
import { updateEquipmentData, fetchEquipmentAudit } from "@/api/api";
import { toast } from "sonner";
import EquipmentAuditDetail from "@/components/audit/EquipmentAuditDetail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { colorForSoonerError } from "@/lib/utils";

interface ContentEquipmentRowProps {
  equipment: EquipmentAdapted;
  assigned_user_name: string;
  setAssigned_user_name: (name: string) => void;
}

const ContentEquipmentRow = ({
  equipment,
  assigned_user_name,
  setAssigned_user_name,
}: ContentEquipmentRowProps) => {
  const user = useUserStore((state) => state.user);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(
    equipment.assigned_user_id?.toString() || ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Query para obtener el historial de auditoría
  const { data: auditHistory, isLoading: isLoadingAudit } =
    useQuery<EquipmentAuditHistory>({
      queryKey: ["equipment-audit", equipment.id],
      queryFn: () => fetchEquipmentAudit(equipment.id),
      enabled: isAuditOpen,
    });

  // Determinar si es una impresora usando type_name
  const isPrinter = equipment.type_name?.toLowerCase().includes("impresora");

  // Extraer los IDs de requests asociados
  const associatedRequests = equipment.requests_linked || [];

  // Mutation para actualizar el equipo (reasignar)
  const updateEquipmentMutation = useMutation({
    mutationFn: async (newUserId: number) => {
      const response = await updateEquipmentData(equipment.id, {
        assigned_user_id: newUserId,
      });
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success("Equipo reasignado correctamente");
      setIsDialogOpen(false);
      setSelectedDepartmentId("");
      setSelectedUserId("");
      setAssigned_user_name(response.data.assigned_user_name || "No asignado");
    },
    onError: (error: any) => {
      toast.error(error?.message, { style: colorForSoonerError });
    },
  });

  // Mutation para desvincular usuario del equipo
  const unlinkUserMutation = useMutation({
    mutationFn: async () => {
      const response = await updateEquipmentData(equipment.id, {
        assigned_user_id: null,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Usuario desvinculado correctamente");
      setIsUnlinkDialogOpen(false);
      setAssigned_user_name("No asignado");
    },
    onError: (error: any) => {
      toast.error(error?.message, { style: colorForSoonerError });
    },
  });

  // Abrir dialog cuando hay departamento y usuario seleccionado
  const handleReassign = () => {
    if (selectedDepartmentId && selectedUserId) {
      setIsDialogOpen(true);
    }
  };

  // Confirmar reasignación
  const handleConfirmReassign = () => {
    if (selectedUserId) {
      updateEquipmentMutation.mutate(parseInt(selectedUserId));
    }
  };

  // Abrir dialog de desvinculación
  const handleUnlinkUser = () => {
    setIsUnlinkDialogOpen(true);
  };

  // Confirmar desvinculación
  const handleConfirmUnlink = () => {
    unlinkUserMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Si es impresora, solo mostrar solicitudes asociadas en una sola columna centrada */}
      {isPrinter ? (
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-lg">Solicitudes asociadas</h4>
          </div>

          {associatedRequests.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No hay solicitudes asociadas a esta impresora
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
      ) : (
        <>
          {/* Columna izquierda: Asignación de usuario - Solo para equipos que NO son impresoras */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-lg">Asignación</h4>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Equipo asignado a:{" "}
                <span className="font-medium">
                  {assigned_user_name || "No asignado"}
                </span>
              </p>
              {assigned_user_name && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleUnlinkUser}
                  className="mt-2"
                  disabled={unlinkUserMutation.isPending}
                >
                  {unlinkUserMutation.isPending
                    ? "Desvinculando..."
                    : "Desvincular usuario"}
                </Button>
              )}
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

            {/* Botón para confirmar reasignación */}
            {selectedDepartmentId && selectedUserId && (
              <Button
                onClick={handleReassign}
                className="w-full mt-4"
                disabled={updateEquipmentMutation.isPending}
              >
                {updateEquipmentMutation.isPending
                  ? "Procesando..."
                  : "Reasignar equipo"}
              </Button>
            )}

            {/* Botón para ver historial - Solo admin y manager */}
            {(user?.role_id === 1 || user?.role_id === 2) && (
              <Button
                onClick={() => setIsAuditOpen(true)}
                variant="outline"
                className="w-full mt-2 gap-2"
              >
                <History className="h-4 w-4" />
                Ver historial de cambios
              </Button>
            )}

            {/* Lista de solicitudes asociadas */}
            {user?.role_id !== 3 && user?.role_id !== 4 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-lg">
                    Solicitudes asociadas
                  </h4>
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
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-white hover:underline flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Solicitud #{requestId}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
                    <strong>CPU:</strong>{" "}
                    {equipment.specifications?.hardware?.cpu}
                  </div>
                  <div>
                    <strong>RAM:</strong>{" "}
                    {equipment.specifications?.hardware?.ram}
                  </div>
                  <div>
                    <strong>Almacenamiento:</strong>{" "}
                    {equipment.specifications?.hardware?.storage}
                  </div>
                  <div>
                    <strong>GPU:</strong>{" "}
                    {equipment.specifications?.hardware?.gpu}
                  </div>
                  <div>
                    <strong>Red:</strong>{" "}
                    {equipment.specifications?.hardware?.network}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm text-gray-600 mb-2">
                  Software:
                </h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <strong>Sistema Operativo:</strong>{" "}
                    {equipment.specifications?.software?.os}
                  </div>
                  <div>
                    <strong>Suite de Oficina:</strong>{" "}
                    {equipment.specifications?.software?.office}
                  </div>
                  <div>
                    <strong>Antivirus:</strong>{" "}
                    {equipment.specifications?.software?.antivirus}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog de confirmación */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar reasignación de equipo</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas reasignar este equipo al usuario
                  seleccionado? Esta acción actualizará el registro de
                  asignación.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="text-sm text-gray-600">
                  <strong>Equipo:</strong> {equipment.brand} {equipment.model}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Número de serie:</strong> {equipment.serial_number}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Asignación actual:</strong>{" "}
                  {equipment.assigned_to || "No asignado"}
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={updateEquipmentMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmReassign}
                  disabled={updateEquipmentMutation.isPending}
                >
                  {updateEquipmentMutation.isPending
                    ? "Procesando..."
                    : "Confirmar reasignación"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de confirmación de desvinculación */}
          <Dialog
            open={isUnlinkDialogOpen}
            onOpenChange={setIsUnlinkDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar desvinculación de usuario</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas desvincular al usuario actual de
                  este equipo? El equipo quedará sin asignación.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="text-sm text-gray-600">
                  <strong>Equipo:</strong> {equipment.brand} {equipment.model}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Número de serie:</strong> {equipment.serial_number}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Usuario actual:</strong> {assigned_user_name}
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUnlinkDialogOpen(false)}
                  disabled={unlinkUserMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmUnlink}
                  disabled={unlinkUserMutation.isPending}
                >
                  {unlinkUserMutation.isPending
                    ? "Procesando..."
                    : "Confirmar desvinculación"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de historial de auditoría */}
          <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Historial de Auditoría - Equipo #{equipment.id}
                </DialogTitle>
                <DialogDescription>
                  Historial completo de cambios y asignaciones de este equipo
                </DialogDescription>
              </DialogHeader>
              {isLoadingAudit && (
                <div className="text-center py-8">Cargando historial...</div>
              )}
              {auditHistory && (
                <EquipmentAuditDetail auditHistory={auditHistory} />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ContentEquipmentRow;
