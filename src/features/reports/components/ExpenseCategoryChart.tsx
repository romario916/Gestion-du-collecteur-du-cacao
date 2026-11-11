
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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">
          Répartition des dépenses
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Montants par catégorie de dépenses validées
        </p>
      </div>

      {report.repartitionParCategorie.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center text-center">
          <p className="text-sm text-gray-500">
            Aucune dépense validée sur cette période.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {item.categorie}
                  </span>

                  <span className="text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(item.montant)}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {percentage.toFixed(1)} % du total
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-600">
            Total des dépenses
          </span>

          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(report.montantTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
