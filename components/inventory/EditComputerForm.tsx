"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipmentData } from "@/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CatalogData, CreateComputerEquipmentInput } from "@/lib/types";

const computerSchema = z.object({
  serial_number: z.string().min(5, "El número de serie es requerido"),
  model: z.string().min(1, "El modelo es requerido"),
  brand_id: z.string().min(1, "La marca es requerida"),
  type_id: z.string().min(1, "El tipo de equipo es requerido"),
  location: z.string().min(1, "La ubicación es requerida"),
  status_id: z.string().min(1, "El estado es requerido"),
  asset_number: z.string().min(1, "El número de bien es requerido"),
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
});

type ComputerFormData = z.infer<typeof computerSchema>;

interface EditComputerFormProps {
  computerId: number;
  computerData: CreateComputerEquipmentInput;
  catalogsData: CatalogData;
}

export const EditComputerForm = ({
  computerId,
  computerData,
  catalogsData,
}: EditComputerFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Estado para rastrear el tipo de equipo seleccionado
  const [selectedTypeId, setSelectedTypeId] = useState(
    computerData?.type_id?.toString() || ""
  );

  // Determinar si es una impresora
  // NOTA: Cambiar "3" por el ID real del tipo "Impresora" en tu base de datos
  const isPrinter = selectedTypeId === "3";

  // Calcular defaultValues directamente desde computerData (que ya viene cargado del padre)
  const defaultValues = useMemo(() => {
    const equipment = computerData;

    return {
      serial_number: equipment?.serial_number || "",
      model: equipment?.model || "",
      brand_id: equipment?.brand_id?.toString() || "",
      type_id: equipment?.type_id?.toString() || "",
      location: equipment?.location || "",
      status_id: equipment?.status_id?.toString() || "",
      asset_number: equipment?.asset_number || "",
      cpu: equipment?.hardware_specs?.cpu || "",
      ram: equipment?.hardware_specs?.ram || "",
      storage: equipment?.hardware_specs?.storage || "",
      gpu: equipment?.hardware_specs?.gpu || "",
      network: equipment?.hardware_specs?.network || "",
      os: equipment?.software_specs?.os || "",
      office: equipment?.software_specs?.office || "",
      antivirus: equipment?.software_specs?.antivirus || "",
    };
  }, [computerData]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ComputerFormData>({
    resolver: zodResolver(computerSchema),
    defaultValues,
  });

  // Mutation para actualizar el equipo
  const updateMutation = useMutation({
    mutationFn: (data: ComputerFormData) => {
      // Verificar si es impresora
      const isPrinterType = data.type_id === "3";
      
      return updateEquipmentData(computerId, {
        serial_number: data.serial_number,
        model: data.model,
        brand_id: parseInt(data.brand_id),
        type_id: parseInt(data.type_id),
        location: data.location,
        status_id: parseInt(data.status_id),
        asset_number: data.asset_number,
        // Solo incluir hardware_specs si NO es impresora
        ...((!isPrinterType) && {
          hardware_specs: {
            cpu: data.cpu || "",
            ram: data.ram || "",
            storage: data.storage || "",
            gpu: data.gpu || "",
            network: data.network || "",
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
      });
    },
    onSuccess: (data) => {
      const successMessage = data?.message || "Equipo actualizado correctamente";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["computer", computerId] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al actualizar el equipo. Intenta nuevamente.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: ComputerFormData) => {
    updateMutation.mutate(data);
  };

  // Extraer catálogos
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
          <CardTitle>Editar Equipo Informático</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Información General del Equipo */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type_id" className="pb-2">
                    Tipo de equipo
                  </Label>
                  <Controller
                    name="type_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
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
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="type_id" className="w-full">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map(
                            (type: { id: number; name: string }) => (
                              <SelectItem
                                key={type.id}
                                value={type.id.toString()}
                              >
                                {type.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type_id && (
                    <span className="text-red-500 text-xs">
                      {errors.type_id.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="brand_id" className="pb-2">
                    Marca
                  </Label>
                  <Controller
                    name="brand_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="brand_id" className="w-full">
                          <SelectValue placeholder="Seleccione marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentBrands.map((brand: any) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand_id && (
                    <span className="text-red-500 text-xs">
                      {errors.brand_id.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="model" className="pb-2">
                    Modelo
                  </Label>
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
                  {errors.model && (
                    <span className="text-red-500 text-xs">
                      {errors.model.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="serial_number" className="pb-2">
                    Número de Serie
                  </Label>
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
                  {errors.serial_number && (
                    <span className="text-red-500 text-xs">
                      {errors.serial_number.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="asset_number" className="pb-2">
                    Número de Bien
                  </Label>
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
                  {errors.asset_number && (
                    <span className="text-red-500 text-xs">
                      {errors.asset_number.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="pb-2">
                    Ubicación
                  </Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="location" className="w-full">
                          <SelectValue placeholder="Seleccione la ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(
                            (department: { id: number; name: string }) => (
                              <SelectItem
                                key={department.id}
                                value={department.name}
                              >
                                {department.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.location && (
                    <span className="text-red-500 text-xs">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="status_id" className="pb-2">
                    Estado
                  </Label>
                  <Controller
                    name="status_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="status_id" className="w-full">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentStatuses.map((status: any) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status_id && (
                    <span className="text-red-500 text-xs">
                      {errors.status_id.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Separador solo si no es impresora */}
            {!isPrinter && <Separator />}

            {/* Especificaciones de Hardware - Solo si NO es impresora */}
            {!isPrinter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Especificaciones de Hardware
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpu" className="pb-2">
                    Procesador (CPU)
                  </Label>
                  <Controller
                    name="cpu"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="cpu"
                        placeholder="Ej: Intel Core i7-11700"
                        required
                      />
                    )}
                  />
                  {errors.cpu && (
                    <span className="text-red-500 text-xs">
                      {errors.cpu.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="ram" className="pb-2">
                    Memoria RAM
                  </Label>
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
                  {errors.ram && (
                    <span className="text-red-500 text-xs">
                      {errors.ram.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="storage" className="pb-2">
                    Almacenamiento
                  </Label>
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
                  {errors.storage && (
                    <span className="text-red-500 text-xs">
                      {errors.storage.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="gpu" className="pb-2">
                    Tarjeta Gráfica (GPU)
                  </Label>
                  <Controller
                    name="gpu"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="gpu"
                        placeholder="Ej: Intel UHD Graphics 750"
                        required
                      />
                    )}
                  />
                  {errors.gpu && (
                    <span className="text-red-500 text-xs">
                      {errors.gpu.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="network" className="pb-2">
                    Red
                  </Label>
                  <Controller
                    name="network"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="network"
                        placeholder="Ej: Gigabit Ethernet, Wi-Fi 6"
                        required
                      />
                    )}
                  />
                  {errors.network && (
                    <span className="text-red-500 text-xs">
                      {errors.network.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Separador solo si no es impresora */}
            {!isPrinter && <Separator />}

            {/* Especificaciones de Software - Solo si NO es impresora */}
            {!isPrinter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Software Instalado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="os" className="pb-2">
                    Sistema Operativo
                  </Label>
                  <Controller
                    name="os"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                  {errors.os && (
                    <span className="text-red-500 text-xs">
                      {errors.os.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="office" className="pb-2">
                    Suite de Oficina
                  </Label>
                  <Controller
                    name="office"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                  {errors.office && (
                    <span className="text-red-500 text-xs">
                      {errors.office.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="antivirus" className="pb-2">
                    Antivirus
                  </Label>
                  <Controller
                    name="antivirus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                  {errors.antivirus && (
                    <span className="text-red-500 text-xs">
                      {errors.antivirus.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            )}

            <Separator />

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/viewInventory")}
                disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
