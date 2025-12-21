import {
  EquipmentResponse,
  EquipmentAdapted,
} from "@/lib/types";

// Función para mapear los nombres de estado de la API al formato esperado
export const mapStatusName = (apiStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    Activo: "Activo",
    "En mantenimiento": "En mantenimiento",
    Averiado: "Averiado",
    Inactivo: "Inactivo",
  };
  return statusMap[apiStatus] || apiStatus;
};

// Funciones auxiliares para extraer datos de la API
export const getBrandName = (equipment: EquipmentResponse) =>
  equipment.brand_name || "N/A";

export const getStatusName = (equipment: EquipmentResponse) => {
  const apiStatus = equipment.status_name || "N/A";
  return mapStatusName(apiStatus);
};

export const getTypeName = (equipment: EquipmentResponse) =>
  equipment.type_name || "N/A";

export const getAssignedUserName = (equipment: EquipmentResponse) =>
  equipment.assigned_user_name || "No asignado";

// Función para convertir EquipmentResponse al formato esperado por el componente
export const adaptEquipmentData = (
  apiEquipment: EquipmentResponse
): EquipmentAdapted => {
  const brand = getBrandName(apiEquipment);
  const type = getTypeName(apiEquipment);

  return {
    id: apiEquipment.id,
    name: `${brand} ${apiEquipment.model}`,
    serial_number: apiEquipment.serial_number,
    model: apiEquipment.model,
    brand: brand,
    location: apiEquipment.location,
    status: getStatusName(apiEquipment) as "Activo" | "En mantenimiento" | "Averiado" | "Inactivo",
    status_id: apiEquipment.status_id,
    asset_number: apiEquipment.asset_number,
    assigned_to: getAssignedUserName(apiEquipment),
    requests_linked: apiEquipment.requests_linked || [],
    assigned_user_id: apiEquipment?.assigned_user_id ?? null,
    type_name: type,
    specifications: apiEquipment.specifications ? {
      hardware: {
        cpu: apiEquipment.specifications.hardware?.cpu,
        ram: apiEquipment.specifications.hardware?.ram,
        storage: apiEquipment.specifications.hardware?.storage,
        gpu: apiEquipment.specifications.hardware?.gpu,
        network: apiEquipment.specifications.hardware?.network,
      },
      software: {
        os: apiEquipment.specifications.software?.os,
        office: apiEquipment.specifications.software?.office,
        antivirus: apiEquipment.specifications.software?.antivirus,
      },
    } : undefined,
  };
};

// Funciones para estilos (similar a requestUtils)
export const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "activo":
      return "text-green-600 bg-green-100 px-2 py-1 font-bold rounded-full text-xs dark:bg-green-500 dark:text-white theme-blue:bg-green-900/80 theme-blue:text-green-100 theme-violet:bg-green-900/80 theme-violet:text-green-100 theme-orange:bg-green-900/80 theme-orange:text-green-100";
    case "en mantenimiento":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 font-bold rounded-full text-xs dark:bg-yellow-600 dark:text-white theme-blue:bg-yellow-900/80 theme-blue:text-yellow-100 theme-violet:bg-yellow-900/80 theme-violet:text-yellow-100 theme-orange:bg-yellow-900/80 theme-orange:text-yellow-100";
    case "averiado":
      return "text-orange-600 bg-orange-100 px-2 py-1 font-bold rounded-full text-xs dark:bg-orange-500 dark:text-white theme-blue:bg-orange-900/80 theme-blue:text-orange-100 theme-violet:bg-orange-900/80 theme-violet:text-orange-100 theme-orange:bg-orange-900/80 theme-orange:text-orange-100";
    case "inactivo":
      return "text-red-600 bg-red-100 px-2 py-1 font-bold rounded-full text-xs dark:bg-red-500 dark:text-white theme-blue:bg-red-900/80 theme-blue:text-red-100 theme-violet:bg-red-900/80 theme-violet:text-red-100 theme-orange:bg-red-900/80 theme-orange:text-red-100";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 font-bold rounded-full text-xs dark:bg-gray-500 dark:text-white";
  }
}; 

