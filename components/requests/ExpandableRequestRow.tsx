"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, History, FileDown } from "lucide-react";
import { RequestAdapted, RequestAuditHistory, RequestResponse } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import ContentRequestRow from "./ContentRequestRow";
import RequestAuditDetail from "@/components/audit/RequestAuditDetail";
import { fetchRequestAudit } from "@/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { generateSingleRequestPDF } from "@/lib/pdfUtils";
import { AuditLog } from "@/lib/types";
import { en } from "zod/v4/locales";

interface ExpandableRequestRowProps {
  requestFullFromApi: RequestResponse;
  requestAdapted: RequestAdapted;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  onUpdatePriority: (id: number, priority: string) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  itemsToSelectStatuses: string[];
  itemsToSelectPriorities: string[];
  itemsToSelectTechinicians: string[];
}

export function ExpandableRequestRow({
  requestAdapted: request,
  requestFullFromApi,
  expanded,
  onToggle,
  onUpdateStatus,
  onUpdatePriority,
  getPriorityColor,
  getStatusColor,
}: ExpandableRequestRowProps) {
  const user = useUserStore((state) => state.user);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Query para obtener el historial de auditoría
  const { data: auditHistory, isLoading: isLoadingAudit } =
    useQuery<RequestAuditHistory>({
      queryKey: ["request-audit", request.id],
      queryFn: () => fetchRequestAudit(request.id),
      enabled: isAuditOpen,
    });

  // Handlers que llaman a los callbacks del padre (que abrirán los diálogos)
  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(request.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
    onUpdatePriority(request.id, newPriority);
  };

  // Ocultar select si el usuario es institucional (role 4) o técnico sin asignación
  const shouldHideStatusSelect = 
    user?.role_id === 4 || 
    (user?.role_id === 3 && request.assigned_to !== user?.full_name);

  const validateToShowStatusSelect = !shouldHideStatusSelect;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportPDF = async () => {
    // Obtener historial de auditoría si el usuario tiene permisos
    let auditData: AuditLog[] | undefined;
    if (user?.role_id === 1 || user?.role_id === 2) {
      try {
        const audit = await fetchRequestAudit(request.id);
        auditData = audit.general_changes;
      } catch (error) {
        console.error("Error al obtener auditoría:", error);
      }
    }
    generateSingleRequestPDF(requestFullFromApi, auditData);
  };

  const beneficiaryName =
    request.third_party?.full_name || request.user.full_name;
  const isThirdParty = !!request.third_party;

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="p-2 text-center">{request.id}</TableCell>
        <TableCell className="p-2">{request.request_type}</TableCell>
        <TableCell className="p-2">{request.equipment?.type_name}</TableCell>
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
            {request.equipment?.type_name === "Impresora"
              ? request.equipment?.location
              : beneficiaryName}
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
        {validateToShowStatusSelect && (
          <TableCell className="p-2 flex flex-col gap-2 min-w-[140px]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select
                      value={request.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="h-8 w-full mb-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En proceso">En proceso</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  Cambiar estado de la solicitud
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {  user?.role_id !== 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select
                      value={request.priority}
                      onValueChange={handlePriorityChange}
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  Cambiar prioridad de la solicitud
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>)}
          </TableCell>
        )}
        <TableCell className="p-2 flex gap-1">
          {(user?.role_id === 1 || user?.role_id === 2) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAuditOpen(true)}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  Ver historial de cambios
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {expanded ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onToggle} >
                    <ChevronDown className="h-4 w-4 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Contraer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expandir</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
                {(user?.role_id !== 4 && user?.role_id !== 3) &&
                  <div className="mb-3 flex justify-end">
                  <Button
                    onClick={handleExportPDF}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Exportar Solicitud a PDF
                  </Button>
                </div>}
                <ContentRequestRow request={request} />
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>

      {/* Diálogo de Historial de Auditoría */}
      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Historial de Auditoría - Solicitud #{request.id}
            </DialogTitle>
            <DialogDescription>
              Historial completo de cambios y asignaciones de esta solicitud
            </DialogDescription>
          </DialogHeader>
          {isLoadingAudit && (
            <div className="text-center py-8">Cargando historial...</div>
          )}
          {auditHistory && <RequestAuditDetail auditHistory={auditHistory} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
