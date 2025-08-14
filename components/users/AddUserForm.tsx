"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


const userSchema = z.object({
    email: z.string().min(3, "El usuario es requerido").email("Formato de email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    is_active: z.boolean(),
    created: z.string().optional(),
    role: z.string().min(1, "El rol es requerido"),
    identity_card: z.string().min(7, "La cédula es requerida").regex(/^[0-9]+$/, "La cédula debe contener solo números").max(9, "La cédula no puede tener más de 9 dígitos"),
    full_name: z.string().min(3, "El nombre es requerido"),
    status: z.boolean(),
    gender: z.string().min(1, "El género es requerido"),
    position: z.string().optional(),
    department: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export const AddUserForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      is_active: true,
      created: "",
      role: "",
      identity_card: "",
      full_name: "",
      status: true,
      gender: "",
      position: "",
      department: "",
    }
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // Simulación de envío exitoso
      alert(`✅ Usuario creado exitosamente!\n\nDatos:\n- Nombre: ${data.full_name}\n- Email: ${data.email}\n- Cédula: ${data.identity_card}\n- Rol: ${data.role}\n- Estado: ${data.is_active ? 'Activo' : 'Inactivo'}`);
      
      // Limpiar formulario después del envío exitoso
      reset();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Agregar usuario</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identity_card" className="pb-2">Cédula</Label>
                <Controller
                  name="identity_card"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="identity_card"
                      type="text"
                      maxLength={9}
                      placeholder="Ingrese cédula"
                      required
                    />
                  )}
                />
                {errors.identity_card && <span className="text-red-500 text-xs">{errors.identity_card.message}</span>}
              </div>
              <div>
                <Label htmlFor="full_name" className="pb-2">Nombre completo</Label>
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
                {errors.full_name && <span className="text-red-500 text-xs">{errors.full_name.message}</span>}
              </div>
              <div>
                <Label htmlFor="email" className="pb-2">Email</Label>
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
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>
              <div>
                <Label htmlFor="password" className="pb-2">Contraseña</Label>
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
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>
              <div>
                <Label htmlFor="role" className="pb-2">Rol</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Seleccione rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Analyst">Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
              </div>
              <div>
                <Label htmlFor="position" className="pb-2">Cargo</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="position"
                      placeholder="Ingrese cargo"
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="department" className="pb-2">Departamento</Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="department"
                      placeholder="Ingrese departamento"
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="gender" className="pb-2">Género</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Seleccione género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <span className="text-red-500 text-xs">{errors.gender.message}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="accent-primary"
                  />
                )}
              />
              <Label htmlFor="is_active">Activo</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            onClick={handleSubmit(onSubmit)} 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar usuario"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
 }

export default AddUserForm;
