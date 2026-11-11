
import type { UserRole } from "../auth/auth.types";

export interface AppUser {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
  actif: boolean;
  dateCreation: string;
}

export interface CreateUserInput {
  nom: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserInput {
  nom: string;
  email: string;
  role: UserRole;
  actif: boolean;
}
