import { Suspense } from "react";
import RequestTable from "@/components/requests/RequestTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function RequestPage() {
  return (
    <LayoutSideBar>
      <h2 className="text-lg">Tabla de solicitudes</h2>
      <ButtonNavigate icon={<Plus />} url="addRequest" className="md: w-fit">
        Nueva solicitud
      </ButtonNavigate>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        {<RequestTable />}
      </Suspense>
    </LayoutSideBar>
  );
}