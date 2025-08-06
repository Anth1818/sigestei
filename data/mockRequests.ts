import { Request } from "@/lib/types";

// Mock data for requests
export const mockRequests: Request[] = [
  {
    id: 1,
    user_id: 1,
    computer_equipment_id: 101,
    request_date: "2025-08-01T09:30:00Z",
    status: "Pendiente",
    priority: "Alta",
    request_type: "Reparación",
    description: "El equipo presenta pantalla azul constante y se reinicia automáticamente. Necesita revisión urgente.",
    assigned_to: "Carlos Rodríguez",
    
    // Usuario que crea la solicitud
    user: {
      full_name: "John Doe",
      email: "john.doe@empresa.com",
      identity_card: 12345678,
      department: "IT",
      position: "Manager"
    },
    
    // Equipo principal de la solicitud
    computer_equipment: {
      name: "Dell OptiPlex 7090",
      serial_number: "DL001234",
      model: "OptiPlex 7090"
    }
  },
  
  {
    id: 2,
    user_id: 2,
    computer_equipment_id: 102,
    request_date: "2025-08-02T14:15:00Z",
    status: "En progreso",
    priority: "Media",
    request_type: "Mantenimiento",
    description: "Solicitud de mantenimiento preventivo mensual. Limpieza de hardware y actualización de software.",
    assigned_to: "Ana García",
    
    user: {
      full_name: "Alice Smith",
      email: "alice.smith@empresa.com",
      identity_card: 87654321,
      department: "Support",
      position: "Technician"
    },
    
    computer_equipment: {
      name: "HP ProDesk 400",
      serial_number: "HP002345",
      model: "ProDesk 400 G9"
    }
  },
  
  {
    id: 3,
    user_id: 1,
    computer_equipment_id: 103,
    request_date: "2025-08-03T10:45:00Z",
    status: "Completada",
    priority: "Baja",
    request_type: "Instalación",
    description: "Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing.Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing. Instalación de nuevo software de diseño gráfico para el equipo de marketing.Instalación de nuevo software de diseño gráfico para el equipo de marketing.",
    assigned_to: "Luis Martínez",
    
    user: {
      full_name: "John Doe",
      email: "john.doe@empresa.com",
      identity_card: 12345678,
      department: "IT",
      position: "Manager"
    },
    
    computer_equipment: {
      name: "Lenovo ThinkStation P340",
      serial_number: "LN003456",
      model: "ThinkStation P340"
    },
    
    // Solicitud para tercero
    third_party: {
      full_name: "María González",
      email: "maria.gonzalez@empresa.com",
      identity_card: 11223344,
      department: "Marketing",
      position: "Diseñadora Gráfica",
      
      // Equipo del beneficiario final
      computer_equipment: {
        id: 201,
        name: "iMac Pro",
        serial_number: "AP004567",
        model: "iMac Pro 27",
        brand: "Apple",
        location: "Oficina 204 - Marketing"
      }
    }
  },
  
  {
    id: 4,
    user_id: 3,
    computer_equipment_id: 104,
    request_date: "2025-08-04T08:20:00Z",
    status: "Cancelada",
    priority: "Media",
    request_type: "Actualización",
    description: "Actualización del sistema operativo cancelada por incompatibilidad de hardware.",
    assigned_to: "Pedro Fernández",
    
    user: {
      full_name: "Roberto Pérez",
      email: "roberto.perez@empresa.com",
      identity_card: 55667788,
      department: "Accounting",
      position: "Contador Senior"
    },
    
    computer_equipment: {
      name: "Acer Aspire TC",
      serial_number: "AC005678",
      model: "Aspire TC-895"
    }
  },
  
  {
    id: 5,
    user_id: 2,
    computer_equipment_id: 105,
    request_date: "2025-08-05T16:30:00Z",
    status: "Pendiente",
    priority: "Alta",
    request_type: "Soporte",
    description: "Problema con conectividad de red. El equipo no puede acceder a recursos compartidos.",
    assigned_to: "Ana García",
    
    user: {
      full_name: "Alice Smith",
      email: "alice.smith@empresa.com",
      identity_card: 87654321,
      department: "Support",
      position: "Technician"
    },
    
    computer_equipment: {
      name: "ASUS VivoPC",
      serial_number: "AS006789",
      model: "VivoPC VM65N"
    },
    
    // Solicitud para tercero del mismo departamento
    third_party: {
      full_name: "Carmen Ruiz",
      email: "carmen.ruiz@empresa.com",
      identity_card: 99887766,
      department: "Support",
      position: "Analista de Soporte",
      
      computer_equipment: {
        id: 202,
        name: "Dell Inspiron Desktop",
        serial_number: "DL007890",
        model: "Inspiron 3891",
        brand: "Dell",
        location: "Mesa 15 - Support"
      }
    }
  },
  
  {
    id: 6,
    user_id: 4,
    computer_equipment_id: 106,
    request_date: "2025-08-06T11:00:00Z",
    status: "En progreso",
    priority: "Media",
    request_type: "Mantenimiento",
    description: "Limpieza de virus y malware detectado por el antivirus corporativo.",
    assigned_to: "Carlos Rodríguez",
    
    user: {
      full_name: "Laura Jiménez",
      email: "laura.jimenez@empresa.com",
      identity_card: 44556677,
      department: "HR",
      position: "Especialista en RRHH"
    },
    
    computer_equipment: {
      name: "MSI Cubi 5",
      serial_number: "MS008901",
      model: "Cubi 5 10M"
    }
  }
];
