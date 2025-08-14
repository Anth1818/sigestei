import ComputerTable from "@/components/inventory/ComputerTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Plus } from "lucide-react";

export default function InventoryPage () {
    return <LayoutSideBar>
        <h2 className="text-lg">Tabla de equipos informáticos</h2>
        <ButtonNavigate icon={<Plus /> } url="addComputerEquipment" className="md: w-fit" >
                    Nuevo equipo informático
                </ButtonNavigate>
      <ComputerTable />
    </LayoutSideBar>
    }