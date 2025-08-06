"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  User,
  Computer,
  Calendar,
  FileText,
} from "lucide-react";
import { Request } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";

interface ExpandableRequestRowProps {
  request: Request;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

export function ExpandableRequestRow({
  request,
  expanded,
  onToggle,
  onUpdateStatus,
  getPriorityColor,
  getStatusColor,
}: ExpandableRequestRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const beneficiaryName =
    request.third_party?.full_name || request.user.full_name;
  const isThirdParty = !!request.third_party;

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="p-2 text-center">{request.id}</TableCell>
        <TableCell className="p-2">{request.request_type}</TableCell>
        <TableCell className={`p-2 ${getPriorityColor(request.priority)}`}>
          {request.priority}
        </TableCell>
        <TableCell className="p-2">
          <span className={getStatusColor(request.status)}>
            {request.status}
          </span>
        </TableCell>
        <TableCell className="p-2">{request.user.full_name}</TableCell>
        <TableCell className="p-2">
          <div className="flex items-center gap-1">
            {beneficiaryName}
            {isThirdParty && (
              <span className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs">
                Tercero
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="p-2">
          {formatDate(request.request_date)}
        </TableCell>
        <TableCell className="p-2">
          <Select
            value={request.status}
            onValueChange={(value) => onUpdateStatus(request.id, value)
                
            }
          >
            <SelectTrigger className="h-8 w-32" >
              <SelectValue  />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="Pendiente" >Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="p-2">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow>
            <TableCell colSpan={9} className="p-4 bg-muted/30">
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="grid grid-cols-2 gap-6">
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
                          <textarea className="text-sm mt-1 p-2 bg-white dark:text-black rounded border h-48 w-sm md:w-md scroll-auto resize-none" >
                            {request.description}
                          </textarea>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-sm text-gray-600">
                            Asignado a:
                          </span>
                          <p className="text-sm">{request.assigned_to}</p>
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
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}
