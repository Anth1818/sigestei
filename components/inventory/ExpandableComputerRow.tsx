"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { ContentComputerRow } from "./ContentComputerRow";
import Link from "next/link";
import { useState } from "react";

interface ExpandableComputerRowProps {
  computer: any;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  getStatusColor: (status: string) => string;
}

export function ExpandableComputerRow({
  computer,
  expanded,
  onToggle,
  onUpdateStatus,
  getStatusColor,
}: ExpandableComputerRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [assigned_user_name, setAssigned_user_name] = useState(
      computer.assigned_to || ""
    );

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="p-2 text-center">{computer.id}</TableCell>
        <TableCell className="p-2">{computer.name}</TableCell>
        <TableCell className="p-2">{computer.model}</TableCell>
        <TableCell className="p-2">{computer.serial_number}</TableCell>
        <TableCell className="p-2">
          <span className={getStatusColor(computer.status)}>
            {computer.status}
          </span>
        </TableCell>
        <TableCell className="p-2">{computer.location}</TableCell>
        <TableCell className="p-2">{assigned_user_name}</TableCell>
        <TableCell className="p-2 flex flex-col gap-2 min-w-[140px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select
                    value={computer.status}
                    onValueChange={(value) => onUpdateStatus(computer.id, value)}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Dañado">Dañado</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                Cambiar estado del equipo
              </TooltipContent>
            </Tooltip>
          </TooltipProvider><Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={`/editComputerEquipment`}>Editar</Link>
          </Button>
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
                <ContentComputerRow computer={computer} assigned_user_name={assigned_user_name} setAssigned_user_name={setAssigned_user_name} />
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}
