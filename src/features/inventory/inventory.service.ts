
import type {
  StockSummary,
  StockMovement,
} from "./inventory.types";

import { getBatches } from "../batches/batches.service";

import {
  getTransformations,
  getDeletedTransformations,
} from "../processing/processing.service";

import { getDryBatches } from "../dry-stock/dry-stock.service";

const DELETED_MOVEMENTS_KEY = "cacao-sambirano-deleted-movements";
const RESET_SORTIES_KEY = "cacao-sambirano-reset-sorties";

function getDeletedMovementIds(): string[] {
  try {
    const stored = localStorage.getItem(DELETED_MOVEMENTS_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveDeletedMovementIds(ids: string[]): void {
  localStorage.setItem(
    DELETED_MOVEMENTS_KEY,
    JSON.stringify(ids),
  );
}

function getResetTransformationIds(): string[] {
  try {
    const stored = localStorage.getItem(RESET_SORTIES_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveResetTransformationIds(ids: string[]): void {
  localStorage.setItem(
    RESET_SORTIES_KEY,
    JSON.stringify(ids),
  );
}

export function resetTotalSorties(): void {
  const transformations = [
    ...getTransformations(),
    ...getDeletedTransformations(),
  ];

  const resetIds = new Set(getResetTransformationIds());

  transformations.forEach((transformation) => {
    if (
      transformation.statut === "EN_COURS" ||
      transformation.statut === "TERMINE"
    ) {
      resetIds.add(transformation.id);
    }
  });

  saveResetTransformationIds(Array.from(resetIds));
}

export function getStockSummary(): StockSummary {
  const batches = getBatches();

  const transformations = [
    ...getTransformations(),
    ...getDeletedTransformations(),
  ];

  const resetIds = new Set(getResetTransformationIds());

  const dryBatches = getDryBatches();
  const movements = getStockMovements();

  const quantiteFraisKg = batches.reduce(
    (total, batch) => total + batch.quantiteDisponibleKg,
    0,
  );

  const quantiteSecKg = dryBatches.reduce(
    (total, batch) => total + batch.quantiteDisponibleKg,
    0,
  );

  const totalEntreesFraisKg = batches.reduce(
    (total, batch) => total + batch.quantiteInitialeKg,
    0,
  );

  const totalEntreesSecsKg = dryBatches.reduce(
    (total, batch) => total + batch.quantiteInitialeKg,
    0,
  );

  const transformationsDemarrees = transformations.filter(
    (transformation) =>
      (transformation.statut === "EN_COURS" ||
        transformation.statut === "TERMINE") &&
      !resetIds.has(transformation.id),
  );

  const totalSortiesKg = transformationsDemarrees.reduce(
    (total, transformation) =>
      total + transformation.quantiteTotaleUtiliseeKg,
    0,
  );

  return {
    quantiteTotaleKg: quantiteFraisKg + quantiteSecKg,
    nombreLots: batches.length + dryBatches.length,
    nombreMouvements: movements.length,
    totalEntreesKg: totalEntreesFraisKg + totalEntreesSecsKg,
    totalSortiesKg,
    quantiteFraisKg,
    quantiteSecKg,
    nombreLotsFrais: batches.length,
    nombreLotsSecs: dryBatches.length,
  };
}

export function getStockMovements(): StockMovement[] {
  const batches = getBatches();

  const transformations = [
    ...getTransformations(),
    ...getDeletedTransformations(),
  ];

  const dryBatches = getDryBatches();
  const deletedIds = new Set(getDeletedMovementIds());

  const entries: StockMovement[] = batches.map((batch) => ({
    id: `ENTREE-${batch.id}`,
    numero: `ENT-${batch.numero}`,
    type: "ENTREE",
    categorie: "FRAIS",
    batchId: batch.id,
    batchNumber: batch.numero,
    quantiteKg: batch.quantiteInitialeKg,
    motif: `Réception de l'achat ${batch.purchaseNumber}`,
    dateMouvement: batch.dateReception,
    dateCreation: batch.dateCreation,
  }));

  const exits: StockMovement[] = transformations
    .filter(
      (transformation) =>
        transformation.statut === "EN_COURS" ||
        transformation.statut === "TERMINE",
    )
    .flatMap((transformation) =>
      transformation.lotsSources.map((source, index) => ({
        id: `SORTIE-${transformation.id}-${source.batchId}`,
        numero: `SOR-${transformation.numero}-${index + 1}`,
        type: "SORTIE" as const,
        categorie: "FRAIS" as const,
        batchId: source.batchId,
        batchNumber: source.batchNumber,
        quantiteKg: source.quantiteUtiliseeKg,
        motif: `Séchage ${transformation.numero}`,
        dateMouvement:
          transformation.dateDebut ?? transformation.dateCreation,
        dateCreation: transformation.dateCreation,
      })),
    );

  const productions: StockMovement[] = dryBatches.map((batch) => ({
    id: `PRODUCTION-${batch.id}`,
    numero: `PROD-${batch.numero}`,
    type: "PRODUCTION",
    categorie: "SEC",
    batchId: batch.id,
    batchNumber: batch.numero,
    quantiteKg: batch.quantiteInitialeKg,
    motif: `Production issue du séchage ${batch.dryingNumber}`,
    dateMouvement: batch.dateProduction,
    dateCreation: batch.dateCreation,
  }));

  return [...entries, ...exits, ...productions]
    .filter((movement) => !deletedIds.has(movement.id))
    .sort(
      (a, b) =>
        new Date(b.dateMouvement).getTime() -
        new Date(a.dateMouvement).getTime(),
    );
}

export function deleteStockMovement(id: string): void {
  const movement = getStockMovements().find(
    (item) => item.id === id,
  );

  if (!movement) {
    throw new Error("Le mouvement demandé est introuvable.");
  }

  if (movement.type === "ENTREE") {
    const batch = getBatches().find(
      (item) => item.id === movement.batchId,
    );

    if (!batch) {
      throw new Error("Le lot frais associé est introuvable.");
    }

    if (
      batch.quantiteDisponibleKg !== batch.quantiteInitialeKg
    ) {
      throw new Error(
        "Impossible de supprimer cette entrée : le lot a déjà été utilisé.",
      );
    }
  }

  if (movement.type === "PRODUCTION") {
    const batch = getDryBatches().find(
      (item) => item.id === movement.batchId,
    );

    if (!batch) {
      throw new Error("Le lot sec associé est introuvable.");
    }

    if (
      batch.quantiteDisponibleKg !== batch.quantiteInitialeKg
    ) {
      throw new Error(
        "Impossible de supprimer cette production : le lot sec a déjà été utilisé.",
      );
    }
  }

  const deletedIds = getDeletedMovementIds();

  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    saveDeletedMovementIds(deletedIds);
  }
}
