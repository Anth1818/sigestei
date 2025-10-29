"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEquipment } from "@/api/api";
import { toast } from "sonner";
import { DepartmentUserSelector } from "@/components/shared/DepartmentUserSelector";
import { CatalogData, CreateComputerEquipmentInput, UserData } from "@/lib/types";
import { colorForSoonerError } from "@/lib/utils";

const computerSchema = z.object({
  serial_number: z.string().min(5, "El número de serie es requerido"),
  model: z.string().min(2, "El modelo es requerido"),
  brand_id: z.string().min(1, "La marca es requerida"),
  type_id: z.string().min(1, "El tipo de equipo es requerido"),
  location: z.string().min(1, "La ubicación es requerida"),
  status_id: z.string().min(1, "El estado es requerido"),
  asset_number: z.string().min(1, "El número de bien es requerido"),
  departmentUserAssinged_id: z.string().optional(),
  assigned_user_id: z.string().optional(),
  // Hardware specs - opcionales para impresoras
  cpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  gpu: z.string().optional(),
  network: z.string().optional(),
  // Software - opcional para impresoras
  os: z.string().optional(),
  office: z.string().optional(),
  antivirus: z.string().optional(),
  software_type_id: z.string().optional(),
  office_suite_id: z.string().optional(),
  antivirus_solution_id: z.string().optional(),
}).superRefine((data, ctx) => {
  // Determinar si es impresora
  // NOTA: Cambiar "3" por el ID real del tipo "Impresora" en tu base de datos
  const isPrinter = data.type_id === "3";
  
  // Si NO es impresora, validar campos de hardware
  if (!isPrinter) {
    if (!data.cpu || data.cpu.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El procesador es requerido",
        path: ["cpu"],
      });
    }
    if (!data.ram || data.ram.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La memoria RAM es requerida",
        path: ["ram"],
      });
    }
    if (!data.storage || data.storage.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El almacenamiento es requerido",
        path: ["storage"],
      });
    }
    if (!data.gpu || data.gpu.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La tarjeta gráfica es requerida",
        path: ["gpu"],
      });
    }
    if (!data.network || data.network.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las opciones de red son requeridas",
        path: ["network"],
      });
    }
    
    // Validar software
    if (!data.os || data.os.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El sistema operativo es requerido",
        path: ["os"],
      });
    }
    if (!data.office || data.office.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La suite de oficina es requerida",
        path: ["office"],
      });
    }
    if (!data.antivirus || data.antivirus.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El antivirus es requerido",
        path: ["antivirus"],
      });
    }
  }
  
  // Si el estado NO es 4 Y NO es impresora, el usuario es obligatorio
  if (data.status_id !== "4" && !isPrinter && !data.assigned_user_id && !data.departmentUserAssinged_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debe asignar un usuario",
      path: ["assigned_user_id"],
    });
  }
});

type ComputerFormData = z.infer<typeof computerSchema>;

interface AddComputerFormProps {
  catalogsData: CatalogData;
  currentUser: UserData | null;
}

