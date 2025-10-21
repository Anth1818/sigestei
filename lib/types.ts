export type SortColumnUser = {
  columna: keyof UserData | "full_name";
  direccion: "asc" | "desc";
} | null;

export type Request = {
  id: number;
  user_id: number; // ID del usuario que crea la solicitud
  computer_equipment_id: number; // Equipo relacionado con la solicitud
  request_date: string;
  resolution_date?: string | Date | null;
  status: "Pendiente" | "En proceso" | "Completada" | "Cancelada";
  priority: "Alta" | "Media" | "Baja";
  request_type?: string;
  description: string;
  comments_technician?: string;
  assigned_to: string;

  // Usuario que crea la solicitud (requestor)
  user: {
    full_name: string;
    email: string;
    identity_card: number;
    department: string;
    position: string;
  };

  // Equipo principal de la solicitud
  computer_equipment: {
    asset_number: number | string;
    location: string;
    serial_number: string;
    model: string;
  };

  // Si es para tercero, datos del beneficiario final
  third_party?: {
    full_name: string;
    email: string;
    identity_card: number;
    department: string;
    position: string;

    // Equipo del beneficiario final (para historial de incidencias)
    computer_equipment: {
      id: number;
      asset_number: number | string;
      serial_number: string;
      model: string;
      brand?: string;
      location?: string;
    };
  };
};

// Tipo para formulario de creación de solicitud
export type CreateRequestPayload = {
  description: string;
  requester_id: number;
  beneficiary_id?: number | null;
  computer_equipment_id: number;
  type_id: number;
};

// Tipo para historial de incidencias por equipo
export type EquipmentIncidentHistory = {
  equipment_id: number;
  equipment_info: {
    name: string;
    serial_number: string;
    model: string;
    owner: {
      full_name: string;
      identity_card: number;
      department: string;
    };
  };
  incidents: {
    request_id: number;
    incident_date: string;
    request_type: string;
    description: string;
    status: string;
    requestor_name: string;
    is_for_owner: boolean; // true si fue solicitado por el dueño del equipo
  }[];
};

export type SortColumnRequest = {
  column: keyof Request | "requestor_name" | "beneficiary_name";
  direction: "asc" | "desc";
} | null;

export type UserData = {
  id: number;
  full_name: string;
  identity_card: number;
  email: string;
  is_active: boolean;
  role_id: number;
  position_id: number;
  department_id: number;
  gender_id: number;
  created_at: string;
  last_login: string | null;
  last_login_backup: string | null;
  department_name: string;
  role_name: string;
  gender_name: string;
  position_name: string;
  computer_equipment_asset_number?: string;
};

export type UpdateUserInput = {
  full_name: string;
  gender_id: number;
  position_id: number;
  department_id: number;
};

export type ResetPasswordInput = {
  identity_card: number;
};

// Types creados en base a los endpoints de la API

export type CreateRequestInput = {
  description: string;
  request_date?: Date;
  resolution_date?: Date | string | null;
  comments_technician?: string | null;
  requester_id: number;
  beneficiary_id?: number | null;
  technician_id?: number | null;
  computer_equipment_id?: number | null;
  type_id: number;
  status_id: number;
  priority_id: number;
};

export interface SelectUserStatusProps {
  role: string;
  onChange: (newStatus: string) => void;
}

export interface SelectComputerByStatusProps {
  status: string;
  onChange: (newStatus: string) => void;
}


// Tipo para los datos del dashboard
export type DashboardData = {
  requestByStatusCurrentMonth: {
    pending?: number;
    resolved?: number;
    closed?: number;
    [key: string]: number | undefined;
  };
  requestsCreatedAndResolvedByMonth: {
    created: {
      january: number;
      february: number;
      march: number;
      april: number;
      may: number;
      june: number;
      july: number;
      august: number;
      september: number;
      october: number;
      november: number;
      december: number;
      [key: string]: number;
    };
    resolved: {
      january: number;
      february: number;
      march: number;
      april: number;
      may: number;
      june: number;
      july: number;
      august: number;
      september: number;
      october: number;
      november: number;
      december: number;
      [key: string]: number;
    };
  };
  equipment: {
    total: number;
    byStatus: {
      operational?: number;
      under_review?: number;
      damaged?: number;
      withdrawn?: number;
      [key: string]: number | undefined;
    };
  };
  users: {
    totalUsers: number;
    byRoles: {
      admin?: number;
      technician?: number;
      user?: number;
      manager?: number;
      [key: string]: number | undefined;
    };
  };
};

export type User = {
  id: number;
  full_name: string;
  identity_card: number;
  email: string;
  is_active: boolean;
  role_id: number;
  position_id: number;
  gender_id: number;
  department_id: number;
  created_at: string;
  department: string;
  position: string;
  role: string;
  computer_equipment?: ComputerEquipment[];
};

export type HardwareSpecs = {
  cpu: string;
  gpu: string;
  ram: string;
  network: string;
  storage: string;
};

export type SoftwareSpecs = {
  os: string;
  office: string;
  antivirus: string;
};

export type ComputerEquipment = {
  id: number;
  asset_number: string;
  serial_number: string;
  model: string;
  location: string;
  hardware_specs: HardwareSpecs;
  software_specs: SoftwareSpecs;
  assigned_user_id: number;
  type_id: number;
  brand_id: number;
  status_id: number;
};

export type RequestPriority = {
  id: number;
  name: string;
};

export type RequestStatus = {
  id: number;
  name: string;
};

export type RequestType = {
  id: number;
  name: string;
};


// Tipo para la respuesta de la API de solicitudes
export type RequestResponse = {
  id: number;
  description: string;
  request_date: string;
  resolution_date: string | null;
  comments_technician: string;
  requester_id: number;
  beneficiary_id: number;
  technician_id: number;
  computer_equipment_id: number;
  type_id: number;
  status_id: number;
  priority_id: number;
  users_requests_beneficiary_idTousers: User;
  users_requests_requester_idTousers: User;
  users_requests_technician_idTousers: User;
  computer_equipment: ComputerEquipment;
  request_priorities: RequestPriority;
  request_statuses: RequestStatus;
  request_types: RequestType;
};

// Tipo para el formato que espera el componente ExpandableComputerRow
export interface ComputerEquipmentAdapted {
  id: number;
  name: string;
  serial_number: string;
  model: string;
  brand: string;
  location: string;
  status: "Activo" | "En mantenimiento" | "Averiado" | "Inactivo";
  status_id: number;
  asset_number: string;
  assigned_to: string;
  requests: number[];
  type: string;
  assigned_user_id: number;
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

// Tipos para la respuesta de la API de equipos informáticos
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

export interface CreateComputerEquipmentInput {
  asset_number: string;
  serial_number: string;
  model?: string | null;
  location?: string | null;
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
  assigned_user_id?: number | null;
  type_id: number;
  brand_id: number;
  status_id: number;
}



//Catalogs types 

export interface ComputerBrand {
  id: number;
  name: string;
}

export interface ComputerStatus {
  id: number;
  name: string;
}

export interface ComputerType {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  department_id: number;
}

export interface Gender {
  id: number;
  name: string;
}

export interface Technician {
  id: number;
  full_name: string;
}

export interface CatalogData {
  request_types: RequestType[];
  computer_brands: ComputerBrand[];
  computer_statuses: ComputerStatus[];
  computer_types: ComputerType[];
  roles: Role[];
  departments: Department[];
  positions: Position[];
  genders: Gender[];
  technicians: Technician[];
}