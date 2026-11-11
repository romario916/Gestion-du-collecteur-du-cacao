
import type {
  Purchase,
  CreatePurchaseInput,
  UpdatePurchaseInput,
  PurchaseStatus,
  CocoaQuality,
} from "./purchases.types";

import { getProducers } from "../producers/producers.service";

const STORAGE_KEY = "cacao-sambirano-purchases";

function getStoredPurchases(): Purchase[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Purchase[]) : [];
  } catch {
    return [];
  }
}

function savePurchases(purchases: Purchase[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
}

function normalizeText(value: string): string {
  return value.trim();
}

function validatePurchaseInput(data: CreatePurchaseInput): void {
  if (!normalizeText(data.producerId)) {
    throw new Error("Veuillez sélectionner un producteur.");
  }

  const producer = getProducers().find(
    (item) => item.id === data.producerId,
  );

  if (!producer) {
    throw new Error("Le producteur sélectionné est introuvable.");
  }

  if (!producer.actif) {
    throw new Error("Ce producteur est inactif. Impossible d'enregistrer un achat.");
  }

  if (!data.dateAchat || Number.isNaN(Date.parse(data.dateAchat))) {
    throw new Error("Veuillez renseigner une date d'achat valide.");
  }

  if (!Number.isFinite(data.quantiteKg) || data.quantiteKg <= 0) {
    throw new Error("La quantité doit être supérieure à zéro.");
  }

  if (!Number.isFinite(data.prixKg) || data.prixKg <= 0) {
    throw new Error("Le prix au kilogramme doit être supérieur à zéro.");
  }

  const validQualities: CocoaQuality[] = [
    "PREMIERE_QUALITE",
    "DEUXIEME_QUALITE",
    "TROISIEME_QUALITE",
  ];

  if (!validQualities.includes(data.qualite)) {
    throw new Error("Veuillez sélectionner une qualité de cacao valide.");
  }
}

function validateStatus(status: PurchaseStatus): void {
  const validStatuses: PurchaseStatus[] = [
    "EN_ATTENTE",
    "VALIDE",
    "ANNULE",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Le statut de l'achat est invalide.");
  }
}

function generatePurchaseNumber(purchases: Purchase[]): string {
  const highestNumber = purchases.reduce((highest, purchase) => {
    const match = purchase.numero.match(/^ACH-(\d+)$/);
    const number = match ? Number(match[1]) : 0;

    return Math.max(highest, number);
  }, 0);

  return `ACH-${String(highestNumber + 1).padStart(4, "0")}`;
}

export function getPurchases(): Purchase[] {
  return getStoredPurchases();
}

export function getPurchaseById(id: string): Purchase | undefined {
  return getStoredPurchases().find((purchase) => purchase.id === id);
}

export function createPurchase(data: CreatePurchaseInput): Purchase {
  validatePurchaseInput(data);

  const purchases = getStoredPurchases();

  const producer = getProducers().find(
    (item) => item.id === data.producerId,
  );

  if (!producer) {
    throw new Error("Producteur introuvable.");
  }

  const purchase: Purchase = {
    id: crypto.randomUUID(),
    numero: generatePurchaseNumber(purchases),
    producerId: producer.id,
    producerName: `${producer.nom} ${producer.prenom}`,
    dateAchat: data.dateAchat,
    quantiteKg: data.quantiteKg,
    prixKg: data.prixKg,
    montantTotal: data.quantiteKg * data.prixKg,
    qualite: data.qualite,
    observations: normalizeText(data.observations),
    statut: "EN_ATTENTE",
    dateCreation: new Date().toISOString(),
  };

  purchases.push(purchase);
  savePurchases(purchases);

  return purchase;
}

export function updatePurchase(
  id: string,
  data: UpdatePurchaseInput,
): Purchase {
  validatePurchaseInput(data);
  validateStatus(data.statut);

  const purchases = getStoredPurchases();
  const index = purchases.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Achat introuvable.");
  }

  const producer = getProducers().find(
    (item) => item.id === data.producerId,
  );

  if (!producer) {
    throw new Error("Producteur introuvable.");
  }

  const updatedPurchase: Purchase = {
    ...purchases[index],
    producerId: producer.id,
    producerName: `${producer.nom} ${producer.prenom}`,
    dateAchat: data.dateAchat,
    quantiteKg: data.quantiteKg,
    prixKg: data.prixKg,
    montantTotal: data.quantiteKg * data.prixKg,
    qualite: data.qualite,
    observations: normalizeText(data.observations),
    statut: data.statut,
  };

  purchases[index] = updatedPurchase;
  savePurchases(purchases);

  return updatedPurchase;
}

export function deletePurchase(id: string): void {
  const purchases = getStoredPurchases();

  const filteredPurchases = purchases.filter(
    (item) => item.id !== id,
  );

  if (filteredPurchases.length === purchases.length) {
    throw new Error("Achat introuvable.");
  }

  savePurchases(filteredPurchases);
}
