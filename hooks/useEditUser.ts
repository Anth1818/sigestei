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
      // Usamos la cédula original (identityCard) para identificar al usuario
      return updateUser(identityCard, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", identityCard] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const successMessage = data?.message || "Usuario actualizado correctamente";
      toast.success(successMessage);
      setIsUpdateDialogOpen(false);
      setPendingUpdateData(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al actualizar el usuario";
      toast.error(errorMessage);
    },
  });

  // Mutation para resetear contraseña
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      return resetUserPassword(identityCard);
    },
    onSuccess: (data) => {
      const successMessage = data?.message || "Contraseña reseteada a la cédula del usuario";
      toast.success(successMessage);
      setIsResetPasswordDialogOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al resetear la contraseña";
      toast.error(errorMessage);
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
