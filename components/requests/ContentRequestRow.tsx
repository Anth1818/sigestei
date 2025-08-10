import { Computer, FileText, User } from "lucide-react"
import { Request } from "@/lib/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

interface ContentRequestRowProps {
  request: Request;
}

const technicians = [
  "Carlos Rodríguez",
  "Ana García",
  "Luis Martínez",
  "Pedro Fernández",
];

const ContentRequestRow = ({ request}: ContentRequestRowProps ) => {
    const [assignedTo, setAssignedTo] = useState(request.assigned_to);
    return <div className="grid grid-cols-2 gap-6">
                  {/* Información de la Solicitud */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-lg">
                        Detalles de la Solicitud
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-sm text-gray-600">
                          Descripción:
                        </span>
                        <div className="w-full">
                          <textarea className="text-sm mt-1 p-2 bg-white dark:text-black rounded border h-48 w-sm md:w-md scroll-auto resize-none" disabled>
                            {request.description}
                          </textarea>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-600">
                            Asignado a:
                          </span>
                          <Select
                            value={assignedTo}
                            onValueChange={setAssignedTo}
                          >
                            <SelectTrigger className="h-7 min-w-[180px] w-auto">
                              <SelectValue placeholder="Asignar técnico" />
                            </SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            ID Equipo:
                          </span>
                          <p className="text-sm">
                            {request.computer_equipment_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del Solicitante */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-lg">Solicitante</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Nombre:
                          </span>
                          <p className="text-sm">{request.user.full_name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Cédula:
                          </span>
                          <p className="text-sm">
                            {request.user.identity_card}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Email:
                          </span>
                          <p className="text-sm">{request.user.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Cargo:
                          </span>
                          <p className="text-sm">{request.user.position}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-600">
                          Departamento:
                        </span>
                        <p className="text-sm">{request.user.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del Equipo Principal */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Computer className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-lg">
                        Equipo Principal
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Nombre:
                          </span>
                          <p className="text-sm">
                            {request.computer_equipment.name}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Modelo:
                          </span>
                          <p className="text-sm">
                            {request.computer_equipment.model}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-600">
                          N° Serie:
                        </span>
                        <p className="text-sm">
                          {request.computer_equipment.serial_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del Beneficiario (si es tercero) */}
                  {request.third_party && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-lg">
                          Beneficiario Final
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-sm text-gray-600">
                              Nombre:
                            </span>
                            <p className="text-sm">
                              {request.third_party.full_name}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-sm text-gray-600">
                              Cédula:
                            </span>
                            <p className="text-sm">
                              {request.third_party.identity_card}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-sm text-gray-600">
                              Email:
                            </span>
                            <p className="text-sm">
                              {request.third_party.email}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-sm text-gray-600">
                              Cargo:
                            </span>
                            <p className="text-sm">
                              {request.third_party.position}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Departamento:
                          </span>
                          <p className="text-sm">
                            {request.third_party.department}
                          </p>
                        </div>

                        {/* Equipo del Beneficiario */}
                        <div className="mt-4 p-3 bg-white dark:text-black rounded border">
                          <div className="flex items-center gap-2 mb-2">
                            <Computer className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-sm">
                              Equipo del Beneficiario
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Nombre:</span>
                              <p>
                                {request.third_party.computer_equipment.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Modelo:</span>
                              <p>
                                {request.third_party.computer_equipment.model}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">N° Serie:</span>
                              <p>
                                {
                                  request.third_party.computer_equipment
                                    .serial_number
                                }
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Ubicación:</span>
                              <p>
                                {
                                  request.third_party.computer_equipment
                                    .location
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
}
export default ContentRequestRow;