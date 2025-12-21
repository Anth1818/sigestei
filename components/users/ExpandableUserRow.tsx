"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserData, AuditLog, LoginHistory } from "@/lib/types";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, History } from "lucide-react";
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
import Link from "next/link";
import { ReactNode } from "react";
import { getStatusColor } from "@/lib/userUtils";
import UserAuditDetail from "@/components/audit/UserAuditDetail";
import { fetchUserChanges, fetchUserLogins } from "@/api/api";


export const ExpandableRow = ({
  user,
  expanded,
  onToggle,
  onToggleActive,
  children,
}: {
  user: UserData;
  expanded: boolean;
  onToggle: () => void;
  onToggleActive: (identityCard: number) => void;
  children?: ReactNode;
}) => {
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Query para obtener cambios del usuario
  const { data: userChanges, isLoading: isLoadingChanges } = useQuery<AuditLog[]>({
    queryKey: ["user-changes", user.id],
    queryFn: () => fetchUserChanges(user.id),
    enabled: isAuditOpen,
  });

  // Query para obtener logins del usuario
  const { data: userLogins, isLoading: isLoadingLogins } = useQuery<LoginHistory[]>({
    queryKey: ["user-logins", user.id],
    queryFn: () => fetchUserLogins(user.id, 20),
    enabled: isAuditOpen,
  });

  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell>{user.identity_card}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.full_name}</TableCell>
        <TableCell>
          <span className={(user.role_name)}>
            {user.role_name}
          </span>
        </TableCell>
        <TableCell>
          <span className={getStatusColor(user.is_active)}>
            {user.is_active ? "Activo" : "Inactivo"}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive(user.identity_card);
              }}
            >
              {user.is_active ? "Desactivar" : "Activar"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAuditOpen(true);
                    }}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Ver historial de cambios
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link href={`/editUser/${user.identity_card}`}>Editar</Link>
            </Button>
          </div>
        </TableCell>
        <TableCell className="w-[50px]">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </TableCell>
      </TableRow>
      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow>
            <TableCell colSpan={7} className="p-0">
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
                {children}
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>

      {/* Dialog de Historial de Auditoría */}
      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent className="max-w-4xl  max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Auditoría - {user.full_name}</DialogTitle>
            <DialogDescription>
              Historial completo de cambios y accesos del usuario
            </DialogDescription>
          </DialogHeader>
          {(isLoadingChanges || isLoadingLogins) && (
            <div className="text-center py-8">Cargando historial...</div>
          )}
          {userChanges && userLogins && (
            <UserAuditDetail changes={userChanges} logins={userLogins} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
