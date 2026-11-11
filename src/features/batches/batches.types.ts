
import type { CocoaQuality } from "../purchases/purchases.types";

export type BatchStatus =
  | "EN_STOCK"
  | "EN_TRAITEMENT"
  | "TRAITE"
  | "BLOQUE";

export interface Batch {
  id: string;
  numero: string;
  purchaseId: string;
  purchaseNumber: string;
  producerId: string;
  producerName: string;
  dateReception: string;
  quantiteInitialeKg: number;
  quantiteDisponibleKg: number;
  qualite: CocoaQuality;
  statut: BatchStatus;
  observations: string;
  dateCreation: string;
}

export interface CreateBatchInput {
  purchaseId: string;
  dateReception: string;
  observations: string;
}
