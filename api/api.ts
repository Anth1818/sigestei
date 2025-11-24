import axios from "axios";
import {
  CreateEquipmentInput,
  CreateRequestInput,
  CreateRequestPayload,
  CreateUserInput,
} from "@/lib/types";
import { EquipmentResponse } from "@/lib/types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// AUTHENTICATION

// Login (genera cookie en backend)
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al iniciar sesión",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al iniciar sesión";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al iniciar sesión",
    };
  }
};

// Logout (elimina cookie en backend)
export const logout = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al cerrar sesión",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al cerrar sesión";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al cerrar sesión",
    };
  }
};

// METRICS

// Obtener datos para el dashboard
export const fetchDataForDashboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener métricas",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener métricas";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener métricas",
    };
  }
};

// CATALOGS

// Obtener catálogos (estados, roles, tipos de solicitud, etc.)
export const fetchCatalogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catalogs`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener catálogos",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener catálogos";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener catálogos",
    };
  }
};

// USERS

// Obtener todos los usuarios de todos los departamentos
export const fetchAllUsersByAllDepartments = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/allUsersByAllDepartments`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener usuarios",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener usuarios";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener usuarios",
    };
  }
};

export const fetchAllUsersEnabledToGetSupportByDepartment = async (departmentId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/allUsersEnabledToGetSupport/department/${departmentId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener usuarios habilitados para soporte",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener usuarios habilitados para soporte";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener usuarios habilitados para soporte",
    };
  }
};

// Obtener todos los usuarios de un departamento específico
export const fetchAllUsersByDepartment = async (departmentId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/allUsersByDepartment/${departmentId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener usuarios del departamento",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener usuarios del departamento";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener usuarios del departamento",
    };
  }
};

// REQUESTS

export const createRequest = async (data: CreateRequestPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests/register`, data, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al crear la solicitud",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al crear la solicitud";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al crear la solicitud",
    };
  }
};


//Obtener todas la solicitudes por usuario
export const fecthAllRequestForTechnician = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/requests/getAllForTechnician/${userId}`,
      {
        withCredentials: true,
      }
    );
    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener solicitudes del tecnico",
        status: response.status,
        data: response.data,
      };
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener solicitudes del tecnico";
      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }
    if (error.message) {
      throw error;
    }
    throw {
      message: "Error inesperado al obtener solicitudes del tecnico",
    };
  }
};


//Obtener todas la solicitudes por usuario
export const fecthAllRequestByUser = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/requests/getAllByUser/${userId}`,
      {
        withCredentials: true,
      }
    );
    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener solicitudes del usuario",
        status: response.status,
        data: response.data,
      };
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener solicitudes del usuario";
      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }
    if (error.message) {
      throw error;
    }
    throw {
      message: "Error inesperado al obtener solicitudes del usuario",
    };
  }
};

// Obtener todas las solicitudes
export const fetchRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener solicitudes",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener solicitudes";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener solicitudes",
    };
  }
};

// Actualizar una solicitud
export const updateRequest = async (
  id: number,
  data: Partial<CreateRequestInput>
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/requests/updateRequest/${id}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al actualizar la solicitud",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al actualizar la solicitud";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al actualizar la solicitud",
    };
  }
};

// EQUIPMENT

export const createEquipment = async (data: CreateEquipmentInput) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/equipment/register`,
      data,
      {
        withCredentials: true,
      }
    );

    // Verificar si el backend envía success: false en la respuesta
    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al crear el equipo",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
  
    // Si es un error de Axios (error de red, 4xx, 5xx)
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;

      // Extraer el mensaje de error del servidor
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al crear el equipo";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    // Si ya es un error normalizado (del bloque success === false)
    if (error.message) {
      throw error;
    }

    // Error genérico
    throw {
      message: "Error inesperado al crear el equipo",
    };
  }
};