export const AddComputerForm = ({ catalogsData, currentUser }: AddComputerFormProps) => {
  const queryClient = useQueryClient();

  // Estados para DepartmentUserSelector
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");

  // Determinar si el usuario es opcional según el estado
  const isUserOptional = selectedStatusId === "4";
  
  // Determinar si es una impresora
  // NOTA: Cambiar "3" por el ID real del tipo "Impresora" en tu base de datos
  // Para verificar: SELECT id, name FROM computer_types WHERE name ILIKE '%impresora%';
  const isPrinter = selectedTypeId === "3";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ComputerFormData>({
    resolver: zodResolver(computerSchema),
    defaultValues: {
      serial_number: "",
      model: "",
      brand_id: "",
      type_id: "",
      location: "",
      status_id: "",
      asset_number: "",
      departmentUserAssinged_id: "",
      assigned_user_id: "",
      cpu: "",
      ram: "",
      storage: "",
      gpu: "",
      network: "",
      os: "",
      office: "",
      antivirus: "",
      software_type_id: "",
      office_suite_id: "",
      antivirus_solution_id: "",
    }
  });

  // Mutation para crear equipo
  const createMutation = useMutation({
    mutationFn: (data: CreateComputerEquipmentInput) => createEquipment(data),
    onSuccess: (data) => {
      // Verificar si la respuesta tiene success: true o el mensaje de éxito
      const successMessage = data?.message || "Equipo informático registrado exitosamente";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["computers"] });
      reset();
      setSelectedDepartmentId("");
      setSelectedUserId("");
      setSelectedStatusId("");
    },
    onError: (error: any) => {
      // Ahora error.message contiene el mensaje del backend
      const errorMessage = error?.message || "Error al registrar el equipo. Intenta nuevamente.";
      toast.error(errorMessage,{style: colorForSoonerError});
      
    },
  });

  const onSubmit = async (data: ComputerFormData) => {
    // Verificar si es impresora
    const isPrinterType = data.type_id === "3";
    
    const equipmentData: CreateComputerEquipmentInput = {
      asset_number: data.asset_number,
      serial_number: data.serial_number,
      model: data.model,
      location: data.location,
      // Solo incluir hardware_specs si NO es impresora
      ...((!isPrinterType) && {
        hardware_specs: {
          cpu: data.cpu || "",
          gpu: data.gpu || "",
          ram: data.ram || "",
          network: data.network || "",
          storage: data.storage || "",
        },
      }),
      // Solo incluir software_specs si NO es impresora
      ...((!isPrinterType) && {
        software_specs: {
          os: data.os || "",
          office: data.office || "",
          antivirus: data.antivirus || "",
        },
      }),
      // Solo asignar usuario si NO es impresora
      assigned_user_id: isPrinterType ? null : (selectedUserId ? parseInt(selectedUserId) : null),
      type_id: parseInt(data.type_id),
      brand_id: parseInt(data.brand_id),
      status_id: parseInt(data.status_id),
    };
    console.log("Equipo a crear:", equipmentData);

    const response = createMutation.mutate(equipmentData);
    console.log("Respuesta de la mutación:", response)
  };

  // Extraer catálogos (ahora recibidos como props)
  const equipmentBrands = catalogsData?.computer_brands || [];
  const equipmentTypes = catalogsData?.computer_types || [];
  const equipmentStatuses = catalogsData?.computer_statuses || [];
  const departments = catalogsData?.departments || [];
  const osOptions = catalogsData?.os_options || [];
  const officeOptions = catalogsData?.office_suites || [];
  const antivirusOptions = catalogsData?.antivirus_solutions || [];

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Agregar Equipo Informático</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Información General del Equipo */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type_id" className="pb-2">Tipo de equipo</Label>
                  <Controller
                    name="type_id"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedTypeId(value);
                          // Si cambia a impresora, limpiar campos de hardware/software
                          if (value === "3") {
                            setValue("cpu", "");
                            setValue("ram", "");
                            setValue("storage", "");
                            setValue("gpu", "");
                            setValue("network", "");
                            setValue("os", "");
                            setValue("office", "");
                            setValue("antivirus", "");
                            setValue("assigned_user_id", "");
                            setSelectedDepartmentId("");
                            setSelectedUserId("");
                          }
                        }}
                      >
                        <SelectTrigger id="type_id" className="w-full">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.length === 0 ? (
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
                  {errors.type_id && <span className="text-red-500 text-xs">{errors.type_id.message}</span>}
                </div>

                <div>
                  <Label htmlFor="brand_id" className="pb-2">Marca</Label>
                  <Controller
                    name="brand_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="brand_id" className="w-full">
                          <SelectValue placeholder="Seleccione marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentBrands.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay marcas disponibles
                            </SelectItem>
                          ) : (
                            equipmentBrands.map((brand: any) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand_id && <span className="text-red-500 text-xs">{errors.brand_id.message}</span>}
                </div>

                <div>
                  <Label htmlFor="model" className="pb-2">Modelo</Label>
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="model"
                        placeholder="Ej: OptiPlex 7090"
                        required
                      />
                    )}
                  />
                  {errors.model && <span className="text-red-500 text-xs">{errors.model.message}</span>}
                </div>

                <div>
                  <Label htmlFor="serial_number" className="pb-2">Número de Serie</Label>
                  <Controller
                    name="serial_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="serial_number"
                        placeholder="Ej: DL001234"
                        required
                      />
                    )}
                  />
                  {errors.serial_number && <span className="text-red-500 text-xs">{errors.serial_number.message}</span>}
                </div>

                <div>
                  <Label htmlFor="asset_number" className="pb-2">Número de Bien</Label>
                  <Controller
                    name="asset_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="asset_number"
                        placeholder="Ej: ASSET-001"
                        required
                      />
                    )}
                  />
                  {errors.asset_number && <span className="text-red-500 text-xs">{errors.asset_number.message}</span>}
                </div>

                <div>
                  <Label htmlFor="location" className="pb-2">Ubicación</Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="location" className="w-full">
                          <SelectValue placeholder="Seleccione ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay departamentos disponibles
                            </SelectItem>
                          ) : (
                            departments.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                </div>

                <div>
                  <Label htmlFor="status_id" className="pb-2">Estado</Label>
                  <Controller
                    name="status_id"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedStatusId(value);
                          // Si cambia a estado 4, limpiar usuario asignado
                          if (value === "4") {
                            setSelectedUserId("");
                            setSelectedDepartmentId("");
                            setValue("assigned_user_id", "");
                          }
                        }}
                      >
                        <SelectTrigger id="status_id" className="w-full">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentStatuses.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay estados disponibles
                            </SelectItem>
                          ) : (
                            equipmentStatuses.map((status: any) => (
                              <SelectItem key={status.id} value={status.id.toString()}>
                                {status.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status_id && <span className="text-red-500 text-xs">{errors.status_id.message}</span>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Selector de Departamento y Usuario - Solo si el estado NO es 4 Y NO es impresora */}
            {!isUserOptional && !isPrinter && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Asignación de Equipo</h3>
                <DepartmentUserSelector
                  currentUserId={currentUser?.id}
                  currentUserRoleId={currentUser?.role_id}
                  currentUserDepartmentId={currentUser?.department_id}
                  selectedDepartmentId={selectedDepartmentId}
                  selectedUserId={selectedUserId}
                  onDepartmentChange={setSelectedDepartmentId}
                  onUserChange={(userId) => {
                    setSelectedUserId(userId);
                    setValue("assigned_user_id", userId);
                  }}
                  departmentLabel="Departamento del usuario"
                  userLabel="Usuario asignado"
                  departmentPlaceholder="Seleccione un departamento"
                  userPlaceholder="Seleccione un usuario"
                  departmentError={errors.assigned_user_id?.message}
                  userError={errors.assigned_user_id?.message}
                />
                <Controller
                  name="assigned_user_id"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={selectedUserId}
                    />
                  )}
                />
              </div>
            )}

            {/* Separador solo si no es impresora */}
            {!isPrinter && <Separator />}

            {/* Especificaciones de Hardware - Solo si NO es impresora */}
            {!isPrinter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Especificaciones de Hardware</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpu" className="pb-2">Procesador (CPU)</Label>
                  <Controller
                    name="cpu"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="cpu"
                        placeholder="Ej: Intel Core i7-10700"
                        required
                      />
                    )}
                  />
                  {errors.cpu && <span className="text-red-500 text-xs">{errors.cpu.message}</span>}
                </div>
                <div>
                  <Label htmlFor="ram" className="pb-2">Memoria RAM</Label>
                  <Controller
                    name="ram"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="ram"
                        placeholder="Ej: 16GB DDR4"
                        required
                      />
                    )}
                  />
                  {errors.ram && <span className="text-red-500 text-xs">{errors.ram.message}</span>}
                </div>
                <div>
                  <Label htmlFor="storage" className="pb-2">Almacenamiento</Label>
                  <Controller
                    name="storage"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="storage"
                        placeholder="Ej: 512GB SSD"
                        required
                      />
                    )}
                  />
                  {errors.storage && <span className="text-red-500 text-xs">{errors.storage.message}</span>}
                </div>
                <div>
                  <Label htmlFor="gpu" className="pb-2">Tarjeta Gráfica (GPU)</Label>
                  <Controller
                    name="gpu"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="gpu"
                        placeholder="Ej: Intel UHD Graphics 630"
                        required
                      />
                    )}
                  />
                  {errors.gpu && <span className="text-red-500 text-xs">{errors.gpu.message}</span>}
                </div>
                <div>
                  <Label htmlFor="network" className="pb-2">Conectividad de Red</Label>
                  <Controller
                    name="network"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="network"
                        placeholder="Ej: Ethernet, Wi-Fi"
                        required
                      />
                    )}
                  />
                  {errors.network && <span className="text-red-500 text-xs">{errors.network.message}</span>}
                </div>
              </div>
            </div>
            )}

            {/* Separador solo si no es impresora */}
            {!isPrinter && <Separator />}

            {/* Software - Solo si NO es impresora */}
            {!isPrinter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Software</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="os" className="pb-2">Sistema Operativo</Label>
                  <Controller
                    name="os"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="os" className="w-full">
                          <SelectValue placeholder="Seleccione SO" />
                        </SelectTrigger>
                        <SelectContent>
                          {osOptions.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay opciones disponibles
                            </SelectItem>
                          ) : (
                            osOptions.map((os: any) => (
                              <SelectItem key={os.id} value={os.name}>
                                {os.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.os && <span className="text-red-500 text-xs">{errors.os.message}</span>}
                </div>
                <div>
                  <Label htmlFor="office" className="pb-2">Suite de Oficina</Label>
                  <Controller
                    name="office"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="office" className="w-full">
                          <SelectValue placeholder="Seleccione suite" />
                        </SelectTrigger>
                        <SelectContent>
                          {officeOptions.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay opciones disponibles
                            </SelectItem>
                          ) : (
                            officeOptions.map((office: any) => (
                              <SelectItem key={office.id} value={office.name}>
                                {office.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.office && <span className="text-red-500 text-xs">{errors.office.message}</span>}
                </div>
                <div>
                  <Label htmlFor="antivirus" className="pb-2">Antivirus</Label>
                  <Controller
                    name="antivirus"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="antivirus" className="w-full">
                          <SelectValue placeholder="Seleccione antivirus" />
                        </SelectTrigger>
                        <SelectContent>
                          {antivirusOptions.length === 0 ? (
                            <SelectItem value="not-found" disabled>
                              No hay opciones disponibles
                            </SelectItem>
                          ) : (
                            antivirusOptions.map((antivirus: any) => (
                              <SelectItem key={antivirus.id} value={antivirus.name}>
                                {antivirus.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.antivirus && <span className="text-red-500 text-xs">{errors.antivirus.message}</span>}
                </div>
              </div>
            </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full md:w-auto"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Registrando..." : "Registrar Equipo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddComputerForm;
