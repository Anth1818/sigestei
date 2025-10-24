"use client";

import { useState, useEffect } from "react";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEditUser } from "@/hooks/useEditUser";
import { UserData, UpdateUserInput } from "@/lib/types";
import { getStatusColor, parseRoleName } from "@/lib/userUtils";
import { parse } from "path";

const userSchema = z.object({
  full_name: z.string().min(3, "El nombre es requerido"),
  gender_id: z.number().min(1, "El género es requerido"),
  position_id: z.number().min(1, "El cargo es requerido"),
  department_id: z.number().min(1, "El departamento es requerido"),
});

interface EditUserProps {
  userData: UserData;
  catalogsData: any;
}

export const EditUserForm = ({ userData, catalogsData }: EditUserProps) => {
  const editUser = useEditUser(userData.identity_card);

  const [form, setForm] = useState<UpdateUserInput>({
    full_name: userData.full_name,
    gender_id: userData.gender_id,
    position_id: userData.position_id,
    department_id: userData.department_id,
  });

  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});

  // Actualizar form cuando cambia userData
  useEffect(() => {
    setForm({
      full_name: userData.full_name,
      gender_id: userData.gender_id,
      position_id: userData.position_id,
      department_id: userData.department_id,
    });
  }, [userData]);

  const genders = catalogsData?.genders || [];
  const positions = catalogsData?.positions || [];
  const departments = catalogsData?.departments || [];
  const roles = catalogsData?.roles || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: keyof UpdateUserInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === "string")
          fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    editUser.handleUpdateUser(form);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Editar usuario</CardTitle>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{userData.full_name}</p>
            <p className="text-sm">
              Estado:{" "}
              <span className={getStatusColor(userData.is_active)}>
                {userData.is_active ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identity_card" className="pb-2">
                  Cédula
                </Label>
                <Input
                  id="identity_card"
                  name="identity_card"
                  type="text"
                  value={userData.identity_card}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="full_name" className="pb-2">
                  Nombre completo
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Ingrese nombre completo"
                  required
                />
                {errors.full_name && (
                  <span className="text-red-500 text-xs">
                    {errors.full_name}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="pb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="password" className="pb-2">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value="********"
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="role" className="pb-2">
                  Rol
                </Label>
                <Select value={userData.role_id.toString()} disabled>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {parseRoleName(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender_id" className="pb-2">
                  Género
                </Label>
                <Select
                  value={form.gender_id.toString()}
                  onValueChange={(value) => handleSelectChange("gender_id", value)}
                >
                  <SelectTrigger id="gender_id" className="w-full">
                    <SelectValue placeholder="Seleccione género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender: any) => (
                      <SelectItem key={gender.id} value={gender.id.toString()}>
                        {gender.name === "M" ? "Masculino" : "Femenino"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender_id && (
                  <span className="text-red-500 text-xs">{errors.gender_id}</span>
                )}
              </div>

              <div>
                <Label htmlFor="position_id" className="pb-2">
                  Cargo
                </Label>
                <Select
                  value={form.position_id.toString()}
                  onValueChange={(value) => handleSelectChange("position_id", value)}
                >
                  <SelectTrigger id="position_id" className="w-full">
                    <SelectValue placeholder="Seleccione cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position: any) => (
                      <SelectItem key={position.id} value={position.id.toString()}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position_id && (
                  <span className="text-red-500 text-xs">{errors.position_id}</span>
                )}
              </div>

              <div>
                <Label htmlFor="department_id" className="pb-2">
                  Departamento
                </Label>
                <Select
                  value={form.department_id.toString()}
                  onValueChange={(value) => handleSelectChange("department_id", value)}
                >
                  <SelectTrigger id="department_id" className="w-full">
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department_id && (
                  <span className="text-red-500 text-xs">
                    {errors.department_id}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={editUser.handleResetPassword}
                disabled={editUser.isResettingPassword}
              >
                {editUser.isResettingPassword ? "Reseteando..." : "Resetear contraseña"}
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={editUser.isUpdating}
              >
                {editUser.isUpdating ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para guardar cambios */}
      <Dialog
        open={editUser.isUpdateDialogOpen}
        onOpenChange={(open) => {
          if (!open) editUser.cancelUpdate();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar actualización</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas guardar los cambios realizados a este usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={editUser.cancelUpdate}>
              Cancelar
            </Button>
            <Button onClick={editUser.confirmUpdate} disabled={editUser.isUpdating}>
              {editUser.isUpdating ? "Guardando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para resetear contraseña */}
      <Dialog
        open={editUser.isResetPasswordDialogOpen}
        onOpenChange={(open) => {
          if (!open) editUser.cancelResetPassword();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar reseteo de contraseña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas resetear la contraseña de este usuario a su número de cédula ({userData.identity_card})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={editUser.cancelResetPassword}>
              Cancelar
            </Button>
            <Button onClick={editUser.confirmResetPassword} disabled={editUser.isResettingPassword}>
              {editUser.isResettingPassword ? "Reseteando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
