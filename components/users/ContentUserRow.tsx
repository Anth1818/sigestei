import { UserData } from "@/lib/types";

interface ContentUserRowProps {
  user: UserData;
}

export const ContentUserRow = ({ user }: ContentUserRowProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50">
      <div>
        <p className="text-sm text-muted-foreground">Departamento</p>
        <p className="font-medium">{user.department_name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Cargo</p>
        <p className="font-medium">{user.position_name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Género</p>
        <p className="font-medium">{user.gender_name === "M" ? "Masculino": "Femenino"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Fecha de creación</p>
        <p className="font-medium">
          {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
      {user.last_login && (
        <div>
          <p className="text-sm text-muted-foreground">
            Último inicio de sesión
          </p>
          <p className="font-medium">
            {new Date(user.last_login).toLocaleString()}
          </p>
        </div>
      )}
      {user.equipment_asset_number && (
        <div>
          <p className="text-sm text-muted-foreground">Número de bien del equipo asignado</p>
          <p className="font-medium">ID: {user.equipment_asset_number}</p>
        </div>
      )}
    </div>
  );
};
