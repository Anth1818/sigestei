import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  AuditLog,
  AuditStatistics,
  CatalogData,
  CreateEquipmentInput,
  CreateRequestInput,
  CreateRequestPayload,
  CreateUserInput,
  DashboardData,
  EquipmentAuditHistory,
  EquipmentResponse,
  LoginHistory,
  PaginatedResponse,
  RequestAuditHistory,
  RequestResponse,
  UserData,
} from "@/lib/types";

// ============================================
// CONFIGURACIÓN BASE Y TIPOS
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// Tipo para errores normalizados de la API
export interface ApiErrorData {
  message: string;
  status?: number;
  data?: unknown;
}

// Clase de error personalizada
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor({ message, status, data }: ApiErrorData) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ============================================
// INSTANCIA DE AXIOS CON INTERCEPTORES
// ============================================

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor de respuesta para manejo centralizado de errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Verificar si el backend retorna success: false
    if (response.data?.success === false) {
      throw new ApiError({
        message: response.data.error || response.data.message || "Error en la operación",
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // Normalizar errores de Axios
    const serverData = error.response?.data;
    const status = error.response?.status;
    const errorMessage =
      serverData?.error ||
      serverData?.message ||
      error.message ||
      "Error inesperado en la operación";

    return Promise.reject(
      new ApiError({
        message: errorMessage,
        status,
        data: serverData,
      })
    );
  }
);

// ============================================
// HELPERS GENÉRICOS
// ============================================

const apiGet = <T>(endpoint: string, params?: Record<string, unknown>): Promise<T> =>
  api.get(endpoint, { params }).then((res) => res.data);

const apiPost = <T, D = unknown>(endpoint: string, data?: D): Promise<T> =>
  api.post(endpoint, data).then((res) => res.data);

const apiPut = <T, D = unknown>(endpoint: string, data?: D): Promise<T> =>
  api.put(endpoint, data).then((res) => res.data);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiDelete = <T>(endpoint: string): Promise<T> =>
  api.delete(endpoint).then((res) => res.data);

// ============================================
// AUTHENTICATION
// ============================================

// Tipo para la respuesta de login
export interface LoginResponse {
  user: UserData;
  message?: string;
}

export const login = (email: string, password: string) =>
  apiPost<LoginResponse>("/auth/login", { email, password });

export const logout = () => apiPost("/auth/logout");

// ============================================
// METRICS / DASHBOARD
// ============================================

export const fetchDataForDashboard = () => apiGet<{ data: DashboardData }>("/dashboard/metrics");

// ============================================
// CATALOGS
// ============================================

export const fetchCatalogs = () => apiGet<CatalogData>("/catalogs");

// ============================================
// USERS
// ============================================

export const fetchAllUsers = () => apiGet<UserData[]>("/users");

export const fetchAllUsersByAllDepartments = () =>
  apiGet<UserData[]>("/users/allUsersByAllDepartments");

export const fetchAllUsersEnabledToGetSupportByDepartment = (departmentId: number) =>
  apiGet<UserData[]>(`/users/allUsersEnabledToGetSupport/department/${departmentId}`);

export const fetchAllUsersByDepartment = (departmentId: number) =>
  apiGet<UserData[]>(`/users/allUsersByDepartment/${departmentId}`);

export const fetchAllTechnicians = () => apiGet<UserData[]>("/users/technicians");

export const fetchUserByIdentityCard = (identityCard: number) =>
  apiGet<UserData>(`/users/identity_card/${identityCard}`);

// Tipo genérico para respuestas de operaciones
export interface ApiResponse {
  message: string;
  success?: boolean;
}

export const createUser = (data: CreateUserInput) =>
  apiPost<ApiResponse, CreateUserInput>("/users/register", data);

export const updateUser = (identityCard: number, data: Partial<CreateUserInput>) =>
  apiPut<ApiResponse, Partial<CreateUserInput>>(`/users/update/${identityCard}`, data);

export const toggleActiveUser = (identityCard: number) =>
  apiPut<ApiResponse>(`/users/toggleActive/${identityCard}`);

export const resetUserPassword = (identityCard: number) =>
  apiPut<ApiResponse>(`/users/resetPassword/${identityCard}`);

export const changeUserPassword = (
  identityCard: number,
  data: { new_password: string }
) => apiPut<ApiResponse, { new_password: string }>(`/users/changePassword/${identityCard}`, data);

// ============================================
// REQUESTS (SOLICITUDES)
// ============================================

export const fetchRequests = () => apiGet<RequestResponse[]>("/requests");

export const fetchRequestsPaginated = (page: number = 1, limit: number = 10) =>
  apiGet<PaginatedResponse<RequestResponse>>("/requests/paginated", { page, limit });

export const fetchRequestsFiltered = (params: {
  request_id?: string;
  technician_ids?: string;
  status_ids?: string;
  priority_ids?: string;
  type_ids?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}) => {
  // Filtrar parámetros vacíos
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== null
    )
  );
  return apiGet<PaginatedResponse<RequestResponse>>("/requests/filter", cleanParams);
};

export const fecthAllRequestForTechnician = (userId: number) =>
  apiGet<RequestResponse[]>(`/requests/getAllForTechnician/${userId}`);

export const fecthAllRequestByUser = (userId: number) =>
  apiGet<RequestResponse[]>(`/requests/getAllByUser/${userId}`);

export const createRequest = (data: CreateRequestPayload) =>
  apiPost<{ message: string; request_id?: number }, CreateRequestPayload>("/requests/register", data);

export const updateRequest = (id: number, data: Partial<CreateRequestInput>) =>
  apiPut<ApiResponse, Partial<CreateRequestInput>>(`/requests/updateRequest/${id}`, data);

// ============================================
// EQUIPMENT
// ============================================

export const fetchAllEquipment = () =>
  apiGet<EquipmentResponse[]>("/equipment");

export const fetchAllPrinters = (type: number) =>
  apiGet<EquipmentResponse[]>("/equipment", { type });

export const fetchEquipmentById = (id: number) =>
  apiGet<EquipmentResponse>(`/equipment/${id}`);

export const createEquipment = (data: CreateEquipmentInput) =>
  apiPost<EquipmentResponse, CreateEquipmentInput>("/equipment/register", data);

export const updateEquipmentData = (id: number, data: Partial<CreateEquipmentInput>) =>
  apiPut<EquipmentResponse, Partial<CreateEquipmentInput>>(`/equipment/update/${id}`, data);

// ============================================
// AUDIT
// ============================================

export const fetchRequestAudit = (requestId: number) =>
  apiGet<RequestAuditHistory>(`/audit/requests/${requestId}`);

export const fetchEquipmentAudit = (equipmentId: number) =>
  apiGet<EquipmentAuditHistory>(`/audit/equipment/${equipmentId}`);

export const fetchUserLogins = (userId: number, limit?: number) =>
  apiGet<LoginHistory[]>(`/audit/users/${userId}/logins`, limit ? { limit } : undefined);

export const fetchUserChanges = (userId: number) =>
  apiGet<AuditLog[]>(`/audit/users/${userId}/changes`);

export const fetchRecentAudits = (limit?: number) =>
  apiGet<AuditLog[]>("/audit/recent", limit ? { limit } : undefined);

export const fetchAuditStatistics = () => apiGet<AuditStatistics>("/audit/statistics");
