import axios from "axios";
import { CreateRequestInput, CreateRequestPayload} from "@/lib/types";

const API_BASE_URL = "http://localhost:3001/api"; // Ajusta el puerto si tu backend usa otro


// AUTHENTICATION

// Login (genera cookie en backend)
export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


// Logout (elimina cookie en backend)
export const logout = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    throw error.response?.data || error;
  }
};



// METRICS

// Obtener datos para el dashboard
export const fetchDataForDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`, {
    withCredentials: true,
  });
  return response.data;
}

// CATALOGS

// Obtener catálogos (estados, roles, tipos de solicitud, etc.)
export const fetchCatalogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/catalogs`, {
    withCredentials: true,
  });
  return response.data;
}


// USERS

// Obtener todos los usuarios de todos los departamentos
export const fetchAllUsersByAllDepartments = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/allUsersByAllDepartments`, {
    withCredentials: true,
  });
  return response.data;
}
// Obtener todos los usuarios de un departamento específico
export const fetchAllUsersByDepartment = async (departmentId: number) => {
  const response = await axios.get(`${API_BASE_URL}/users/allUsersByDepartment/${departmentId}`, {
    withCredentials: true,
  });
  return response.data;
}



// REQUESTS



export const createRequest = async (data: CreateRequestPayload) => {
  const response = await axios.post(`${API_BASE_URL}/requests/register`, data, {
    withCredentials: true,
  });
  return response.data;
}

// Obtener todas las solicitudes
export const fetchRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/requests`, {
    withCredentials: true,
  });
  return response.data;
}


// Actualizar una solicitud
export const updateRequest = async (id: number, data: Partial<CreateRequestInput>) => {
  const response = await axios.put(`${API_BASE_URL}/requests/updateRequest/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
}

