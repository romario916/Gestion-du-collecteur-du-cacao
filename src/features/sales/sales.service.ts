
import type {
  Sale,
  SaleItem,
  SaleStatus,
  CreateSaleInput,
} from "./sales.types";

import { getCustomerById } from "../customers/customers.service";

import {
  getDryBatchById,
  consumeDryBatchQuantity,
} from "../dry-stock/dry-stock.service";

const STORAGE_KEY = "cacao-sambirano-sales";

function getStoredSales(): Sale[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as Sale[]) : [];
  } catch {
    return [];
  }
}

function saveSales(sales: Sale[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

function generateSaleNumber(sales: Sale[]): string {
  const highestNumber = sales.reduce((highest, sale) => {
    const match = sale.numero.match(/^VTE-(\d+)$/);
    const number = match ? Number(match[1]) : 0;

    return Math.max(highest, number);
  }, 0);

  return `VTE-${String(highestNumber + 1).padStart(4, "0")}`;
}

export function getSales(): Sale[] {
  return getStoredSales();
}

export function getSaleById(id: string): Sale | undefined {
  return getStoredSales().find((sale) => sale.id === id);
}

export function getSalesByStatus(status: SaleStatus): Sale[] {
  return getStoredSales().filter((sale) => sale.statut === status);
}

export function deleteSale(id: string): void {
  const sales = getStoredSales();

  const saleExists = sales.some((sale) => sale.id === id);

  if (!saleExists) {
    throw new Error("La vente demandée est introuvable.");
  }

  const updatedSales = sales.filter((sale) => sale.id !== id);

  saveSales(updatedSales);
}

export function createSale(input: CreateSaleInput): Sale {
  const sales = getStoredSales();

  if (!input.clientId) {
    throw new Error("Veuillez sélectionner un client.");
  }

  const customer = getCustomerById(input.clientId);

  if (!customer) {
    throw new Error("Le client sélectionné est introuvable.");
  }

  if (customer.statut !== "ACTIF") {
    throw new Error("Ce client est inactif et ne peut pas effectuer de vente.");
  }

  if (!input.dateVente) {
    throw new Error("La date de vente est obligatoire.");
  }

  if (!input.articles.length) {
    throw new Error("Ajoutez au moins un lot sec à la vente.");
  }

  const usedBatchIds = new Set<string>();
  const saleItems: SaleItem[] = [];

  for (const item of input.articles) {
    if (usedBatchIds.has(item.dryBatchId)) {
      throw new Error(
        "Un même lot sec ne peut pas être ajouté plusieurs fois.",
      );
    }

    usedBatchIds.add(item.dryBatchId);

    if (!Number.isFinite(item.quantiteKg) || item.quantiteKg <= 0) {
      throw new Error("Chaque quantité vendue doit être supérieure à zéro.");
    }

    if (!Number.isFinite(item.prixKg) || item.prixKg <= 0) {
      throw new Error("Chaque prix par kilogramme doit être supérieur à zéro.");
    }

    const dryBatch = getDryBatchById(item.dryBatchId);

    if (!dryBatch || dryBatch.statut !== "EN_STOCK") {
      throw new Error("Un des lots secs sélectionnés n'est plus disponible.");
    }

    if (item.quantiteKg > dryBatch.quantiteDisponibleKg) {
      throw new Error(`Stock insuffisant pour le lot ${dryBatch.numero}.`);
    }

    saleItems.push({
      dryBatchId: dryBatch.id,
      dryBatchNumber: dryBatch.numero,
      quantiteKg: item.quantiteKg,
      prixKg: item.prixKg,
      montantTotal: item.quantiteKg * item.prixKg,
    });
  }

  const totalQuantity = saleItems.reduce(
    (total, item) => total + item.quantiteKg,
    0,
  );

  const totalAmount = saleItems.reduce(
    (total, item) => total + item.montantTotal,
    0,
  );

  const customerName =
    customer.type === "ENTREPRISE"
      ? customer.nomEntreprise
      : `${customer.nom} ${customer.prenom}`.trim();

  const newSale: Sale = {
    id: crypto.randomUUID(),
    numero: generateSaleNumber(sales),
    clientId: customer.id,
    clientNumero: customer.numero,
    clientNom: customerName,
    dateVente: input.dateVente,
    articles: saleItems,
    quantiteKg: totalQuantity,
    montantTotal: totalAmount,
    statut: "EN_ATTENTE",
    observations: input.observations.trim(),
    dateCreation: new Date().toISOString(),
  };

  sales.push(newSale);
  saveSales(sales);

  return newSale;
}

export function validateSale(id: string): Sale {
  const sales = getStoredSales();
  const saleIndex = sales.findIndex((sale) => sale.id === id);

  if (saleIndex === -1) {
    throw new Error("La vente demandée est introuvable.");
  }

  const sale = sales[saleIndex];

  if (sale.statut !== "EN_ATTENTE") {
    throw new Error("Seule une vente en attente peut être validée.");
  }

  const customer = getCustomerById(sale.clientId);

  if (!customer || customer.statut !== "ACTIF") {
    throw new Error("Le client n'est plus actif. Validation impossible.");
  }

  for (const item of sale.articles) {
    const dryBatch = getDryBatchById(item.dryBatchId);

    if (!dryBatch || dryBatch.statut !== "EN_STOCK") {
      throw new Error(
        `Le lot ${item.dryBatchNumber} n'est plus disponible.`,
      );
    }

    if (item.quantiteKg > dryBatch.quantiteDisponibleKg) {
      throw new Error(
        `Stock insuffisant pour le lot ${item.dryBatchNumber}.`,
      );
    }
  }

  for (const item of sale.articles) {
    consumeDryBatchQuantity(item.dryBatchId, item.quantiteKg);
  }

  const validatedSale: Sale = {
    ...sale,
    statut: "VALIDEE",
  };

  sales[saleIndex] = validatedSale;
  saveSales(sales);

  return validatedSale;
}

export function markSaleAsPaid(id: string): Sale {
  const sales = getStoredSales();
  const saleIndex = sales.findIndex((sale) => sale.id === id);

  if (saleIndex === -1) {
    throw new Error("La vente demandée est introuvable.");
  }

  const sale = sales[saleIndex];

  if (sale.statut !== "VALIDEE") {
    throw new Error("Seule une vente validée peut être marquée comme payée.");
  }

  const paidSale: Sale = {
    ...sale,
    statut: "PAYEE",
  };

  sales[saleIndex] = paidSale;
  saveSales(sales);

  return paidSale;
}

export function cancelSale(id: string): Sale {
  const sales = getStoredSales();
  const saleIndex = sales.findIndex((sale) => sale.id === id);

  if (saleIndex === -1) {
    throw new Error("La vente demandée est introuvable.");
  }

  const sale = sales[saleIndex];

  if (sale.statut !== "EN_ATTENTE") {
    throw new Error("Seule une vente en attente peut être annulée.");
  }

  const cancelledSale: Sale = {
    ...sale,
    statut: "ANNULEE",
  };

  sales[saleIndex] = cancelledSale;
  saveSales(sales);

  return cancelledSale;
}
