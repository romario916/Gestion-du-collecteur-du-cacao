
import { useEffect, useState, type FormEvent } from "react";

import {
  X,
  Save,
  ShoppingCart,
  Package,
  Plus,
  Trash2,
  UserRound,
  CalendarDays,
  ClipboardList,
  Wallet,
  Scale,
  FileText,
  Info,
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
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`;
}

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100/70";

const labelClassName =
  "mb-2 block text-sm font-semibold text-gray-700";

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
      getCustomers().filter(
        (customer) => customer.statut === "ACTIF",
      ),
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

  const getUsedQuantity = (
    batchId: string,
    currentIndex: number,
  ) =>
    items.reduce((total, item, index) => {
      if (
        index === currentIndex ||
        item.dryBatchId !== batchId
      ) {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
        toast.error(
          "Le prix au kilogramme doit être supérieur à zéro.",
        );
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="my-5 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative overflow-hidden bg-[#103F26] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-yellow-400/20" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-200">
                <ShoppingCart size={15} />
                Gestion commerciale
              </div>

              <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">
                Nouvelle vente
              </h2>

              <p className="mt-1 text-sm text-green-100/80">
                Enregistrer une vente de cacao sec
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              aria-label="Fermer le formulaire"
              className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            >
              <X size={21} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-500" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-7 p-5 sm:p-7">
            {/* Informations générales */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Informations générales
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Client et date de la transaction
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClassName}>
                    Client <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={clientId}
                      onChange={(event) =>
                        setClientId(event.target.value)
                      }
                      required
                      className={`${inputClassName} pl-10`}
                    >
                      <option value="">
                        Sélectionner un client
                      </option>

                      {customers.map((customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.type === "ENTREPRISE"
                            ? customer.nomEntreprise
                            : `${customer.nom} ${customer.prenom}`}
                          {" — "}
                          {customer.numero}
                        </option>
                      ))}
                    </select>
                  </div>

                  {customers.length === 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                      <Info size={14} />
                      Aucun client actif disponible.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>
                    Date de vente{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      value={dateVente}
                      onChange={(event) =>
                        setDateVente(event.target.value)
                      }
                      required
                      className={`${inputClassName} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sélection des lots */}
            <section className="border-t border-gray-100 pt-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Package size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Lots de cacao sec
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Sélectionnez les lots et les quantités à vendre.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={dryBatches.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={17} />
                  Ajouter un lot
                </button>
              </div>

              {dryBatches.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-9 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                    <Package size={25} />
                  </div>

                  <p className="mt-3 text-sm font-bold text-gray-800">
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
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-green-200"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-800">
                            <Package size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              Article {index + 1}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Détail du lot vendu
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          title="Supprimer cet article"
                          aria-label={`Supprimer l'article ${index + 1}`}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-3">
                        <div className="md:col-span-3">
                          <label className={labelClassName}>
                            Lot de cacao sec{" "}
                            <span className="text-red-500">*</span>
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
                            className={inputClassName}
                          >
                            <option value="">
                              Sélectionner un lot
                            </option>

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
                          <label className={labelClassName}>
                            Quantité (kg){" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Scale
                              size={16}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

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
                              className={`${inputClassName} pl-10`}
                            />
                          </div>

                          {batch && (
                            <p className="mt-2 text-xs text-blue-700">
                              Disponible :{" "}
                              <strong>
                                {remainingQuantity.toLocaleString(
                                  "fr-FR",
                                )}{" "}
                                kg
                              </strong>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={labelClassName}>
                            Prix par kg (Ar){" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Wallet
                              size={16}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

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
                              className={`${inputClassName} pl-10`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClassName}>
                            Montant de l'article
                          </label>

                          <div className="flex min-h-[46px] items-center rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-extrabold text-green-800">
                            {formatCurrency(lineTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Observations */}
            <section className="border-t border-gray-100 pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <FileText size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Observations
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Informations complémentaires sur la vente
                  </p>
                </div>
              </div>

              <textarea
                value={observations}
                onChange={(event) =>
                  setObservations(event.target.value)
                }
                rows={3}
                placeholder="Informations complémentaires sur la vente..."
                className={`${inputClassName} resize-none`}
              />
            </section>

            {/* Récapitulatif */}
            <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white sm:p-6">
              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />

              <div className="relative">
                <div className="mb-5 flex items-center gap-2">
                  <Wallet size={19} className="text-yellow-400" />
                  <h3 className="font-bold">
                    Récapitulatif de la vente
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-green-100/80">
                      Quantité totale
                    </p>

                    <p className="mt-2 text-2xl font-extrabold">
                      {totalQuantity.toLocaleString("fr-FR")} kg
                    </p>

                    <p className="mt-1 text-xs text-green-100/70">
                      {items.length} article(s)
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-medium text-green-100/80">
                      Montant total
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-yellow-400 sm:text-3xl">
                      {formatCurrency(totalAmount)}
                    </p>

                    <p className="mt-1 text-xs text-green-100/70">
                      Montant estimé de la transaction
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {loading ? "Enregistrement..." : "Enregistrer la vente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
