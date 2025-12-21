"use client";

import LayoutSideBar from "@/layouts/LayoutSideBar";
import { EditEquipmentForm } from "@/components/inventory/EditEquipmentForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchEquipmentById, fetchCatalogs } from "@/api/api";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { ArrowBigLeft } from "lucide-react";

export default function EditEquipmentPage() {
  const params = useParams();
  const equipmentId = params.id as string;

  // Obtener datos del equipo
  const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery({
    queryKey: ["equipment", parseInt(equipmentId)],
    queryFn: () => fetchEquipmentById(parseInt(equipmentId)),
  });

  // Obtener catálogos
  const { data: catalogsData, isLoading: isLoadingCatalogs } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  // Mostrar loading mientras se cargan los datos
  if (isLoadingEquipment || isLoadingCatalogs) {
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
  if (!equipmentData) {
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
        <EditEquipmentForm
          equipmentId={parseInt(equipmentId)}
          equipmentData={equipmentData}
          catalogsData={catalogsData}
        />
      </div>
    </LayoutSideBar>
  );
}
