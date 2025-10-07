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
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetchDataForDashboard();
      return res.data;
    },
  });

  if (isLoading) return <LayoutSideBar><main className="p-4">Cargando dashboard...</main></LayoutSideBar>;
  if (error) return <LayoutSideBar><main className="p-4 text-red-500">Error al cargar datos del dashboard</main></LayoutSideBar>;

  return (
    <LayoutSideBar>
      <main>
        <p className="p-4">Dashboard administrativo</p>
        <div className="flex flex-1 flex-col pb-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <CardDashboard
              title="Buscar solicitudes por:"
              content={`${data?.requestByStatusCurrentMonth[selectRequestStatus] || "0"} ${TEXTREQUESTBYSTATUS[selectRequestStatus] || ''}`}
              footer={`Cantidad por mes`}
              Icon={FileCheck}
            >
              <SelectTechnicalRequestStatus onChange={setSelectRequestStatus} status={selectRequestStatus} />
            </CardDashboard>
            <CardDashboard
              title="Buscar equipos por:"
              content={`${data?.equipment.byStatus[selectComputerStatus]} ${TEXTCOMPUTERBYSTATUS[selectComputerStatus] || ''}`}
              footer={`Total de equipos: ${data?.equipment.total}`}
              Icon={ComputerIcon}
            >
              <SelectComputerStatus onChange={setSelectComputerStatus} status={selectComputerStatus}/>
            </CardDashboard>
            <CardDashboard
              title="Buscar usuarios por:"
              content={`${data?.users.byRoles[selectUserByRole]} ${TEXTUSERBYROLE[selectUserByRole] || ''}`}
              footer={`Total de usuarios: ${data?.users.totalUsers}`}
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
