
import { useEffect, useState } from "react";

import {
  Package,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  Sprout,
  Sun,
  Trash2,
  RotateCcw,
} from "lucide-react";

import {
  getStockSummary,
  getStockMovements,
  deleteStockMovement,
  resetTotalSorties,
} from "./inventory.service";

import type {
  StockSummary,
  StockMovement,
} from "./inventory.types";

import {
  getDryBatches,
  deleteDryBatch,
} from "../dry-stock/dry-stock.service";

import type { DryBatch } from "../dry-stock/dry-stock.types";

function formatQuantity(value: number): string {
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} kg`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date invalide";
  }

  return date.toLocaleDateString("fr-FR");
}

const movementConfig = {
  ENTREE: {
    label: "Entrée",
    icon: ArrowDownToLine,
    style: "bg-green-100 text-green-700",
  },
  SORTIE: {
    label: "Sortie",
    icon: ArrowUpFromLine,
    style: "bg-red-100 text-red-700",
  },
  PRODUCTION: {
    label: "Production",
    icon: Sprout,
    style: "bg-blue-100 text-blue-700",
  },
};

export default function InventoryPage() {
  const [summary, setSummary] = useState<StockSummary>({
    quantiteTotaleKg: 0,
    nombreLots: 0,
    nombreMouvements: 0,
    totalEntreesKg: 0,
    totalSortiesKg: 0,
    quantiteFraisKg: 0,
    quantiteSecKg: 0,
    nombreLotsFrais: 0,
    nombreLotsSecs: 0,
  });

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [dryBatches, setDryBatches] = useState<DryBatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function refreshInventory(): void {
    setSummary(getStockSummary());
    setMovements(getStockMovements());
    setDryBatches(getDryBatches());
  }

  useEffect(() => {
    refreshInventory();
  }, []);

  function handleResetTotalSorties(): void {
    const confirmed = window.confirm(
      "Voulez-vous vraiment remettre le Total des sorties à zéro ?\n\n" +
        "Les anciennes sorties ne seront plus comptabilisées dans ce total.\n" +
        "Les opérations de séchage, l'historique et les quantités réelles du stock seront conservés.",
    );

    if (!confirmed) {
      return;
    }

    try {
      resetTotalSorties();

      refreshInventory();

      setError(null);
      setSuccess(
        "Le Total des sorties a été remis à zéro. Les anciennes opérations sont conservées.",
      );
    } catch (err) {
      setSuccess(null);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de remettre le Total des sorties à zéro.",
      );
    }
  }

  function handleDeleteMovement(movement: StockMovement): void {
    const confirmed = window.confirm(
      `Voulez-vous supprimer le mouvement ${movement.numero} ?\n\n` +
        "Ce mouvement sera masqué de l'historique. " +
        "Les quantités réelles du stock ne seront pas modifiées.",
    );

    if (!confirmed) {
      return;
    }

    try {
      deleteStockMovement(movement.id);

      refreshInventory();

      setError(null);
      setSuccess(
        `Le mouvement ${movement.numero} a été supprimé de l'historique.`,
      );
    } catch (err) {
      setSuccess(null);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la suppression.",
      );
    }
  }

  function handleDeleteDryBatch(batch: DryBatch): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer définitivement le lot ${batch.numero} ?\n\n` +
        `Quantité initiale : ${formatQuantity(batch.quantiteInitialeKg)}\n` +
        `Quantité disponible : ${formatQuantity(batch.quantiteDisponibleKg)}\n` +
        `Quantité déjà utilisée : ${formatQuantity(
          batch.quantiteInitialeKg - batch.quantiteDisponibleKg,
        )}\n\n` +
        "Cette action est irréversible. Le lot sera retiré du stock disponible. " +
        "Les ventes déjà enregistrées seront conservées et les quantités utilisées ne seront pas restaurées.",
    );

    if (!confirmed) {
      return;
    }

    try {
      deleteDryBatch(batch.id);

      refreshInventory();

      setError(null);
      setSuccess(
        `Le lot ${batch.numero} a été définitivement supprimé du stock sec.`,
      );
    } catch (err) {
      setSuccess(null);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la suppression du lot sec.",
      );
    }
  }

  const stats = [
    {
      label: "Stock frais disponible",
      value: formatQuantity(summary.quantiteFraisKg),
      description: `${summary.nombreLotsFrais} lot(s) frais`,
      icon: Sprout,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Stock sec disponible",
      value: formatQuantity(summary.quantiteSecKg),
      description: `${summary.nombreLotsSecs} lot(s) secs`,
      icon: Sun,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Stock total disponible",
      value: formatQuantity(summary.quantiteTotaleKg),
      description: `${summary.nombreLots} lot(s) au total`,
      icon: Warehouse,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total des sorties",
      value: formatQuantity(summary.totalSortiesKg),
      description: "Cacao frais utilisé pour le séchage",
      icon: ArrowUpFromLine,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des stocks
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Suivi séparé du cacao frais, du cacao sec et des mouvements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSorties = stat.label === "Total des sorties";

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {stat.description}
              </p>

              {isSorties && (
                <button
                  type="button"
                  onClick={handleResetTotalSorties}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                  <RotateCcw size={14} />
                  Vider le total
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lots de cacao sec */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Lots de cacao sec
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {dryBatches.length} lot(s) sec(s) enregistré(s)
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
            <Sun size={18} />
            Cacao séché
          </div>
        </div>

        {dryBatches.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package size={36} className="mx-auto text-gray-300" />

            <h3 className="mt-3 font-semibold text-gray-800">
              Aucun lot sec enregistré
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Les lots secs produits après le séchage apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Référence</th>
                  <th className="px-5 py-4 font-semibold">
                    Opération de séchage
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Date de production
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Quantité initiale
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Quantité disponible
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {dryBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                      {batch.numero}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {batch.dryingNumber}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(batch.dateProduction)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatQuantity(batch.quantiteInitialeKg)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-amber-700">
                      {formatQuantity(batch.quantiteDisponibleKg)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteDryBatch(batch)}
                        title="Supprimer définitivement ce lot sec"
                        aria-label={`Supprimer le lot ${batch.numero}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          La suppression définitive est possible même si le lot a déjà été
          utilisé. Les ventes existantes sont conservées et les quantités
          utilisées ne sont pas restaurées.
        </div>
      </div>

      {/* Historique des mouvements */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Historique des mouvements
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {summary.nombreMouvements} mouvement(s) enregistré(s)
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity size={17} />
            Suivi du stock
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mx-5 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <div className="mx-5 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          La suppression d'un mouvement masque uniquement son historique.
          Pour retirer réellement un lot sec du stock, utilisez la section
          « Lots de cacao sec » ci-dessus.
        </div>

        {movements.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package size={36} className="mx-auto text-gray-300" />

            <h3 className="mt-3 font-semibold text-gray-800">
              Aucun mouvement enregistré
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Les entrées, sorties et productions apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Référence</th>
                  <th className="px-5 py-4 font-semibold">Mouvement</th>
                  <th className="px-5 py-4 font-semibold">Catégorie</th>
                  <th className="px-5 py-4 font-semibold">Lot</th>
                  <th className="px-5 py-4 font-semibold">Quantité</th>
                  <th className="px-5 py-4 font-semibold">Motif</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {movements.map((movement) => {
                  const config = movementConfig[movement.type];
                  const Icon = config.icon;

                  return (
                    <tr
                      key={movement.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                        {movement.numero}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.style}`}
                        >
                          <Icon size={13} />
                          {config.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movement.categorie === "FRAIS"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {movement.categorie === "FRAIS"
                            ? "Cacao frais"
                            : "Cacao sec"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                        {movement.batchNumber}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                        {formatQuantity(movement.quantiteKg)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {movement.motif}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(movement.dateMouvement)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteMovement(movement)}
                          title="Masquer ce mouvement de l'historique"
                          aria-label={`Masquer le mouvement ${movement.numero}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
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
        )}
      </div>
    </div>
  );
}
