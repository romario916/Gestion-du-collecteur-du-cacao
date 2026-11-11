
import type { Producer } from "../producers/producers.types";

export type PurchaseStatus =
  | "EN_ATTENTE"
  | "VALIDE"
  | "ANNULE";

export type CocoaQuality =
  | "PREMIERE_QUALITE"
  | "DEUXIEME_QUALITE"
  | "TROISIEME_QUALITE";

export interface Purchase {
  id: string;
  numero: string;
  producerId: string;
  producerName: string;
  dateAchat: string;
  quantiteKg: number;
  prixKg: number;
  montantTotal: number;
  qualite: CocoaQuality;
  observations: string;
  statut: PurchaseStatus;
  dateCreation: string;
}

export interface CreatePurchaseInput {
  producerId: string;
  dateAchat: string;
  quantiteKg: number;
  prixKg: number;
  qualite: CocoaQuality;
  observations: string;
}

export interface UpdatePurchaseInput extends CreatePurchaseInput {
  statut: PurchaseStatus;
}

export interface PurchaseWithProducer extends Purchase {
  producer?: Producer;
}
