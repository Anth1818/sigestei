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

const computerSchema = z.object({
  name: z.string().min(3, "El nombre del equipo es requerido"),
  serial_number: z.string().min(5, "El número de serie es requerido"),
  model: z.string().min(2, "El modelo es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  location: z.string().min(3, "La ubicación es requerida"),
  status: z.string().min(1, "El estado es requerido"),
  purchase_date: z.string().min(1, "La fecha de compra es requerida"),
  warranty_expiration: z.string().min(1, "La fecha de expiración de garantía es requerida"),
  assigned_to: z.string().min(3, "La asignación es requerida"),
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

export const AddComputerForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ComputerFormData>({
    resolver: zodResolver(computerSchema),
    defaultValues: {
      name: "",
      serial_number: "",
      model: "",
      brand: "",
      location: "",
      status: "",
      purchase_date: "",
      warranty_expiration: "",
      assigned_to: "",
      cpu: "",
      ram: "",
      storage: "",
      gpu: "",
      network: "",
      os: "",
      office: "",
      antivirus: "",
    }
  });

  const onSubmit = async (data: ComputerFormData) => {
    try {
      // Simulación de envío exitoso
      alert(`✅ Equipo informático registrado exitosamente!\n\nDatos:\n- Nombre: ${data.name}\n- Modelo: ${data.model}\n- Serie: ${data.serial_number}\n- Marca: ${data.brand}\n- Estado: ${data.status}`);
      
      // Limpiar formulario después del envío exitoso
      reset();
    } catch (error) {
      console.error("Error al registrar equipo:", error);
    }
  };

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
                  <Label htmlFor="name" className="pb-2">Nombre del Equipo</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="Ej: Dell OptiPlex 7090"
                        required
                      />
                    )}
                  />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
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
                  <Label htmlFor="brand" className="pb-2">Marca</Label>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="brand" className="w-full">
                          <SelectValue placeholder="Seleccione marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dell">Dell</SelectItem>
                          <SelectItem value="HP">HP</SelectItem>
                          <SelectItem value="Lenovo">Lenovo</SelectItem>
                          <SelectItem value="Acer">Acer</SelectItem>
                          <SelectItem value="ASUS">ASUS</SelectItem>
                          <SelectItem value="MSI">MSI</SelectItem>
                          <SelectItem value="Apple">Apple</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <span className="text-red-500 text-xs">{errors.brand.message}</span>}
                </div>
                <div>
                  <Label htmlFor="location" className="pb-2">Ubicación</Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="location"
                        placeholder="Ej: Oficina 101 - IT"
                        required
                      />
                    )}
                  />
                  {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                </div>
                <div>
                  <Label htmlFor="status" className="pb-2">Estado</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="En mantenimiento">En mantenimiento</SelectItem>
                          <SelectItem value="En reparación">En reparación</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
                </div>
                <div>
                  <Label htmlFor="purchase_date" className="pb-2">Fecha de Compra</Label>
                  <Controller
                    name="purchase_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="purchase_date"
                        type="date"
                        required
                      />
                    )}
                  />
                  {errors.purchase_date && <span className="text-red-500 text-xs">{errors.purchase_date.message}</span>}
                </div>
                <div>
                  <Label htmlFor="warranty_expiration" className="pb-2">Vencimiento de Garantía</Label>
                  <Controller
                    name="warranty_expiration"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="warranty_expiration"
                        type="date"
                        required
                      />
                    )}
                  />
                  {errors.warranty_expiration && <span className="text-red-500 text-xs">{errors.warranty_expiration.message}</span>}
                </div>
                <div>
                  <Label htmlFor="assigned_to" className="pb-2">Asignado a</Label>
                  <Controller
                    name="assigned_to"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="assigned_to"
                        placeholder="Ej: John Doe"
                        required
                      />
                    )}
                  />
                  {errors.assigned_to && <span className="text-red-500 text-xs">{errors.assigned_to.message}</span>}
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

            <Separator />

            {/* Software */}
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
                          <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                          <SelectItem value="Windows 10 Home">Windows 10 Home</SelectItem>
                          <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                          <SelectItem value="Windows 11 Home">Windows 11 Home</SelectItem>
                          <SelectItem value="macOS">macOS</SelectItem>
                          <SelectItem value="Ubuntu">Ubuntu</SelectItem>
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
                          <SelectItem value="Microsoft Office 2019">Microsoft Office 2019</SelectItem>
                          <SelectItem value="Microsoft Office 2021">Microsoft Office 2021</SelectItem>
                          <SelectItem value="Microsoft Office 365">Microsoft Office 365</SelectItem>
                          <SelectItem value="Microsoft Office 2016">Microsoft Office 2016</SelectItem>
                          <SelectItem value="LibreOffice">LibreOffice</SelectItem>
                          <SelectItem value="Google Workspace">Google Workspace</SelectItem>
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
                          <SelectItem value="Windows Defender">Windows Defender</SelectItem>
                          <SelectItem value="McAfee">McAfee</SelectItem>
                          <SelectItem value="ESET NOD32">ESET NOD32</SelectItem>
                          <SelectItem value="Avast">Avast</SelectItem>
                          <SelectItem value="Kaspersky">Kaspersky</SelectItem>
                          <SelectItem value="Bitdefender">Bitdefender</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.antivirus && <span className="text-red-500 text-xs">{errors.antivirus.message}</span>}
                </div>
              </div>
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
            {isSubmitting ? "Registrando..." : "Registrar Equipo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddComputerForm;
