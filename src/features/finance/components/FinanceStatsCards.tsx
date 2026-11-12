
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
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
      color: "text-green-700",
      background: "bg-green-50",
      accent: "bg-green-600",
      indicator: ArrowUpRight,
    },
    {
      title: "Dépenses validées",
      value: formatAmount(stats.totalExpenses),
      count: `${stats.validatedExpensesCount} dépenses`,
      icon: TrendingDown,
      color: "text-red-600",
      background: "bg-red-50",
      accent: "bg-red-500",
      indicator: ArrowDownRight,
    },
    {
      title: "Résultat net",
      value: formatAmount(stats.netResult),
      count: "Recettes − dépenses validées",
      icon: Wallet,
      color:
        stats.netResult >= 0
          ? "text-blue-700"
          : "text-red-600",
      background:
        stats.netResult >= 0
          ? "bg-blue-50"
          : "bg-red-50",
      accent:
        stats.netResult >= 0
          ? "bg-blue-600"
          : "bg-red-500",
      indicator:
        stats.netResult >= 0
          ? ArrowUpRight
          : ArrowDownRight,
    },
    {
      title: "Ventes non encaissées",
      value: formatAmount(stats.unpaidSalesAmount),
      count: `${stats.unpaidSalesCount} ventes validées`,
      icon: Receipt,
      color: "text-yellow-700",
      background: "bg-yellow-50",
      accent: "bg-yellow-500",
      indicator: Clock,
    },
    {
      title: "Dépenses en attente",
      value: formatAmount(stats.pendingExpensesAmount),
      count: `${stats.pendingExpensesCount} dépenses`,
      icon: Clock,
      color: "text-orange-700",
      background: "bg-orange-50",
      accent: "bg-orange-500",
      indicator: Receipt,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const Indicator = card.indicator;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${card.accent}`}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-3 break-words text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  {card.value}
                </h3>

                <p className="mt-2 text-xs font-medium text-gray-400">
                  {card.count}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.background} ${card.color} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon size={22} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Indicateur financier
              </span>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.background} ${card.color}`}
              >
                <Indicator size={15} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
