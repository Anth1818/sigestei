import {
  ComputerEquipmentResponse,
  ComputerEquipmentAdapted,
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
export const getBrandName = (equipment: ComputerEquipmentResponse) =>
  equipment.equipment_brands?.name || "N/A";

export const getStatusName = (equipment: ComputerEquipmentResponse) => {
  const apiStatus = equipment.equipment_statuses?.name || "N/A";
  return mapStatusName(apiStatus);
};

export const getTypeName = (equipment: ComputerEquipmentResponse) =>
  equipment.equipment_types?.name || "N/A";

export const getAssignedUserName = (equipment: ComputerEquipmentResponse) =>
  equipment.users?.full_name || "No asignado";

// Función para convertir ComputerEquipmentResponse al formato esperado por el componente
export const adaptComputerData = (
  apiEquipment: ComputerEquipmentResponse
): ComputerEquipmentAdapted => {
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
    requests: apiEquipment.requests || [],
    assigned_user_id: apiEquipment.assigned_user_id,
    type: type,
    hardware_specs: {
      cpu: apiEquipment.hardware_specs.cpu,
      ram: apiEquipment.hardware_specs.ram,
      storage: apiEquipment.hardware_specs.storage,
      gpu: apiEquipment.hardware_specs.gpu,
      network: apiEquipment.hardware_specs.network,
    },
    software: {
      os: apiEquipment.software_specs.os,
      office: apiEquipment.software_specs.office,
      antivirus: apiEquipment.software_specs.antivirus,
    },
  };
};

// Funciones para estilos (similar a requestUtils)
export const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "activo":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
    case "en mantenimiento":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs";
    case "averiado":
      return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs";
    case "inactivo":
      return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs";
  }
};
