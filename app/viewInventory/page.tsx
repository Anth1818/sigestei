import { Suspense } from "react";
import EquipmentTable from "@/components/inventory/EquipmentTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function InventoryPage() {
  return (
    <LayoutSideBar>
      <h2 className="text-lg">Tabla de equipos informáticos</h2>
      <ButtonNavigate icon={<Plus />} url="addEquipment" className="md: w-fit">
        Nuevo equipo informático
      </ButtonNavigate>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <EquipmentTable />
      </Suspense>
    </LayoutSideBar>
  );
}