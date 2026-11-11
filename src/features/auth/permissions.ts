
import type { UserRole } from "./auth.types";

const modulePermissions: Record<string, UserRole[]> = {
  producers: ["ADMIN", "RESPONSABLE_PRODUCTION"],
  purchases: ["ADMIN", "RESPONSABLE_PRODUCTION", "COMMERCIAL", "COMPTABLE"],
  batches: ["ADMIN", "RESPONSABLE_PRODUCTION", "MAGASINIER"],
  processing: ["ADMIN", "RESPONSABLE_PRODUCTION", "MAGASINIER"],
  inventory: ["ADMIN", "MAGASINIER"],
  customers: ["ADMIN", "COMMERCIAL"],
  sales: ["ADMIN", "COMMERCIAL", "COMPTABLE"],
  expenses: ["ADMIN", "COMPTABLE"],
  finance: ["ADMIN", "COMPTABLE"],
  reports: [
    "ADMIN",
    "RESPONSABLE_PRODUCTION",
    "MAGASINIER",
    "COMMERCIAL",
    "COMPTABLE",
  ],
  users: ["ADMIN"],
  settings: ["ADMIN"],
};

export function canAccessModule(
  module: string,
  role: UserRole,
): boolean {
  return modulePermissions[module]?.includes(role) ?? false;
}
