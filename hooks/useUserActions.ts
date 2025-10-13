import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// TODO: Importar la función de API cuando esté disponible
// import { updateUserStatus } from "@/api/api";

export function useUserActions() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Estado para el diálogo de confirmación de cambio de estado
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    userId: number;
    newStatus: boolean;
  } | null>(null);

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Mutation para actualizar el estado del usuario
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      // TODO: Implementar cuando el endpoint esté disponible
      // return updateUserStatus(userId, { is_active: isActive });
      
      // Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Estado del usuario actualizado correctamente");
      setIsStatusDialogOpen(false);
      setPendingStatusUpdate(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Error al actualizar el estado del usuario"
      );
    },
  });

  const handleStatusChange = (userId: number, currentStatus: boolean) => {
    setPendingStatusUpdate({
      userId,
      newStatus: !currentStatus,
    });
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        userId: pendingStatusUpdate.userId,
        isActive: pendingStatusUpdate.newStatus,
      });
    }
  };

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
}
