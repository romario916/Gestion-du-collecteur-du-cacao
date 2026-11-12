
import { useEffect, useState } from "react";

import {
  Package,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpFromLine as OutgoingIcon,
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
    style: "bg-green-50 text-green-700 ring-1 ring-green-200",
  },
  SORTIE: {
    label: "Sortie",
    icon: ArrowUpFromLine,
    style: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
  PRODUCTION: {
    label: "Production",
    icon: Sprout,
    style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
};

const initialSummary: StockSummary = {
  quantiteTotaleKg: 0,
  nombreLots: 0,
  nombreMouvements: 0,
  totalEntreesKg: 0,
  totalSortiesKg: 0,
  quantiteFraisKg: 0,
  quantiteSecKg: 0,
  nombreLotsFrais: 0,
  nombreLotsSecs: 0,
};

export default function InventoryPage() {
  const [summary, setSummary] = useState<StockSummary>(initialSummary);
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
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
      accent: "bg-green-600",
    },
    {
      label: "Stock sec disponible",
      value: formatQuantity(summary.quantiteSecKg),
      description: `${summary.nombreLotsSecs} lot(s) secs`,
      icon: Sun,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      accent: "bg-amber-500",
    },
    {
      label: "Stock total disponible",
      value: formatQuantity(summary.quantiteTotaleKg),
      description: `${summary.nombreLots} lot(s) au total`,
      icon: Warehouse,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      accent: "bg-blue-600",
    },
    {
      label: "Total des sorties",
      value: formatQuantity(summary.totalSortiesKg),
      description: "Cacao frais utilisé pour le séchage",
      icon: ArrowUpFromLine,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-700",
      accent: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5B54B]" />
            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
              Gestion des stocks
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Inventaire général
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Suivi du cacao frais, du cacao sec et des mouvements de stock.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
          <Activity size={18} className="text-green-700" />
          <span className="text-sm font-semibold text-green-800">
            Suivi des stocks
          </span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSorties = stat.label === "Total des sorties";

          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              {isSorties && (
                <button
                  type="button"
                  onClick={handleResetTotalSorties}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
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
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Sun size={20} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Lots de cacao sec
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {dryBatches.length} lot(s) sec(s) enregistré(s)
                </p>
              </div>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            <Package size={14} />
            Stock après séchage
          </span>
        </div>

        {dryBatches.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
              <Package size={30} className="text-amber-600" />
            </div>

            <h3 className="mt-4 font-bold text-gray-800">
              Aucun lot sec enregistré
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Les lots secs produits après le séchage apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#103F26] text-white">
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
                    className="transition-colors hover:bg-amber-50/40"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          <Package size={16} />
                        </div>

                        <span className="font-bold text-gray-800">
                          {batch.numero}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-600">
                      {batch.dryingNumber}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(batch.dateProduction)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatQuantity(batch.quantiteInitialeKg)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-flex rounded-lg bg-green-50 px-3 py-1.5 font-bold text-green-700">
                        {formatQuantity(batch.quantiteDisponibleKg)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteDryBatch(batch)}
                        title="Supprimer définitivement ce lot sec"
                        aria-label={`Supprimer le lot ${batch.numero}`}
                        className="inline-flex items-center justify-center rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3 text-xs leading-5 text-gray-500 sm:px-6">
          La suppression définitive est possible même si le lot a déjà été
          utilisé. Les ventes existantes sont conservées et les quantités
          utilisées ne sont pas restaurées.
        </div>
      </section>

      {/* Historique des mouvements */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                Historique des mouvements
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {summary.nombreMouvements} mouvement(s) enregistré(s)
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            <Warehouse size={14} />
            Suivi du stock
          </span>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mx-5 mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 sm:mx-6"
          >
            {success}
          </div>
        )}

        <div className="mx-5 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 sm:mx-6">
          La suppression d'un mouvement masque uniquement son historique.
          Pour retirer réellement un lot sec du stock, utilisez la section
          « Lots de cacao sec » ci-dessus.
        </div>

        {movements.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Package size={30} className="text-blue-600" />
            </div>

            <h3 className="mt-4 font-bold text-gray-800">
              Aucun mouvement enregistré
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Les entrées, sorties et productions apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#103F26] text-white">
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
                      className="transition-colors hover:bg-green-50/40"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-green-800">
                        {movement.numero}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.style}`}
                        >
                          <Icon size={13} />
                          {config.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            movement.categorie === "FRAIS"
                              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                              : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
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

                      <td className="whitespace-nowrap px-5 py-4 font-bold text-gray-800">
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
                          className="inline-flex items-center justify-center rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3 sm:px-6">
          <span className="text-xs text-gray-500">
            Historique des mouvements de stock
          </span>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {movements.length} mouvement(s)
          </span>
        </div>
      </section>
    </div>
  );
}
