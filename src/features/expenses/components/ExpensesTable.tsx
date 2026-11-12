
import {
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Receipt,
  CalendarDays,
  UserRound,
  Tag,
  Wallet,
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
  EN_ATTENTE:
    "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-200",
  VALIDEE:
    "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200",
  ANNULEE:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
};

function ActionButton({
  onClick,
  title,
  children,
  color,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow";
}) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
    green: "text-green-700 hover:bg-green-50 hover:text-green-800",
    red: "text-red-500 hover:bg-red-50 hover:text-red-700",
    yellow: "text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-lg p-2 transition duration-200 ${colors[color]}`}
    >
      {children}
    </button>
  );
}

export default function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
  onView,
  onValidate,
  onCancel,
}: ExpensesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b border-green-900/10 bg-[#F4F8F5]">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Référence
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Dépense
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Catégorie
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Date
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Montant
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#14532D]">
                Statut
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#14532D]">
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
                    className="group transition-colors duration-200 hover:bg-green-50/40"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-bold text-[#14532D]">
                        <Receipt size={14} />
                        {expense.numero}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition group-hover:bg-green-100 group-hover:text-green-700">
                          <Wallet size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-bold text-gray-800">
                            {expense.libelle}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                            <UserRound size={12} />
                            <span className="truncate">
                              {expense.beneficiaire || "Aucun bénéficiaire"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                        <Tag size={13} />
                        {category?.label ?? expense.categorie}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays size={15} className="text-gray-400" />
                        {formatDate(expense.dateDepense)}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-extrabold text-[#14532D]">
                        {formatAmount(expense.montant)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[expense.statut]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {EXPENSE_STATUS_LABELS[expense.statut]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          onClick={() => onView(expense)}
                          title="Voir les détails"
                          color="blue"
                        >
                          <Eye size={17} />
                        </ActionButton>

                        {expense.statut === "EN_ATTENTE" && (
                          <ActionButton
                            onClick={() => onValidate(expense)}
                            title="Valider la dépense"
                            color="green"
                          >
                            <CheckCircle size={17} />
                          </ActionButton>
                        )}

                        {expense.statut !== "ANNULEE" && (
                          <ActionButton
                            onClick={() => onCancel(expense)}
                            title="Annuler la dépense"
                            color="red"
                          >
                            <XCircle size={17} />
                          </ActionButton>
                        )}

                        <ActionButton
                          onClick={() => onEdit(expense)}
                          title="Modifier"
                          color="yellow"
                        >
                          <Pencil size={17} />
                        </ActionButton>

                        <ActionButton
                          onClick={() => onDelete(expense)}
                          title="Supprimer"
                          color="red"
                        >
                          <Trash2 size={17} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <Receipt size={26} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-gray-800">
                      Aucune dépense trouvée
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Les dépenses enregistrées apparaîtront ici.
                      Modifiez votre recherche ou ajoutez une dépense.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {expenses.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3">
          <p className="text-xs text-gray-500">
            Liste des dépenses enregistrées
          </p>

          <span className="text-xs font-semibold text-[#14532D]">
            {expenses.length} dépense(s)
          </span>
        </div>
      )}
    </div>
  );
}
