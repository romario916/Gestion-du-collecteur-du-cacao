
import {
  Eye,
  Pencil,
  Trash2,
  ShoppingCart,
  CalendarDays,
  UserRound,
  Package,
} from "lucide-react";

import type {
  Purchase,
  CocoaQuality,
  PurchaseStatus,
} from "../purchases.types";

interface PurchasesTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
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
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusStyle(status: PurchaseStatus): string {
  switch (status) {
    case "VALIDE":
      return "bg-green-50 text-green-700 ring-1 ring-green-200";

    case "ANNULE":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";

    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }
}

export default function PurchasesTable({
  purchases,
  onView,
  onEdit,
  onDelete,
}: PurchasesTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 rounded-2xl bg-green-50 p-5 text-green-700">
          <ShoppingCart size={32} />
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Aucun achat trouvé
        </h3>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Les achats enregistrés apparaîtront ici. Vous pourrez les consulter,
          modifier ou supprimer depuis ce tableau.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1150px] text-left">
        <thead>
          <tr className="border-b border-green-900/10 bg-green-50/70 text-[11px] uppercase tracking-wider text-green-900">
            <th className="px-5 py-4 font-bold">Référence</th>
            <th className="px-5 py-4 font-bold">Producteur</th>
            <th className="px-5 py-4 font-bold">Date d'achat</th>
            <th className="px-5 py-4 font-bold">Quantité</th>
            <th className="px-5 py-4 font-bold">Prix / kg</th>
            <th className="px-5 py-4 font-bold">Montant total</th>
            <th className="px-5 py-4 font-bold">Qualité</th>
            <th className="px-5 py-4 font-bold">Statut</th>
            <th className="px-5 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="group transition-colors hover:bg-green-50/40"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                    <ShoppingCart size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {purchase.numero}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Référence achat
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <UserRound size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {purchase.producerName}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {purchase.producerId}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={15} className="shrink-0 text-gray-400" />
                  {formatDate(purchase.dateAchat)}
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-green-700" />
                  <span className="text-sm font-semibold text-gray-800">
                    {purchase.quantiteKg.toLocaleString("fr-FR")} kg
                  </span>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm text-gray-600">
                  {formatCurrency(purchase.prixKg)}
                </p>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-bold text-green-800">
                  {formatCurrency(purchase.montantTotal)}
                </p>
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  {qualityLabels[purchase.qualite]}
                </span>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    purchase.statut
                  )}`}
                >
                  {statusLabels[purchase.statut]}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView(purchase)}
                    aria-label={`Voir l'achat ${purchase.numero}`}
                    title="Voir les détails"
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-green-100 hover:text-green-800"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(purchase)}
                    aria-label={`Modifier l'achat ${purchase.numero}`}
                    title="Modifier"
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(purchase)}
                    aria-label={`Supprimer l'achat ${purchase.numero}`}
                    title="Supprimer"
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
