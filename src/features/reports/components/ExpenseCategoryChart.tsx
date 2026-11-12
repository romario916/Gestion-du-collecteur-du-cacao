
import { Wallet, ChartNoAxesColumnIncreasing } from "lucide-react";

import type { ExpenseReport } from "../reports.types";

interface ExpenseCategoryChartProps {
  report: ExpenseReport;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ExpenseCategoryChart({
  report,
}: ExpenseCategoryChartProps) {
  const maxAmount = Math.max(
    ...report.repartitionParCategorie.map((item) => item.montant),
    0,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3">
            <ChartNoAxesColumnIncreasing
              size={21}
              className="text-amber-700"
            />
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">
              Répartition des dépenses
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Montants par catégorie de dépenses validées
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
          <Wallet size={14} />
          Analyse des charges
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {report.repartitionParCategorie.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-2xl bg-gray-100 p-4">
              <Wallet size={26} className="text-gray-400" />
            </div>

            <p className="text-sm font-semibold text-gray-700">
              Aucune dépense disponible
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
              Aucune dépense validée sur cette période.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {report.repartitionParCategorie.map((item) => {
              const percentage =
                report.montantTotal > 0
                  ? (item.montant / report.montantTotal) * 100
                  : 0;

              const barWidth =
                maxAmount > 0
                  ? (item.montant / maxAmount) * 100
                  : 0;

              return (
                <div key={item.categorie}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.categorie}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {percentage.toFixed(1)} % du total
                      </p>
                    </div>

                    <span className="shrink-0 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(item.montant)}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-800 to-green-500 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total des dépenses
            </p>

            <p className="mt-1 text-lg font-extrabold text-gray-900">
              {formatCurrency(report.montantTotal)}
            </p>
          </div>

          <div className="rounded-xl bg-green-100 p-3">
            <Wallet size={22} className="text-green-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
