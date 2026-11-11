
export type DryingStatus =
  | "EN_ATTENTE"
  | "EN_COURS"
  | "TERMINE";

export interface DryingBatchInput {
  batchId: string;
  quantiteUtiliseeKg: number;
}

export interface DryingBatchSource {
  batchId: string;
  batchNumber: string;
  purchaseNumber: string;
  producerId: string;
  producerName: string;
  quantiteUtiliseeKg: number;
}

export interface Transformation {
  id: string;
  numero: string;

  lotsSources: DryingBatchSource[];

  quantiteTotaleUtiliseeKg: number;
  quantiteObtenueKg: number | null;
  rendement: number | null;
  pertePoidsKg: number | null;

  statut: DryingStatus;

  dateDebut: string | null;
  dateFin: string | null;

  observations: string;
  dateCreation: string;
}

export interface CreateTransformationInput {
  lots: DryingBatchInput[];
  observations: string;
}
