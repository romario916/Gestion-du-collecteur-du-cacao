
import { X, Receipt } from "lucide-react";

import type { Expense } from "../expenses.types";

import {
  EXPENSE_CATEGORIES,
  EXPENSE_STATUS_LABELS,
} from "../expenses.constants";

interface ExpenseDetailsProps {
  expense: Expense;
  onClose: () => void;
}

function formatAmount(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} Ar`;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const statusStyles: Record<Expense["statut"], string> = {
  EN_ATTENTE: "bg-amber-50 text-amber-700",
  VALIDEE: "bg-green-50 text-green-700",
  ANNULEE: "bg-red-50 text-red-700",
};

export default function ExpenseDetails({
  expense,
  onClose,
}: ExpenseDetailsProps) {
  const category = EXPENSE_CATEGORIES.find(
    (item) => item.value === expense.categorie,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
              <Receipt size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Détails de la dépense
              </h2>
              <p className="text-sm text-gray-500">
                {expense.numero}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Fermer"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Montant de la dépense
            </p>

            <p className="mt-2 text-3xl font-bold text-[#14532D]">
              {formatAmount(expense.montant)}
            </p>

            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[expense.statut]}`}
            >
              {EXPENSE_STATUS_LABELS[expense.statut]}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Libellé</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {expense.libelle}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Catégorie</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {category?.label ?? expense.categorie}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Date de la dépense</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {formatDate(expense.dateDepense)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Bénéficiaire</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {expense.beneficiaire || "Non renseigné"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400">Description</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {expense.description || "Aucune description."}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Observations</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {expense.observations || "Aucune observation."}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
              Date d'enregistrement
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(expense.dateCreation).toLocaleString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166534]"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
