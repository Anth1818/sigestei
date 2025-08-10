import LayoutSideBar from "@/layouts/LayoutSideBar"
import AddRequestForm from "@/components/requests/AddRequestForm"
import { ButtonNavigate } from "@/components/shared/ButtonToNavigate"
import { ArrowBigLeft } from "lucide-react"
export default function UserRequestPage () {
return (
    <LayoutSideBar>
         <ButtonNavigate url="/viewRequests" className="w-fit" icon={<ArrowBigLeft className="h-4 w-4"/>}>
            Volver a solicitudes
        </ButtonNavigate>
        <AddRequestForm />
    </LayoutSideBar>
)
}