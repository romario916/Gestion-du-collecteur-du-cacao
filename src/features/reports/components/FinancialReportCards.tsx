
import {
  TrendingUp,
  TrendingDown,
  Wallet,
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
      color: "text-green-600",
      background: "bg-green-50",
    },
    {
      title: "Dépenses validées",
      value: formatCurrency(report.depensesValidees),
      description: "Total des dépenses validées",
      icon: TrendingDown,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      title: "Résultat net",
      value: formatCurrency(report.resultatNet),
      description: isPositive
        ? "Résultat positif sur la période"
        : "Résultat négatif sur la période",
      icon: Wallet,
      color: isPositive ? "text-blue-600" : "text-orange-600",
      background: isPositive ? "bg-blue-50" : "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="mt-3 break-words text-xl font-bold text-gray-900">
                  {card.value}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {card.description}
                </p>
              </div>

              <div className={`rounded-lg p-3 ${card.background} ${card.color}`}>
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
