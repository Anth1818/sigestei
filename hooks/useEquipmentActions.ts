import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipmentData } from "@/api/api";
import { toast } from "sonner";

export const useEquipmentActions = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    equipmentId: number;
    newStatusId: number;
    newStatusName: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Mutation para actualizar el status
  const updateStatusMutation = useMutation({
    mutationFn: ({ equipmentId, statusId }: { equipmentId: number; statusId: number }) =>
      updateEquipmentData(equipmentId, { status_id: statusId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Estado del equipo actualizado correctamente");
      setIsStatusDialogOpen(false);
      setPendingStatusUpdate(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Error al actualizar el estado. Intenta nuevamente."
      );
    },
  });

  // Manejar solicitud de cambio de status (abre dialog)
  const handleStatusChange = (
    equipmentId: number,
    newStatusId: number,
    newStatusName: string
  ) => {
    setPendingStatusUpdate({ equipmentId, newStatusId, newStatusName });
    setIsStatusDialogOpen(true);
  };

  // Confirmar cambio de status
  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        equipmentId: pendingStatusUpdate.equipmentId,
        statusId: pendingStatusUpdate.newStatusId,
      });
    }
  };

  // Cancelar cambio de status
  const cancelStatusUpdate = () => {
    setIsStatusDialogOpen(false);
    setPendingStatusUpdate(null);
  };

  return {
    expanded,
    toggleExpansion,
    isStatusDialogOpen,
    pendingStatusUpdate,
    handleStatusChange,
    confirmStatusUpdate,
    cancelStatusUpdate,
    updateStatusMutation,
  };
};
