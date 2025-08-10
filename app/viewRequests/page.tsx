import RequestTable from "@/components/requests/RequestTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Plus } from "lucide-react";

export default function RequestPage () {
    return <LayoutSideBar>
        <h2 className="text-lg">Tabla de solicitudes</h2>
        <ButtonNavigate icon={<Plus /> } url="addRequest" className="md: w-fit" >
                    Nueva solicitud
                </ButtonNavigate>
      <RequestTable />
    </LayoutSideBar>
    }