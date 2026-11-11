
import {
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import type { Expense } from "../expenses.types";

import {
  EXPENSE_CATEGORIES,
  EXPENSE_STATUS_LABELS,
} from "../expenses.constants";

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onView: (expense: Expense) => void;
  onValidate: (expense: Expense) => void;
  onCancel: (expense: Expense) => void;
}

function formatAmount(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} Ar`;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<Expense["statut"], string> = {
  EN_ATTENTE: "bg-amber-50 text-amber-700",
  VALIDEE: "bg-green-50 text-green-700",
  ANNULEE: "bg-red-50 text-red-700",
};

export default function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
  onView,
  onValidate,
  onCancel,
}: ExpensesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Référence
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Dépense
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Catégorie
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Montant
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Statut
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                const category = EXPENSE_CATEGORIES.find(
                  (item) => item.value === expense.categorie,
                );

                return (
                  <tr
                    key={expense.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#14532D]">
                      {expense.numero}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {expense.libelle}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {expense.beneficiaire || "Aucun bénéficiaire"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {category?.label ?? expense.categorie}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatDate(expense.dateDepense)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatAmount(expense.montant)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[expense.statut]}`}
                      >
                        {EXPENSE_STATUS_LABELS[expense.statut]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView(expense)}
                          title="Voir les détails"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        {expense.statut === "EN_ATTENTE" && (
                          <button
                            type="button"
                            onClick={() => onValidate(expense)}
                            title="Valider la dépense"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCircle size={17} />
                          </button>
                        )}

                        {expense.statut !== "ANNULEE" && (
                          <button
                            type="button"
                            onClick={() => onCancel(expense)}
                            title="Annuler la dépense"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEdit(expense)}
                          title="Modifier"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(expense)}
                          title="Supprimer"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  Aucune dépense enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
