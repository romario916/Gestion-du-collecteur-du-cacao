
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { X, Save, Package } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Nouvelle opération de séchage
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez les lots de cacao frais à regrouper.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Lots de cacao frais disponibles
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Cochez les lots à inclure dans cette opération.
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {selectedBatches.length} sélectionné(s)
              </span>
            </div>

            {batches.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
                <Package
                  size={32}
                  className="mx-auto text-amber-600"
                />
                <p className="mt-3 text-sm font-semibold text-amber-800">
                  Aucun lot disponible
                </p>
                <p className="mt-1 text-xs text-amber-700">
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
                      className={`rounded-xl border p-4 transition ${
                        isSelected
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(event) =>
                            handleToggleBatch(
                              batch.id,
                              event.target.checked,
                            )
                          }
                          className="mt-1 h-4 w-4 accent-green-700"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {batch.numero}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {batch.producerName} · Achat{" "}
                                {batch.purchaseNumber}
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-sm font-semibold text-green-800">
                                {batch.quantiteDisponibleKg.toLocaleString(
                                  "fr-FR",
                                )}{" "}
                                kg
                              </p>
                              <p className="text-xs text-gray-500">
                                {qualityLabels[batch.qualite]}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>

                      {isSelected && (
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <label
                            htmlFor={`quantity-${batch.id}`}
                            className="mb-2 block text-xs font-semibold text-gray-700"
                          >
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
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />

                          <p className="mt-1 text-xs text-gray-500">
                            Maximum disponible :{" "}
                            {batch.quantiteDisponibleKg.toLocaleString(
                              "fr-FR",
                            )}{" "}
                            kg
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm font-semibold text-green-900">
              Quantité totale de cacao frais sélectionnée
            </p>
            <p className="mt-2 text-2xl font-bold text-green-800">
              {totalQuantity.toLocaleString("fr-FR", {
                maximumFractionDigits: 2,
              })}{" "}
              kg
            </p>
            <p className="mt-1 text-xs text-green-700">
              Total des quantités saisies pour les lots sélectionnés.
            </p>
          </div>

          <div>
            <label
              htmlFor="observations"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Observations
            </label>

            <textarea
              id="observations"
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={3}
              placeholder="Informations complémentaires sur le séchage..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={selectedBatches.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
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
