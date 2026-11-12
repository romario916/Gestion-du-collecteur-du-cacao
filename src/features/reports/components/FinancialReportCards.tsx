
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import type { FinancialReport } from "../reports.types";

interface FinancialReportCardsProps {
  report: FinancialReport;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(value);

export default function FinancialReportCards({
  report,
}: FinancialReportCardsProps) {
  const isPositive = report.resultatNet >= 0;

  const cards = [
    {
      title: "Recettes encaissées",
      value: formatCurrency(report.recettesEncaissees),
      description: "Total des ventes payées",
      icon: TrendingUp,
      color: "text-green-700",
      background: "bg-green-50",
      border: "border-t-green-600",
    },
    {
      title: "Dépenses validées",
      value: formatCurrency(report.depensesValidees),
      description: "Total des dépenses validées",
      icon: TrendingDown,
      color: "text-red-700",
      background: "bg-red-50",
      border: "border-t-red-500",
    },
    {
      title: "Résultat net",
      value: formatCurrency(report.resultatNet),
      description: isPositive
        ? "Résultat positif sur la période"
        : "Résultat négatif sur la période",
      icon: Wallet,
      color: isPositive ? "text-blue-700" : "text-orange-700",
      background: isPositive ? "bg-blue-50" : "bg-orange-50",
      border: isPositive
        ? "border-t-blue-600"
        : "border-t-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group rounded-2xl border border-gray-200 border-t-[3px] ${card.border} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-500">
                  {card.title}
                </p>

                <p className="mt-4 break-words text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  {card.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {card.description}
                </p>
              </div>

              <div
                className={`shrink-0 rounded-xl p-3 ${card.background} ${card.color} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={22} strokeWidth={2} />
              </div>
            </div>

            {card.title === "Résultat net" && (
              <div
                className={`mt-5 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs font-semibold ${
                  isPositive ? "text-green-700" : "text-orange-700"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}

                {isPositive ? "Situation positive" : "Situation à surveiller"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
