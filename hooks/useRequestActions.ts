import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequest } from "@/api/api";
import { toast } from "sonner";
import { RequestResponse } from "@/lib/types";

export const useRequestActions = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPriorityDialogOpen, setIsPriorityDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    requestId: number;
    newStatus: string;
  } | null>(null);
  const [pendingPriorityUpdate, setPendingPriorityUpdate] = useState<{
    requestId: number;
    newPriority: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Funciones auxiliares para mapear nombres a IDs
  const getStatusId = (statusName: string): number => {
    const statusMap: Record<string, number> = {
      Pendiente: 1,
      "En proceso": 2,
      Completada: 3,
      Cancelada: 4,
    };
    return statusMap[statusName] || 1;
  };

  const getPriorityId = (priorityName: string): number => {
    const priorityMap: Record<string, number> = {
      Alta: 1,
      Media: 2,
      Baja: 3,
    };
    return priorityMap[priorityName] || 2;
  };

  // Mutation para actualizar el estado
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => {
      const statusId = getStatusId(status);
      const needsResolutionDate = statusId === 3 || statusId === 4;
      const updateData: { status_id: number; resolution_date?: string } = {
        status_id: statusId,
      };
      if (needsResolutionDate) {
        updateData.resolution_date = new Date().toISOString();
      }
      return updateRequest(id, updateData);
    },
    onSuccess: () => {
      // Invalidar queries para forzar refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["requests-filtered"] });
      toast.success("Estado actualizado correctamente");
      setIsStatusDialogOpen(false);
      setPendingStatusUpdate(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar el estado");
    },
  });

  // Mutation para actualizar la prioridad
  const updatePriorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: string }) =>
      updateRequest(id, { priority_id: getPriorityId(priority) }),
    onSuccess: () => {
      // Invalidar queries para forzar refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["requests-filtered"] });
      toast.success("Prioridad actualizada correctamente");
      setIsPriorityDialogOpen(false);
      setPendingPriorityUpdate(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar la prioridad");
    },
  });

  // Manejar solicitud de cambio de estado (abre dialog)
  const handleStatusChange = (requestId: number, newStatus: string) => {
    setPendingStatusUpdate({ requestId, newStatus });
    setIsStatusDialogOpen(true);
  };

  // Manejar solicitud de cambio de prioridad (abre dialog)
  const handlePriorityChange = (requestId: number, newPriority: string) => {
    setPendingPriorityUpdate({ requestId, newPriority });
    setIsPriorityDialogOpen(true);
  };

  // Confirmar cambio de estado
  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        id: pendingStatusUpdate.requestId,
        status: pendingStatusUpdate.newStatus,
      });
    }
  };

  // Confirmar cambio de prioridad
  const confirmPriorityUpdate = () => {
    if (pendingPriorityUpdate) {
      updatePriorityMutation.mutate({
        id: pendingPriorityUpdate.requestId,
        priority: pendingPriorityUpdate.newPriority,
      });
    }
  };

  // Cancelar cambio de estado
  const cancelStatusUpdate = () => {
    setIsStatusDialogOpen(false);
    setPendingStatusUpdate(null);
  };

  // Cancelar cambio de prioridad
  const cancelPriorityUpdate = () => {
    setIsPriorityDialogOpen(false);
    setPendingPriorityUpdate(null);
  };

  return {
    expanded,
    toggleExpansion,
    isStatusDialogOpen,
    isPriorityDialogOpen,
    pendingStatusUpdate,
    pendingPriorityUpdate,
    handleStatusChange,
    handlePriorityChange,
    confirmStatusUpdate,
    confirmPriorityUpdate,
    cancelStatusUpdate,
    cancelPriorityUpdate,
    updateStatusMutation,
    updatePriorityMutation,
  };
};
