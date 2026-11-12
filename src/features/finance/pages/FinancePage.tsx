
import { useEffect, useState } from "react";

import {
  Wallet,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

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
    <div className="space-y-7 pb-6">
      {/* En-tête */}
      <section className="relative overflow-hidden rounded-2xl bg-[#103F26] px-5 py-7 shadow-lg sm:px-7">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-yellow-400/5" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-yellow-400/15 p-2 text-yellow-400">
                <Wallet size={21} />
              </span>

              <span className="text-sm font-semibold text-green-100">
                Gestion financière
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Tableau financier
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100/80">
              Suivez les recettes, les dépenses et la situation financière
              de Cacao Sambirano.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/15 text-yellow-400">
              <TrendingUp size={21} />
            </div>

            <div>
              <p className="text-xs font-medium text-green-100/70">
                Période d'analyse
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                6 derniers mois
              </p>
            </div>

            <CalendarDays
              size={18}
              className="ml-2 text-yellow-400"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-transparent" />
      </section>

      {/* Statistiques financières */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Vue d'ensemble financière
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Indicateurs principaux de votre activité.
            </p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 sm:flex">
            <ArrowUpRight size={15} />
            Statistiques
          </div>
        </div>

        <FinanceStatsCards stats={stats} />
      </section>

      {/* Évolution financière */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Évolution financière
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comparaison mensuelle des recettes et des dépenses.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <MonthlyFinanceChart data={monthlyData} />
        </div>
      </section>

      {/* Historique */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Historique financier
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Consultez les dix dernières recettes et dépenses enregistrées.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <FinanceHistoryTable items={history} />
        </div>
      </section>
    </div>
  );
}
