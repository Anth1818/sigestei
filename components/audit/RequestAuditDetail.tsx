"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestAuditHistory } from "@/lib/types";
import { useAuditFormatting } from "@/hooks/useAuditFormatting";
import {
  formatAuditDate,
  getChangeTypeName,
  getFieldName,
  getChangeTypeColor,
} from "@/lib/auditUtils";
import { ArrowRight } from "lucide-react";

interface RequestAuditDetailProps {
  auditHistory: RequestAuditHistory;
}

export default function RequestAuditDetail({
  auditHistory,
}: RequestAuditDetailProps) {
  const { formatValue } = useAuditFormatting();

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Cambios Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {auditHistory.general_changes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay cambios registrados
            </p>
          ) : (
            <div className="space-y-4">
              {auditHistory.general_changes.map((change) => (
                <div
                  key={change.id}
                  className="border-l-2 border-muted pl-4 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getChangeTypeColor(
                            change.change_type
                          )}`}
                        >
                          {getChangeTypeName(change.change_type)}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">
                          {getFieldName(change.field_name)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-muted-foreground break-all">
                          <span className="break-all">{formatValue(change.field_name, change.old_value, true)}</span>
                          <ArrowRight className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-foreground break-all">
                            {formatValue(change.field_name, change.new_value, true)}
                          </span>
                        </div>
                        {change.comments && (
                          <div className="text-xs mt-2 p-2 bg-muted rounded break-words">
                            <strong>Comentario:</strong> {change.comments}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground sm:min-w-[150px]">
                      <div>{formatAuditDate(change.changed_at)}</div>
                      <div className="font-medium mt-1">
                        {change.changed_by.full_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asignaciones de Técnico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Asignaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {auditHistory.technician_assignments.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay asignaciones registradas
            </p>
          ) : (
            <div className="space-y-4">
              {auditHistory.technician_assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border-l-2 border-green-500 pl-4 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm space-y-1">
                        <div className="font-medium">
                          Técnico asignado: {assignment.technician.full_name}
                        </div>
                        {assignment.previous_technician && (
                          <div className="text-muted-foreground">
                            Anterior: {assignment.previous_technician.full_name}
                          </div>
                        )}
                        {assignment.reason && (
                          <div className="text-xs mt-2 p-2 bg-muted rounded break-words">
                            <strong>Razón:</strong> {assignment.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground sm:min-w-[150px]">
                      <div>{formatAuditDate(assignment.assigned_at)}</div>
                      <div className="font-medium mt-1">
                        Por: {assignment.assigned_by.full_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
