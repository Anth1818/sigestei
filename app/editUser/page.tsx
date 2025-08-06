import LayoutSideBar from "@/layouts/LayoutSideBar";
import { EditUser } from "@/components/users/EditUser";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import { ArrowBigLeft } from "lucide-react";

export default function EditUserPage() {
  return (
    <LayoutSideBar>
      <ButtonNavigate
        url="/viewUsers"
        className="w-fit"
        icon={<ArrowBigLeft className="h-4 w-4" />}
      >
        Volver a usuarios
      </ButtonNavigate>
      <EditUser />
    </LayoutSideBar>
  );
}
