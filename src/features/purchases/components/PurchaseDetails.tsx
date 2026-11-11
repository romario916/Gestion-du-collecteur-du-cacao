
import {
  X,
  ShoppingCart,
  UserRound,
  CalendarDays,
  Scale,
  Wallet,
  FileText,
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
      ? "bg-green-50 text-green-700"
      : purchase.statut === "ANNULE"
        ? "bg-red-50 text-red-700"
        : "bg-orange-50 text-orange-700";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-green-700" />
              <h2 className="text-lg font-bold text-gray-900">
                Détails de l'achat
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Référence : {purchase.numero}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Informations générales
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
              >
                {statusLabels[purchase.statut]}
              </span>
            </div>

            <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Date de l'achat</p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <CalendarDays size={16} className="text-gray-400" />
                  {formatDate(purchase.dateAchat)}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Date d'enregistrement</p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(purchase.dateCreation))}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-gray-900">
              Informations du producteur
            </h3>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  <UserRound size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {purchase.producerName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Identifiant : {purchase.producerId}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-gray-900">
              Détails de la transaction
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Scale size={17} />
                  <span className="text-xs">Quantité achetée</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {purchase.quantiteKg.toLocaleString("fr-FR")} kg
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Wallet size={17} />
                  <span className="text-xs">Prix par kilogramme</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatCurrency(purchase.prixKg)}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-green-50 p-5">
              <p className="text-sm font-medium text-green-800">
                Montant total de l'achat
              </p>

              <p className="mt-2 text-2xl font-bold text-green-900">
                {formatCurrency(purchase.montantTotal)}
              </p>

              <p className="mt-2 text-xs text-green-700">
                {purchase.quantiteKg.toLocaleString("fr-FR")} kg ×{" "}
                {formatCurrency(purchase.prixKg)}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-gray-900">
              Qualité du cacao
            </h3>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-800">
                {qualityLabels[purchase.qualite]}
              </p>
            </div>
          </section>

          {purchase.observations && (
            <section>
              <h3 className="mb-3 font-semibold text-gray-900">
                Observations
              </h3>

              <div className="flex gap-3 rounded-xl border border-gray-100 p-4">
                <FileText
                  size={18}
                  className="mt-0.5 shrink-0 text-gray-400"
                />

                <p className="text-sm leading-6 text-gray-700">
                  {purchase.observations}
                </p>
              </div>
            </section>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
