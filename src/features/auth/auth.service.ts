
import type {
  AuthUser,
  LoginCredentials,
  UserRole,
} from "./auth.types";

import {
  authenticateStoredUser,
} from "../users/users.service";

interface DemoAccount {
  user: AuthUser;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    user: {
      id: "1",
      nom: "Administrateur",
      email: "admin@cacao.mg",
      role: "ADMIN",
    },
    password: "AdminDemo2026!",
  },
  {
    user: {
      id: "2",
      nom: "Responsable Production",
      email: "production@cacao.mg",
      role: "RESPONSABLE_PRODUCTION",
    },
    password: "ProdDemo2026!",
  },
  {
    user: {
      id: "3",
      nom: "Magasinier",
      email: "stock@cacao.mg",
      role: "MAGASINIER",
    },
    password: "StockDemo2026!",
  },
  {
    user: {
      id: "4",
      nom: "Commercial",
      email: "commercial@cacao.mg",
      role: "COMMERCIAL",
    },
    password: "ComDemo2026!",
  },
  {
    user: {
      id: "5",
      nom: "Comptable",
      email: "compta@cacao.mg",
      role: "COMPTABLE",
    },
    password: "FinanceDemo2026!",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrateur",
  RESPONSABLE_PRODUCTION: "Responsable production",
  MAGASINIER: "Magasinier",
  COMMERCIAL: "Commercial",
  COMPTABLE: "Comptable",
};

export async function authenticate(
  credentials: LoginCredentials,
): Promise<AuthUser | null> {
  const email = credentials.email.trim().toLowerCase();

  const demoAccount = DEMO_ACCOUNTS.find(
    (item) =>
      item.user.email.toLowerCase() === email &&
      item.password === credentials.password,
  );

  if (demoAccount) {
    return demoAccount.user;
  }

  return authenticateStoredUser(
    credentials.email,
    credentials.password,
  );
}
