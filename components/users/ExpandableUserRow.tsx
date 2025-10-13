"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { UserData } from "@/lib/types";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { parseRoleName, getStatusColor } from "@/lib/userUtils";


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
  onToggleActive: () => void;
  children?: ReactNode;
}) => {

  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell>{user.identity_card}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.full_name}</TableCell>
        <TableCell>
          <span className={(user.role_name)}>
            {parseRoleName(user.role_name)}
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
                onToggleActive();
              }}
            >
              {user.is_active ? "Desactivar" : "Activar"}
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link href={`/editUser/${user.id}`}>Editar</Link>
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
    </>
  );
};
