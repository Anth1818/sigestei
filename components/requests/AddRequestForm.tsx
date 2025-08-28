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
import { mockUsers } from "@/data/mockUsers";
import { User } from "@/lib/types";

// Simula el usuario autenticado (puedes cambiar el id para pruebas)
const currentUser: User = mockUsers[2];

const requestTypes = [
  "Mantenimiento",
  "Instalación",
  "Reparación",
  "Actualización",
  "Soporte"
];

const maintenanceSubtypes = [
  "Preventivo",
  "Correctivo"
];


const requestSchema = z.object({
  request_type: z.string().min(1, "El tipo de solicitud es requerido"),
  maintenance_subtype: z.string().optional(),
  repair_update_subtype: z.string().optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(500, "La descripción no puede exceder 500 caracteres"),
  isForThirdParty: z.boolean(),
  selectedThirdPartyId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isForThirdParty && !data.selectedThirdPartyId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar un usuario beneficiario",
      path: ["selectedThirdPartyId"]
    });
  }
  if (data.request_type === "Mantenimiento" && !data.maintenance_subtype) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar el subtipo de mantenimiento",
      path: ["maintenance_subtype"]
    });
  }
  if ((data.request_type === "Reparación" || data.request_type === "Actualización") && !data.repair_update_subtype) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar si es hardware o software",
      path: ["repair_update_subtype"]
    });
  }
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function AddRequestForm() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      request_type: "",
      maintenance_subtype: "",
      repair_update_subtype: "",
      description: "",
      isForThirdParty: false,
      selectedThirdPartyId: "",
    }
  });

  const isForThirdParty = watch("isForThirdParty");
  const selectedThirdPartyId = watch("selectedThirdPartyId");
  const requestType = watch("request_type");
  const maintenanceSubtype = watch("maintenance_subtype");
  const repairUpdateSubtype = watch("repair_update_subtype");

  // Usuarios del mismo departamento (excluye al usuario actual)
  const departmentUsers = mockUsers.filter(
    (u) => u.department === currentUser.department && u.id !== currentUser.id
  );

  const onSubmit = async (data: RequestFormData) => {
    try {
      const beneficiary = data.isForThirdParty
        ? departmentUsers.find((u) => u.id === Number(data.selectedThirdPartyId))
        : currentUser;

      if (data.isForThirdParty && !beneficiary) {
        alert("Debes seleccionar un usuario beneficiario válido.");
        return;
      }

      if (!beneficiary) return;

      const alertMsg = `
Solicitud creada:

Solicitante:
 - Nombre: ${currentUser.full_name}
 - Email: ${currentUser.email}
 - Departamento: ${currentUser.department}

Tipo de solicitud: ${data.request_type}
Descripción: ${data.description}
Beneficiario: ${beneficiary.full_name}${data.isForThirdParty ? ` (Tercero)\n- Email: ${beneficiary.email}\n- Cargo: ${beneficiary.position}` : " (Yo mismo)"}
`;
      alert(alertMsg);
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
          {/* Selección de beneficiario */}
          <div className="mb-6">
            <Label className="font-medium mb-2 block">¿Para quién es la solicitud?</Label>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
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
              <label className="flex items-center gap-2">
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
                Para un tercero de mi departamento
              </label>
            </div>
          </div>

          {/* Si es para tercero, mostrar select de usuarios del departamento */}
          {isForThirdParty && (
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
                      {departmentUsers.length === 0 ? (
                        <SelectItem value="not-found" disabled>No hay usuarios en tu departamento</SelectItem>
                      ) : (
                        departmentUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id.toString()}>
                            {u.full_name} - {u.position}
                          </SelectItem>
                        ))
                      )}
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
            <div>
              <Label htmlFor="request_type" className="pb-2">Tipo de solicitud</Label>
              <Controller
                name="request_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} required>
                    <SelectTrigger id="request_type" className="w-full">
                      <SelectValue placeholder="Selecciona tipo de solicitud" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.request_type && (
                <span className="text-red-500 text-xs">{errors.request_type.message}</span>
              )}
            </div>
            {requestType === "Mantenimiento" && (
              <div>
                <Label htmlFor="maintenance_subtype" className="pb-2">Subtipo de mantenimiento</Label>
                <Controller
                  name="maintenance_subtype"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} required>
                      <SelectTrigger id="maintenance_subtype" className="w-full">
                        <SelectValue placeholder="Selecciona subtipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceSubtypes.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.maintenance_subtype && (
                  <span className="text-red-500 text-xs">{errors.maintenance_subtype.message}</span>
                )}
              </div>
            )}
            {(requestType != "Mantenimiento") && (
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <Label htmlFor="repair_update_subtype">¿La solicitud es sobre hardware o software?</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer text-primary" aria-label="¿Qué es hardware o software?">🛈</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span>
                        <b>Hardware:</b> Se refiere a componentes físicos del equipo, como disco duro, memoria RAM, teclado, etc.<br/>
                        <b>Software:</b> Se refiere a programas o sistemas instalados, como el sistema operativo o aplicaciones.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Controller
                  name="repair_update_subtype"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} required>
                      <SelectTrigger id="repair_update_subtype" className="w-full">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.repair_update_subtype && (
                  <span className="text-red-500 text-xs">{errors.repair_update_subtype.message}</span>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="description" className="pb-2">Descripción</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    placeholder="Describe el problema o requerimiento"
                    maxLength={500}
                    className="min-h-[160px] border rounded px-2 py-1 w-full resize-none"
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">{errors.description.message}</span>
              )}
            </div>
            <CardFooter className="flex justify-end px-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
