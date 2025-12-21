"use client";

import { useQuery } from "@tanstack/react-query";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { AddUserForm } from "@/components/users/AddUserForm";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { ArrowBigLeft } from "lucide-react";
import { fetchCatalogs } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddUserPage() {
  // Fetch catalogs para los selects
  const { data: catalogsData, isLoading: catalogsLoading } = useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });

  if (catalogsLoading) {
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

  return (
    <LayoutSideBar>
      <ButtonNavigate
        url="/viewUsers"
        className="w-fit"
        icon={<ArrowBigLeft className="h-4 w-4" />}
      >
        Volver a usuarios
      </ButtonNavigate>
      <AddUserForm catalogsData={catalogsData} />
    </LayoutSideBar>
  );
}