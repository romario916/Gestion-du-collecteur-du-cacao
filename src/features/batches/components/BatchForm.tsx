
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  X,
  Save,
  ShoppingCart,
  UserRound,
  CalendarDays,
  Package,
  Scale,
  Award,
  ClipboardList,
  Wheat,
} from "lucide-react";

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

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#14532D] focus:ring-4 focus:ring-green-50";

const labelClassName =
  "mb-2 block text-sm font-semibold text-gray-700";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative overflow-hidden bg-[#103F26] px-5 py-6 sm:px-7">
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[20px] border-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E5B54B]">
                <Wheat size={25} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E5B54B]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200">
                    Gestion des stocks
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">
                  Créer un nouveau lot
                </h2>

                <p className="mt-1 text-sm text-green-100/70">
                  Enregistrement d'un lot de cacao frais.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-24 bg-[#E5B54B]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          {/* Sélection de l'achat */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#14532D]">
                <ShoppingCart size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Achat d'origine
                </h3>
                <p className="text-xs text-gray-400">
                  Sélectionnez un achat validé.
                </p>
              </div>
            </div>

            <label htmlFor="purchaseId" className={labelClassName}>
              Achat validé <span className="text-red-500">*</span>
            </label>

            <select
              id="purchaseId"
              value={purchaseId}
              onChange={(event) => setPurchaseId(event.target.value)}
              required
              className={inputClassName}
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
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <Package
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="text-xs leading-relaxed text-amber-700">
                  Aucun achat validé disponible pour créer un lot.
                </p>
              </div>
            )}
          </section>

          {/* Informations de l'achat */}
          {selectedPurchase && (
            <section className="overflow-hidden rounded-xl border border-green-100 bg-green-50/70">
              <div className="flex items-center gap-2 border-b border-green-100 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#14532D] shadow-sm">
                  <ClipboardList size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#14532D]">
                    Informations de l'achat
                  </h3>
                  <p className="text-xs text-green-700/70">
                    Détails de l'achat sélectionné
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <UserRound
                    size={17}
                    className="mt-0.5 shrink-0 text-green-700"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Producteur</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {selectedPurchase.producerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingCart
                    size={17}
                    className="mt-0.5 shrink-0 text-green-700"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Référence achat</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {selectedPurchase.numero}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Scale
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Quantité initiale</p>
                    <p className="mt-1 text-sm font-bold text-[#14532D]">
                      {selectedPurchase.quantiteKg.toLocaleString("fr-FR")} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award
                    size={17}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Qualité</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {qualityLabels[selectedPurchase.qualite]}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Date de réception */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CalendarDays size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Réception du lot
                </h3>
                <p className="text-xs text-gray-400">
                  Informations sur la réception physique.
                </p>
              </div>
            </div>

            <label htmlFor="dateReception" className={labelClassName}>
              Date de réception <span className="text-red-500">*</span>
            </label>

            <input
              id="dateReception"
              type="date"
              value={dateReception}
              onChange={(event) => setDateReception(event.target.value)}
              required
              className={inputClassName}
            />
          </section>

          {/* Observations */}
          <section>
            <label htmlFor="observations" className={labelClassName}>
              Observations
              <span className="ml-2 text-xs font-normal text-gray-400">
                (Facultatif)
              </span>
            </label>

            <textarea
              id="observations"
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={3}
              placeholder="Informations complémentaires sur la réception..."
              className={`${inputClassName} resize-none`}
            />
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={!selectedPurchase}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-[#103F26] disabled:cursor-not-allowed disabled:opacity-50"
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
