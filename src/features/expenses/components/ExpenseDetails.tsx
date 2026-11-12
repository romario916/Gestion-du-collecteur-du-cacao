
import {
  X,
  Receipt,
  Wallet,
  CalendarDays,
  UserRound,
  Tag,
  FileText,
  ClipboardList,
  Clock,
  Hash,
  Info,
} from "lucide-react";

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
  EN_ATTENTE:
    "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-200",
  VALIDEE:
    "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200",
  ANNULEE:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
};

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon size={17} className="text-green-700" />
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
    </div>
  );
}

export default function ExpenseDetails({
  expense,
  onClose,
}: ExpenseDetailsProps) {
  const category = EXPENSE_CATEGORIES.find(
    (item) => item.value === expense.categorie,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative overflow-hidden bg-[#103F26] px-5 py-6 sm:px-6">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-yellow-400">
                <Receipt size={24} />
              </div>

              <div>
                <p className="text-xs font-semibold text-green-100">
                  Gestion financière
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-white">
                  Détails de la dépense
                </h2>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-green-100/75">
                  <Hash size={12} />
                  {expense.numero}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title="Fermer"
              aria-label="Fermer les détails"
              className="rounded-xl border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="max-h-[calc(92vh-150px)] space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Montant */}
          <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-green-100">
                <Wallet size={17} className="text-yellow-400" />
                Montant de la dépense
              </div>

              <p className="mt-3 break-words text-3xl font-extrabold tracking-tight text-yellow-400">
                {formatAmount(expense.montant)}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[expense.statut]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {EXPENSE_STATUS_LABELS[expense.statut]}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
                  <Tag size={13} />
                  {category?.label ?? expense.categorie}
                </span>
              </div>
            </div>
          </section>

          {/* Informations générales */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <SectionTitle
              icon={Receipt}
              title="Informations générales"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem
                icon={FileText}
                label="Libellé"
                value={expense.libelle}
              />

              <DetailItem
                icon={Tag}
                label="Catégorie"
                value={category?.label ?? expense.categorie}
              />

              <DetailItem
                icon={CalendarDays}
                label="Date de la dépense"
                value={formatDate(expense.dateDepense)}
              />

              <DetailItem
                icon={UserRound}
                label="Bénéficiaire"
                value={expense.beneficiaire || "Non renseigné"}
              />
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
            <SectionTitle
              icon={FileText}
              title="Description"
            />

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {expense.description || "Aucune description."}
            </p>
          </section>

          {/* Observations */}
          <section className="rounded-2xl border border-yellow-100 bg-yellow-50/40 p-5">
            <SectionTitle
              icon={ClipboardList}
              title="Observations"
            />

            <div className="flex items-start gap-2">
              <Info size={16} className="mt-1 shrink-0 text-yellow-700" />

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {expense.observations || "Aucune observation."}
              </p>
            </div>
          </section>

          {/* Date de création */}
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                <Clock size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400">
                  Date d'enregistrement
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {new Date(expense.dateCreation).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Pied de fenêtre */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50/70 p-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.98]"
          >
            <X size={16} />
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
