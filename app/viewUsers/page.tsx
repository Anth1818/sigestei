import { Suspense } from "react";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import UserTable from "@/components/users/UserTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function UserPage() {
  return (
    <LayoutSideBar>
      <h2 className="text-lg">Tabla de usuarios</h2>
      <ButtonNavigate icon={<Plus />} url="addUser" className="md: w-fit">
        Añadir usuario
      </ButtonNavigate>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <UserTable />
      </Suspense>
    </LayoutSideBar>
  );
}