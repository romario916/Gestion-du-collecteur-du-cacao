
export type ExpenseCategory =
  | "TRANSPORT"
  | "SALAIRES"
  | "MATERIEL"
  | "ENTRETIEN"
  | "ADMINISTRATION"
  | "AUTRES";

export type ExpenseStatus =
  | "EN_ATTENTE"
  | "VALIDEE"
  | "ANNULEE";

export interface Expense {
  id: string;
  numero: string;

  categorie: ExpenseCategory;
  libelle: string;
  description: string;

  montant: number;

  dateDepense: string;
  beneficiaire: string;

  statut: ExpenseStatus;

  observations: string;

  dateCreation: string;
}

export interface CreateExpenseInput {
  categorie: ExpenseCategory;
  libelle: string;
  description: string;
  montant: number;
  dateDepense: string;
  beneficiaire: string;
  observations: string;
}
