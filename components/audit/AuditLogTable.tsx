"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuditLog } from "@/lib/types";
import { usePagination } from "@/hooks/usePagination";
import { useAuditFormatting } from "@/hooks/useAuditFormatting";
import {
  formatAuditDateShort,
  getEntityTypeName,
  getChangeTypeName,
  getFieldName,
  getEntityTypeColor,
  getChangeTypeColor,
} from "@/lib/auditUtils";

interface AuditLogTableProps {
  auditLogs: AuditLog[];
}

export default function AuditLogTable({ auditLogs }: AuditLogTableProps) {
  const pagination = usePagination(auditLogs);
  const { formatValue, isLoading: isCatalogsLoading } = useAuditFormatting();

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo de Entidad</TableHead>
              <TableHead>ID Entidad</TableHead>
              <TableHead>Tipo de Cambio</TableHead>
              <TableHead>Campo</TableHead>
              <TableHead>Valor Anterior</TableHead>
              <TableHead>Valor Nuevo</TableHead>
              <TableHead>Modificado Por</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No se encontraron registros de auditoría
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedItems.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getEntityTypeColor(
                        log.entity_type
                      )}`}
                    >
                      {getEntityTypeName(log.entity_type)}
                    </span>
                  </TableCell>
                  <TableCell>{log.entity_id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getChangeTypeColor(
                        log.change_type
                      )}`}
                    >
                      {getChangeTypeName(log.change_type)}
                    </span>
                  </TableCell>
                  <TableCell>{getFieldName(log.field_name)}</TableCell>
                  <TableCell>{formatValue(log.field_name, log.old_value, log.entity_type)}</TableCell>
                  <TableCell>{formatValue(log.field_name, log.new_value, log.entity_type)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {log.changed_by?.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.changed_by?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatAuditDateShort(log.changed_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando{" "}
          {Math.min(
            (pagination.currentPage - 1) * pagination.rowsPerPage + 1,
            auditLogs.length
          )}{" "}
          a{" "}
          {Math.min(
            pagination.currentPage * pagination.rowsPerPage,
            auditLogs.length
          )}{" "}
          de {auditLogs.length} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.changePage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <div className="text-sm font-medium">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.changePage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
