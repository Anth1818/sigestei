"use client";

import { UserCard } from "@/components/profile/UserCard";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserByIdentityCard } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageProfile() {
  const params = useParams();
  const identityCard = params.id ? Number(params.id) : null;

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["user", identityCard],
    queryFn: () => fetchUserByIdentityCard(identityCard!),
    enabled: !!identityCard,
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

  if (isLoading) {
    return (
      <LayoutSideBar>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LayoutSideBar>
    );
  }

  if (error || !userData) {
    return (
      <LayoutSideBar>
        <div className="flex items-center justify-center h-64 text-red-500">
          <p>Error al cargar los datos del usuario</p>
        </div>
      </LayoutSideBar>
    );
  }

  return (
    <LayoutSideBar>
      <div className="space-y-6">
          <h2 className="text-lg">Perfil de usuario</h2>
        <UserCard userData={userData} />
        <ChangePasswordForm identityCard={identityCard} />
      </div>
    </LayoutSideBar>
  );
}
