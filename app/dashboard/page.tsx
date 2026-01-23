"use client"
import LayoutSideBar from "@/layouts/LayoutSideBar"
import CardDashboard from "@/components/dashboard/CardDashboard"
import { FileCheck, ComputerIcon, UserCheck2Icon } from "lucide-react"
import SelectTechnicalRequestStatus from "@/components/dashboard/SelectTechinalRequestStatus"
import SelectComputerStatus from "@/components/dashboard/SelectComputerStatus"
import SelectUserStatus from "@/components/dashboard/SelectUserStatus"
import RequestChart from "@/components/dashboard/RequestChart"
import { useQuery } from "@tanstack/react-query"
import { fetchDataForDashboard } from "@/api/api"
import { useState } from "react"
import type { DashboardData } from "@/lib/types"
import { TEXTREQUESTBYSTATUS, TEXTCOMPUTERBYSTATUS, TEXTUSERBYROLE } from "@/lib/constants"


export default function DashboardPage() {
  const [selectUserByRole, setSelectUserByRole] = useState("user");
  const [selectComputerStatus, setSelectComputerStatus] = useState("operational");
  const [selectRequestStatus, setSelectRequestStatus] = useState("resolved");
  const { data, isLoading, error } = useQuery<{ data: DashboardData }>({
    queryKey: ["dashboard-metrics"],
    queryFn: fetchDataForDashboard,
  });

  if (isLoading) return <LayoutSideBar><main className="p-4">Cargando dashboard...</main></LayoutSideBar>;
  if (error) return <LayoutSideBar><main className="p-4 text-red-500">Error al cargar datos del dashboard</main></LayoutSideBar>;

  return (
    <LayoutSideBar>
      <main>
        <h2 className="pb-4 text-lg">Dashboard administrativo</h2>
        <div className="flex flex-1 flex-col pb-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <CardDashboard
              title="Buscar solicitudes por:"
              content={`${data?.data?.requestByStatusCurrentMonth?.[selectRequestStatus] || "0"} ${TEXTREQUESTBYSTATUS[selectRequestStatus] || ''}`}
              footer={`Cantidad por mes`}
              Icon={FileCheck}
            >
              <SelectTechnicalRequestStatus onChange={setSelectRequestStatus} status={selectRequestStatus} />
            </CardDashboard>
            <CardDashboard
              title="Buscar equipos por:"
              content={`${data?.data?.equipment?.byStatus?.[selectComputerStatus] || "0"} ${TEXTCOMPUTERBYSTATUS[selectComputerStatus] || ''}`}
              footer={`Total de equipos: ${data?.data?.equipment?.total || "0"}`}
              Icon={ComputerIcon}
            >
              <SelectComputerStatus onChange={setSelectComputerStatus} status={selectComputerStatus}/>
            </CardDashboard>
            <CardDashboard
              title="Buscar usuarios por:"
              content={`${data?.data?.users?.byRoles?.[selectUserByRole] || "0"} ${TEXTUSERBYROLE[selectUserByRole] || ''}`}
              footer={`Total de usuarios: ${data?.data?.users?.totalUsers || "0"}`}
              Icon={UserCheck2Icon}
              
            >
              <SelectUserStatus onChange={setSelectUserByRole} role={selectUserByRole} />
            </CardDashboard>
          </div>
        </div>
        <RequestChart />
      </main>
    </LayoutSideBar>
  );
}
