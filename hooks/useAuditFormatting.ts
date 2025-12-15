import { useQuery } from "@tanstack/react-query";
import { fetchCatalogs } from "@/api/api";
import { CatalogData } from "@/lib/types";

/**
 * Hook para formatear valores de auditoría con catálogos
 * Proporciona acceso a los catálogos y funciones de formateo
 */
export const useAuditFormatting = () => {
  const { data: catalogs, isLoading } = useQuery<CatalogData>({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  /**
   * Formatear valor según el campo y los catálogos
   */
  const formatValue = (fieldName: string, value: string | null, isRequest?: boolean): string => {
    if (value === null || value === "null") {
      return "N/A";
    }
    if (value === "true") {
      return "Sí";
    }
    if (value === "false") {
      return "No";
    }

    if (!catalogs) {
      return value;
    }

    const numericValue = parseInt(value);

    switch (fieldName) {
      case "status_id": {
        const status = isRequest
          ? catalogs.request_statuses.find((s) => s.id === numericValue)
          : catalogs.equipment_statuses.find((s) => s.id === numericValue);
        return status?.name || value;
      }
      case "priority_id": {
        const priorities: Record<number, string> = {
          1: "Alta",
          2: "Media",
          3: "Baja",
        };
        return priorities[numericValue] || value;
      }
      case "role_id": {
        const role = catalogs.roles.find((r) => r.id === numericValue);
        return role?.name || value;
      }
      case "department_id": {
        const department = catalogs.departments.find((d) => d.id === numericValue);
        return department?.name || value;
      }
      case "position_id": {
        const position = catalogs.positions.find((p) => p.id === numericValue);
        return position?.name || value;
      }
      case "gender_id": {
        const gender = catalogs.genders.find((g) => g.id === numericValue);
        if (gender?.name === "M") return "Masculino";
        if (gender?.name === "F") return "Femenino";
        return gender?.name || value;
      }
      case "type_id": {
        const type = catalogs.equipment_types.find((t) => t.id === numericValue);
        return type?.name || value;
      }
      case "brand_id": {
        const brand = catalogs.equipment_brands.find((b) => b.id === numericValue);
        return brand?.name || value;
      }
      default:
        return value;
    }
  };

  /**
   * Formatear múltiples valores de una vez
   */
  const formatValues = (
    fieldName: string,
    oldValue: string | null,
    newValue: string | null
  ): { oldFormatted: string; newFormatted: string } => {
    return {
      oldFormatted: formatValue(fieldName, oldValue),
      newFormatted: formatValue(fieldName, newValue),
    };
  };

  return {
    catalogs,
    isLoading,
    formatValue,
    formatValues,
  };
};
