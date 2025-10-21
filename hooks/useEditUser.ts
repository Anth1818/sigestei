import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser, resetUserPassword } from "@/api/api";
import { UpdateUserInput } from "@/lib/types";

export function useEditUser(identityCard: number) {
  const queryClient = useQueryClient();

  // Estado para diálogos de confirmación
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<UpdateUserInput | null>(null);

  // Mutation para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      return updateUser(identityCard, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", identityCard] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario actualizado correctamente");
      setIsUpdateDialogOpen(false);
      setPendingUpdateData(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error al actualizar el usuario"
      );
    },
  });

  // Mutation para resetear contraseña
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      return resetUserPassword(identityCard);
    },
    onSuccess: () => {
      toast.success("Contraseña reseteada a la cédula del usuario");
      setIsResetPasswordDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error al resetear la contraseña"
      );
    },
  });

  // Handlers para actualizar usuario
  const handleUpdateUser = (data: UpdateUserInput) => {
    setPendingUpdateData(data);
    setIsUpdateDialogOpen(true);
  };

  const confirmUpdate = () => {
    if (pendingUpdateData) {
      updateUserMutation.mutate(pendingUpdateData);
    }
  };

  const cancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setPendingUpdateData(null);
  };

  // Handlers para resetear contraseña
  const handleResetPassword = () => {
    setIsResetPasswordDialogOpen(true);
  };

  const confirmResetPassword = () => {
    resetPasswordMutation.mutate();
  };

  const cancelResetPassword = () => {
    setIsResetPasswordDialogOpen(false);
  };

  return {
    // Update user
    isUpdateDialogOpen,
    handleUpdateUser,
    confirmUpdate,
    cancelUpdate,
    isUpdating: updateUserMutation.isPending,
    
    // Reset password
    isResetPasswordDialogOpen,
    handleResetPassword,
    confirmResetPassword,
    cancelResetPassword,
    isResettingPassword: resetPasswordMutation.isPending,
  };
}
