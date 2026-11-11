
import type {
  Transformation,
  CreateTransformationInput,
} from "./processing.types";

import type { Batch } from "../batches/batches.types";

import {
  getBatches,
  consumeBatchQuantity,
} from "../batches/batches.service";

import { createDryBatch } from "../dry-stock/dry-stock.service";

const STORAGE_KEY = "cacao-sambirano-drying";
const DELETED_STORAGE_KEY = "cacao-sambirano-deleted-drying";

function getStoredTransformations(): Transformation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Transformation[]) : [];
  } catch {
    return [];
  }
}

function saveTransformations(
  transformations: Transformation[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transformations),
  );
}

function getStoredDeletedTransformations(): Transformation[] {
  try {
    const stored = localStorage.getItem(DELETED_STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Transformation[]) : [];
  } catch {
    return [];
  }
}

function saveDeletedTransformations(
  transformations: Transformation[],
): void {
  localStorage.setItem(
    DELETED_STORAGE_KEY,
    JSON.stringify(transformations),
  );
}

function generateTransformationNumber(
  transformations: Transformation[],
): string {
  const highestNumber = transformations.reduce(
    (highest, transformation) => {
      const match = transformation.numero.match(/^SEC-(\d+)$/);
      const number = match ? Number(match[1]) : 0;

      return Math.max(highest, number);
    },
    0,
  );

  return `SEC-${String(highestNumber + 1).padStart(4, "0")}`;
}

export function getTransformations(): Transformation[] {
  return getStoredTransformations();
}

export function getDeletedTransformations(): Transformation[] {
  return getStoredDeletedTransformations();
}

export function getAvailableBatches(): Batch[] {
  return getBatches().filter(
    (batch) =>
      batch.statut === "EN_STOCK" &&
      batch.quantiteDisponibleKg > 0,
  );
}

export function createTransformation(
  data: CreateTransformationInput,
): Transformation {
  if (!Array.isArray(data.lots) || data.lots.length === 0) {
    throw new Error("Veuillez sélectionner au moins un lot.");
  }

  const batches = getAvailableBatches();
  const usedBatchIds = new Set<string>();

  let quantiteTotaleUtiliseeKg = 0;

  const lotsSources = data.lots.map((item) => {
    if (!item.batchId.trim()) {
      throw new Error("Un lot sélectionné est invalide.");
    }

    if (usedBatchIds.has(item.batchId)) {
      throw new Error(
        "Un même lot ne peut pas être sélectionné plusieurs fois.",
      );
    }

    usedBatchIds.add(item.batchId);

    if (
      !Number.isFinite(item.quantiteUtiliseeKg) ||
      item.quantiteUtiliseeKg <= 0
    ) {
      throw new Error(
        "Chaque quantité utilisée doit être supérieure à zéro.",
      );
    }

    const batch = batches.find(
      (availableBatch) => availableBatch.id === item.batchId,
    );

    if (!batch) {
      throw new Error(
        "Un des lots sélectionnés n'est plus disponible.",
      );
    }

    if (item.quantiteUtiliseeKg > batch.quantiteDisponibleKg) {
      throw new Error(
        `Stock insuffisant pour le lot ${batch.numero}.`,
      );
    }

    quantiteTotaleUtiliseeKg += item.quantiteUtiliseeKg;

    return {
      batchId: batch.id,
      batchNumber: batch.numero,
      purchaseNumber: batch.purchaseNumber,
      producerId: batch.producerId,
      producerName: batch.producerName,
      quantiteUtiliseeKg: item.quantiteUtiliseeKg,
    };
  });

  const transformations = getStoredTransformations();
  const deletedTransformations = getStoredDeletedTransformations();

  const transformation: Transformation = {
    id: crypto.randomUUID(),
    numero: generateTransformationNumber([
      ...transformations,
      ...deletedTransformations,
    ]),
    lotsSources,
    quantiteTotaleUtiliseeKg,
    quantiteObtenueKg: null,
    rendement: null,
    pertePoidsKg: null,
    statut: "EN_ATTENTE",
    dateDebut: null,
    dateFin: null,
    observations: data.observations.trim(),
    dateCreation: new Date().toISOString(),
  };

  transformations.push(transformation);
  saveTransformations(transformations);

  return transformation;
}

