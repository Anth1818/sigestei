import EquipmentTable from "@/components/inventory/EquipmentTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Plus } from "lucide-react";

export default function InventoryPage () {
    return <LayoutSideBar>
        <h2 className="text-lg">Tabla de equipos informáticos</h2>
        <ButtonNavigate icon={<Plus /> } url="addEquipment" className="md: w-fit" >
                    Nuevo equipo informático
                </ButtonNavigate>
      <EquipmentTable />
    </LayoutSideBar>
    }