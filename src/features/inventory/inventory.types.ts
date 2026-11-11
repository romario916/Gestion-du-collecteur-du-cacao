
export type StockCategory = "FRAIS" | "SEC";

export type StockMovementType =
  | "ENTREE"
  | "SORTIE"
  | "PRODUCTION";

export interface StockMovement {
  id: string;
  numero: string;
  type: StockMovementType;
  categorie: StockCategory;
  batchId: string;
  batchNumber: string;
  quantiteKg: number;
  motif: string;
  dateMouvement: string;
  dateCreation: string;
}

export interface StockSummary {
  quantiteTotaleKg: number;
  nombreLots: number;
  nombreMouvements: number;
  totalEntreesKg: number;
  totalSortiesKg: number;

  quantiteFraisKg: number;
  quantiteSecKg: number;
  nombreLotsFrais: number;
  nombreLotsSecs: number;
}

export interface CreateStockMovementInput {
  type: StockMovementType;
  categorie: StockCategory;
  batchId: string;
  quantiteKg: number;
  motif: string;
}
