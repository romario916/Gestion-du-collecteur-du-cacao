
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Save } from "lucide-react";

import type { CreateBatchInput } from "../batches.types";
import type { Purchase } from "../../purchases/purchases.types";

import { getAvailablePurchases } from "../batches.service";

interface BatchFormProps {
  onClose: () => void;
  onSubmit: (data: CreateBatchInput) => void;
}

const qualityLabels: Record<Purchase["qualite"], string> = {
  PREMIERE_QUALITE: "1ère qualité",
  DEUXIEME_QUALITE: "2ème qualité",
  TROISIEME_QUALITE: "3ème qualité",
};

export default function BatchForm({
  onClose,
  onSubmit,
}: BatchFormProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseId, setPurchaseId] = useState("");
  const [dateReception, setDateReception] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [observations, setObservations] = useState("");

  useEffect(() => {
    setPurchases(getAvailablePurchases());
  }, []);

  const selectedPurchase = purchases.find(
    (purchase) => purchase.id === purchaseId,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!purchaseId) {
      toast.error("Veuillez sélectionner un achat.");
      return;
    }

    if (!dateReception) {
      toast.error("Veuillez renseigner la date de réception.");
      return;
    }

    onSubmit({
      purchaseId,
      dateReception,
      observations,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Créer un nouveau lot
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez un achat validé pour générer un lot.
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
            <label
              htmlFor="purchaseId"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Achat validé <span className="text-red-500">*</span>
            </label>

            <select
              id="purchaseId"
              value={purchaseId}
              onChange={(event) => setPurchaseId(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Sélectionner un achat</option>

              {purchases.map((purchase) => (
                <option key={purchase.id} value={purchase.id}>
                  {purchase.numero} — {purchase.producerName} —{" "}
                  {purchase.quantiteKg.toLocaleString("fr-FR")} kg
                </option>
              ))}
            </select>

            {purchases.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                Aucun achat validé disponible pour créer un lot.
              </p>
            )}
          </div>

          {selectedPurchase && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-5">
              <h3 className="mb-4 text-sm font-bold text-green-900">
                Informations de l'achat sélectionné
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Producteur</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedPurchase.producerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Référence achat</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedPurchase.numero}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Quantité initiale</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedPurchase.quantiteKg.toLocaleString("fr-FR")} kg
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Qualité</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {qualityLabels[selectedPurchase.qualite]}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="dateReception"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Date de réception <span className="text-red-500">*</span>
            </label>

            <input
              id="dateReception"
              type="date"
              value={dateReception}
              onChange={(event) => setDateReception(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
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
              placeholder="Informations complémentaires sur la réception..."
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
              disabled={!selectedPurchase}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              Créer le lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
