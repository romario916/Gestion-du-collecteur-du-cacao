
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  X,
  Save,
  Package,
  Wheat,
  Scale,
  UserRound,
  ShoppingCart,
  ClipboardList,
  CheckCircle2,
  Wallet,
} from "lucide-react";

import type { CreateTransformationInput } from "../processing.types";
import type { Batch } from "../../batches/batches.types";

import { getAvailableBatches } from "../processing.service";

interface TransformationFormProps {
  onClose: () => void;
  onSubmit: (data: CreateTransformationInput) => void;
}

const qualityLabels: Record<Batch["qualite"], string> = {
  PREMIERE_QUALITE: "1ère qualité",
  DEUXIEME_QUALITE: "2ème qualité",
  TROISIEME_QUALITE: "3ème qualité",
};

export default function TransformationForm({
  onClose,
  onSubmit,
}: TransformationFormProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, string>
  >({});
  const [observations, setObservations] = useState("");

  useEffect(() => {
    setBatches(getAvailableBatches());
  }, []);

  const selectedBatches = batches.filter(
    (batch) => selectedQuantities[batch.id] !== undefined,
  );

  const totalQuantity = selectedBatches.reduce(
    (total, batch) =>
      total + (Number(selectedQuantities[batch.id]) || 0),
    0,
  );

  function handleQuantityChange(
    batchId: string,
    value: string,
  ) {
    setSelectedQuantities((previous) => ({
      ...previous,
      [batchId]: value,
    }));
  }

  function handleToggleBatch(
    batchId: string,
    checked: boolean,
  ) {
    setSelectedQuantities((previous) => {
      const updated = { ...previous };

      if (checked) {
        updated[batchId] = "";
      } else {
        delete updated[batchId];
      }

      return updated;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedBatches.length === 0) {
      toast.error("Veuillez sélectionner au moins un lot.");
      return;
    }

    for (const batch of selectedBatches) {
      const quantity = Number(selectedQuantities[batch.id]);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        toast.error(
          `Veuillez saisir une quantité valide pour ${batch.numero}.`,
        );
        return;
      }

      if (quantity > batch.quantiteDisponibleKg) {
        toast.error(
          `La quantité dépasse le stock disponible du lot ${batch.numero}.`,
        );
        return;
      }
    }

    const data: CreateTransformationInput = {
      lots: selectedBatches.map((batch) => ({
        batchId: batch.id,
        quantiteUtiliseeKg: Number(selectedQuantities[batch.id]),
      })),
      observations,
    };

    onSubmit(data);
  }

  const inputClassName =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative overflow-hidden bg-[#103F26] px-6 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E5B54B]">
                <Wheat size={25} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E5B54B]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-100">
                    Production / Séchage
                  </p>
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  Nouvelle opération de séchage
                </h2>

                <p className="mt-1 text-sm text-green-100">
                  Regroupez plusieurs lots de cacao frais.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <X size={21} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-[#E5B54B]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-8">
          {/* Sélection des lots */}
          <section>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Package size={18} />
                  </div>

                  <h3 className="text-base font-bold text-gray-900">
                    Lots de cacao frais disponibles
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Sélectionnez les lots à inclure dans cette opération.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-800 ring-1 ring-green-200">
                <CheckCircle2 size={14} />
                {selectedBatches.length} sélectionné(s)
              </span>
            </div>

            {batches.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                  <Package size={27} className="text-amber-700" />
                </div>

                <p className="mt-3 text-sm font-bold text-amber-900">
                  Aucun lot disponible
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-amber-800">
                  Vous devez disposer de lots de cacao frais en stock avant
                  de créer une opération de séchage.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {batches.map((batch) => {
                  const isSelected =
                    selectedQuantities[batch.id] !== undefined;

                  return (
                    <div
                      key={batch.id}
                      className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "border-green-300 bg-green-50/40 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3 p-4 sm:p-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(event) =>
                            handleToggleBatch(
                              batch.id,
                              event.target.checked,
                            )
                          }
                          className="mt-1 h-4 w-4 shrink-0 accent-green-700"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <Package
                                  size={15}
                                  className="shrink-0 text-green-700"
                                />
                                {batch.numero}
                              </p>

                              <div className="mt-2 flex flex-col gap-1.5 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-4">
                                <span className="flex items-center gap-1.5">
                                  <UserRound size={13} />
                                  {batch.producerName}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <ShoppingCart size={13} />
                                  Achat {batch.purchaseNumber}
                                </span>
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-lg font-bold text-green-800">
                                {batch.quantiteDisponibleKg.toLocaleString(
                                  "fr-FR",
                                )}{" "}
                                <span className="text-xs font-semibold">
                                  kg
                                </span>
                              </p>

                              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {qualityLabels[batch.qualite]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>

                      {isSelected && (
                        <div className="border-t border-green-200 bg-white/70 px-4 py-4 sm:px-5">
                          <label
                            htmlFor={`quantity-${batch.id}`}
                            className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-700"
                          >
                            <Scale size={15} className="text-green-700" />
                            Quantité à sécher (kg)
                          </label>

                          <input
                            id={`quantity-${batch.id}`}
                            type="number"
                            min="0.01"
                            max={batch.quantiteDisponibleKg}
                            step="0.01"
                            required
                            value={selectedQuantities[batch.id]}
                            onChange={(event) =>
                              handleQuantityChange(
                                batch.id,
                                event.target.value,
                              )
                            }
                            placeholder="Ex. : 100"
                            className={inputClassName}
                          />

                          <p className="mt-2 text-xs text-gray-500">
                            Stock maximum disponible :{" "}
                            <span className="font-semibold text-green-700">
                              {batch.quantiteDisponibleKg.toLocaleString(
                                "fr-FR",
                              )}{" "}
                              kg
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Récapitulatif */}
          <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white sm:p-6">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[20px] border-white/5" />

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-green-100">
                  <Wallet size={17} />
                  <p className="text-sm font-semibold">
                    Quantité totale sélectionnée
                  </p>
                </div>

                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {totalQuantity.toLocaleString("fr-FR", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-lg font-semibold text-green-100">
                    kg
                  </span>
                </p>

                <p className="mt-2 text-xs text-green-100">
                  Total des quantités saisies pour les lots sélectionnés.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E5B54B]/15 text-[#E5B54B]">
                <Scale size={30} />
              </div>
            </div>

            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#E5B54B] transition-all"
                style={{
                  width: selectedBatches.length > 0 ? "100%" : "0%",
                }}
              />
            </div>
          </section>

          {/* Observations */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ClipboardList size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Observations
                </h3>
                <p className="text-xs text-gray-500">
                  Informations complémentaires sur le séchage.
                </p>
              </div>
            </div>

            <textarea
              id="observations"
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={3}
              placeholder="Ajoutez des informations complémentaires..."
              className={`${inputClassName} resize-none`}
            />
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={selectedBatches.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              Créer l'opération
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
