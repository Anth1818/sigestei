"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AddRequestForm() {
  const [isForThirdParty, setIsForThirdParty] = useState(false);
  const [selectedThirdPartyId, setSelectedThirdPartyId] = useState<string>("");
  const [form, setForm] = useState({
    request_type: "",
    description: "",
  });

  const disabled = form.request_type === "" || form.description.trim() === "" || (isForThirdParty && selectedThirdPartyId === "");

  // Usuarios del mismo departamento (excluye al usuario actual)
  const departmentUsers = mockUsers.filter(
    (u) => u.department === currentUser.department && u.id !== currentUser.id
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const beneficiary = isForThirdParty
      ? departmentUsers.find((u) => u.id === Number(selectedThirdPartyId))
      : currentUser;
        if (isForThirdParty && !beneficiary) {
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

Tipo de solicitud: ${form.request_type}
Descripción: ${form.description}
Beneficiario: ${beneficiary.full_name}${isForThirdParty ? ` (Tercero)\n- Email: ${beneficiary.email}\n- Cargo: ${beneficiary.position}` : " (Yo mismo)"}
`;
        alert(alertMsg);
        setForm({ request_type: "", description: "" });
        setSelectedThirdPartyId("");
        setIsForThirdParty(false);
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
                <input
                  type="radio"
                  name="beneficiary"
                  checked={!isForThirdParty}
                  onChange={() => setIsForThirdParty(false)}
                />
                Para mí
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="beneficiary"
                  checked={isForThirdParty}
                  onChange={() => setIsForThirdParty(true)}
                />
                Para un tercero de mi departamento
              </label>
            </div>
          </div>

          {/* Si es para tercero, mostrar select de usuarios del departamento */}
          {isForThirdParty && (
            <div className="mb-6">
              <Label htmlFor="third-party-select" className="block mb-1">Selecciona el usuario beneficiario</Label>
              <Select
                value={selectedThirdPartyId}
                onValueChange={(value) => setSelectedThirdPartyId(value)}
              >
                <SelectTrigger id="third-party-select" className="w-full">
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {departmentUsers.length === 0 ? (
                    <SelectItem value="not-fount" disabled>No hay usuarios en tu departamento</SelectItem>
                  ) : (
                    departmentUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.full_name} - {u.position}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Formulario de solicitud */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="request_type" className="pb-2">Tipo de solicitud</Label>
              <Select
                value={form.request_type}
                onValueChange={(value) => handleSelectChange("request_type", value)}
                required
              >
                <SelectTrigger id="request_type" className="w-full">
                  <SelectValue placeholder="Selecciona tipo de solicitud" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="pb-2">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe el problema o requerimiento"
                maxLength={500}
                required
                className="min-h-[160px] border rounded px-2 py-1 w-full resize-none"
              />
            </div>
            <CardFooter className="flex justify-end px-0">
                <Button
                type="submit"
                disabled={disabled}
                className={`w-full md:w-auto ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                Enviar solicitud
                </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
