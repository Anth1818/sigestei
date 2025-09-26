export const TEXTREQUESTBYSTATUS: Record<string, string> = {
  pending: "Pendientes",
  in_progress: "En progreso",
  resolved: "Resueltas",
  closed: "Cerradas",
};

export const TEXTCOMPUTERBYSTATUS: Record<string, string> = {
  operational: "Operativos",
  under_review: "En revisión",
  damaged: "Averiados",
  withdrawn: "Retirados",
};

export const TEXTUSERBYROLE: Record<string, string> = {
  admin: "Administradores",
  manager: "Coordinadores",
  technician: "Técnicos/as",
  user: "Usuarios institucionales",
};
