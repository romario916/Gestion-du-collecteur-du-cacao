
import {
  Eye,
  Pencil,
  Trash2,
  ShoppingCart,
  CalendarDays,
  UserRound,
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

export default function PurchasesTable({
  purchases,
  onView,
  onEdit,
  onDelete,
}: PurchasesTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-2xl bg-green-50 p-4 text-green-700">
          <ShoppingCart size={30} />
        </div>

        <h3 className="font-semibold text-gray-900">
          Aucun achat trouvé
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Les achats enregistrés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-4 font-semibold">Référence</th>
            <th className="px-4 py-4 font-semibold">Producteur</th>
            <th className="px-4 py-4 font-semibold">Date</th>
            <th className="px-4 py-4 font-semibold">Quantité</th>
            <th className="px-4 py-4 font-semibold">Prix / kg</th>
            <th className="px-4 py-4 font-semibold">Montant total</th>
            <th className="px-4 py-4 font-semibold">Qualité</th>
            <th className="px-4 py-4 font-semibold">Statut</th>
            <th className="px-4 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="transition hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <p className="font-semibold text-gray-900">
                  {purchase.numero}
                </p>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {purchase.producerName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {purchase.producerId}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CalendarDays size={15} className="text-gray-400" />
                  {formatDate(purchase.dateAchat)}
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {purchase.quantiteKg.toLocaleString("fr-FR")} kg
                </p>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm text-gray-700">
                  {formatCurrency(purchase.prixKg)}
                </p>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(purchase.montantTotal)}
                </p>
              </td>

              <td className="px-4 py-4">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {qualityLabels[purchase.qualite]}
                </span>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    purchase.statut === "VALIDE"
                      ? "bg-green-50 text-green-700"
                      : purchase.statut === "ANNULE"
                        ? "bg-red-50 text-red-700"
                        : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {statusLabels[purchase.statut]}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onView(purchase)}
                    aria-label={`Voir l'achat ${purchase.numero}`}
                    title="Voir les détails"
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(purchase)}
                    aria-label={`Modifier l'achat ${purchase.numero}`}
                    title="Modifier"
                    className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(purchase)}
                    aria-label={`Supprimer l'achat ${purchase.numero}`}
                    title="Supprimer"
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
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
