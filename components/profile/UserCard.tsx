import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { UserData } from "@/lib/types";
import { getStatusColor, parseRoleName } from "@/lib/userUtils";
import { Mail, IdCard, Briefcase, Building2, Calendar, UserCircle } from "lucide-react";

interface UserCardProps {
  userData: UserData;
}

export const UserCard = ({ userData }: UserCardProps) => {
  return (
    <Card className="w-full shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          Información del Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4" />
              <span className="font-medium">Nombre Completo</span>
            </div>
            <p className="text-lg font-semibold">{userData.full_name}</p>
          </div>

          {/* Cédula */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IdCard className="h-4 w-4" />
              <span className="font-medium">Cédula</span>
            </div>
            <p className="text-lg">{userData.identity_card}</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email</span>
            </div>
            <p className="text-lg">{userData.email}</p>
          </div>

          {/* Género */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4" />
              <span className="font-medium">Género</span>
            </div>
            <p className="text-lg">{userData.role_id === 1 ? "Masculino" : "Femenino"}</p>
          </div>

          {/* Cargo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">Cargo</span>
            </div>
            <p className="text-lg">{userData.position_name}</p>
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Departamento</span>
            </div>
            <p className="text-lg">{userData.department_name}</p>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4" />
              <span className="font-medium">Rol</span>
            </div>
            <span>
              {parseRoleName(userData.role_name)}
            </span>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Estado</span>
            </div>
            <span className={getStatusColor(userData.is_active)}>
              {userData.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Fecha de Creación */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Fecha de Creación</span>
            </div>
            <p className="text-lg">
              {new Date(userData.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Último Login */}
          {userData.last_login && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Último Acceso</span>
              </div>
              <p className="text-lg">
                {new Date(userData.last_login).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* Equipo Asignado */}
          {userData.computer_equipment_asset_number && (
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">Equipo Asignado</span>
              </div>
              <p className="text-lg">{userData.computer_equipment_asset_number}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};