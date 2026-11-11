
import { getProducers } from "../producers/producers.service";
import { getPurchases } from "../purchases/purchases.service";
import { getBatches } from "../batches/batches.service";
import { getTransformations } from "../processing/processing.service";
import { getDryBatches } from "../dry-stock/dry-stock.service";
import { getSales } from "../sales/sales.service";

export interface DashboardActivity {
  id: string;
  type: "PRODUCTEUR" | "ACHAT" | "TRANSFORMATION" | "VENTE";
  title: string;
  description: string;
  date: string;
  timestamp: number;
}

export function getDashboardStats() {
  const producers = getProducers();
  const purchases = getPurchases();
  const batches = getBatches();
  const transformations = getTransformations();
  const dryBatches = getDryBatches();
  const sales = getSales();

  const confirmedPurchases = purchases.filter(
    (purchase) => purchase.statut === "VALIDE",
  );

  const confirmedSales = sales.filter(
    (sale) => sale.statut === "VALIDEE" || sale.statut === "PAYEE",
  );

  const paidSales = sales.filter(
    (sale) => sale.statut === "PAYEE",
  );

  const unpaidSales = sales.filter(
    (sale) => sale.statut === "VALIDEE",
  );

  const completedTransformations = transformations.filter(
    (transformation) => transformation.statut === "TERMINE",
  );

  const totalSales = confirmedSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const totalCollected = paidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const totalUnpaid = unpaidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const totalPurchases = confirmedPurchases.reduce(
    (total, purchase) => total + purchase.montantTotal,
    0,
  );

  const totalDryProduction = dryBatches.reduce(
    (total, batch) => total + batch.quantiteInitialeKg,
    0,
  );

  const availableFreshStock = batches.reduce(
    (total, batch) => total + batch.quantiteDisponibleKg,
    0,
  );

  const availableDryStock = dryBatches.reduce(
    (total, batch) => total + batch.quantiteDisponibleKg,
    0,
  );

  return {
    producers: {
      total: producers.length,
      active: producers.filter((producer) => producer.actif).length,
    },

    purchases: {
      total: confirmedPurchases.length,
      amount: totalPurchases,
    },

    batches: {
      total: batches.length,
      availableStockKg: availableFreshStock,
    },

    processing: {
      totalCompleted: completedTransformations.length,
      totalDryProductionKg: totalDryProduction,
    },

    dryStock: {
      total: dryBatches.length,
      availableStockKg: availableDryStock,
    },

    sales: {
      total: confirmedSales.length,
      amount: totalSales,
      collected: totalCollected,
      unpaid: totalUnpaid,
      pending: sales.filter(
        (sale) => sale.statut === "EN_ATTENTE",
      ).length,
      cancelled: sales.filter(
        (sale) => sale.statut === "ANNULEE",
      ).length,
    },
  };
}

export function getDashboardRecentActivities(
  limit = 8,
): DashboardActivity[] {
  const producers = getProducers();
  const purchases = getPurchases();
  const transformations = getTransformations();
  const sales = getSales();

  const activities: DashboardActivity[] = [];

  producers.forEach((producer) => {
    const date = producer.dateInscription;

    activities.push({
      id: `producer-${producer.id}`,
      type: "PRODUCTEUR",
      title: "Nouveau producteur",
      description: `${producer.nom} ${producer.prenom}`,
      date,
      timestamp: new Date(date).getTime(),
    });
  });

  purchases.forEach((purchase) => {
    const date = purchase.dateCreation;

    activities.push({
      id: `purchase-${purchase.id}`,
      type: "ACHAT",
      title: "Achat de cacao",
      description: `${purchase.quantiteKg} kg auprès de ${purchase.producerName}`,
      date,
      timestamp: new Date(date).getTime(),
    });
  });

  transformations.forEach((transformation) => {
    const date = transformation.dateCreation;

    activities.push({
      id: `transformation-${transformation.id}`,
      type: "TRANSFORMATION",
      title: "Opération de séchage",
      description: `${transformation.numero} — ${transformation.quantiteTotaleUtiliseeKg} kg utilisés`,
      date,
      timestamp: new Date(date).getTime(),
    });
  });

  sales.forEach((sale) => {
    const date = sale.dateCreation;

    activities.push({
      id: `sale-${sale.id}`,
      type: "VENTE",
      title: "Vente de cacao sec",
      description: `${sale.numero} — ${sale.clientNom}`,
      date,
      timestamp: new Date(date).getTime(),
    });
  });

  return activities
    .filter((activity) => !Number.isNaN(activity.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}
