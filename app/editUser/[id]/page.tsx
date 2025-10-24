"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { EditUserForm } from "@/components/users/EditUserForm";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { ArrowBigLeft } from "lucide-react";
import { fetchUserByIdentityCard, fetchCatalogs } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage() {
  const params = useParams();
  const identityCard = params.id ? Number(params.id) : null;

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", identityCard],
    queryFn: () => fetchUserByIdentityCard(identityCard!),
    enabled: !!identityCard,
  });

  // Fetch catalogs
  const { data: catalogsData, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  if (!identityCard) {
    return (
      <LayoutSideBar>
        <div className="flex items-center justify-center h-64 text-red-500">
          <p>ID de usuario inválido</p>
        </div>
      </LayoutSideBar>
    );
  }

  if (userLoading || catalogsLoading) {
    return (
      <LayoutSideBar>
        <ButtonNavigate
          url="/viewUsers"
          className="w-fit"
          icon={<ArrowBigLeft className="h-4 w-4" />}
        >
          Volver a usuarios
        </ButtonNavigate>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LayoutSideBar>
    );
  }

  if (userError || !userData) {
    return (
      <LayoutSideBar>
        <ButtonNavigate
          url="/viewUsers"
          className="w-fit"
          icon={<ArrowBigLeft className="h-4 w-4" />}
        >
          Volver a usuarios
        </ButtonNavigate>
        <div className="flex items-center justify-center h-64 text-red-500">
          <p>Error al cargar los datos del usuario</p>
        </div>
      </LayoutSideBar>
    );
  }

  return (
    <LayoutSideBar>
      <ButtonNavigate
        url="/viewUsers"
        className="w-fit"
        icon={<ArrowBigLeft className="h-4 w-4" />}
      >
        Volver a usuarios
      </ButtonNavigate>
      <EditUserForm userData={userData} catalogsData={catalogsData} />
    </LayoutSideBar>
  );
}
