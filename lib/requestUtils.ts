import { RequestResponse, Request } from "@/lib/types";

// Funciones auxiliares para extraer datos de la API
export const getRequesterName = (request: RequestResponse) =>
  request.users_requests_requester_idTousers?.full_name || "N/A";

export const getBeneficiaryName = (request: RequestResponse) =>
  request.users_requests_beneficiary_idTousers?.full_name || "N/A";

export const getStatusName = (request: RequestResponse) => 
  request.request_statuses?.name || "N/A";

export const getPriorityName = (request: RequestResponse) => 
  request.request_priorities?.name || "N/A";

export const getTypeName = (request: RequestResponse) => 
  request.request_types?.name || "N/A";

// Función para convertir RequestResponse al formato esperado por ExpandableRequestRow
export const adaptRequestData = (apiRequest: RequestResponse): Request => {
  return {
    id: apiRequest.id,
    user_id: apiRequest.requester_id,
    computer_equipment_id: apiRequest.computer_equipment_id,
    request_date: apiRequest.request_date,
    resolution_date: apiRequest.resolution_date ? new Date(apiRequest.resolution_date) : null,
    comments_technician: apiRequest.comments_technician || "",
    status: getStatusName(apiRequest) as "Pendiente" | "En proceso" | "Completada" | "Cancelada",
    priority: getPriorityName(apiRequest) as "Alta" | "Media" | "Baja",
    request_type: getTypeName(apiRequest) as "Mantenimiento" | "Instalación" | "Reparación" | "Actualización" | "Soporte",
    description: apiRequest.description,
    assigned_to: apiRequest.users_requests_technician_idTousers?.full_name || "N/A",
    user: {
      full_name: apiRequest.users_requests_requester_idTousers?.full_name || "N/A",
      email: apiRequest.users_requests_requester_idTousers?.email || "N/A",
      identity_card: apiRequest.users_requests_requester_idTousers?.identity_card || 0,
      department: apiRequest.users_requests_requester_idTousers?.department || "N/A",
      position: apiRequest.users_requests_requester_idTousers?.position || "N/A",
    },
    computer_equipment: {
      name: apiRequest.computer_equipment?.model || "N/A",
      serial_number: apiRequest.computer_equipment?.serial_number || "N/A",
      model: apiRequest.computer_equipment?.model || "N/A",
    },
    // Si el beneficiario es diferente al solicitante, se considera tercero
    third_party: apiRequest.beneficiary_id !== apiRequest.requester_id &&
      apiRequest.users_requests_beneficiary_idTousers
      ? {
          full_name: apiRequest.users_requests_beneficiary_idTousers.full_name,
          email: apiRequest.users_requests_beneficiary_idTousers.email,
          identity_card: apiRequest.users_requests_beneficiary_idTousers.identity_card,
          department: "N/A",
          position: "N/A",
          computer_equipment: {
            id: apiRequest.computer_equipment?.id || 0,
            name: apiRequest.computer_equipment?.model || "N/A",
            serial_number: apiRequest.computer_equipment?.serial_number || "N/A",
            model: apiRequest.computer_equipment?.model || "N/A",
            brand: "N/A",
            location: apiRequest.computer_equipment?.location || "N/A",
          },
        }
      : undefined,
  };
};

// Funciones para estilos
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta": return "text-red-600 font-semibold";
    case "Media": return "text-yellow-600 font-semibold";
    case "Baja": return "text-green-600 font-semibold";
    default: return "";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pendiente": return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs";
    case "En proceso": return "text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs";
    case "Completada": return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
    case "Cancelada": return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
    default: return "";
  }
};