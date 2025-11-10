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
import { useAddUser } from "@/hooks/useAddUser";
import { CreateUserInput } from "@/lib/types";


const userSchema = z.object({
  full_name: z.string().min(3, "El nombre es requerido"),
  identity_card: z.number().min(1000000, "Cédula inválida"),
  email: z.string().min(3, "El email es requerido").email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  gender_id: z.number().min(1, "El género es requerido"),
  position_id: z.number().min(1, "El cargo es requerido"),
  department_id: z.number().min(1, "El departamento es requerido"),
  role_id: z.number().min(1, "El rol es requerido"),
});

interface AddUserFormProps {
  catalogsData: any;
}

export const AddUserForm = ({ catalogsData }: AddUserFormProps) => {
  const addUser = useAddUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      identity_card: 0,
      email: "",
      password: "",
      gender_id: 0,
      position_id: 0,
      department_id: 0,
      role_id: 0,
    },
  });

  const genders = catalogsData?.genders || [];
  const positions = catalogsData?.positions || [];
  const departments = catalogsData?.departments || [];
  const roles = catalogsData?.roles || [];

  const onSubmit = (data: CreateUserInput) => {
    addUser.handleCreateUser(data);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Agregar usuario</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identity_card" className="pb-2">
                  Cédula
                </Label>
                <Controller
                  name="identity_card"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="identity_card"
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="Ingrese cédula"
                      required
                    />
                  )}
                />
                {errors.identity_card && (
                  <span className="text-red-500 text-xs">
                    {errors.identity_card.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="full_name" className="pb-2">
                  Nombre completo
                </Label>
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="full_name"
                      placeholder="Ingrese nombre completo"
                      required
                    />
                  )}
                />
                {errors.full_name && (
                  <span className="text-red-500 text-xs">
                    {errors.full_name.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="pb-2">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Ingrese email"
                      required
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="pb-2">
                  Contraseña
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Ingrese contraseña"
                      required
                    />
                  )}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="role_id" className="pb-2">
                  Rol
                </Label>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value > 0 ? field.value.toString() : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="role_id" className="w-full">
                        <SelectValue placeholder="Seleccione rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: any) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role_id && (
                  <span className="text-red-500 text-xs">{errors.role_id.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="gender_id" className="pb-2">
                  Género
                </Label>
                <Controller
                  name="gender_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value > 0 ? field.value.toString() : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
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
                  )}
                />
                {errors.gender_id && (
                  <span className="text-red-500 text-xs">{errors.gender_id.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="position_id" className="pb-2">
                  Cargo
                </Label>
                <Controller
                  name="position_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value > 0 ? field.value.toString() : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
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
                  )}
                />
                {errors.position_id && (
                  <span className="text-red-500 text-xs">{errors.position_id.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="department_id" className="pb-2">
                  Departamento
                </Label>
                <Controller
                  name="department_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value > 0 ? field.value.toString() : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
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
                  )}
                />
                {errors.department_id && (
                  <span className="text-red-500 text-xs">
                    {errors.department_id.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={addUser.isCreating}
              >
                {addUser.isCreating ? "Registrando..." : "Registrar usuario"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog
        open={addUser.isDialogOpen}
        onOpenChange={(open) => {
          if (!open) addUser.cancelCreate();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas crear este usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={addUser.cancelCreate}>
              Cancelar
            </Button>
            <Button onClick={addUser.confirmCreate} disabled={addUser.isCreating}>
              {addUser.isCreating ? "Creando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUserForm;
