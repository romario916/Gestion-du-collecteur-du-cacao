
import {
  Receipt,
  Wallet,
  Clock,
  CheckCircle2,
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
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total des dépenses",
      value: formatAmount(stats.totalAmount),
      description: "Hors dépenses annulées",
      icon: Wallet,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: "En attente",
      value: formatAmount(stats.pendingAmount),
      description: `${stats.pendingCount} dépense(s) à valider`,
      icon: Clock,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Dépenses validées",
      value: formatAmount(stats.validatedAmount),
      description: `${stats.validatedCount} dépense(s) validée(s)`,
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}
              >
                <Icon size={21} />
              </div>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              {card.title}
            </p>

            <h3 className="mt-1 break-words text-xl font-bold text-[#17251B]">
              {card.value}
            </h3>

            <p className="mt-2 text-xs text-gray-400">
              {card.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}
