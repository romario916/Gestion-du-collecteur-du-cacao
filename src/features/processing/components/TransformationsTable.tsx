
import {
  Play,
  CheckCircle2,
  Trash2,
  Package,
  Wheat,
  Users,
  Scale,
  TrendingUp,
  Layers3,
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
  EN_ATTENTE:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  EN_COURS:
    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  TERMINE:
    "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
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
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <Package size={30} className="text-green-700" />
        </div>

        <h3 className="mt-4 text-base font-bold text-gray-800">
          Aucune opération de séchage enregistrée
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Les opérations de séchage créées apparaîtront ici.
          Commencez par enregistrer une nouvelle opération.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="bg-[#103F26] text-white">
            <tr>
              <th className="px-5 py-4 font-semibold">
                Référence
              </th>

              <th className="px-5 py-4 font-semibold">
                Lots sources
              </th>

              <th className="px-5 py-4 font-semibold">
                Producteurs
              </th>

              <th className="px-5 py-4 font-semibold">
                Poids frais utilisé
              </th>

              <th className="px-5 py-4 font-semibold">
                Poids sec obtenu
              </th>

              <th className="px-5 py-4 font-semibold">
                Rendement
              </th>

              <th className="px-5 py-4 font-semibold">
                Statut
              </th>

              <th className="px-5 py-4 text-center font-semibold">
                Actions
              </th>
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
                  className="transition-colors duration-200 hover:bg-green-50/40"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <Wheat size={17} />
                      </div>

                      <span className="font-bold text-green-800">
                        {transformation.numero}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {transformation.lotsSources.map((source) => (
                        <span
                          key={source.batchId}
                          className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                        >
                          <Package size={12} className="text-green-700" />
                          {source.batchNumber}
                        </span>
                      ))}

                      <span className="mt-1 text-xs font-medium text-gray-400">
                        {transformation.lotsSources.length} lot(s)
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {producers.map((producer) => (
                        <span
                          key={producer}
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-700"
                        >
                          <Users
                            size={13}
                            className="shrink-0 text-gray-400"
                          />
                          {producer}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <Scale size={15} className="text-green-700" />
                      {formatQuantity(
                        transformation.quantiteTotaleUtiliseeKg,
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {transformation.quantiteObtenueKg === null ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className="font-semibold text-green-700">
                        {formatQuantity(
                          transformation.quantiteObtenueKg,
                        )}
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {transformation.rendement === null ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 font-bold text-blue-700">
                        <TrendingUp size={14} />
                        {transformation.rendement.toLocaleString(
                          "fr-FR",
                          { maximumFractionDigits: 2 },
                        )} %
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[transformation.statut]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusLabels[transformation.statut]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {transformation.statut === "EN_ATTENTE" && (
                        <button
                          type="button"
                          onClick={() => onStart(transformation)}
                          title="Démarrer le séchage"
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Play size={14} />
                          Démarrer
                        </button>
                      )}

                      {transformation.statut === "EN_COURS" && (
                        <button
                          type="button"
                          onClick={() => onFinish(transformation)}
                          title="Terminer le séchage"
                          className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
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
                        className="inline-flex items-center justify-center rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
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

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Layers3 size={14} />
          Historique des opérations
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
          {transformations.length} opération(s)
        </span>
      </div>
    </div>
  );
}
