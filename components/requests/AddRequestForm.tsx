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
import { fetchCatalogs, createRequest, fetchAllEquipment } from "@/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState, useMemo } from "react";
import { CreateRequestPayload } from "@/lib/types";
import { toast } from "sonner";
import { DepartmentUserSelector } from "@/components/shared/DepartmentUserSelector";

const requestSchema = z
  .object({
    equipment_type: z.string().min(1, "El tipo de equipo es requerido"),
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
    selectedEquipmentId: z.string().optional(), // Para impresoras
  })
  .superRefine((data, ctx) => {
    // Si es para tercero (y no es impresora), debe seleccionar un usuario
    if (
      data.isForThirdParty &&
      data.equipment_type !== "3" &&
      !data.selectedThirdPartyId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes seleccionar un usuario beneficiario",
        path: ["selectedThirdPartyId"],
      });
    }

    // Si es impresora, debe seleccionar un equipo
    if (data.equipment_type === "3" && !data.selectedEquipmentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes seleccionar una impresora",
        path: ["selectedEquipmentId"],
      });
    }
  });

type RequestFormData = z.infer<typeof requestSchema>;

export default function AddRequestForm() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  // Estados para el selector de departamento y usuario (fuera del form)
  const [selectedDepartmentIdState, setSelectedDepartmentIdState] =
    useState("");
  const [selectedUserIdState, setSelectedUserIdState] = useState("");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");

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
      equipment_type: "",
      request_category: "",
      description: "",
      isForThirdParty: false,
      selectedDepartmentId: "",
      selectedThirdPartyId: "",
      selectedEquipmentId: "",
    },
  });

  const isForThirdParty = watch("isForThirdParty");
  const equipmentType = watch("equipment_type");

  // Determinar si es una impresora (type_id = 3)
  const isPrinter = equipmentType === "3";

  // Obtener catálogos (incluye categorías)
  const { data: catalogs, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  const categories = catalogs?.request_types || [];
  const equipmentTypes = catalogs?.equipment_types || [];

  // Obtener todos los equipos para filtrar las impresoras
  const { data: allEquipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: fetchAllEquipment,
    enabled: isPrinter, // Solo cargar cuando sea impresora
  });

  // Filtrar impresoras según el rol del usuario
  const printers = useMemo(() => {
    if (!allEquipment || !user) return [];

    // Filtrar solo impresoras (type_id = 3)
    const allPrinters = allEquipment.filter(
      (equipment: any) => equipment.type_id === 3
    );

    // Si es usuario normal (role_id = 4), filtrar por departamento
    // Si es admin (role_id = 1) coordinator (role_id = 2) o técnico (role_id = 3), mostrar todas
    if (user.role_id === 4) {
      return allPrinters.filter(
        (printer: any) =>
          printer.department_name?.toLowerCase() ===
            user.department_name?.toLowerCase() ||
          printer.location?.toLowerCase() ===
            user.department_name?.toLowerCase()
      );
    }

    // Admin, coordinator o técnico: mostrar todas las impresoras
    return allPrinters;
  }, [allEquipment, user]);

  // Sincronizar estados externos con el formulario
  useEffect(() => {
    setValue("selectedDepartmentId", selectedDepartmentIdState);
    setValue("selectedThirdPartyId", selectedUserIdState);
  }, [selectedDepartmentIdState, selectedUserIdState, setValue]);

  const createRequestMutation = useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
    onSuccess: (data) => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      // Resetear el formulario
      reset();

      // Mostrar notificación de éxito
      const successMessage = data?.message || "Solicitud creada exitosamente";
      toast.success(successMessage, {
        description: "Tu solicitud ha sido registrada y será procesada pronto.",
        duration: 4000,
      });
    },
    onError: (error: any) => {
      // Mostrar notificación de error con detalles
      const errorMessage = error?.message || "Error desconocido";
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

    // Determinar si la solicitud es para una impresora
    const isForPrinter = data.equipment_type === "3";

    const requestPayload: CreateRequestPayload = {
      description: data.description,
      requester_id: user.id,
      // Si es impresora, beneficiary_id es null (la impresora pertenece al departamento)
      // Si es para tercero, usar el ID del tercero
      // Si es para el usuario actual, usar su ID
      beneficiary_id: isForPrinter
        ? null
        : data.isForThirdParty
        ? data.selectedThirdPartyId
          ? Number(data.selectedThirdPartyId)
          : null
        : user.id,
      // Si es impresora, usar el ID de la impresora seleccionada
      // Si no, usar el equipo del usuario o del beneficiario
      equipment_id: isForPrinter
        ? Number(data.selectedEquipmentId)
        : user?.equipment_id ?? 0,
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
          {/* Select de tipo de equipo */}
          <div className="pb-4">
            <Label htmlFor="equipment_type" className="pb-2">
              Tipo de equipo
            </Label>
            <Controller
              name="equipment_type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedEquipmentType(value);
                    // Limpiar selección de impresora si cambia el tipo
                    if (value !== "3") {
                      setValue("selectedEquipmentId", "");
                    }
                  }}
                >
                  <SelectTrigger id="equipment_type" className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogsLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando tipos...
                      </SelectItem>
                    ) : equipmentTypes.length === 0 ? (
                      <SelectItem value="not-found" disabled>
                        No hay tipos disponibles
                      </SelectItem>
                    ) : (
                      equipmentTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipment_type && (
              <span className="text-red-500 text-xs">
                {errors.equipment_type.message}
              </span>
            )}
          </div>

          {/* Selección: Para mí o para tercero (solo si NO es impresora) */}
          {!isPrinter && (
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
          )}

          {/* Selector de Departamento y Usuario para terceros (solo si NO es impresora) */}
          {isForThirdParty && !isPrinter && (
            <DepartmentUserSelector
              currentUserId={user?.id}
              currentUserRoleId={user?.role_id}
              currentUserDepartmentId={user?.department_id}
              selectedDepartmentId={selectedDepartmentIdState}
              selectedUserId={selectedUserIdState}
              onDepartmentChange={setSelectedDepartmentIdState}
              onUserChange={setSelectedUserIdState}
              filterCurrentUser={true}
              departmentLabel="Selecciona el departamento"
              userLabel="Selecciona el usuario beneficiario"
              departmentPlaceholder="Selecciona un departamento"
              userPlaceholder="Selecciona un usuario"
              departmentError={errors.selectedDepartmentId?.message}
              userError={errors.selectedThirdPartyId?.message}
            />
          )}

          {/* Formulario de solicitud */}
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Selector de impresora (solo si es tipo impresora) */}
            {isPrinter && (
              <div>
                <Label htmlFor="selectedEquipmentId" className="pb-2">
                  Selecciona la impresora
                </Label>

                {/* Mensaje informativo para usuarios normales */}
                {user?.role_id === 3 && (
                  <p className="text-sm text-gray-600 mb-2">
                    Solo se muestran las impresoras de tu departamento (
                    {user.department_name})
                  </p>
                )}

                <Controller
                  name="selectedEquipmentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!equipmentLoading && printers.length === 0}
                    >
                      <SelectTrigger
                        id="selectedEquipmentId"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona una impresora" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentLoading ? (
                          <SelectItem value="loading" disabled>
                            Cargando impresoras...
                          </SelectItem>
                        ) : printers.length === 0 ? (
                          <SelectItem value="not-found" disabled>
                            {user?.role_id === 3
                              ? `No hay impresoras disponibles en tu departamento (${user.department_name})`
                              : "No hay impresoras disponibles en el sistema"}
                          </SelectItem>
                        ) : (
                          printers.map((printer: any) => (
                            <SelectItem
                              key={printer.id}
                              value={printer.id.toString()}
                            >
                              {printer.brand_name} {printer.model} -{" "}
                              {printer.location}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Mensaje de error si no hay impresoras disponibles */}
                {!equipmentLoading && printers.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    {user?.role_id === 3
                      ? "No puedes crear una solicitud para impresora porque no hay impresoras registradas en tu departamento. Contacta al administrador."
                      : "No hay impresoras registradas en el sistema. Registra una impresora primero."}
                  </p>
                )}

                {errors.selectedEquipmentId && (
                  <span className="text-red-500 text-xs">
                    {errors.selectedEquipmentId.message}
                  </span>
                )}
              </div>
            )}

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
