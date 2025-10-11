"use client";

import AddComputerForm from "@/components/inventory/AddComputerForm";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { ArrowBigLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogs } from "@/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddComputerEquipmentPage() {
  const router = useRouter();
  const { user } = useUserStore();

  // Obtener catálogos
  const { data: catalogsData, isLoading: catalogsLoading, error } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  if (catalogsLoading) {
    return (
      <LayoutSideBar>
        <ButtonNavigate url="/viewInventory" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4" />}>
          Volver al inventario
        </ButtonNavigate>
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </LayoutSideBar>
    );
  }

  if (error) {
    return (
      <LayoutSideBar>
        <ButtonNavigate url="/viewInventory" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4" />}>
          Volver al inventario
        </ButtonNavigate>
        <div className="flex justify-center items-center min-h-[80vh]">
          <p className="text-red-500">Error al cargar los catálogos. Intenta nuevamente.</p>
        </div>
      </LayoutSideBar>
    );
  }

  return (
    <LayoutSideBar>
      <ButtonNavigate url="/viewInventory" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4" />}>
        Volver al inventario
      </ButtonNavigate>
      <AddComputerForm 
        catalogsData={catalogsData}
        currentUser={user}
      />
    </LayoutSideBar>
  );
}