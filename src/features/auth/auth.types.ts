
export type UserRole =
  | "ADMIN"
  | "RESPONSABLE_PRODUCTION"
  | "MAGASINIER"
  | "COMMERCIAL"
  | "COMPTABLE";

export interface AuthUser {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
