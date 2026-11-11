
import { getSales } from "../sales/sales.service";
import { getExpenses } from "../expenses/expenses.service";

import type {
  FinanceStats,
  MonthlyFinance,
} from "./finance.types";

export function getFinanceStats(): FinanceStats {
  const sales = getSales();
  const expenses = getExpenses();

  const paidSales = sales.filter(
    (sale) => sale.statut === "PAYEE",
  );

  const unpaidSales = sales.filter(
    (sale) => sale.statut === "VALIDEE",
  );

  const validatedExpenses = expenses.filter(
    (expense) => expense.statut === "VALIDEE",
  );

  const pendingExpenses = expenses.filter(
    (expense) => expense.statut === "EN_ATTENTE",
  );

  const totalRevenue = paidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const totalExpenses = validatedExpenses.reduce(
    (total, expense) => total + expense.montant,
    0,
  );

  const unpaidSalesAmount = unpaidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  const pendingExpensesAmount = pendingExpenses.reduce(
    (total, expense) => total + expense.montant,
    0,
  );

  return {
    totalRevenue,
    totalExpenses,
    netResult: totalRevenue - totalExpenses,
    unpaidSalesAmount,
    pendingExpensesAmount,
    paidSalesCount: paidSales.length,
    unpaidSalesCount: unpaidSales.length,
    validatedExpensesCount: validatedExpenses.length,
    pendingExpensesCount: pendingExpenses.length,
  };
}

export function getMonthlyFinanceData(
  monthCount = 6,
): MonthlyFinance[] {
  const sales = getSales();
  const expenses = getExpenses();

  const months: MonthlyFinance[] = [];

  const currentDate = new Date();

  for (let index = monthCount - 1; index >= 0; index--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index,
      1,
    );

    const monthKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    const month = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });

    const revenue = sales
      .filter(
        (sale) =>
          sale.statut === "PAYEE" &&
          sale.dateVente.slice(0, 7) === monthKey,
      )
      .reduce((total, sale) => total + sale.montantTotal, 0);

    const monthlyExpenses = expenses
      .filter(
        (expense) =>
          expense.statut === "VALIDEE" &&
          expense.dateDepense.slice(0, 7) === monthKey,
      )
      .reduce((total, expense) => total + expense.montant, 0);

    months.push({
      month,
      monthKey,
      revenue,
      expenses: monthlyExpenses,
      result: revenue - monthlyExpenses,
    });
  }

  return months;
}
