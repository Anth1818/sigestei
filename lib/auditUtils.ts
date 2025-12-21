import { AuditLog, CatalogData } from "./types";
import { fetchCatalogs } from "@/api/api";

// Cache global para los catálogos
let catalogsCache: CatalogData | null = null;

// Función para obtener catálogos (con cache)
export const getCatalogs = async (): Promise<CatalogData> => {
  if (catalogsCache) {
    return catalogsCache;
  }
  
  try {
    const catalogs = await fetchCatalogs();
    catalogsCache = catalogs;
    return catalogs;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    // Retornar estructura vacía en caso de error
    return {
      request_types: [],
      equipment_brands: [],
      equipment_statuses: [],
      equipment_types: [],
      roles: [],
      departments: [],
      positions: [],
      genders: [],
      technicians: [],
      os_options: [],
      office_suites: [],
      antivirus_solutions: [],
      request_statuses: [],
    };
  }
};

// Limpiar cache (útil para refrescar datos)
export const clearCatalogsCache = () => {
  catalogsCache = null;
};

// Mapeo de tipos de entidad a nombres legibles
export const ENTITY_TYPE_NAMES: Record<string, string> = {
  request: "Solicitud",
  equipment: "Equipo",
  user: "Usuario",
};

// Mapeo de tipos de cambios a nombres legibles
export const CHANGE_TYPE_NAMES: Record<string, string> = {
  status_changed: "Cambio de estado",
  priority_changed: "Cambio de prioridad",
  role_changed: "Cambio de rol",
  department_changed: "Cambio de departamento",
  gender_changed: "Cambio de género",
  position_changed: "Cambio de cargo",
  user_activated: "Usuario activado",
  user_deactivated: "Usuario desactivado",
  profile_updated: "Perfil actualizado",
  identity_card_changed: "Cédula cambiada",
  email_changed: "Correo electrónico cambiado",
  full_name_changed: "Nombre completo cambiado",
};

// Parsear rol de usuario
export const parseRole = async (roleId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof roleId === "string" ? parseInt(roleId) : roleId;
  const role = catalogs.roles.find((r) => r.id === id);
  return role?.name || `Rol #${roleId}`;
};

// Parsear departamento
export const parseDepartment = async (departmentId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof departmentId === "string" ? parseInt(departmentId) : departmentId;
  const department = catalogs.departments.find((d) => d.id === id);
  return department?.name || `Departamento #${departmentId}`;
};

// Parsear cargo/posición
export const parsePosition = async (positionId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof positionId === "string" ? parseInt(positionId) : positionId;
  const position = catalogs.positions.find((p) => p.id === id);
  return position?.name || `Cargo #${positionId}`;
};

// Parsear género
export const parseGender = async (genderId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof genderId === "string" ? parseInt(genderId) : genderId;
  const gender = catalogs.genders.find((g) => g.id === id);
  if (gender?.name === "M") return "Masculino";
  if (gender?.name === "F") return "Femenino";
  return gender?.name || `Género #${genderId}`;
};

// Parsear estado de equipo
export const parseEquipmentStatus = async (statusId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof statusId === "string" ? parseInt(statusId) : statusId;
  const status = catalogs.equipment_statuses.find((s) => s.id === id);
  return status?.name || `Estado #${statusId}`;
};

// Parsear tipo de equipo
export const parseEquipmentType = async (typeId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof typeId === "string" ? parseInt(typeId) : typeId;
  const type = catalogs.equipment_types.find((t) => t.id === id);
  return type?.name || `Tipo #${typeId}`;
};

// Parsear marca de equipo
export const parseEquipmentBrand = async (brandId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof brandId === "string" ? parseInt(brandId) : brandId;
  const brand = catalogs.equipment_brands.find((b) => b.id === id);
  return brand?.name || `Marca #${brandId}`;
};

// Parsear tipo de solicitud
export const parseRequestType = async (typeId: string | number): Promise<string> => {
  const catalogs = await getCatalogs();
  const id = typeof typeId === "string" ? parseInt(typeId) : typeId;
  const type = catalogs.request_types.find((t) => t.id === id);
  return type?.name || `Tipo #${typeId}`;
};

// Mapeo de nombres de campos a nombres legibles
export const FIELD_NAMES: Record<string, string> = {
  status_id: "Estado",
  priority_id: "Prioridad",
  role_id: "Rol",
  gender_id: "Género",
  identity_card: "Cédula",
  email: "Correo electrónico",
  full_name: "Nombre completo",
  department_id: "Departamento",
  position_id: "Cargo",
  is_active: "Estado activo",
  assigned_user_id: "Usuario asignado",
  technician_id: "Técnico asignado",
  beneficiary_id: "Beneficiario",
  equipment_id: "Equipo",
  description: "Descripción",
  comments_technician: "Comentarios del técnico",
  location: "Ubicación",
};

export const parseStatusNumber = (statusId: string): string => {
  switch (statusId) {
    case "1": 
        return "Pendiente";
    case "2":
        return "En proceso";
    case "3":
        return "Completada";
    case "4":
        return "Cancelada";
    default:
        return "Desconocido";
  }
};

