"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export const ExpandableRow = ({
  user,
  expanded,
  onToggle,
  onToggleActive,
}: {
  user: User;
  expanded: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
}) => {
  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell>{user.identity_card}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.full_name}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
        <TableCell>
          <Button
            size="sm"
            className="mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive();
            }}
          >
            {user.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={`/editUser`}>Editar</Link>
          </Button>
        </TableCell>
        <TableCell>
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
                <div className="p-4 bg-muted">
                  <h3 className="font-semibold mb-2">Additional Info:</h3>
                  <p>{user.position}</p>
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
};
