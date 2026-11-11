
import {
  Play,
  CheckCircle2,
  Trash2,
  Package,
} from "lucide-react";

import type { Transformation } from "../processing.types";

interface TransformationsTableProps {
  transformations: Transformation[];
  onStart: (transformation: Transformation) => void;
  onFinish: (transformation: Transformation) => void;
  onDelete: (transformation: Transformation) => void;
}

const statusLabels: Record<Transformation["statut"], string> = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  TERMINE: "Terminée",
};

const statusStyles: Record<Transformation["statut"], string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  EN_COURS: "bg-blue-100 text-blue-700",
  TERMINE: "bg-green-100 text-green-700",
};

function formatQuantity(value: number): string {
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} kg`;
}

export default function TransformationsTable({
  transformations,
  onStart,
  onFinish,
  onDelete,
}: TransformationsTableProps) {
  if (transformations.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
        <Package size={36} className="mx-auto text-gray-300" />

        <h3 className="mt-3 text-base font-semibold text-gray-800">
          Aucune opération de séchage enregistrée
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Les opérations de séchage créées apparaîtront ici.
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
              <th className="px-5 py-4 font-semibold">Référence</th>
              <th className="px-5 py-4 font-semibold">Lots sources</th>
              <th className="px-5 py-4 font-semibold">Producteurs</th>
              <th className="px-5 py-4 font-semibold">Poids frais utilisé</th>
              <th className="px-5 py-4 font-semibold">Poids sec obtenu</th>
              <th className="px-5 py-4 font-semibold">Rendement</th>
              <th className="px-5 py-4 font-semibold">Statut</th>
              <th className="px-5 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transformations.map((transformation) => {
              const producers = [
                ...new Set(
                  transformation.lotsSources.map(
                    (source) => source.producerName,
                  ),
                ),
              ];

              return (
                <tr
                  key={transformation.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-800">
                    {transformation.numero}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {transformation.lotsSources.map((source) => (
                        <span
                          key={source.batchId}
                          className="whitespace-nowrap text-xs font-medium text-gray-700"
                        >
                          {source.batchNumber}
                        </span>
                      ))}

                      <span className="mt-1 text-xs text-gray-400">
                        {transformation.lotsSources.length} lot(s)
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {producers.map((producer) => (
                        <span
                          key={producer}
                          className="text-xs text-gray-700"
                        >
                          {producer}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                    {formatQuantity(
                      transformation.quantiteTotaleUtiliseeKg,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                    {transformation.quantiteObtenueKg === null
                      ? "—"
                      : formatQuantity(
                          transformation.quantiteObtenueKg,
                        )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                    {transformation.rendement === null
                      ? "—"
                      : `${transformation.rendement.toLocaleString(
                          "fr-FR",
                          { maximumFractionDigits: 2 },
                        )} %`}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transformation.statut]}`}
                    >
                      {statusLabels[transformation.statut]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {transformation.statut === "EN_ATTENTE" && (
                        <button
                          type="button"
                          onClick={() => onStart(transformation)}
                          title="Démarrer le séchage"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Play size={15} />
                          Démarrer
                        </button>
                      )}

                      {transformation.statut === "EN_COURS" && (
                        <button
                          type="button"
                          onClick={() => onFinish(transformation)}
                          title="Terminer le séchage"
                          className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                        >
                          <CheckCircle2 size={15} />
                          Terminer
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(transformation)}
                        title="Supprimer l'opération"
                        aria-label={`Supprimer ${transformation.numero}`}
                        className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
