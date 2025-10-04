"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCatalogs,
  fetchAllUsersByDepartment,
  createRequest,
} from "@/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect } from "react";
import { CreateRequestPayload, UserData } from "@/lib/types";
import { toast } from "sonner";

const requestSchema = z
  .object({
    request_category: z
      .string()
      .min(1, "La categoría de solicitud es requerida"),
    description: z
      .string()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder 500 caracteres"),
    isForThirdParty: z.boolean(),
    selectedDepartmentId: z.string().optional(),
    selectedThirdPartyId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isForThirdParty && !data.selectedThirdPartyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes seleccionar un usuario beneficiario",
        path: ["selectedThirdPartyId"],
      });
    }
  });

type RequestFormData = z.infer<typeof requestSchema>;

export default function AddRequestForm() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      request_category: "",
      description: "",
      isForThirdParty: false,
      selectedDepartmentId: "",
      selectedThirdPartyId: "",
    },
  });

  const isForThirdParty = watch("isForThirdParty");
  const selectedThirdPartyId = watch("selectedThirdPartyId");
  const selectedDepartmentId = watch("selectedDepartmentId");

  // Obtener catálogos (incluye categorías)
  const { data: catalogs, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  const departments = catalogs?.departments || [];
  const categories = catalogs?.request_types || [];

  // Esta variable contendrá el ID definitivo del departamento para la consulta.
  // Para un usuario regular, es su propio departamento.
  //Para un administrador/gerente, es el que seleccionan del dropdown.
  const departmentIdToFetch =
    user?.role_id === 4
      ? user.department_id
      : selectedDepartmentId
      ? Number(selectedDepartmentId)
      : null;

  const { data: departmentUsers, isLoading: departmentUsersLoading } = useQuery(
    {
      queryKey: ["departmentUsers", departmentIdToFetch],

      queryFn: async () => {
        if (!departmentIdToFetch) {
          return [];
        }
        return await fetchAllUsersByDepartment(departmentIdToFetch);
      },

      enabled: isForThirdParty && !!departmentIdToFetch,
    }
  );

  const filteredDepartmentUsers =
    departmentUsers?.filter(
      (u: UserData) => u.id.toString() !== user?.id.toString()
    ) || [];

  // Reset selectedThirdPartyId cuando cambia el departamento
  useEffect(() => {
    if (selectedDepartmentId) {
      setValue("selectedThirdPartyId", "");
    }
  }, [selectedDepartmentId, setValue]);

  const createRequestMutation = useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      // Resetear el formulario
      reset();

      // Mostrar notificación de éxito
      toast.success("Solicitud creada exitosamente", {
        description: "Tu solicitud ha sido registrada y será procesada pronto.",
        duration: 4000,
      });
    },
    onError: (error: any) => {
      // Mostrar notificación de error con detalles
      const errorMessage =
        error?.response?.data?.message || error?.message || "Error desconocido";
      toast.error("Error al crear la solicitud", {
        description: errorMessage,
        duration: 5000,
      });
      console.error("Error al crear solicitud:", error);
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    if (!user) {
      toast.error("Usuario no autenticado", {
        description: "Por favor, inicia sesión para continuar.",
      });
      return;
    }

    const requestPayload: CreateRequestPayload = {
      description: data.description,
      requester_id: user.id,
      beneficiary_id: data.isForThirdParty
        ? data.selectedThirdPartyId
          ? Number(data.selectedThirdPartyId)
          : null
        : user.id,
      computer_equipment_id: (user as any).computer_equipment_id ?? null,
      type_id: Number(data.request_category),
    };

    createRequestMutation.mutate(requestPayload);
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
            <Label className="block mb-2">
              ¿La solicitud es para ti o para un tercero?
            </Label>
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
              <Label htmlFor="department-select" className="block mb-1">
                Selecciona el departamento
              </Label>
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
                        <SelectItem value="loading" disabled>
                          Cargando departamentos...
                        </SelectItem>
                      ) : departments.length === 0 ? (
                        <SelectItem value="not-found" disabled>
                          No hay departamentos disponibles
                        </SelectItem>
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
                <span className="text-red-500 text-xs">
                  {errors.selectedDepartmentId.message}
                </span>
              )}
            </div>
          )}

          {/* Si es para tercero, mostrar select de usuarios */}
          {isForThirdParty && (user?.role_id === 4 || selectedDepartmentId) && (
            <div className="mb-6">
              <Label htmlFor="third-party-select" className="block mb-1">
                Selecciona el usuario beneficiario
              </Label>
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
                        <SelectItem value="loading" disabled>
                          Cargando usuarios...
                        </SelectItem>
                      ) : (
                        (() => {
                          const users = filteredDepartmentUsers || [];

                          return users.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay usuarios disponibles
                            </SelectItem>
                          ) : (
                            users.map((u: any) => (
                              <SelectItem key={u.id} value={u.id.toString()}>
                                {u.full_name}
                              </SelectItem>
                            ))
                          );
                        })()
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedThirdPartyId && (
                <span className="text-red-500 text-xs">
                  {errors.selectedThirdPartyId.message}
                </span>
              )}
            </div>
          )}

          {/* Formulario de solicitud */}
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Select de categoría */}
            <div>
              <div className="flex gap-1">
                <Label htmlFor="request_category" className="pb-2">
                  Categoría de solicitud
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className="cursor-pointer text-primary pb-2"
                      aria-label="¿Qué es hardware o software?"
                    >
                      🛈
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>
                      <b>Hardware:</b> Se refiere a componentes físicos del
                      equipo, como disco duro, memoria RAM, teclado, etc.
                      <br />
                      <b>Software:</b> Se refiere a programas o sistemas
                      instalados, como el sistema operativo o aplicaciones.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
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
                        <SelectItem value="loading" disabled>
                          Cargando categorías...
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="not-found" disabled>
                          No hay categorías disponibles
                        </SelectItem>
                      ) : (
                        categories.map((category: any) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.request_category && (
                <span className="text-red-500 text-xs">
                  {errors.request_category.message}
                </span>
              )}
            </div>

            {/* Campo de descripción */}
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="description" className="pb-2">
                    Descripción del problema
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Describe detalladamente el problema o solicitud (min 10
                    caracteres, máx 500)
                  </p>
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
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>

            <CardFooter className="flex justify-end gap-3 px-0 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={createRequestMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createRequestMutation.isPending}
              >
                {createRequestMutation.isPending
                  ? "Enviando..."
                  : "Enviar solicitud"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
