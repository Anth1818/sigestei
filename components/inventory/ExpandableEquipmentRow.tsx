"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { ContentEquipmentRow } from "./ContentEquipmentRow";
import { EquipmentAdapted } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

interface ExpandableEquipmentRowProps {
  equipment: EquipmentAdapted;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (equipmentId: number, newStatusId: number, newStatusName: string) => void;
  getStatusColor: (status: string) => string;
  equipmentStatuses: Array<{ id: number; name: string }>;
}

export function ExpandableEquipmentRow({
  equipment,
  expanded,
  onToggle,
  onUpdateStatus,
  getStatusColor,
  equipmentStatuses,
}: ExpandableEquipmentRowProps) {


  const [assigned_user_name, setAssigned_user_name] = useState(
      equipment.assigned_to || "No asignado"
    );

  // Manejar el cambio de estado
  const handleStatusChange = (statusId: string) => {
    const selectedStatus = equipmentStatuses.find(
      (status) => status.id.toString() === statusId
    );
    if (selectedStatus) {
      onUpdateStatus(equipment.id, selectedStatus.id, selectedStatus.name);
    }
  };

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="p-2 text-center">{equipment.id}</TableCell>
        <TableCell className="p-2">{equipment.type_name}</TableCell>
        <TableCell className="p-2">{equipment.asset_number}</TableCell>
        <TableCell className="p-2">{equipment.brand}</TableCell>
        <TableCell className="p-2">{equipment.model}</TableCell>
        <TableCell className="p-2">{equipment.serial_number}</TableCell>
        <TableCell className="p-2">
          <span className={getStatusColor(equipment.status)}>
            {equipment.status}
          </span>
        </TableCell>
        <TableCell className="p-2">{equipment.location}</TableCell>
        <TableCell className="p-2">{equipment.type_name === "Impresora" ? equipment.location : assigned_user_name}</TableCell>
        <TableCell className="p-2 flex flex-col gap-2 min-w-[140px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select
                    value={equipment.status_id?.toString()}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
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
            <Link href={`/editEquipment/${equipment.id}`}>Editar</Link>
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
            <TableCell colSpan={11} className="p-4 bg-muted/30">
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
                <ContentEquipmentRow equipment={equipment} assigned_user_name={assigned_user_name} setAssigned_user_name={setAssigned_user_name} />
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}
