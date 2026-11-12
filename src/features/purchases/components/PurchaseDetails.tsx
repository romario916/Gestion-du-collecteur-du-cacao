
import {
  X,
  ShoppingCart,
  UserRound,
  CalendarDays,
  Scale,
  Wallet,
  FileText,
  Package,
  Clock,
  Hash,
} from "lucide-react";

import type {
  Purchase,
  CocoaQuality,
  PurchaseStatus,
} from "../purchases.types";

interface PurchaseDetailsProps {
  purchase: Purchase | null;
  onClose: () => void;
}

const qualityLabels: Record<CocoaQuality, string> = {
  PREMIERE_QUALITE: "Première qualité",
  DEUXIEME_QUALITE: "Deuxième qualité",
  TROISIEME_QUALITE: "Troisième qualité",
};

const statusLabels: Record<PurchaseStatus, string> = {
  EN_ATTENTE: "En attente",
  VALIDE: "Validé",
  ANNULE: "Annulé",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date invalide";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function PurchaseDetails({
  purchase,
  onClose,
}: PurchaseDetailsProps) {
  if (!purchase) {
    return null;
  }

  const statusStyle =
    purchase.statut === "VALIDE"
      ? "bg-green-100 text-green-800 ring-green-200"
      : purchase.statut === "ANNULE"
        ? "bg-red-100 text-red-800 ring-red-200"
        : "bg-amber-100 text-amber-800 ring-amber-200";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden bg-[#103F26] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                <ShoppingCart size={23} />
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-green-200">
                  Approvisionnement
                </p>

                <h2 className="text-xl font-extrabold sm:text-2xl">
                  Détails de l'achat
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-green-100">
                  <Hash size={14} />
                  <span>{purchase.numero}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="shrink-0 rounded-xl border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-400" />
        </div>

        {/* Contenu */}
        <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
          {/* Informations générales */}
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-gray-900">
                Informations générales
              </h3>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusStyle}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabels[purchase.statut]}
              </span>
            </div>

            <div className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2.5 text-green-700 shadow-sm">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Date de l'achat
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {formatDate(purchase.dateAchat)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2.5 text-blue-700 shadow-sm">
                  <Clock size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Date d'enregistrement
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(purchase.dateCreation))}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Producteur */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800">
                <UserRound size={19} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Informations du producteur
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Origine de l'approvisionnement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50/50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-800 text-white">
                <UserRound size={23} />
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-gray-900">
                  {purchase.producerName}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Identifiant : {purchase.producerId}
                </p>
              </div>
            </div>
          </section>

          {/* Transaction */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={19} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Détails de la transaction
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Quantité et prix du cacao acheté
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Scale size={17} className="text-green-700" />
                  <span className="text-xs font-medium">
                    Quantité achetée
                  </span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-gray-900">
                  {purchase.quantiteKg.toLocaleString("fr-FR")}{" "}
                  <span className="text-sm font-semibold text-gray-500">
                    kg
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Wallet size={17} className="text-blue-700" />
                  <span className="text-xs font-medium">
                    Prix par kilogramme
                  </span>
                </div>

                <p className="mt-3 text-xl font-extrabold text-gray-900">
                  {formatCurrency(purchase.prixKg)}
                </p>
              </div>
            </div>

            {/* Montant total */}
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white">
              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[20px] border-white/5" />

              <div className="relative">
                <div className="flex items-center gap-2 text-green-200">
                  <Wallet size={18} />
                  <p className="text-sm font-semibold">
                    Montant total de l'achat
                  </p>
                </div>

                <p className="mt-3 break-words text-2xl font-extrabold text-yellow-400 sm:text-3xl">
                  {formatCurrency(purchase.montantTotal)}
                </p>

                <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-green-100">
                  <span>
                    {purchase.quantiteKg.toLocaleString("fr-FR")} kg
                  </span>
                  <span>×</span>
                  <span>{formatCurrency(purchase.prixKg)} / kg</span>
                </div>
              </div>
            </div>
          </section>

          {/* Qualité */}
          <section>
            <h3 className="mb-3 font-bold text-gray-900">
              Qualité du cacao
            </h3>

            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <Package size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-blue-600">
                  Classification
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {qualityLabels[purchase.qualite]}
                </p>
              </div>
            </div>
          </section>

          {/* Observations */}
          {purchase.observations && (
            <section>
              <h3 className="mb-3 font-bold text-gray-900">
                Observations
              </h3>

              <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="shrink-0 rounded-xl bg-amber-100 p-2.5 text-amber-700">
                  <FileText size={18} />
                </div>

                <p className="text-sm leading-6 text-gray-700">
                  {purchase.observations}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Pied de fenêtre */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-900 sm:w-auto sm:min-w-32"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
