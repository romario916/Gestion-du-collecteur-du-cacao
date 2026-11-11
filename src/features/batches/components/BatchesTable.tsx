
import { Trash2 } from "lucide-react";

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
  EN_STOCK: "bg-green-100 text-green-700",
  EN_TRAITEMENT: "bg-blue-100 text-blue-700",
  TRAITE: "bg-purple-100 text-purple-700",
  BLOQUE: "bg-red-100 text-red-700",
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
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
        <h3 className="text-base font-semibold text-gray-800">
          Aucun lot enregistré
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Les lots créés à partir des achats validés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
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
            {batches.map((batch) => (
              <tr
                key={batch.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-800">
                  {batch.numero}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {batch.purchaseNumber}
                </td>

                <td className="px-5 py-4 font-medium text-gray-800">
                  {batch.producerName}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {new Date(batch.dateReception).toLocaleDateString("fr-FR")}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {batch.quantiteInitialeKg.toLocaleString("fr-FR")} kg
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                  {batch.quantiteDisponibleKg.toLocaleString("fr-FR")} kg
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {qualityLabels[batch.qualite]}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[batch.statut]}`}
                  >
                    {statusLabels[batch.statut]}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onDelete(batch)}
                    disabled={
                      batch.statut !== "EN_STOCK" &&
                      batch.statut !== "EN_TRAITEMENT"
                    }
                    title={
                      batch.statut === "EN_STOCK" ||
                      batch.statut === "EN_TRAITEMENT"
                        ? "Supprimer ce lot"
                        : "Ce lot ne peut pas être supprimé"
                    }
                    aria-label={`Supprimer le lot ${batch.numero}`}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
