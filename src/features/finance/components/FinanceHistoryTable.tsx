
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  CalendarDays,
  Wallet,
  ArrowDownToLine,
} from "lucide-react";

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
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FinanceHistoryTable({
  items,
}: FinanceHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Receipt size={19} />
            </span>

            <h2 className="text-lg font-extrabold text-gray-900">
              Historique financier
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Dernières recettes encaissées et dépenses validées.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-800">
          <ArrowDownToLine size={15} />
          {items.length} opération{items.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Tableau */}
      {items.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#103F26]">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-green-100">
                    Référence
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-green-100">
                    Opération
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-green-100">
                    Date
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-green-100">
                    Type
                  </th>

                  <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-green-100">
                    Montant
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const isRevenue = item.type === "RECETTE";

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-green-50/40"
                    >
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-700">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <Receipt size={15} />
                          </span>

                          {item.numero}
                        </span>
                      </td>

                      <td className="max-w-[240px] px-5 py-4">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {item.libelle}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          {formatDate(item.date)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            isRevenue
                              ? "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200"
                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
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
                        className={`px-5 py-4 text-right text-sm font-extrabold tabular-nums ${
                          isRevenue ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        <span className="inline-flex items-center justify-end gap-1">
                          {isRevenue ? "+" : "-"}
                          {formatAmount(item.montant)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3">
            <span className="text-xs font-medium text-gray-500">
              Opérations récentes
            </span>

            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-800">
              <Wallet size={14} />
              Historique financier
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <Receipt size={28} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-gray-700">
            Aucun historique disponible
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
            Les recettes encaissées et les dépenses validées apparaîtront ici
            après les premières opérations.
          </p>
        </div>
      )}
    </div>
  );
}
