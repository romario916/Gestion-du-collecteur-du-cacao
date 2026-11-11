
export type CustomerType = "PARTICULIER" | "ENTREPRISE";

export interface Customer {
  id: string;
  numero: string;
  type: CustomerType;
  nom: string;
  prenom: string;
  nomEntreprise: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  pays: string;
  nif: string;
  stat: string;
  observations: string;
  statut: "ACTIF" | "INACTIF";
  dateCreation: string;
}

export interface CreateCustomerInput {
  type: CustomerType;
  nom: string;
  prenom: string;
  nomEntreprise: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  pays: string;
  nif: string;
  stat: string;
  observations: string;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
