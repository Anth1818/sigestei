"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogs, fetchAllUsersByDepartment } from "@/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect } from "react";
import { UserData } from "@/lib/types";

const requestSchema = z.object({
  request_category: z.string().min(1, "La categoría de solicitud es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(500, "La descripción no puede exceder 500 caracteres"),
  isForThirdParty: z.boolean(),
  selectedDepartmentId: z.string().optional(),
  selectedThirdPartyId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isForThirdParty && !data.selectedThirdPartyId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar un usuario beneficiario",
      path: ["selectedThirdPartyId"]
    });
  }
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function AddRequestForm() {
  const user = useUserStore((state) => state.user);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      request_category: "",
      description: "",
      isForThirdParty: false,
      selectedDepartmentId: "",
      selectedThirdPartyId: "",
    }
  });

  const isForThirdParty = watch("isForThirdParty");
  const selectedThirdPartyId = watch("selectedThirdPartyId");
  const selectedDepartmentId = watch("selectedDepartmentId");

  // Obtener catálogos (incluye categorías)
  const { data: catalogs, isLoading: catalogsLoading } = useQuery({
    queryKey: ['catalogs'],
    queryFn: fetchCatalogs,
  });

  const departments = catalogs?.departments || [];
  const categories = catalogs?.request_types || [];

  // This variable will hold the definitive department ID for the query.
  // For a regular user, it's their own department.
  // For an admin/manager, it's the one they select from the dropdown.
  const departmentIdToFetch = user?.role_id === 4
    ? user.department_id
    : selectedDepartmentId ? Number(selectedDepartmentId) : null;

  const { data: departmentUsers, isLoading: departmentUsersLoading } = useQuery({
    // The query key is now simpler and directly tied to the ID we want to fetch.
    // React Query will automatically cache and refetch when this ID changes.
    queryKey: ['departmentUsers', departmentIdToFetch],
    
    queryFn: async () => {
      // We only proceed if there's a valid department ID.
      if (!departmentIdToFetch) {
        return [];
      }
      return await fetchAllUsersByDepartment(departmentIdToFetch);
    },

    // The query is enabled only if it's for a third party AND we have a valid department ID to fetch.
    // This covers both user roles correctly.
    enabled: isForThirdParty && !!departmentIdToFetch,
  });
  
  const filteredDepartmentUsers = departmentUsers?.filter((u: UserData) => u.id.toString() !== user?.id.toString()) || [];

  // Reset selectedThirdPartyId cuando cambia el departamento
  useEffect(() => {
    if (selectedDepartmentId) {
      setValue("selectedThirdPartyId", "");
    }
  }, [selectedDepartmentId, setValue]);

  const onSubmit = async (data: RequestFormData) => {
    try {
      if (!user) {
        alert("Usuario no autenticado");
        return;
      }

      // Aquí harías la llamada a la API para crear la solicitud
      console.log("Datos del formulario:", data);
      
      reset();
    } catch (error) {
      console.error("Error al crear solicitud:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30 p-4">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 p-4">
        <CardHeader>
          <CardTitle>Nueva solicitud de soporte</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {/* Selección: Para mí o para tercero */}
          <div className="mb-6">
            <Label className="block mb-2">¿La solicitud es para ti o para un tercero?</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Controller
                  name="isForThirdParty"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <input
                      type="radio"
                      name="beneficiary"
                      checked={!value}
                      onChange={() => onChange(false)}
                    />
                  )}
                />
                Para mí
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Controller
                  name="isForThirdParty"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <input
                      type="radio"
                      name="beneficiary"
                      checked={value}
                      onChange={() => onChange(true)}
                    />
                  )}
                />
                Para un tercero
              </label>
            </div>
          </div>

          {/* Si es para tercero y NO es role_id 4, mostrar select de departamentos */}
          {isForThirdParty && user?.role_id !== 4 && (
            <div className="mb-6">
              <Label htmlFor="department-select" className="block mb-1">Selecciona el departamento</Label>
              <Controller
                name="selectedDepartmentId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="department-select" className="w-full">
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogsLoading ? (
                        <SelectItem value="loading" disabled>Cargando departamentos...</SelectItem>
                      ) : departments.length === 0 ? (
                        <SelectItem value="not-found" disabled>No hay departamentos disponibles</SelectItem>
                      ) : (
                        departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedDepartmentId && (
                <span className="text-red-500 text-xs">{errors.selectedDepartmentId.message}</span>
              )}
            </div>
          )}

          {/* Si es para tercero, mostrar select de usuarios */}
          {isForThirdParty && (user?.role_id === 4 || selectedDepartmentId) && (
            <div className="mb-6">
              <Label htmlFor="third-party-select" className="block mb-1">Selecciona el usuario beneficiario</Label>
              <Controller
                name="selectedThirdPartyId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="third-party-select" className="w-full">
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentUsersLoading ? (
                        <SelectItem value="loading" disabled>Cargando usuarios...</SelectItem>
                      ) : (() => {
                        const users = filteredDepartmentUsers || [];
                        
                        return users.length === 0 ? (
                          <SelectItem value="not-found" disabled>No hay usuarios disponibles</SelectItem>
                        ) : (
                          users.map((u: any) => (
                            <SelectItem key={u.id} value={u.id.toString()}>
                              {u.full_name}
                            </SelectItem>
                          ))
                        );
                      })()}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedThirdPartyId && (
                <span className="text-red-500 text-xs">{errors.selectedThirdPartyId.message}</span>
              )}
            </div>
          )}

          {/* Formulario de solicitud */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Select de categoría */}
            <div>
              <Label htmlFor="request_category" className="pb-2">Categoría de solicitud</Label>
              <Controller
                name="request_category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="request_category" className="w-full">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogsLoading ? (
                        <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="not-found" disabled>No hay categorías disponibles</SelectItem>
                      ) : (
                        categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.request_category && (
                <span className="text-red-500 text-xs">{errors.request_category.message}</span>
              )}
            </div>

            {/* Campo de descripción */}
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="description" className="pb-2">Descripción del problema</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Describe detalladamente el problema o solicitud (min 10 caracteres, máx 500)</p>
                </TooltipContent>
              </Tooltip>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    className="w-full p-2 border rounded-md min-h-[100px] resize-y"
                    placeholder="Describe el problema o solicitud..."
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">{errors.description.message}</span>
              )}
            </div>

            <CardFooter className="flex justify-end gap-3 px-0 pb-0">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
