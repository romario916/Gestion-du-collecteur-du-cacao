
import type {
  Expense,
  CreateExpenseInput,
} from "./expenses.types";

const STORAGE_KEY = "cacao-sambirano-expenses";

function getStoredExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as Expense[]) : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function generateExpenseNumber(expenses: Expense[]): string {
  const nextNumber = expenses.length + 1;

  return `DEP-${String(nextNumber).padStart(5, "0")}`;
}

export function getExpenses(): Expense[] {
  return getStoredExpenses().sort(
    (a, b) =>
      new Date(b.dateCreation).getTime() -
      new Date(a.dateCreation).getTime(),
  );
}

export function getExpenseById(id: string): Expense | undefined {
  return getStoredExpenses().find((expense) => expense.id === id);
}

export function createExpense(input: CreateExpenseInput): Expense {
  const expenses = getStoredExpenses();

  const expense: Expense = {
    id: crypto.randomUUID(),
    numero: generateExpenseNumber(expenses),
    ...input,
    statut: "EN_ATTENTE",
    dateCreation: new Date().toISOString(),
  };

  expenses.push(expense);
  saveExpenses(expenses);

  return expense;
}

export function updateExpense(
  id: string,
  input: CreateExpenseInput,
): Expense | null {
  const expenses = getStoredExpenses();

  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return null;
  }

  const updatedExpense: Expense = {
    ...expenses[index],
    ...input,
  };

  expenses[index] = updatedExpense;
  saveExpenses(expenses);

  return updatedExpense;
}

export function updateExpenseStatus(
  id: string,
  statut: Expense["statut"],
): Expense | null {
  const expenses = getStoredExpenses();

  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return null;
  }

  expenses[index] = {
    ...expenses[index],
    statut,
  };

  saveExpenses(expenses);

  return expenses[index];
}

export function deleteExpense(id: string): boolean {
  const expenses = getStoredExpenses();

  const filteredExpenses = expenses.filter(
    (expense) => expense.id !== id,
  );

  if (filteredExpenses.length === expenses.length) {
    return false;
  }

  saveExpenses(filteredExpenses);

  return true;
}
