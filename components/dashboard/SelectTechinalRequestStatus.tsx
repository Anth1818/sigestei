import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectComputerByStatusProps } from "@/lib/types"

interface SelectTechinalRequestStatusProps extends SelectComputerByStatusProps {}

export default function SelectTechinalRequestStatus( { onChange, status }: SelectTechinalRequestStatusProps) {
    return (
        <Select value={status} onValueChange={onChange}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in_process">En proceso</SelectItem>
                <SelectItem value="resolved">Completadas</SelectItem>
                <SelectItem value="closed">Cancelada</SelectItem>
            </SelectContent>
        </Select>
    )
}