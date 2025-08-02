import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectTechinalRequestStatus() {
    return (
        <Select>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Pending">Pendientes</SelectItem>
                <SelectItem value="In_process">En proceso</SelectItem>
                <SelectItem value="Resolved">Resueltas</SelectItem>
                <SelectItem value="Closed">Cerradas</SelectItem>
            </SelectContent>
        </Select>
    )
}