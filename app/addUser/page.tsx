import { ButtonNavigate } from "@/components/shared/ButtonToNavigate";
import {AddUser} from "@/components/users/AddUser";
import LayoutSideBar from "@/layouts/LayoutSideBar";
import {ArrowBigLeft} from "lucide-react"

export default function AddUserPage () {
    return <LayoutSideBar>
        <ButtonNavigate url="/viewUsers" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4"/>}>
            Volver a usuarios
        </ButtonNavigate>
        <AddUser />
    </LayoutSideBar>
    }