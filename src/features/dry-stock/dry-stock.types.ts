
export type DryBatchStatus =
  | "EN_STOCK"
  | "EPUISE"
  | "BLOQUE";

export interface DryBatchSource {
  batchId: string;
  batchNumber: string;
  producerName: string;
  quantiteUtiliseeKg: number;
}

export interface DryBatch {
  id: string;
  numero: string;

  dryingId: string;
  dryingNumber: string;

  sources: DryBatchSource[];

  quantiteInitialeKg: number;
  quantiteDisponibleKg: number;

  statut: DryBatchStatus;

  dateProduction: string;
  dateCreation: string;
  observations: string;
}
