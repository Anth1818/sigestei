
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
};