export const parsePriorityNumber = (priorityId: string): string => {
  switch (priorityId) {
    case "1":
        return "Alta";
    case "2":
        return "Media";
    case "3":
        return "Baja";
    default:
        return "Desconocida";
  }
};


// Formatear fecha a formato legible
export const formatAuditDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Formatear fecha corta
export const formatAuditDateShort = (dateString: string = new Date().toISOString()): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Obtener color según el tipo de entidad
export const getEntityTypeColor = (entityType: string): string => {
  switch (entityType) {
    case "request":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "equipment":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "user":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

// Obtener color según el tipo de cambio
export const getChangeTypeColor = (changeType: string): string => {
  if (changeType?.includes("activated") || changeType?.includes("assigned")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }
  if (changeType?.includes("deactivated") || changeType?.includes("unassigned")) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  }
  if (changeType?.includes("changed") || changeType?.includes("updated")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};

// Obtener nombre legible del tipo de entidad
export const getEntityTypeName = (entityType: string): string => {
  return ENTITY_TYPE_NAMES[entityType] || entityType;
};

// Obtener nombre legible del tipo de cambio
export const getChangeTypeName = (changeType: string): string => {
  return CHANGE_TYPE_NAMES[changeType] || changeType;
};

// Obtener nombre legible del campo
export const getFieldName = (fieldName: string): string => {
  return FIELD_NAMES[fieldName] || fieldName;
};

// Formatear valor de cambio para visualización (síncrono - para compatibilidad)
export const formatChangeValue = (value: string | null): string => {
  if (value === null || value === "null") {
    return "N/A";
  }
  if (value === "true") {
    return "Sí";
  }
  if (value === "false") {
    return "No";
  }
  return value;
};

// Formatear valor de cambio con catálogos (asíncrono - versión mejorada)
export const formatChangeValueWithCatalogs = async (
  fieldName: string,
  value: string | null
): Promise<string> => {
  if (value === null || value === "null") {
    return "N/A";
  }
  if (value === "true") {
    return "Sí";
  }
  if (value === "false") {
    return "No";
  }

  // Parsear según el campo
  try {
    switch (fieldName) {
      case "status_id":
        return await parseStatusNumber(value);
      case "priority_id":
        return await parsePriorityNumber(value);
      case "role_id":
        return await parseRole(value);
      case "department_id":
        return await parseDepartment(value);
      case "position_id":
        return await parsePosition(value);
      case "gender_id":
        return await parseGender(value);
      case "type_id":
        return await parseEquipmentType(value);
      case "brand_id":
        return await parseEquipmentBrand(value);
      default:
        return value;
    }
  } catch (error) {
    console.error(`Error parsing ${fieldName}:`, error);
    return value;
  }
};

// Obtener icono según el tipo de entidad
export const getEntityTypeIcon = (entityType: string): string => {
  switch (entityType) {
    case "request":
      return "FileText";
    case "equipment":
      return "Computer";
    case "user":
      return "User";
    default:
      return "AlertCircle";
  }
};

// Obtener descripción completa del cambio
export const getChangeDescription = (log: AuditLog): string => {
  const entityName = getEntityTypeName(log.entity_type);
  const changeTypeName = getChangeTypeName(log.change_type);
  const fieldName = getFieldName(log.field_name);
  const oldValue = formatChangeValue(log.old_value);
  const newValue = formatChangeValue(log.new_value);

  return `${changeTypeName} en ${entityName}: ${fieldName} cambió de "${oldValue}" a "${newValue}"`;
};

// Validar formato de fecha ISO
export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Convertir fecha a formato ISO para la API
export const toISODateString = (date: Date): string => {
  return date.toISOString();
};

// Filtrar logs por rango de fechas
export const filterByDateRange = (
  logs: AuditLog[],
  startDate?: Date,
  endDate?: Date
): AuditLog[] => {
  if (!startDate && !endDate) return logs;

  return logs.filter((log) => {
    const logDate = new Date(log.changed_at);
    if (startDate && logDate < startDate) return false;
    if (endDate && logDate > endDate) return false;
    return true;
  });
};

// Agrupar logs por tipo de entidad
export const groupByEntityType = (
  logs: AuditLog[]
): Record<string, AuditLog[]> => {
  return logs.reduce((acc, log) => {
    const type = log.entity_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(log);
    return acc;
  }, {} as Record<string, AuditLog[]>);
};

// Agrupar logs por usuario que hizo el cambio
export const groupByChangedBy = (
  logs: AuditLog[]
): Record<string, AuditLog[]> => {
  return logs.reduce((acc, log) => {
    const userName = log.changed_by.full_name;
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(log);
    return acc;
  }, {} as Record<string, AuditLog[]>);
};

// Obtener estadísticas de los logs
export const getLogStatistics = (logs: AuditLog[]) => {
  const byEntityType = groupByEntityType(logs);
  const byChangedBy = groupByChangedBy(logs);

  return {
    total: logs.length,
    byEntityType: Object.entries(byEntityType).map(([type, items]) => ({
      type,
      count: items.length,
    })),
    byChangedBy: Object.entries(byChangedBy).map(([user, items]) => ({
      user,
      count: items.length,
    })),
  };
};