// Obtener todos los equipos
export const fetchAllEquipment = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/equipment`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener equipos",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener equipos";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener equipos",
    };
  }
};

export const fetchEquipmentById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/equipment/${id}`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el equipo",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el equipo";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el equipo",
    };
  }
};

export const updateEquipmentData = async (
  id: number,
  data: Partial<EquipmentResponse>
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/equipment/update/${id}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al actualizar el equipo",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al actualizar el equipo";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al actualizar el equipo",
    };
  }
};

// USERS

export const createUser = async (data: CreateUserInput) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, data, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al crear el usuario",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al crear el usuario";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al crear el usuario",
    };
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener usuarios",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener usuarios";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener usuarios",
    };
  }
};

export const fetchUserByIdentityCard = async (identityCard: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/identity_card/${identityCard}`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el usuario",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el usuario";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el usuario",
    };
  }
};

export const toggleActiveUser = async (identityCard: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/toggleActive/${identityCard}`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al cambiar el estado del usuario",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al cambiar el estado del usuario";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al cambiar el estado del usuario",
    };
  }
};

export const updateUser = async (identityCard: number, data: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/update/${identityCard}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al actualizar el usuario",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al actualizar el usuario";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al actualizar el usuario",
    };
  }
};

export const resetUserPassword = async (identityCard: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/resetPassword/${identityCard}`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al restablecer la contraseña",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al restablecer la contraseña";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al restablecer la contraseña",
    };
  }
};

export const changeUserPassword = async (
  identityCard: number,
  data: { new_password: string }
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/changePassword/${identityCard}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al cambiar la contraseña",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al cambiar la contraseña";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al cambiar la contraseña",
    };
  }
};

// AUDIT

// Obtener historial de una solicitud específica
export const fetchRequestAudit = async (requestId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/audit/requests/${requestId}`,
      { withCredentials: true }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el historial de la solicitud",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el historial de la solicitud";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el historial de la solicitud",
    };
  }
};

// Obtener historial de un equipo específico
export const fetchEquipmentAudit = async (equipmentId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/audit/equipment/${equipmentId}`,
      { withCredentials: true }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el historial del equipo",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el historial del equipo";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el historial del equipo",
    };
  }
};

// Obtener historial de logins de un usuario
export const fetchUserLogins = async (userId: number, limit?: number) => {
  try {
    const url = limit
      ? `${API_BASE_URL}/audit/users/${userId}/logins?limit=${limit}`
      : `${API_BASE_URL}/audit/users/${userId}/logins`;

    const response = await axios.get(url, { withCredentials: true });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el historial de logins",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el historial de logins";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el historial de logins",
    };
  }
};

// Obtener historial de cambios de un usuario
export const fetchUserChanges = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/audit/users/${userId}/changes`,
      { withCredentials: true }
    );

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener el historial de cambios del usuario",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener el historial de cambios del usuario";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener el historial de cambios del usuario",
    };
  }
};

// Obtener cambios recientes del sistema
export const fetchRecentAudits = async (limit?: number) => {
  try {
    const url = limit
      ? `${API_BASE_URL}/audit/recent?limit=${limit}`
      : `${API_BASE_URL}/audit/recent`;

    const response = await axios.get(url, { withCredentials: true });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener los cambios recientes",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener los cambios recientes";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener los cambios recientes",
    };
  }
};

// Obtener estadísticas de auditoría
export const fetchAuditStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit/statistics`, {
      withCredentials: true,
    });

    if (response.data && response.data.success === false) {
      throw {
        message: response.data.error || response.data.message || "Error al obtener las estadísticas de auditoría",
        status: response.status,
        data: response.data,
      };
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data;
      const status = error.response?.status;
      const errorMessage = serverData?.error || serverData?.message || error.message || "Error al obtener las estadísticas de auditoría";

      throw {
        message: errorMessage,
        status,
        data: serverData,
      };
    }

    if (error.message) {
      throw error;
    }

    throw {
      message: "Error inesperado al obtener las estadísticas de auditoría",
    };
  }
};

