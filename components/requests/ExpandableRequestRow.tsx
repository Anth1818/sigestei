"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Request } from "@/lib/types";
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
import ContentRequestRow from "./ContentRequestRow";
import { useUserStore } from "@/hooks/useUserStore";

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
  const user = useUserStore((state) => state.user);

  // Handlers que llaman a los callbacks del padre (que abrirán los diálogos)
  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(request.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
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
            {request.equipment?.type_name === "Impresora" ? request.equipment?.location : beneficiaryName}
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
        { user?.role_id != 4 &&
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
          </TooltipProvider>
        </TableCell>
        }
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
