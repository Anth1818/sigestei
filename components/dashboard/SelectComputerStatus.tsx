import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectComputerByStatusProps } from "@/lib/types"

export default function SelectTechinalRequestStatus({onChange, status}: SelectComputerByStatusProps) {
    return (
        <Select value={status} onValueChange={onChange}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="operational">Operativos</SelectItem>
                <SelectItem value="under_review">En revision</SelectItem>
                <SelectItem value="damaged">Averiados</SelectItem>
                <SelectItem value="withdrawn">Retirados</SelectItem>
            </SelectContent>
        </Select>
    )
}