
import type { DryBatch } from "./dry-stock.types";

const STORAGE_KEY = "cacao-sambirano-dry-stock";

function getStoredDryBatches(): DryBatch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as DryBatch[]) : [];
  } catch {
    return [];
  }
}

function saveDryBatches(batches: DryBatch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

function generateDryBatchNumber(batches: DryBatch[]): string {
  const highestNumber = batches.reduce((highest, batch) => {
    const match = batch.numero.match(/^LOT-SEC-(\d+)$/);
    const number = match ? Number(match[1]) : 0;

    return Math.max(highest, number);
  }, 0);

  return `LOT-SEC-${String(highestNumber + 1).padStart(4, "0")}`;
}

export function getDryBatches(): DryBatch[] {
  return getStoredDryBatches();
}

export function getDryBatchById(id: string): DryBatch | undefined {
  return getStoredDryBatches().find((batch) => batch.id === id);
}

export function getAvailableDryBatches(): DryBatch[] {
  return getStoredDryBatches().filter(
    (batch) => batch.statut === "EN_STOCK" && batch.quantiteDisponibleKg > 0,
  );
}

export function deleteDryBatch(id: string): void {
  const batches = getStoredDryBatches();
  const batchExists = batches.some((item) => item.id === id);

  if (!batchExists) {
    throw new Error("Lot sec introuvable.");
  }

  saveDryBatches(batches.filter((item) => item.id !== id));
}

interface CreateDryBatchInput {
  dryingId: string;
  dryingNumber: string;
  sources: DryBatch["sources"];
  quantiteInitialeKg: number;
  dateProduction: string;
  observations: string;
}

export function createDryBatch(data: CreateDryBatchInput): DryBatch {
  const batches = getStoredDryBatches();

  if (!Number.isFinite(data.quantiteInitialeKg) || data.quantiteInitialeKg <= 0) {
    throw new Error("La quantité de cacao sec doit être supérieure à zéro.");
  }

  if (!data.dryingId || !data.dryingNumber) {
    throw new Error("L'opération de séchage est invalide.");
  }

  if (!data.sources.length) {
    throw new Error("Au moins un lot source est nécessaire.");
  }

  const alreadyCreated = batches.some(
    (batch) => batch.dryingId === data.dryingId,
  );

  if (alreadyCreated) {
    throw new Error("Un lot sec existe déjà pour cette opération de séchage.");
  }

  const newBatch: DryBatch = {
    id: crypto.randomUUID(),
    numero: generateDryBatchNumber(batches),
    dryingId: data.dryingId,
    dryingNumber: data.dryingNumber,
    sources: data.sources,
    quantiteInitialeKg: data.quantiteInitialeKg,
    quantiteDisponibleKg: data.quantiteInitialeKg,
    statut: "EN_STOCK",
    dateProduction: data.dateProduction,
    dateCreation: new Date().toISOString(),
    observations: data.observations,
  };

  batches.push(newBatch);
  saveDryBatches(batches);

  return newBatch;
}

export function consumeDryBatchQuantity(
  id: string,
  quantity: number,
): DryBatch {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("La quantité doit être supérieure à zéro.");
  }

  const batches = getStoredDryBatches();
  const batchIndex = batches.findIndex((batch) => batch.id === id);

  if (batchIndex === -1) {
    throw new Error("Lot sec introuvable.");
  }

  const batch = batches[batchIndex];

  if (batch.statut !== "EN_STOCK") {
    throw new Error("Ce lot sec n'est pas disponible.");
  }

  if (quantity > batch.quantiteDisponibleKg) {
    throw new Error("La quantité demandée dépasse le stock disponible.");
  }

  const updatedBatch: DryBatch = {
    ...batch,
    quantiteDisponibleKg: batch.quantiteDisponibleKg - quantity,
    statut:
      batch.quantiteDisponibleKg - quantity === 0 ? "EPUISE" : "EN_STOCK",
  };

  batches[batchIndex] = updatedBatch;
  saveDryBatches(batches);

  return updatedBatch;
}
