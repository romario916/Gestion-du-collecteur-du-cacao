
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface FinanceHistoryItem {
  id: string;
  numero: string;
  libelle: string;
  type: "RECETTE" | "DEPENSE";
  montant: number;
  date: string;
}

interface FinanceHistoryTableProps {
  items: FinanceHistoryItem[];
}

function formatAmount(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} Ar`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR");
}

export default function FinanceHistoryTable({
  items,
}: FinanceHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-lg font-bold text-gray-900">
          Historique financier
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Dernières recettes encaissées et dépenses validées
        </p>
      </div>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Référence
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Opération
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Montant
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const isRevenue = item.type === "RECETTE";

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                      {item.numero}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.libelle}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          isRevenue
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isRevenue ? (
                          <ArrowDownLeft size={13} />
                        ) : (
                          <ArrowUpRight size={13} />
                        )}

                        {isRevenue ? "Recette" : "Dépense"}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 text-right text-sm font-bold ${
                        isRevenue ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isRevenue ? "+" : "-"}
                      {formatAmount(item.montant)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-10 text-center text-sm text-gray-400">
          Aucune opération financière enregistrée.
        </div>
      )}
    </div>
  );
}
