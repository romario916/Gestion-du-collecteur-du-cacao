
import {
  Receipt,
  Wallet,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import type { ExpenseStats } from "../expenses.stats";

interface ExpenseStatsCardsProps {
  stats: ExpenseStats;
}

function formatAmount(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} Ar`;
}

export default function ExpenseStatsCards({
  stats,
}: ExpenseStatsCardsProps) {
  const cards = [
    {
      title: "Nombre de dépenses",
      value: stats.totalExpenses.toLocaleString("fr-FR"),
      description: "Dépenses enregistrées",
      icon: Receipt,
      iconStyle: "bg-blue-50 text-blue-700",
      accent: "bg-blue-500",
      valueStyle: "text-gray-900",
    },
    {
      title: "Total des dépenses",
      value: formatAmount(stats.totalAmount),
      description: "Hors dépenses annulées",
      icon: Wallet,
      iconStyle: "bg-green-50 text-green-700",
      accent: "bg-green-700",
      valueStyle: "text-[#14532D]",
    },
    {
      title: "En attente",
      value: formatAmount(stats.pendingAmount),
      description: `${stats.pendingCount} dépense(s) à valider`,
      icon: Clock,
      iconStyle: "bg-yellow-50 text-yellow-700",
      accent: "bg-yellow-500",
      valueStyle: "text-gray-900",
    },
    {
      title: "Dépenses validées",
      value: formatAmount(stats.validatedAmount),
      description: `${stats.validatedCount} dépense(s) validée(s)`,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
      accent: "bg-emerald-600",
      valueStyle: "text-emerald-700",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-lg"
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${card.accent}`}
            />

            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconStyle} transition duration-300 group-hover:scale-105`}
              >
                <Icon size={22} strokeWidth={2} />
              </div>

              <div className="rounded-lg bg-gray-50 p-1.5 text-gray-300 transition group-hover:bg-green-50 group-hover:text-green-700">
                <ArrowUpRight size={16} />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <h3
                className={`mt-2 break-words text-xl font-extrabold tracking-tight ${card.valueStyle}`}
              >
                {card.value}
              </h3>

              <p className="mt-2 text-xs font-medium text-gray-400">
                {card.description}
              </p>
            </div>

            <div className="mt-5 h-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full w-1/3 rounded-full ${card.accent} opacity-70 transition-all duration-500 group-hover:w-2/3`}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
