// Tipos para la respuesta de la API
export interface ComputerEquipmentResponse {
  id: number;
  asset_number: string;
  serial_number: string;
  model: string;
  location: string;
  hardware_specs: {
    cpu: string;
    gpu: string;
    ram: string;
    network: string;
    storage: string;
  };
  software_specs: {
    os: string;
    office: string;
    antivirus: string;
  };
  assigned_user_id: number;
  type_id: number;
  brand_id: number;
  status_id: number;
  users?: {
    id: number;
    full_name: string;
    identity_card: number;
    email: string;
    role_id: number;
    position_id: number;
    gender_id: number;
    department_id: number;
  };
  requests?: number[];
  equipment_brands?: {
    id: number;
    name: string;
  };
  equipment_statuses?: {
    id: number;
    name: string;
  };
  equipment_types?: {
    id: number;
    name: string;
  };
}

// Tipo para el formato que espera el componente
export interface ComputerEquipmentAdapted {
  id: number;
  name: string;
  serial_number: string;
  model: string;
  brand: string;
  location: string;
  status: string;
  asset_number: string;
  assigned_to: string;
  requests: number[]
  type: string;
  hardware_specs: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    network: string;
  };
  software: {
    os: string;
    office: string;
    antivirus: string;
  };
}

// Función para mapear los nombres de estado de la API al formato esperado
export const mapStatusName = (apiStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'operational': 'Activo',
    'under_review': 'En revisión',
    'damaged': 'Dañado',
    'inactive': 'Inactivo',
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
export const adaptComputerData = (apiEquipment: ComputerEquipmentResponse): ComputerEquipmentAdapted => {
  const brand = getBrandName(apiEquipment);
  const type = getTypeName(apiEquipment);
  
  return {
    id: apiEquipment.id,
    name: `${brand} ${apiEquipment.model}`,
    serial_number: apiEquipment.serial_number,
    model: apiEquipment.model,
    brand: brand,
    location: apiEquipment.location,
    status: getStatusName(apiEquipment),
    asset_number: apiEquipment.asset_number,
    assigned_to: getAssignedUserName(apiEquipment),
    requests: apiEquipment.requests || [],
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
    case "operational":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
    case "en revisión":
    case "under_review":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs";
    case "dañado":
    case "damaged":
      return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs";
    case "inactivo":
    case "inactive":
      return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs";
  }
};
