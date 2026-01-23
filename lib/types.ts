export type SortColumnUser = {
  columna: keyof UserData | "full_name";
  direccion: "asc" | "desc";
} | null;

export type RequestAdapted = {
  id: number;
  user_id: number; // ID del usuario que crea la solicitud
  equipment_id: number; // Equipo relacionado con la solicitud
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
 equipment: {
    asset_number: number | string;
    location: string;
    serial_number: string;
    model: string;
    type_name?: string;
  };

  // Si es para tercero, datos del beneficiario final
  third_party?: {
    full_name: string;
    email: string;
    identity_card: number;
    department: string;
    position: string;

    // Equipo del beneficiario final (para historial de incidencias)
    equipment: {
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
  equipment_id: number;
  type_id: number;
};


export type SortColumnRequest = {
  column: keyof RequestResponse | "requestor_name" | "beneficiary_name" | "status" | "priority" | "request_type" | "equipment";
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
  equipment_asset_number?: string;
  equipment_id?: number;
};

export type UpdateUserInput = {
  identity_card: number;
  full_name: string;
  email: string;
  role_id: number;
  gender_id: number;
  position_id: number;
  department_id: number;
};

export type ResetPasswordInput = {
  identity_card: number;
};

export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
  confirm_password: string;
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
      previous_december: number;
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
      previous_december: number;
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

export type CreateUserInput = {
  full_name: string;
  identity_card: number;
  email: string;
  password: string;
  role_id: number;
  position_id: number;
  department_id: number;
  gender_id: number;  
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
  equipment?: Equipment[];
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

export type Equipment = {
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
  brand_name?: string;
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
  comments_technician: string | null;
  requester_id: number;
  beneficiary_id: number | null;
  technician_id: number | null;
  equipment_id: number;
  type_equipment_id: number; // ID del tipo de equipo
  type_id: number;
  status_id: number;
  priority_id: number;
  users_requests_beneficiary_idTousers: {
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
    equipment?: any[];
    position: string;
    department: string;
    gender: string;
    role: string;
  } | null;
  users_requests_requester_idTousers: {
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
    position: string;
    department: string;
    gender: string;
    role: string;
  };
  users_requests_technician_idTousers: {
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
    position: string;
    department: string;
    gender: string;
    role: string;
  } | null;
  equipment: {
    id: number;
    asset_number: string;
    serial_number: string;
    model: string;
    location: string;
    type_id: number;
    brand_id: number;
    status_id: number;
    department_id: number | null;
    assigned_user_id: number | null;
    specifications: {
      hardware: {
        cpu: string;
        gpu: string;
        ram: string;
        network: string;
        storage: string;
      };
      software: {
        os: string;
        office: string;
        antivirus: string;
      };
    };
    type_name: string;
    brand_name: string;
    status_name: string;
  };
  request_priorities: {
    id: number;
    name: string;
  };
  request_statuses: {
    id: number;
    name: string;
  };
  request_types: {
    id: number;
    name: string;
  };
};

// Tipo para el formato que espera el componente ExpandableComputerRow
export interface EquipmentAdapted {
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
  requests_linked: number[]; // IDs de las solicitudes asociadas con el equipo
  type_name: string;
  assigned_user_id: number | null;
  specifications?: EquipmentSpecifications;
} 
 
export interface EquipmentSpecifications {
  hardware: {
    cpu: string;
    gpu: string;
    ram: string;
    network: string;
    storage: string;
  };
  software: {
    os: string;
    office: string;
    antivirus: string;
  };
}

// Tipos para la respuesta de la API de equipos informáticos
export interface EquipmentResponse {
  id: number;
  asset_number: string;
  serial_number: string;
  model: string;
  location: string;
  type_id: number;
  brand_id: number;
  status_id: number;
  department_id: number | null;
  assigned_user_id: number | null;
  specifications: {
    hardware: {
      cpu: string;
      gpu: string;
      ram: string;
      network: string;
      storage: string;
    };
    software: {
      os: string;
      office: string;
      antivirus: string;
    };
    office_suite_id: number | null;
    software_type_id: number | null;
    antivirus_solution_id: number | null;
  };
  type_name: string;
  brand_name: string;
  status_name: string;
  department_name: string | null;
  assigned_user_name: string | null;
  assigned_user_email: string | null;
  assigned_user_identity_card: number | null;
  requests_linked?: number[];
  message?: string;
}

export interface CreateEquipmentInput {
  asset_number: string;
  serial_number: string;
  model?: string | null;
  location?: string | null;
  specifications?: {
    hardware: {
      cpu: string;
      gpu: string;
      ram: string;
      network: string;
      storage: string;
    };
    software: {
      os: string;
      office: string;
      antivirus: string;
    };
  };
  assigned_user_id?: number | null | undefined;
  type_id: number;
  brand_id: number;
  status_id: number;
 
}



//Catalogs types 

export interface EquipmentBrand {
  id: number;
  name: string;
}

export interface EquipmentStatus {
  id: number;
  name: string;
}

export interface EquipmentType {
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

export interface OsOption {
  id: number;
  name: string;
}

export interface officeSuiteOption {
  id: number;
  name: string;
}
export interface AntivirusOption {
  id: number;
  name: string;
}

export interface CatalogData {
  request_types: RequestType[];
  equipment_brands: EquipmentBrand[];
  equipment_statuses: EquipmentStatus[];
  equipment_types: EquipmentType[];
  roles: Role[];
  departments: Department[];
  positions: Position[];
  genders: Gender[];
  technicians: Technician[];
  os_options: OsOption[];
  office_suites: officeSuiteOption[];
  antivirus_solutions: AntivirusOption[];
  request_statuses: RequestStatus[];
}

// AUDIT TYPES

export interface AuditUser {
  id: number;
  full_name: string;
  email: string;
}

export interface AuditLog {
  id: number;
  entity_type: "request" | "equipment" | "user";
  entity_id: number;
  change_type: string;
  field_name: string;
  old_value: string;
  new_value: string;
  changed_by_id: number;
  changed_at: string;
  comments: string | null;
  changed_by: AuditUser;
}

export interface TechnicianAssignment {
  id: number;
  request_id: number;
  technician_id: number;
  previous_technician_id: number | null;
  assigned_by_id: number;
  assigned_at: string;
  reason: string;
  technician: AuditUser;
  previous_technician: AuditUser | null;
  assigned_by: AuditUser;
}

export interface EquipmentAssignment {
  id: number;
  equipment_id: number;
  user_id: number;
  previous_user_id: number | null;
  location: string;
  previous_location: string | null;
  assigned_by_id: number;
  assigned_at: string;
  reason: string;
  user: AuditUser;
  previous_user: AuditUser | null;
  assigned_by: AuditUser;
}

export interface LoginHistory {
  id: number;
  user_id: number;
  login_at: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason: string | null;
}

export interface RequestAuditHistory {
  general_changes: AuditLog[];
  technician_assignments: TechnicianAssignment[];
}

export interface EquipmentAuditHistory {
  general_changes: AuditLog[];
  assignments: EquipmentAssignment[];
}

export interface AuditStatistics {
  request_changes: number;
  equipment_changes: number;
  user_changes: number;
  total_logins: number;
}

// Tipos para paginación del servidor
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Tipo para los filtros de solicitudes
export interface RequestFiltersParams {
  technician_ids?: string;
  status_ids?: string;
  priority_ids?: string;
  type_ids?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}