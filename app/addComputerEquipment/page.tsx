import AddComputerForm from "@/components/inventory/AddComputerForm";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { ArrowBigLeft } from "lucide-react";

export default function AddComputerEquipmentPage () {
    return <LayoutSideBar>
        <ButtonNavigate url="/viewInventory" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4"/>}>
            Volver al inventario
        </ButtonNavigate>
        <p>Agregar equipo informático</p>
        <AddComputerForm />
    </LayoutSideBar>
    }