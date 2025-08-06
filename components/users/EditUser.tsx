"use client";

import { useState } from "react";
import { mockUsers } from "@/data/mockUsers";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";

const userSchema = z.object({
  email: z.email("Formato de email inválido"),
  // Simula obtener el usuario a editar (por ejemplo el primero del mock)
  is_active: z.boolean(),
  created: z.string().optional(),
  role: z.string().min(1, "El rol es requerido"),
  identity_card: z
    .string()
    .min(5, "La cédula es requerida")
    .regex(/^[0-9]+$/, "La cédula debe contener solo números")
    .max(9, "La cédula no puede tener más de 9 dígitos"),
  full_name: z.string().min(3, "El nombre es requerido"),
  status: z.boolean(),
  gender: z.string().min(1, "El género es requerido"),
  position: z.string().optional(),
  department: z.string().optional(),
});

export const EditUser = () => {
  // Simula obtener el usuario a editar (por ejemplo el primero del mock)
  const userToEdit = mockUsers[0];
  const [form, setForm] = useState({
    email: userToEdit.email, // Simula email
    password: userToEdit.password,
    is_active: userToEdit.is_active,
    created: userToEdit.created,
    role: userToEdit.role,
    identity_card: userToEdit.identity_card.toString(),
    full_name: userToEdit.full_name,
    status: userToEdit.status,
    gender: userToEdit.gender,
    position: userToEdit.position,
    department: userToEdit.department,
  });
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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
    alert(
      `✅ Usuario actualizado!\n\n` +
      `Datos:\n` +
      `- Nombre: ${form.full_name}\n` +
      `- Email: ${form.email}\n` +
      `- Cédula: ${form.identity_card}\n` +
      `- Rol: ${form.role}\n` +
      `- Estado: ${form.is_active ? "Activo" : "Inactivo"}\n` +
      `- Cargo: ${form.position || "No especificado"}\n` +
      `- Género: ${form.gender}\n` +
      `- Departamento: ${form.department}\n`
    );
  };

  const handleResetPassword = () => {
    setForm((prev) => ({
      ...prev,
      password: prev.identity_card,
    }));
    alert("La contraseña ha sido reseteada a la cédula del usuario.");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Editar usuario</CardTitle>
          <span> {userToEdit.full_name}</span>
          <p> Estatus: <span className={`${userToEdit.is_active ? "text-green-500" : "text-red-500"}`}>{userToEdit.is_active ? "Activo" : "Inactivo"}</span></p>
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
                  maxLength={9}
                  value={form.identity_card}
                  onChange={handleChange}
                  placeholder="Ingrese cédula"
                  required
                  disabled
                />
                {errors.identity_card && (
                  <span className="text-red-500 text-xs">
                    {errors.identity_card}
                  </span>
                )}
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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ingrese email"
                  required
                  disabled
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="pb-2">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingrese contraseña"
                  required
                  disabled
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="role" className="pb-2">
                  Rol
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                  disabled
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Seleccione rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <span className="text-red-500 text-xs">{errors.role}</span>
                )}
              </div>
              <div>
                <Label htmlFor="position" className="pb-2">
                  Cargo
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Ingrese cargo"
                />
              </div>
              <div>
                <Label htmlFor="department" className="pb-2">
                  Departamento
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Ingrese departamento"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="pb-2">
                  Género
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Seleccione género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <span className="text-red-500 text-xs">{errors.gender}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
              >
                Resetear contraseña
              </Button>
              <Button type="submit" className="w-full md:w-auto">
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
};
