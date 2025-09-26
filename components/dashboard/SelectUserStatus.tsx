import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectUserStatusProps } from "@/lib/types"

export default function SelectUserStatus({ onChange, role }: SelectUserStatusProps) {
    return (
        <Select value={role} onValueChange={onChange}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Coordinador</SelectItem>
                <SelectItem value="technician">Técnico/a</SelectItem>
                <SelectItem value="user">Usuarios institucionales</SelectItem>
            </SelectContent>
        </Select>
    )
}