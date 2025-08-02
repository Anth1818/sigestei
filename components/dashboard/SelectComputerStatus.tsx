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
                <SelectItem value="Operational">Operativos</SelectItem>
                <SelectItem value="Under_review">En revision</SelectItem>
                <SelectItem value="Damaged">Dañados</SelectItem>
                <SelectItem value="Withdrawn">Retirados</SelectItem>
            </SelectContent>
        </Select>
    )
}