"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRecentAudits, fetchAuditStatistics } from "@/api/api";
import { AuditLog, AuditStatistics } from "@/lib/types";
import {
  formatAuditDate,
  getEntityTypeName,
  getChangeTypeName,
  getEntityTypeColor,
  getChangeTypeColor,
} from "@/lib/auditUtils";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditFormatting } from "@/hooks/useAuditFormatting";

export default function AuditRealtimeDashboard() {
const { formatValue } = useAuditFormatting();

  // Query con auto-refresh cada 30 segundos
  const {
    data: recentLogs,
    isLoading,
    error,
    refetch,
  } = useQuery<AuditLog[]>({
    queryKey: ["audit-realtime"],
    queryFn: async () => {
      const response = await fetchRecentAudits(15);
      return response;
    },
    refetchInterval: 30000, // 30 segundos
  });

  // Query para estadísticas con auto-refresh
  const { data: stats } = useQuery<AuditStatistics>({
    queryKey: ["audit-stats-realtime"],
    queryFn: fetchAuditStatistics,
    refetchInterval: 60000, // 60 segundos
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600 animate-pulse" />
              <CardTitle>Dashboard en Tiempo Real</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Actualización automática cada 30 segundos
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar ahora
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.request_changes}</div>
                <div className="text-xs text-muted-foreground">Cambios en Solicitudes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.equipment_changes}</div>
                <div className="text-xs text-muted-foreground">Cambios en Equipos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.user_changes}</div>
                <div className="text-xs text-muted-foreground">Cambios en Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total_logins}</div>
                <div className="text-xs text-muted-foreground">Total Logins</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos 15 Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Cargando actividad reciente...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              Error al cargar la actividad: {(error as Error).message}
            </div>
          )}

          {recentLogs && recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Tipo de Entidad */}
                  <div className="flex-shrink-0 mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getEntityTypeColor(log.entity_type)}`}
                    >
                      {getEntityTypeName(log.entity_type)} #{log.entity_id}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getChangeTypeColor(log.change_type)}`}
                      >
                        {getChangeTypeName(log.change_type)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{log.changed_by.full_name}</span>
                      {" realizó un cambio"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatAuditDate(log.changed_at)}
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="text-right text-xs text-muted-foreground max-w-[200px]">
                    <div className="truncate">
                      <span className="line-through">{formatValue(log.field_name, log.old_value) || "N/A"}</span>
                    </div>
                    <div className="font-medium text-foreground truncate">
                      {formatValue(log.field_name, log.new_value) || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading &&
            !error && (
              <div className="text-center py-8 text-muted-foreground">
                No hay actividad reciente
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
            <span>Sistema monitoreando cambios en tiempo real</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
