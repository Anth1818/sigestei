"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/api";
import { CreateUserInput } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAddUser = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<CreateUserInput | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: (data) => {
      const successMessage = data?.message || "Usuario creado exitosamente";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setPendingUserData(null);
      // Redirigir a la vista de usuarios después de crear
      router.push("/viewUsers");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al crear el usuario";
      toast.error(errorMessage);
      setIsDialogOpen(false);
      setPendingUserData(null);
    },
  });

  const handleCreateUser = (data: CreateUserInput) => {
    setPendingUserData(data);
    setIsDialogOpen(true);
  };

  const confirmCreate = () => {
    if (pendingUserData) {
      createUserMutation.mutate(pendingUserData);
    }
  };

  const cancelCreate = () => {
    setIsDialogOpen(false);
    setPendingUserData(null);
  };

  return {
    isDialogOpen,
    handleCreateUser,
    confirmCreate,
    cancelCreate,
    isCreating: createUserMutation.isPending,
  };
};
