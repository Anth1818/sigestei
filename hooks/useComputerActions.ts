import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipmentData } from "@/api/api";
import { toast } from "sonner";

export const useComputerActions = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    computerId: number;
    newStatusId: number;
    newStatusName: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Mutation para actualizar el status
  const updateStatusMutation = useMutation({
    mutationFn: ({ computerId, statusId }: { computerId: number; statusId: number }) =>
      updateEquipmentData(computerId, { status_id: statusId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["computers"] });
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
    computerId: number,
    newStatusId: number,
    newStatusName: string
  ) => {
    setPendingStatusUpdate({ computerId, newStatusId, newStatusName });
    setIsStatusDialogOpen(true);
  };

  // Confirmar cambio de status
  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        computerId: pendingStatusUpdate.computerId,
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
