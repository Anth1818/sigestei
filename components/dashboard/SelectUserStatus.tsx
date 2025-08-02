import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectUserStatus() {
    return (
        <Select>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Coordinator">Coordinador</SelectItem>
                <SelectItem value="Technical">Técnico/a</SelectItem>
                <SelectItem value="user">Usuario institucional</SelectItem>
            </SelectContent>
        </Select>
    )
}