
import type { Expense } from "./expenses.types";
import { getExpenses } from "./expenses.service";

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  pendingAmount: number;
  validatedAmount: number;
  cancelledAmount: number;
  pendingCount: number;
  validatedCount: number;
  cancelledCount: number;
}

export function getExpenseStats(): ExpenseStats {
  const expenses: Expense[] = getExpenses();

  const pendingExpenses = expenses.filter(
    (expense) => expense.statut === "EN_ATTENTE",
  );

  const validatedExpenses = expenses.filter(
    (expense) => expense.statut === "VALIDEE",
  );

  const cancelledExpenses = expenses.filter(
    (expense) => expense.statut === "ANNULEE",
  );

  const calculateTotal = (items: Expense[]): number =>
    items.reduce((total, expense) => total + expense.montant, 0);

  return {
    totalExpenses: expenses.length,
    totalAmount: calculateTotal(
      expenses.filter((expense) => expense.statut !== "ANNULEE"),
    ),
    pendingAmount: calculateTotal(pendingExpenses),
    validatedAmount: calculateTotal(validatedExpenses),
    cancelledAmount: calculateTotal(cancelledExpenses),
    pendingCount: pendingExpenses.length,
    validatedCount: validatedExpenses.length,
    cancelledCount: cancelledExpenses.length,
  };
}