export function startTransformation(id: string): void {
  const transformations = getStoredTransformations();

  const transformation = transformations.find(
    (item) => item.id === id,
  );

  if (!transformation) {
    throw new Error("L'opération de séchage est introuvable.");
  }

  if (transformation.statut !== "EN_ATTENTE") {
    throw new Error("Cette opération ne peut pas être démarrée.");
  }

  const batches = getAvailableBatches();

  for (const source of transformation.lotsSources) {
    const batch = batches.find(
      (item) => item.id === source.batchId,
    );

    if (!batch) {
      throw new Error(
        `Le lot ${source.batchNumber} n'est plus disponible.`,
      );
    }

    if (source.quantiteUtiliseeKg > batch.quantiteDisponibleKg) {
      throw new Error(
        `Stock insuffisant pour le lot ${source.batchNumber}.`,
      );
    }
  }

  for (const source of transformation.lotsSources) {
    consumeBatchQuantity(
      source.batchId,
      source.quantiteUtiliseeKg,
    );
  }

  transformation.statut = "EN_COURS";
  transformation.dateDebut = new Date().toISOString();

  saveTransformations(transformations);
}

export function finishTransformation(
  id: string,
  quantiteObtenueKg: number,
): void {
  const transformations = getStoredTransformations();

  const transformation = transformations.find(
    (item) => item.id === id,
  );

  if (!transformation) {
    throw new Error("L'opération de séchage est introuvable.");
  }

  if (transformation.statut !== "EN_COURS") {
    throw new Error("Cette opération n'est pas en cours.");
  }

  if (
    !Number.isFinite(quantiteObtenueKg) ||
    quantiteObtenueKg <= 0
  ) {
    throw new Error("Le poids sec obtenu doit être supérieur à zéro.");
  }

  if (
    quantiteObtenueKg > transformation.quantiteTotaleUtiliseeKg
  ) {
    throw new Error(
      "Le poids sec obtenu ne peut pas dépasser le poids frais utilisé.",
    );
  }

  const dateProduction = new Date().toISOString();

  createDryBatch({
    dryingId: transformation.id,
    dryingNumber: transformation.numero,
    sources: transformation.lotsSources.map((source) => ({
      batchId: source.batchId,
      batchNumber: source.batchNumber,
      producerName: source.producerName,
      quantiteUtiliseeKg: source.quantiteUtiliseeKg,
    })),
    quantiteInitialeKg: quantiteObtenueKg,
    dateProduction,
    observations: transformation.observations,
  });

  transformation.quantiteObtenueKg = quantiteObtenueKg;

  transformation.rendement =
    (quantiteObtenueKg /
      transformation.quantiteTotaleUtiliseeKg) *
    100;

  transformation.pertePoidsKg =
    transformation.quantiteTotaleUtiliseeKg -
    quantiteObtenueKg;

  transformation.statut = "TERMINE";
  transformation.dateFin = dateProduction;

  saveTransformations(transformations);
}

export function deleteTransformation(id: string): void {
  const transformations = getStoredTransformations();

  const transformation = transformations.find(
    (item) => item.id === id,
  );

  if (!transformation) {
    throw new Error("L'opération de séchage est introuvable.");
  }

  const deletedTransformations = getStoredDeletedTransformations();

  if (
    !deletedTransformations.some((item) => item.id === id)
  ) {
    deletedTransformations.push(transformation);
    saveDeletedTransformations(deletedTransformations);
  }

  saveTransformations(
    transformations.filter((item) => item.id !== id),
  );
}
