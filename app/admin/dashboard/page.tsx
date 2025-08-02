import LayoutSideBar from "@/layouts/LayoutSideBar"
import CardDashboard from "@/components/dashboard/CardDashboard"
import { FileCheck, ComputerIcon, UserCheck2Icon } from "lucide-react"
import SelectTechnicalRequestStatus from "@/components/dashboard/SelectTechinalRequestStatus"
import SelectComputerStatus from "@/components/dashboard/SelectComputerStatus"
import SelectUserStatus from "@/components/dashboard/SelectUserStatus"
import RequestChart from "@/components/dashboard/RequestChart"

export default function Page() {
  return (
    <LayoutSideBar>
      <main>
        <p className="p-4">Dashboard administrador</p>
        <div className="flex flex-1 flex-col pb-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <CardDashboard title="Buscar solicitudes por:" content="200 Solicitudes resueltas" footer="Cantidad por mes" Icon={FileCheck}>
              <SelectTechnicalRequestStatus />
            </CardDashboard>
            <CardDashboard title="Buscar equipos por:" content="100 Equipos operativos" footer="Total de equipos: 300" Icon={ComputerIcon}>
              <SelectComputerStatus />
            </CardDashboard>
            <CardDashboard title="Buscar usuarios por:" content="150 Usuarios institucionales" footer="Total de usuarios: 250" Icon={UserCheck2Icon}>
              <SelectUserStatus />
            </CardDashboard>
          </div>
        </div>
        <RequestChart />
      </main>
    </LayoutSideBar>


  )
}
