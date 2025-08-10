
export type SortColumnUser = {
  columna: keyof User | "nombreCompleto";
  direccion: "asc" | "desc";
} | null;

export type User = {
  id: number;
  worker_id: number;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
  created: string;
  role: string;
  identity_card: number;
  full_name: string;
  status: boolean;
  gender: string;
  position: string;
  position_id: number;
  gender_id: number;
  department: string;
  department_id: number;
  idEquipmentAssigned: number;
};

// ...existing code...

export type Request = {
  id: number;
  user_id: number; // ID del usuario que crea la solicitud
  computer_equipment_id: number; // Equipo relacionado con la solicitud
  request_date: string;
  status: "Pendiente" | "En progreso" | "Completada" | "Cancelada";
  priority: "Alta" | "Media" | "Baja";
  request_type: "Mantenimiento" | "Instalación" | "Reparación" | "Actualización" | "Soporte";
  description: string;
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
    name: string;
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
      name: string;
      serial_number: string;
      model: string;
      brand?: string;
      location?: string;
    };
  };
};

// Tipo para formulario de creación de solicitud
export type CreateRequestForm = {
  request_type: string;
  priority: string;
  description: string;
  computer_equipment_id: number;
  
  // Campos para tercero
  is_for_third_party: boolean;
  third_party_identity_card?: number;
  third_party_computer_equipment_id?: number; // Equipo del beneficiario final
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