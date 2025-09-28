export const TEXTREQUESTBYSTATUS: Record<string, string> = {
  pending: "Solicitudes Pendientes",
  in_progress: "Solicitudes En progreso",
  resolved: "Solicitudes Resueltas",
  closed: "Solicitudes Cerradas",
};

export const TEXTCOMPUTERBYSTATUS: Record<string, string> = {
  operational: "Equipos Operativos",
  under_review: "Equipos En revisión",
  damaged: "Equipos Averiados",
  withdrawn: "Equipos Retirados",
};

export const TEXTUSERBYROLE: Record<string, string> = {
  admin: "Administradores",
  manager: "Coordinadores",
  technician: "Técnicos/as",
  user: "Usuarios institucionales",
};
