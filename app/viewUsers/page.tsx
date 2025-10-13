import LayoutSideBar from "@/layouts/LayoutSideBar";
import UserTable from "@/components/users/UserTable";
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import {Plus} from "lucide-react" 

export default function UserPage () {
    return <LayoutSideBar>
        <h2 className="text-lg">Tabla de usuarios</h2>
        <ButtonNavigate icon={<Plus /> } url="addUser" className="md: w-fit" >
            Añadir usuario
        </ButtonNavigate>
        <UserTable />
    </LayoutSideBar>
    }