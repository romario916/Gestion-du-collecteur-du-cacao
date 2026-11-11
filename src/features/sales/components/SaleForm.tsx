
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  ShoppingCart,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import type { Customer } from "../../customers/customers.types";
import type { DryBatch } from "../../dry-stock/dry-stock.types";
import type {
  CreateSaleInput,
  CreateSaleItemInput,
} from "../sales.types";

import { getCustomers } from "../../customers/customers.service";
import { getAvailableDryBatches } from "../../dry-stock/dry-stock.service";
import { createSale } from "../sales.service";

interface SaleFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

interface SaleItemForm {
  dryBatchId: string;
  quantiteKg: string;
  prixKg: string;
}

const emptyItem: SaleItemForm = {
  dryBatchId: "",
  quantiteKg: "",
  prixKg: "",
};

function formatCurrency(value: number): string {
  return `${value.toLocaleString("fr-FR")} Ar`;
}

export default function SaleForm({
  onCancel,
  onCreated,
}: SaleFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dryBatches, setDryBatches] = useState<DryBatch[]>([]);

  const [clientId, setClientId] = useState("");
  const [dateVente, setDateVente] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [observations, setObservations] = useState("");

  const [items, setItems] = useState<SaleItemForm[]>([
    { ...emptyItem },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomers(
      getCustomers().filter((customer) => customer.statut === "ACTIF"),
    );

    setDryBatches(getAvailableDryBatches());
  }, []);

  const updateItem = (
    index: number,
    field: keyof SaleItemForm,
    value: string,
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [...current, { ...emptyItem }]);
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const getBatch = (batchId: string) =>
    dryBatches.find((batch) => batch.id === batchId);

  const getUsedQuantity = (batchId: string, currentIndex: number) =>
    items.reduce((total, item, index) => {
      if (index === currentIndex || item.dryBatchId !== batchId) {
        return total;
      }

      return total + (Number(item.quantiteKg) || 0);
    }, 0);

  const totalQuantity = items.reduce(
    (total, item) => total + (Number(item.quantiteKg) || 0),
    0,
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total +
      (Number(item.quantiteKg) || 0) *
        (Number(item.prixKg) || 0),
    0,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!clientId) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }

    if (!dateVente) {
      toast.error("Veuillez renseigner la date de vente.");
      return;
    }

    if (items.length === 0) {
      toast.error("Ajoutez au moins un lot à la vente.");
      return;
    }

    const articles: CreateSaleItemInput[] = [];

    for (const item of items) {
      const quantiteKg = Number(item.quantiteKg);
      const prixKg = Number(item.prixKg);

      if (!item.dryBatchId) {
        toast.error("Veuillez sélectionner un lot de cacao sec.");
        return;
      }

      if (!Number.isFinite(quantiteKg) || quantiteKg <= 0) {
        toast.error("La quantité doit être supérieure à zéro.");
        return;
      }

      if (!Number.isFinite(prixKg) || prixKg <= 0) {
        toast.error("Le prix au kilogramme doit être supérieur à zéro.");
        return;
      }

      const batch = getBatch(item.dryBatchId);

      if (!batch) {
        toast.error("Un lot sélectionné n'est plus disponible.");
        return;
      }

      const quantityUsedElsewhere = getUsedQuantity(
        item.dryBatchId,
        items.indexOf(item),
      );

      if (
        quantiteKg + quantityUsedElsewhere >
        batch.quantiteDisponibleKg
      ) {
        toast.error(
          `Quantité insuffisante pour le lot ${batch.numero}.`,
        );
        return;
      }

      articles.push({
        dryBatchId: item.dryBatchId,
        quantiteKg,
        prixKg,
      });
    }

    const input: CreateSaleInput = {
      clientId,
      dateVente,
      articles,
      observations: observations.trim(),
    };

    try {
      setLoading(true);

      createSale(input);

      toast.success("Vente enregistrée avec succès.");
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-6 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Nouvelle vente
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enregistrer une vente de cacao sec
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Client *
                </label>

                <select
                  value={clientId}
                  onChange={(event) => setClientId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
                >
                  <option value="">Sélectionner un client</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.type === "ENTREPRISE"
                        ? customer.nomEntreprise
                        : `${customer.nom} ${customer.prenom}`}
                      {" — "}
                      {customer.numero}
                    </option>
                  ))}
                </select>

                {customers.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    Aucun client actif disponible.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Date de vente *
                </label>

                <input
                  type="date"
                  value={dateVente}
                  onChange={(event) => setDateVente(event.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Lots de cacao sec
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Sélectionnez les lots et les quantités à vendre.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={dryBatches.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={16} />
                  Ajouter un lot
                </button>
              </div>

              {dryBatches.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                  <Package
                    size={30}
                    className="mx-auto mb-2 text-gray-400"
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    Aucun stock sec disponible
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Les lots disponibles apparaîtront ici.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {items.map((item, index) => {
                  const batch = getBatch(item.dryBatchId);

                  const remainingQuantity = batch
                    ? Math.max(
                        0,
                        batch.quantiteDisponibleKg -
                          getUsedQuantity(item.dryBatchId, index),
                      )
                    : 0;

                  const lineTotal =
                    (Number(item.quantiteKg) || 0) *
                    (Number(item.prixKg) || 0);

                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          Article {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Supprimer cet article"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-3">
                          <label className="mb-2 block text-xs font-semibold text-gray-600">
                            Lot de cacao sec *
                          </label>

                          <select
                            value={item.dryBatchId}
                            onChange={(event) => {
                              updateItem(
                                index,
                                "dryBatchId",
                                event.target.value,
                              );
                              updateItem(index, "quantiteKg", "");
                            }}
                            required
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600"
                          >
                            <option value="">Sélectionner un lot</option>

                            {dryBatches.map((dryBatch) => {
                              const used = getUsedQuantity(
                                dryBatch.id,
                                index,
                              );

                              const available =
                                dryBatch.quantiteDisponibleKg - used;

                              return (
                                <option
                                  key={dryBatch.id}
                                  value={dryBatch.id}
                                  disabled={
                                    available <= 0 &&
                                    item.dryBatchId !== dryBatch.id
                                  }
                                >
                                  {dryBatch.numero} — Disponible :{" "}
                                  {available.toLocaleString("fr-FR")} kg
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-gray-600">
                            Quantité (kg) *
                          </label>

                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            max={
                              batch
                                ? remainingQuantity
                                : undefined
                            }
                            value={item.quantiteKg}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "quantiteKg",
                                event.target.value,
                              )
                            }
                            required
                            placeholder="Ex : 50"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                          />

                          {batch && (
                            <p className="mt-1 text-xs text-gray-500">
                              Disponible :{" "}
                              {remainingQuantity.toLocaleString("fr-FR")} kg
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-gray-600">
                            Prix par kg (Ar) *
                          </label>

                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.prixKg}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "prixKg",
                                event.target.value,
                              )
                            }
                            required
                            placeholder="Ex : 25000"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-gray-600">
                            Montant
                          </label>

                          <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm font-bold text-green-700">
                            {formatCurrency(lineTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Observations
              </label>

              <textarea
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                rows={3}
                placeholder="Informations complémentaires sur la vente..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800">
                    Quantité totale
                  </p>
                  <p className="mt-1 text-lg font-bold text-green-900">
                    {totalQuantity.toLocaleString("fr-FR")} kg
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-green-800">
                    Montant total
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                customers.length === 0 ||
                dryBatches.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={17} />
              {loading ? "Enregistrement..." : "Enregistrer la vente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
