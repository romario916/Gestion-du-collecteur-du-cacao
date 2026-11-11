
import type { ExpenseCategory } from "./expenses.types";

export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory;
  label: string;
}[] = [
  {
    value: "TRANSPORT",
    label: "Transport",
  },
  {
    value: "SALAIRES",
    label: "Salaires et main-d'œuvre",
  },
  {
    value: "MATERIEL",
    label: "Matériel et équipements",
  },
  {
    value: "ENTRETIEN",
    label: "Entretien et réparations",
  },
  {
    value: "ADMINISTRATION",
    label: "Frais administratifs",
  },
  {
    value: "AUTRES",
    label: "Autres dépenses",
  },
];

export const EXPENSE_STATUS_LABELS = {
  EN_ATTENTE: "En attente",
  VALIDEE: "Validée",
  ANNULEE: "Annulée",
} as const;
