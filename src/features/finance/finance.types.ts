
export interface FinanceStats {
  totalRevenue: number;
  totalExpenses: number;
  netResult: number;

  unpaidSalesAmount: number;
  pendingExpensesAmount: number;

  paidSalesCount: number;
  unpaidSalesCount: number;
  validatedExpensesCount: number;
  pendingExpensesCount: number;
}

export interface MonthlyFinance {
  month: string;
  monthKey: string;
  revenue: number;
  expenses: number;
  result: number;
}
