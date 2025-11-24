import { Computer, FileText, User, MessageSquare } from "lucide-react";
import { Request } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCatalogs, updateRequest } from "@/api/api";
import { toast } from "sonner";
import { useUserStore } from "@/hooks/useUserStore";

interface ContentRequestRowProps {
  request: Request;
}

const ContentRequestRow = ({ request }: ContentRequestRowProps) => {
  const [assignedTo, setAssignedTo] = useState(
    request.assigned_to === "N/A" ? "" : request.assigned_to
  );
  const [comments_technician, setCommentsTechnician] = useState(
    request.comments_technician || ""
  );
  // Estados para el diálogo de confirmación de técnico
  const [isTechnicianDialogOpen, setIsTechnicianDialogOpen] = useState(false);
  const [pendingTechnician, setPendingTechnician] = useState<{
    name: string;
    id: number;
  } | null>(null);

  const user = useUserStore((state) => state.user);

  // Obtener catálogos que incluyen técnicos
  const { data: catalogs, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  // Filtrar técnicos del catálogo
  const technicians = catalogs?.technicians || [];

  const queryClient = useQueryClient();

  // Mutation para actualizar el técnico asignado (y estado si es necesario)
  const updateTechnicianMutation = useMutation({
    mutationFn: async ({
      id,
      technicianId,
      statusId,
    }: {
      id: number;
      technicianId: number;
      statusId?: number;
    }) => {
      const updateData: any = { technician_id: technicianId };
      if (statusId) {
        updateData.status_id = statusId;
      }
      const response = await updateRequest(id, updateData);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      const actionText = assignedTo ? "reasignado" : "asignado";
      const statusText =
        variables.statusId === 2 ? " y el estado cambió a 'En Proceso'" : "";
      toast.success(`Técnico ${actionText} correctamente${statusText}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al asignar técnico");
    },
  });

  // Mutation para guardar comentarios del técnico
  const updateCommentsMutation = useMutation({
    mutationFn: ({ id, comments }: { id: number; comments: string }) =>
      updateRequest(id, { comments_technician: comments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Comentarios guardados correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al guardar comentarios");
    },
  });

  // Función para obtener el ID del técnico por nombre
  const getTechnicianIdByName = (technicianName: string): number => {
    const technician = technicians.find(
      (tech: any) => tech.full_name === technicianName
    );
    return technician?.id || 0;
  };

  // Handler para cambio de técnico - muestra el diálogo de confirmación
  const handleTechnicianChange = (technicianName: string) => {
    const technicianId = getTechnicianIdByName(technicianName);
    if (technicianId) {
      setPendingTechnician({ name: technicianName, id: technicianId });
      setIsTechnicianDialogOpen(true);
    }
  };

  // Confirmar asignación/reasignación de técnico
  const confirmTechnicianAssignment = () => {
    if (pendingTechnician) {
      const isPending = request.status === "Pendiente";

      // cambio de estado a "en proceso" si esta pending
      const statusId = isPending ? 2 : undefined;

      updateTechnicianMutation.mutate({
        id: request.id,
        technicianId: pendingTechnician.id,
        statusId,
      });

      setAssignedTo(pendingTechnician.name);
      setIsTechnicianDialogOpen(false);
      setPendingTechnician(null);
    }
  };

  // Cancelar asignación de técnico
  const cancelTechnicianAssignment = () => {
    setIsTechnicianDialogOpen(false);
    setPendingTechnician(null);
  };

  const isCompletedOrCancelled =
    request.status === "Completada" || request.status === "Cancelada";

  const handleSaveComments = () => {
    // Solo permitir guardar si el estado es completado (3) o cancelado (4)
    if (isCompletedOrCancelled) {
      updateCommentsMutation.mutate({
        id: request.id,
        comments: comments_technician,
      });
    } else {
      toast.warning(
        "Los comentarios solo pueden guardarse cuando el estado sea 'Completada' o 'Cancelada'"
      );
    }
  };

  const restoreComments = () => {
    setCommentsTechnician(request.comments_technician || "");
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Información de la Solicitud */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">Detalles de la Solicitud</h4>
        </div>

        <div className="space-y-2">
          <div>
            <span className="font-medium text-sm text-gray-400">
              Descripción:
            </span>
            <div className="w-full">
              <textarea
                defaultValue={request.description}
                className="text-sm mt-1 p-2 bg-white dark:text-black theme-blue:text-black theme-violet:text-black theme-orange:text-black rounded border h-48 w-sm md:w-md scroll-auto resize-none"
                disabled
              ></textarea>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-400">
              Fecha de cierre:
            </span>
            <p className="text-sm">
              {request.resolution_date
                ? typeof request.resolution_date === "string"
                  ? request.resolution_date
                  : request.resolution_date.toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Asignación/Reasignación de Técnico (no disponible para rol 4 o 3) */}
          {(user?.role_id !== 4 && user?.role_id !== 3) && (
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-400">
                  {assignedTo ? "Reasignar a:" : "Asignar a:"}
                </span>
                <Select
                  value={assignedTo}
                  onValueChange={handleTechnicianChange}
                  disabled={updateTechnicianMutation.isPending}
                >
                  <SelectTrigger className="h-7 min-w-[180px] w-auto">
                    <SelectValue
                      placeholder={
                        assignedTo ? "Reasignar técnico" : "Asignar técnico"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogsLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando técnicos...
                      </SelectItem>
                    ) : (
                      technicians.map((tech: any) => (
                        <SelectItem key={tech.id} value={tech.full_name}>
                          {tech.full_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
              <span className="font-medium text-sm text-gray-400">Nombre:</span>
              <p className="text-sm">{request.user.full_name}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">Cédula:</span>
              <p className="text-sm">{request.user.identity_card}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">Email:</span>
              <p className="text-sm">{request.user.email}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">Cargo:</span>
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

      {/* Información del Equipo Principal (del solicitante) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Computer className="h-5 w-5 text-purple-600" />
          {request.equipment.type_name === "Impresora" ? (
            <h4 className="font-semibold text-lg">
              Características de la impresora
            </h4>
          ) : (
            <h4 className="font-semibold text-lg">
              Equipo Principal del solicitante
            </h4>
          )}
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-sm text-gray-400">Modelo:</span>
              <p className="text-sm">{request.equipment.model}</p>
            </div>
          </div>
          <div>
            <span className="font-medium text-sm text-gray-400">N° Serie:</span>
            <p className="text-sm">{request.equipment.serial_number}</p>
          </div>
        </div>
        <div>
          <span className="font-medium text-sm text-gray-400">N° de Bien:</span>
          <p className="text-sm">{request.equipment.asset_number || "N/A"}</p>
        </div>
        <div>
          <span className="font-medium text-sm text-gray-400">Ubicación:</span>
          <p className="text-sm">{request.equipment.location || "N/A"}</p>
        </div>
      </div>

      {/* Información del Beneficiario (si es tercero) */}
      {request.third_party && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-lg">
              Beneficiario Final{" "}
              {request.third_party ? "(El que recibe soporte)" : ""}
            </h4>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-sm text-gray-400">
                  Nombre:
                </span>
                <p className="text-sm">{request.third_party.full_name}</p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-400">
                  Cédula:
                </span>
                <p className="text-sm">{request.third_party.identity_card}</p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-400">
                  Email:
                </span>
                <p className="text-sm">{request.third_party.email}</p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-400">
                  Cargo:
                </span>
                <p className="text-sm">{request.third_party.position}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-sm text-gray-400">
                Departamento:
              </span>
              <p className="text-sm">{request.third_party.department}</p>
            </div>

            {/* Equipo del Beneficiario */}
            <div className="mt-4 p-3 bg-white dark:text-black theme-blue:text-black theme-violet:text-black rounded border">
              <div className="flex items-center gap-2 mb-2">
                <Computer className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-sm">
                  Equipo del Beneficiario
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-700">Modelo:</span>
                  <p>{request.third_party.equipment.model}</p>
                </div>
                <div>
                  <span className="text-gray-700">N° Serie:</span>
                  <p>{request.third_party.equipment.serial_number}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-700">
                    N° de Bien:
                  </span>
                  <p className="text-sm">
                    {request.third_party.equipment.asset_number}
                  </p>
                </div>
                <div>
                  <span className="text-gray-700">Ubicación:</span>
                  <p>{request.third_party.equipment.location}</p>
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
                  ? "bg-white border-gray-300 dark:border-gray-600 text-black"
                  : "bg-gray-100 border-gray-200 cursor-not-allowed text-black"
              }`}
              placeholder={
                isCompletedOrCancelled
                  ? "Escriba los comentarios del técnico..."
                  : "Los comentarios solo pueden editarse cuando el estado sea 'Completada' o 'Cancelada'"
              }
              value={comments_technician}
              onChange={(e) => setCommentsTechnician(e.target.value)}
              disabled={!isCompletedOrCancelled || user?.role_id === 4}
            />
          </div>

          {isCompletedOrCancelled && (
            <div className="flex justify-end gap-2">
              {user?.role_id !== 4 && (
                <>
                  <Button onClick={restoreComments} size="sm">
                    Reestablecer Comentarios
                  </Button>

                  <Button
                    onClick={handleSaveComments}
                    size="sm"
                    disabled={updateCommentsMutation.isPending}
                  >
                    {updateCommentsMutation.isPending
                      ? "Guardando..."
                      : "Guardar Comentarios"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialog de confirmación para asignación/reasignación de técnico */}
      <Dialog
        open={isTechnicianDialogOpen}
        onOpenChange={cancelTechnicianAssignment}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {assignedTo
                ? "Confirmar reasignación de técnico"
                : "Confirmar asignación de técnico"}
            </DialogTitle>
            <DialogDescription>
              {assignedTo
                ? "¿Estás seguro de que deseas reasignar esta solicitud a otro técnico?"
                : "¿Estás seguro de que deseas asignar un técnico a esta solicitud?"}
            </DialogDescription>
          </DialogHeader>

          {pendingTechnician && (
            <div className="py-4 space-y-3">
              <div className="text-sm">
                <strong>Técnico:</strong>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {pendingTechnician.name}
                </span>
              </div>

              {assignedTo && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Técnico actual:</strong> {assignedTo}
                </div>
              )}

              {!assignedTo && request.status === "Pendiente" && (
                <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  ℹ️ El estado de la solicitud cambiará automáticamente a{" "}
                  <strong>"En Proceso"</strong>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelTechnicianAssignment}
              disabled={updateTechnicianMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmTechnicianAssignment}
              disabled={updateTechnicianMutation.isPending}
            >
              {updateTechnicianMutation.isPending
                ? "Procesando..."
                : assignedTo
                ? "Confirmar reasignación"
                : "Confirmar asignación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ContentRequestRow;
