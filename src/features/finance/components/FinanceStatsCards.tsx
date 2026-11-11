
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Receipt,
} from "lucide-react";

import type { FinanceStats } from "../finance.types";

interface FinanceStatsCardsProps {
  stats: FinanceStats;
}

function formatAmount(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} Ar`;
}

export default function FinanceStatsCards({
  stats,
}: FinanceStatsCardsProps) {
  const cards = [
    {
      title: "Recettes encaissées",
      value: formatAmount(stats.totalRevenue),
      count: `${stats.paidSalesCount} ventes payées`,
      icon: TrendingUp,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      title: "Dépenses validées",
      value: formatAmount(stats.totalExpenses),
      count: `${stats.validatedExpensesCount} dépenses`,
      icon: TrendingDown,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      title: "Résultat net",
      value: formatAmount(stats.netResult),
      count: "Recettes − dépenses validées",
      icon: Wallet,
      color: stats.netResult >= 0
        ? "text-blue-600"
        : "text-red-600",
      background: stats.netResult >= 0
        ? "bg-blue-50"
        : "bg-red-50",
    },
    {
      title: "Ventes non encaissées",
      value: formatAmount(stats.unpaidSalesAmount),
      count: `${stats.unpaidSalesCount} ventes validées`,
      icon: Receipt,
      color: "text-amber-600",
      background: "bg-amber-50",
    },
    {
      title: "Dépenses en attente",
      value: formatAmount(stats.pendingExpensesAmount),
      count: `${stats.pendingExpensesCount} dépenses`,
      icon: Clock,
      color: "text-orange-600",
      background: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-3 text-xl font-bold text-gray-900">
                  {card.value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {card.count}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.background} ${card.color}`}
              >
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
