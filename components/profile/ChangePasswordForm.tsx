"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserPassword } from "@/api/api";
import { toast } from "sonner";
import { useState } from "react";
import { Lock } from "lucide-react";

const passwordSchema = z.object({
  new_password: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirm_password: z.string().min(1, "Confirma tu nueva contraseña"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  identityCard: number;
}

export const ChangePasswordForm = ({ identityCard }: ChangePasswordFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<PasswordFormData | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { new_password: string }) => {
      const response = await changeUserPassword(identityCard, data);
      return response;
    },
    onSuccess: (data) => {
      const successMessage = data?.message || "Contraseña actualizada exitosamente";
      toast.success(successMessage);
      setIsDialogOpen(false);
      setPendingData(null);
      reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al cambiar la contraseña";
      toast.error(errorMessage);
      setIsDialogOpen(false);
      setPendingData(null);
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    setPendingData(data);
    setIsDialogOpen(true);
  };

  const confirmChange = () => {
    if (pendingData) {
      changePasswordMutation.mutate({
        new_password: pendingData.new_password,
      });
    }
  };

  const cancelChange = () => {
    setIsDialogOpen(false);
    setPendingData(null);
  };

  return (
    <Card className="w-full shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Cambiar Contraseña
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new_password" className="pb-2">
                Nueva Contraseña
              </Label>
              <Controller
                name="new_password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="new_password"
                    type="password"
                    placeholder="Ingrese nueva contraseña"
                    required
                  />
                )}
              />
              {errors.new_password && (
                <span className="text-red-500 text-xs">
                  {errors.new_password.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="confirm_password" className="pb-2">
                Confirmar Nueva Contraseña
              </Label>
              <Controller
                name="confirm_password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="confirm_password"
                    type="password"
                    placeholder="Confirme nueva contraseña"
                    required
                  />
                )}
              />
              {errors.confirm_password && (
                <span className="text-red-500 text-xs">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Cambiando..."
                : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Dialog de confirmación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de contraseña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cambiar tu contraseña?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelChange}>
              Cancelar
            </Button>
            <Button
              onClick={confirmChange}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Cambiando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
