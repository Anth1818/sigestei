"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog, LoginHistory } from "@/lib/types";
import { useAuditFormatting } from "@/hooks/useAuditFormatting";
import {
  formatAuditDate,
  getChangeTypeName,
  getFieldName,
  getChangeTypeColor,
} from "@/lib/auditUtils";
import { ArrowRight, CheckCircle, XCircle, Monitor } from "lucide-react";

interface UserAuditDetailProps {
  changes: AuditLog[];
  logins: LoginHistory[];
}

export default function UserAuditDetail({
  changes,
  logins,
}: UserAuditDetailProps) {
  const { formatValue } = useAuditFormatting();

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Cambios de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {changes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay cambios registrados
            </p>
          ) : (
            <div className="space-y-4">
              {changes.map((change) => (
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
                          <span className="break-all">{formatValue(change.field_name, change.old_value)}</span>
                          <ArrowRight className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-foreground break-all">
                            {formatValue(change.field_name, change.new_value)}
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

      {/* Historial de Logins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Accesos</CardTitle>
        </CardHeader>
        <CardContent>
          {logins.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay logins registrados
            </p>
          ) : (
            <div className="space-y-3">
              {logins.map((login) => (
                <div
                  key={login.id}
                  className={`border-l-2 ${
                    login.success ? "border-green-500" : "border-red-500"
                  } pl-4 py-2`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {login.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {login.success ? "Acceso exitoso" : "Acceso fallido"}
                        </span>
                      </div>
                      {!login.success && login.failure_reason && (
                        <div className="text-xs text-red-600 pl-6">
                          {login.failure_reason}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pl-6 space-y-0.5">
                        <div className="break-all">IP: {login.ip_address}</div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Monitor className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {login.user_agent}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground sm:min-w-[150px]">
                      <div>{formatAuditDate(login.login_at)}</div>
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
