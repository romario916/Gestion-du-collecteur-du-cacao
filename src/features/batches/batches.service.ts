
import type {
  Batch,
  CreateBatchInput,
} from "./batches.types";

import { getPurchases } from "../purchases/purchases.service";

const STORAGE_KEY = "cacao-sambirano-batches";

function getStoredBatches(): Batch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Batch[]) : [];
  } catch {
    return [];
  }
}

function saveBatches(batches: Batch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

function generateBatchNumber(batches: Batch[]): string {
  const highestNumber = batches.reduce((highest, batch) => {
    const match = batch.numero.match(/^LOT-(\d+)$/);
    const number = match ? Number(match[1]) : 0;

    return Math.max(highest, number);
  }, 0);

  return `LOT-${String(highestNumber + 1).padStart(4, "0")}`;
}

export function getBatches(): Batch[] {
  return getStoredBatches();
}

export function getBatchById(id: string): Batch | undefined {
  return getStoredBatches().find((batch) => batch.id === id);
}

export function getAvailablePurchases() {
  const purchases = getPurchases();
  const batches = getStoredBatches();

  return purchases.filter(
    (purchase) =>
      purchase.statut === "VALIDE" &&
      !batches.some((batch) => batch.purchaseId === purchase.id),
  );
}

export function createBatch(data: CreateBatchInput): Batch {
  if (!data.purchaseId.trim()) {
    throw new Error("Veuillez sélectionner un achat.");
  }

  if (!data.dateReception || Number.isNaN(Date.parse(data.dateReception))) {
    throw new Error("Veuillez renseigner une date de réception valide.");
  }

  const purchases = getPurchases();
  const purchase = purchases.find(
    (item) => item.id === data.purchaseId,
  );

  if (!purchase) {
    throw new Error("L'achat sélectionné est introuvable.");
  }

  if (purchase.statut !== "VALIDE") {
    throw new Error("Seuls les achats validés peuvent générer un lot.");
  }

  const batches = getStoredBatches();

  if (batches.some((batch) => batch.purchaseId === purchase.id)) {
    throw new Error("Un lot existe déjà pour cet achat.");
  }

  const batch: Batch = {
    id: crypto.randomUUID(),
    numero: generateBatchNumber(batches),
    purchaseId: purchase.id,
    purchaseNumber: purchase.numero,
    producerId: purchase.producerId,
    producerName: purchase.producerName,
    dateReception: data.dateReception,
    quantiteInitialeKg: purchase.quantiteKg,
    quantiteDisponibleKg: purchase.quantiteKg,
    qualite: purchase.qualite,
    statut: "EN_STOCK",
    observations: data.observations.trim(),
    dateCreation: new Date().toISOString(),
  };

  batches.push(batch);
  saveBatches(batches);

  return batch;
}

export function deleteBatch(id: string): void {
  const batches = getStoredBatches();
  const batch = batches.find((item) => item.id === id);

  if (!batch) {
    throw new Error("Le lot demandé est introuvable.");
  }

  if (!["EN_STOCK", "EN_TRAITEMENT"].includes(batch.statut)) {
    throw new Error(
      "Ce lot ne peut pas être supprimé avec son statut actuel.",
    );
  }

  saveBatches(batches.filter((item) => item.id !== id));
}

export function consumeBatchQuantity(
  batchId: string,
  quantityKg: number,
): void {
  const batches = getStoredBatches();
  const batch = batches.find((item) => item.id === batchId);

  if (!batch) {
    throw new Error("Le lot demandé est introuvable.");
  }

  if (batch.statut !== "EN_STOCK") {
    throw new Error("Ce lot n'est pas disponible.");
  }

  if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
    throw new Error("La quantité doit être supérieure à zéro.");
  }

  if (quantityKg > batch.quantiteDisponibleKg) {
    throw new Error("Stock insuffisant pour cette transformation.");
  }

  batch.quantiteDisponibleKg -= quantityKg;

  if (batch.quantiteDisponibleKg === 0) {
    batch.statut = "EN_TRAITEMENT";
  }

  saveBatches(batches);
}
