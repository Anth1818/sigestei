import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleActiveUser } from "@/api/api";

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
    mutationFn: async ({ identityCard }: { identityCard: number }) => {
      return toggleActiveUser(identityCard);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const successMessage = data?.message || "Estado del usuario actualizado correctamente";
      toast.success(successMessage);
      setIsStatusDialogOpen(false);
      setPendingStatusUpdate(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al actualizar el estado del usuario";
      toast.error(errorMessage);
    },
  });

  const handleStatusChange = (identityCard: number) => {
    setPendingStatusUpdate({
      userId: identityCard,
      newStatus: true, // El backend hace toggle, no necesitamos saber el estado actual
    });
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        identityCard: pendingStatusUpdate.userId,
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
