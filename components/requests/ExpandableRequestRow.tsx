"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Request, RequestResponse } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequest } from "@/api/api";
import { toast } from "sonner";
import ContentRequestRow from "./ContentRequestRow";

interface ExpandableRequestRowProps {
  request: Request;
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
  request,
  expanded,
  onToggle,
  onUpdateStatus,
  onUpdatePriority,
  getPriorityColor,
  getStatusColor,
  
}: ExpandableRequestRowProps) {
  const queryClient = useQueryClient();


  // Mutation para actualizar el estado
const updateStatusMutation = useMutation({
  mutationFn: ({ id, status }: { id: number; status: string }) => {
    const statusId = getStatusId(status);
    // Si el status es 3 (Completada) o 4 (Cancelada), agrega resolution_date
    const needsResolutionDate = statusId === 3 || statusId === 4;
    const updateData: { status_id: number; resolution_date?: string } = { status_id: statusId };
    if (needsResolutionDate) {
      updateData.resolution_date = new Date().toISOString();
    }
    return updateRequest(id, updateData);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    toast.success("Estado actualizado correctamente");
  },
  onError: (error: any) => {
    toast.error(error?.message || "Error al actualizar el estado");
  },
});

  // Mutation para actualizar la prioridad 
  const updatePriorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: string }) =>
      updateRequest(id, { priority_id: getPriorityId(priority) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Prioridad actualizada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar la prioridad");
    },
  });

  // Funciones auxiliares para mapear nombres a IDs
  const getStatusId = (statusName: string): number => {
    const statusMap: Record<string, number> = {
      "Pendiente": 1,
      "En proceso": 2,
      "Completada": 3,
      "Cancelada": 4,
      
    };
    return statusMap[statusName] || 1;
  };

  const getPriorityId = (priorityName: string): number => {
    const priorityMap: Record<string, number> = {
      "Alta": 1,
      "Media": 2,
      "Baja": 3,
    };
    return priorityMap[priorityName] || 2;
  };

  // Handlers que usan las mutations
  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({ id: request.id, status: newStatus });
    onUpdateStatus(request.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
    updatePriorityMutation.mutate({ id: request.id, priority: newPriority });
    onUpdatePriority(request.id, newPriority);
  };

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
        <TableCell className="p-2 flex flex-col gap-2 min-w-[140px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select
                    value={request.status}
                    onValueChange={handleStatusChange}
                    disabled={updateStatusMutation.isPending}
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select
                    value={request.priority}
                    onValueChange={handlePriorityChange}
                    disabled={updatePriorityMutation.isPending}
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
          </TooltipProvider>
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
                <ContentRequestRow request={request} />
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}
