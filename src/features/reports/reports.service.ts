
import { getPurchases } from "../purchases/purchases.service";
import { getTransformations } from "../processing/processing.service";
import { getSales } from "../sales/sales.service";
import { getExpenses } from "../expenses/expenses.service";
import { EXPENSE_CATEGORIES } from "../expenses/expenses.constants";

import type {
  ReportPeriod,
  PurchaseReport,
  ProductionReport,
  SalesReport,
  ExpenseReport,
  FinancialReport,
} from "./reports.types";

function isWithinPeriod(
  date: string,
  period: ReportPeriod,
): boolean {
  const normalizedDate = date.slice(0, 10);

  return (
    normalizedDate >= period.dateDebut &&
    normalizedDate <= period.dateFin
  );
}

export function getPurchaseReport(
  period: ReportPeriod,
): PurchaseReport {
  const purchases = getPurchases();

  const validatedPurchases = purchases.filter(
    (purchase) =>
      purchase.statut === "VALIDE" &&
      isWithinPeriod(purchase.dateAchat, period),
  );

  return {
    nombreAchats: validatedPurchases.length,

    quantiteTotaleKg: validatedPurchases.reduce(
      (total, purchase) => total + purchase.quantiteKg,
      0,
    ),

    montantTotal: validatedPurchases.reduce(
      (total, purchase) => total + purchase.montantTotal,
      0,
    ),
  };
}

export function getProductionReport(
  period: ReportPeriod,
): ProductionReport {
  const transformations = getTransformations();

  const completedTransformations = transformations.filter(
    (transformation) =>
      transformation.statut === "TERMINE" &&
      transformation.dateFin !== null &&
      isWithinPeriod(transformation.dateFin, period),
  );

  const quantiteFraicheUtiliseeKg =
    completedTransformations.reduce(
      (total, transformation) =>
        total + transformation.quantiteTotaleUtiliseeKg,
      0,
    );

  const quantiteSecheObtenueKg =
    completedTransformations.reduce(
      (total, transformation) =>
        total + (transformation.quantiteObtenueKg ?? 0),
      0,
    );

  const perteTotaleKg = completedTransformations.reduce(
    (total, transformation) =>
      total + (transformation.pertePoidsKg ?? 0),
    0,
  );

  const rendementMoyen =
    quantiteFraicheUtiliseeKg > 0
      ? (quantiteSecheObtenueKg / quantiteFraicheUtiliseeKg) * 100
      : 0;

  return {
    nombreOperations: completedTransformations.length,
    quantiteFraicheUtiliseeKg,
    quantiteSecheObtenueKg,
    perteTotaleKg,
    rendementMoyen,
  };
}

export function getSalesReport(
  period: ReportPeriod,
): SalesReport {
  const sales = getSales();

  const periodSales = sales.filter(
    (sale) =>
      (sale.statut === "PAYEE" || sale.statut === "VALIDEE") &&
      isWithinPeriod(sale.dateVente, period),
  );

  const paidSales = periodSales.filter(
    (sale) => sale.statut === "PAYEE",
  );

  const unpaidSales = periodSales.filter(
    (sale) => sale.statut === "VALIDEE",
  );

  return {
    nombreVentes: periodSales.length,

    quantiteVendueKg: periodSales.reduce(
      (total, sale) => total + sale.quantiteKg,
      0,
    ),

    chiffreAffaires: paidSales.reduce(
      (total, sale) => total + sale.montantTotal,
      0,
    ),

    montantEnAttente: unpaidSales.reduce(
      (total, sale) => total + sale.montantTotal,
      0,
    ),
  };
}

export function getExpenseReport(
  period: ReportPeriod,
): ExpenseReport {
  const expenses = getExpenses();

  const validatedExpenses = expenses.filter(
    (expense) =>
      expense.statut === "VALIDEE" &&
      isWithinPeriod(expense.dateDepense, period),
  );

  const categories = new Map<string, number>();

  validatedExpenses.forEach((expense) => {
    const currentAmount = categories.get(expense.categorie) ?? 0;

    categories.set(
      expense.categorie,
      currentAmount + expense.montant,
    );
  });

  return {
    nombreDepenses: validatedExpenses.length,

    montantTotal: validatedExpenses.reduce(
      (total, expense) => total + expense.montant,
      0,
    ),

    repartitionParCategorie: Array.from(
      categories,
      ([categorie, montant]) => {
        const categoryLabel = EXPENSE_CATEGORIES.find(
          (item) => item.value === categorie,
        )?.label;

        return {
          categorie: categoryLabel ?? categorie,
          montant,
        };
      },
    ),
  };
}

export function getFinancialReport(
  period: ReportPeriod,
): FinancialReport {
  const sales = getSales();
  const expenses = getExpenses();

  const paidSales = sales.filter(
    (sale) =>
      sale.statut === "PAYEE" &&
      isWithinPeriod(sale.dateVente, period),
  );

  const validatedExpenses = expenses.filter(
    (expense) =>
      expense.statut === "VALIDEE" &&
      isWithinPeriod(expense.dateDepense, period),
  );

  const recettesEncaissees = paidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const depensesValidees = validatedExpenses.reduce(
    (total, expense) => total + expense.montant,
    0,
  );

  return {
    recettesEncaissees,
    depensesValidees,
    resultatNet: recettesEncaissees - depensesValidees,
  };
}
