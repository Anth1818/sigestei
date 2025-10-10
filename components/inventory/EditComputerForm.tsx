"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipmentData } from "@/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const computerSchema = z.object({
  serial_number: z.string().min(5, "El número de serie es requerido"),
  model: z.string().min(1, "El modelo es requerido"),
  brand_id: z.string().min(1, "La marca es requerida"),
  type_id: z.string().min(1, "El tipo de equipo es requerido"),
  location: z.string().min(1, "La ubicación es requerida"),
  status_id: z.string().min(1, "El estado es requerido"),
  asset_number: z.string().min(1, "El número de bien es requerido"),
  // Hardware specs
  cpu: z.string().min(3, "El procesador es requerido"),
  ram: z.string().min(2, "La memoria RAM es requerida"),
  storage: z.string().min(3, "El almacenamiento es requerido"),
  gpu: z.string().min(3, "La tarjeta gráfica es requerida"),
  network: z.string().min(3, "Las opciones de red son requeridas"),
  // Software
  os: z.string().min(3, "El sistema operativo es requerido"),
  office: z.string().min(3, "La suite de oficina es requerida"),
  antivirus: z.string().min(3, "El antivirus es requerido"),
});

type ComputerFormData = z.infer<typeof computerSchema>;

interface EditComputerFormProps {
  computerId: number;
  computerData: any;
  catalogsData: any;
}

export const EditComputerForm = ({ computerId, computerData, catalogsData }: EditComputerFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
    formState: { errors }
  } = useForm<ComputerFormData>({
    resolver: zodResolver(computerSchema),
    defaultValues,
  });

  // Mutation para actualizar el equipo
  const updateMutation = useMutation({
    mutationFn: (data: ComputerFormData) =>
      updateEquipmentData(computerId, {
        serial_number: data.serial_number,
        model: data.model,
        brand_id: parseInt(data.brand_id),
        type_id: parseInt(data.type_id),
        location: data.location,
        status_id: parseInt(data.status_id),
        asset_number: data.asset_number,
        hardware_specs: {
          cpu: data.cpu,
          ram: data.ram,
          storage: data.storage,
          gpu: data.gpu,
          network: data.network,
        },
        software_specs: {
          os: data.os,
          office: data.office,
          antivirus: data.antivirus,
        },
      }),
    onSuccess: () => {
      toast.success("Equipo actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['computer', computerId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Error al actualizar el equipo. Intenta nuevamente."
      );
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

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/30">
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Editar Equipo Informático</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Información General del Equipo */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type_id" className="pb-2">
                    Tipo de equipo: <span className="font-bold text-primary">{computerData?.equipment_types.name || 'Cargando...'}</span>
                  </Label>
                  <Controller
                    name="type_id"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        value={field.value || undefined} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="type_id" className="w-full">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map((type: {id:number, name:string}) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type_id && <span className="text-red-500 text-xs">{errors.type_id.message}</span>}
                </div>
                
                <div>
                  <Label htmlFor="brand_id" className="pb-2">
                    Marca: <span className="font-bold text-primary">{computerData?.equipment_brands.name || 'Cargando...'}</span>
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
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
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
                  <Label htmlFor="location" className="pb-2">
                    Ubicación: <span className="font-bold text-primary">{computerData?.location || 'Cargando...'}</span>
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
                          {departments.map((department: {id:number, name:string}) => (
                            <SelectItem key={department.id} value={department.name}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                </div>

                <div>
                  <Label htmlFor="status_id" className="pb-2">
                    Estado: <span className="font-bold text-primary">{computerData?.equipment_statuses.name || 'Cargando...'}</span>
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
                            <SelectItem key={status.id} value={status.id.toString()}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status_id && <span className="text-red-500 text-xs">{errors.status_id.message}</span>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Especificaciones de Hardware */}
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
                        placeholder="Ej: Intel Core i7-11700"
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
                        placeholder="Ej: Intel UHD Graphics 750"
                        required
                      />
                    )}
                  />
                  {errors.gpu && <span className="text-red-500 text-xs">{errors.gpu.message}</span>}
                </div>

                <div>
                  <Label htmlFor="network" className="pb-2">Red</Label>
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
                  {errors.network && <span className="text-red-500 text-xs">{errors.network.message}</span>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Especificaciones de Software */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Software Instalado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="os" className="pb-2">Sistema Operativo</Label>
                  <Controller
                    name="os"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="os"
                        placeholder="Ej: Windows 11 Pro"
                        required
                      />
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
                      <Input
                        {...field}
                        id="office"
                        placeholder="Ej: Microsoft Office 365"
                        required
                      />
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
                      <Input
                        {...field}
                        id="antivirus"
                        placeholder="Ej: Windows Defender"
                        required
                      />
                    )}
                  />
                  {errors.antivirus && <span className="text-red-500 text-xs">{errors.antivirus.message}</span>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/viewInventory')}
                disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

