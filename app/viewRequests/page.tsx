import RequestTable from "@/components/requests/RequestTable";
import LayoutSideBar from "@/layouts/LayoutSideBar";

export default function RequestPage () {
    return <LayoutSideBar>
        <h2 className="text-lg">Tabla de solicitudes</h2>
      <RequestTable />
    </LayoutSideBar>
    }