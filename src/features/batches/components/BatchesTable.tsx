
import {
  Trash2,
  Package,
  ShoppingCart,
  UserRound,
  CalendarDays,
  Scale,
} from "lucide-react";

import type { Batch } from "../batches.types";

interface BatchesTableProps {
  batches: Batch[];
  onDelete: (batch: Batch) => void;
}

const statusLabels: Record<Batch["statut"], string> = {
  EN_STOCK: "En stock",
  EN_TRAITEMENT: "En traitement",
  TRAITE: "Traité",
  BLOQUE: "Bloqué",
};

const statusStyles: Record<Batch["statut"], string> = {
  EN_STOCK: "bg-green-50 text-green-700 ring-green-600/20",
  EN_TRAITEMENT: "bg-blue-50 text-blue-700 ring-blue-600/20",
  TRAITE: "bg-purple-50 text-purple-700 ring-purple-600/20",
  BLOQUE: "bg-red-50 text-red-700 ring-red-600/20",
};

const qualityLabels: Record<Batch["qualite"], string> = {
  PREMIERE_QUALITE: "1ère qualité",
  DEUXIEME_QUALITE: "2ème qualité",
  TROISIEME_QUALITE: "3ème qualité",
};

export default function BatchesTable({
  batches,
  onDelete,
}: BatchesTableProps) {
  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-14 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
          <Package size={30} />
        </div>

        <h3 className="text-base font-bold text-gray-800">
          Aucun lot enregistré
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
          Les lots créés à partir des achats validés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-[#103F26] text-xs uppercase tracking-wide text-white">
            <tr>
              <th className="px-5 py-4 font-semibold">N° Lot</th>
              <th className="px-5 py-4 font-semibold">Achat</th>
              <th className="px-5 py-4 font-semibold">Producteur</th>
              <th className="px-5 py-4 font-semibold">Réception</th>
              <th className="px-5 py-4 font-semibold">Quantité initiale</th>
              <th className="px-5 py-4 font-semibold">Disponible</th>
              <th className="px-5 py-4 font-semibold">Qualité</th>
              <th className="px-5 py-4 font-semibold">Statut</th>
              <th className="px-5 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {batches.map((batch) => {
              const canDelete =
                batch.statut === "EN_STOCK" ||
                batch.statut === "EN_TRAITEMENT";

              return (
                <tr
                  key={batch.id}
                  className="transition-colors duration-200 hover:bg-green-50/40"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#14532D]">
                        <Package size={17} />
                      </div>

                      <span className="font-bold text-[#14532D]">
                        {batch.numero}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ShoppingCart
                        size={15}
                        className="shrink-0 text-gray-400"
                      />
                      {batch.purchaseNumber}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-800">
                      <UserRound
                        size={15}
                        className="shrink-0 text-gray-400"
                      />
                      {batch.producerName}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />
                      {new Date(batch.dateReception).toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <Scale size={15} className="text-amber-500" />
                      {batch.quantiteInitialeKg.toLocaleString("fr-FR")} kg
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-bold text-[#14532D]">
                      {batch.quantiteDisponibleKg.toLocaleString("fr-FR")} kg
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                      {qualityLabels[batch.qualite]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[batch.statut]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusLabels[batch.statut]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onDelete(batch)}
                      disabled={!canDelete}
                      title={
                        canDelete
                          ? "Supprimer ce lot"
                          : "Ce lot ne peut pas être supprimé"
                      }
                      aria-label={`Supprimer le lot ${batch.numero}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
