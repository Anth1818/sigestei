"use client";

import LayoutSideBar from "@/layouts/LayoutSideBar";
import { EditComputerForm } from "@/components/inventory/EditComputerForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchEquipmentById, fetchCatalogs } from "@/api/api";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { ArrowBigLeft } from "lucide-react";

export default function EditComputerEquipmentPage() {
  const params = useParams();
  const computerId = params.id as string;

  // Obtener datos del equipo
  const { data: computerData, isLoading: isLoadingComputer } = useQuery({
    queryKey: ["computer", parseInt(computerId)],
    queryFn: () => fetchEquipmentById(parseInt(computerId)),
  });

  // Obtener catálogos
  const { data: catalogsData, isLoading: isLoadingCatalogs } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  // Mostrar loading mientras se cargan los datos
  if (isLoadingComputer || isLoadingCatalogs) {
    return (
      <LayoutSideBar>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">Cargando datos del equipo...</div>
          </div>
        </div>
      </LayoutSideBar>
    );
  }

  // Mostrar error si no se encuentra el equipo
  if (!computerData) {
    return (
      <LayoutSideBar>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center py-8">
            <div className="text-lg text-red-600">No se encontró el equipo</div>
          </div>
        </div>
      </LayoutSideBar>
    );
  }

  return (
    <LayoutSideBar>
      <div className="container mx-auto p-6">
        <ButtonNavigate
          url="/viewInventory"
          className="w-fit mb-4"
          icon={<ArrowBigLeft className="h-4 w-4" />}
        >
          Volver al inventario
        </ButtonNavigate>
        <EditComputerForm
          computerId={parseInt(computerId)}
          computerData={computerData}
          catalogsData={catalogsData}
        />
      </div>
    </LayoutSideBar>
  );
}
