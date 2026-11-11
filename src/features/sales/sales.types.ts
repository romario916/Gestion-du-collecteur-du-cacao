
export type SaleStatus =
  | "EN_ATTENTE"
  | "VALIDEE"
  | "PAYEE"
  | "ANNULEE";

export interface SaleItem {
  dryBatchId: string;
  dryBatchNumber: string;
  quantiteKg: number;
  prixKg: number;
  montantTotal: number;
}

export interface Sale {
  id: string;
  numero: string;
  clientId: string;
  clientNumero: string;
  clientNom: string;
  dateVente: string;
  articles: SaleItem[];
  quantiteKg: number;
  montantTotal: number;
  statut: SaleStatus;
  observations: string;
  dateCreation: string;
}

export interface CreateSaleItemInput {
  dryBatchId: string;
  quantiteKg: number;
  prixKg: number;
}

export interface CreateSaleInput {
  clientId: string;
  dateVente: string;
  articles: CreateSaleItemInput[];
  observations: string;
}

export type UpdateSaleInput = Partial<CreateSaleInput>;
