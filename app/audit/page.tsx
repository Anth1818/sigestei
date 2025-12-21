"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuditLogTable from "@/components/audit/AuditLogTable";
import AuditRealtimeDashboard from "@/components/audit/AuditRealtimeDashboard";
import { fetchRecentAudits } from "@/api/api";
import { AuditLog } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Activity } from "lucide-react";

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<"realtime" | "recent">(
    "realtime"
  );

  // Query para cambios recientes
  const {
    data: recentData,
    isLoading: isLoadingRecent,
    error: recentError,
  } = useQuery<AuditLog[]>({
    queryKey: ["audit-recent"],
    queryFn: async () => {
      const response = await fetchRecentAudits(50);
      return response;
    },
  });

  const tabs = [
    {
      id: "realtime" as const,
      label: "En Tiempo Real",
      icon: Activity,
    },
    {
      id: "recent" as const,
      label: "Cambios Recientes",
      icon: Clock,
    },
  ];

  return (
    <LayoutSideBar>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Auditoría del Sistema</h2>
          <p className="text-muted-foreground">
            Historial completo de cambios y accesos al sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="gap-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Contenido de tabs */}
        <div>
          {/* Tab de Dashboard en Tiempo Real */}
          {activeTab === "realtime" && <AuditRealtimeDashboard />}

          {/* Tab de Cambios Recientes */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              {isLoadingRecent && (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              )}

              {recentError && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-red-500">
                      Error al cargar cambios recientes:{" "}
                      {(recentError as Error).message}
                    </div>
                  </CardContent>
                </Card>
              )}

              {recentData && recentData.length > 0 ? (
                <AuditLogTable auditLogs={recentData} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      No hay cambios recientes registrados
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutSideBar>
  );
}
