
import { useEffect, useState } from "react";

import { Wallet } from "lucide-react";

import { getSales } from "../../sales/sales.service";
import { getExpenses } from "../../expenses/expenses.service";

import {
  getFinanceStats,
  getMonthlyFinanceData,
} from "../finance.service";

import type {
  FinanceStats,
  MonthlyFinance,
} from "../finance.types";

import FinanceStatsCards from "../components/FinanceStatsCards";
import MonthlyFinanceChart from "../components/MonthlyFinanceChart";

import FinanceHistoryTable, {
  type FinanceHistoryItem,
} from "../components/FinanceHistoryTable";

export default function FinancePage() {
  const [stats, setStats] = useState<FinanceStats>(() =>
    getFinanceStats(),
  );

  const [monthlyData, setMonthlyData] = useState<MonthlyFinance[]>([]);
  const [history, setHistory] = useState<FinanceHistoryItem[]>([]);

  useEffect(() => {
    refreshFinance();
  }, []);

  function refreshFinance() {
    setStats(getFinanceStats());
    setMonthlyData(getMonthlyFinanceData(6));

    const salesHistory: FinanceHistoryItem[] = getSales()
      .filter((sale) => sale.statut === "PAYEE")
      .map((sale) => ({
        id: `sale-${sale.id}`,
        numero: sale.numero,
        libelle: `Vente à ${sale.clientNom}`,
        type: "RECETTE",
        montant: sale.montantTotal,
        date: sale.dateVente,
      }));

    const expensesHistory: FinanceHistoryItem[] = getExpenses()
      .filter((expense) => expense.statut === "VALIDEE")
      .map((expense) => ({
        id: `expense-${expense.id}`,
        numero: expense.numero,
        libelle: expense.libelle,
        type: "DEPENSE",
        montant: expense.montant,
        date: expense.dateDepense,
      }));

    const sortedHistory = [
      ...salesHistory,
      ...expensesHistory,
    ].sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    setHistory(sortedHistory.slice(0, 10));
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-green-700">
          Gestion financière
        </p>

        <h1 className="mt-1 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-900">
          <Wallet size={27} className="text-green-700" />
          Finance
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Suivez les recettes, les dépenses et la situation financière de
          Cacao Sambirano.
        </p>
      </div>

      <FinanceStatsCards stats={stats} />

      <MonthlyFinanceChart data={monthlyData} />

      <FinanceHistoryTable items={history} />
    </div>
  );
}
