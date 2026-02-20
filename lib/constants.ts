export const TEXTREQUESTBYSTATUS: Record<string, string> = {
  pending: "Solicitudes Pendientes",
  in_process: "Solicitudes En proceso",
  resolved: "Solicitudes Completadas",
  closed: "Solicitudes Canceladas",
};

export const TEXTCOMPUTERBYSTATUS: Record<string, string> = {
  operational: "Equipos activos",
  under_review: "Equipos en mantenimiento",
  damaged: "Equipos defectuosos",
  withdrawn: "Equipos inactivos",
};

export const TEXTUSERBYROLE: Record<string, string> = {
  admin: "Administradores",
  manager: "Coordinadores",
  technician: "Técnicos/as",
  user: "Usuarios institucionales",
};
