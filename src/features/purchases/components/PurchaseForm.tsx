
import { useEffect, useState } from "react";
import { X, Save, Calculator } from "lucide-react";
import { toast } from "sonner";

import type {
  Purchase,
  CreatePurchaseInput,
  UpdatePurchaseInput,
  CocoaQuality,
} from "../purchases.types";

import { getProducers } from "../../producers/producers.service";

interface PurchaseFormProps {
  purchase: Purchase | null;
  onCreate: (data: CreatePurchaseInput) => void;
  onUpdate: (data: UpdatePurchaseInput) => void;
  onClose: () => void;
}

const initialForm: CreatePurchaseInput = {
  producerId: "",
  dateAchat: new Date().toISOString().slice(0, 10),
  quantiteKg: 0,
  prixKg: 0,
  qualite: "PREMIERE_QUALITE",
  observations: "",
};

const qualityOptions: { value: CocoaQuality; label: string }[] = [
  {
    value: "PREMIERE_QUALITE",
    label: "Première qualité",
  },
  {
    value: "DEUXIEME_QUALITE",
    label: "Deuxième qualité",
  },
  {
    value: "TROISIEME_QUALITE",
    label: "Troisième qualité",
  },
];

export default function PurchaseForm({
  purchase,
  onCreate,
  onUpdate,
  onClose,
}: PurchaseFormProps) {
  const [form, setForm] = useState<CreatePurchaseInput>(initialForm);

  const [statut, setStatut] =
    useState<UpdatePurchaseInput["statut"]>("EN_ATTENTE");

  const activeProducers = getProducers().filter(
    (producer) => producer.actif,
  );

  const montantTotal = form.quantiteKg * form.prixKg;

  useEffect(() => {
    if (purchase) {
      setForm({
        producerId: purchase.producerId,
        dateAchat: purchase.dateAchat,
        quantiteKg: purchase.quantiteKg,
        prixKg: purchase.prixKg,
        qualite: purchase.qualite,
        observations: purchase.observations,
      });

      setStatut(purchase.statut);
    } else {
      setForm(initialForm);
      setStatut("EN_ATTENTE");
    }
  }, [purchase]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "quantiteKg" || name === "prixKg"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (purchase) {
        const updateData: UpdatePurchaseInput = {
          ...form,
          statut,
        };

        onUpdate(updateData);
      } else {
        onCreate(form);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {purchase ? "Modifier l'achat" : "Nouvel achat de cacao"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations de la transaction.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Informations générales
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Producteur
                </span>

                <select
                  name="producerId"
                  value={form.producerId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Sélectionner un producteur</option>

                  {activeProducers.map((producer) => (
                    <option key={producer.id} value={producer.id}>
                      {producer.numero} — {producer.nom} {producer.prenom}
                    </option>
                  ))}
                </select>

                {activeProducers.length === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    Aucun producteur actif disponible. Ajoutez ou réactivez
                    un producteur avant de créer un achat.
                  </p>
                )}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Date d'achat
                </span>

                <input
                  type="date"
                  name="dateAchat"
                  value={form.dateAchat}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              {purchase && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Statut
                  </span>

                  <select
                    value={statut}
                    onChange={(event) =>
                      setStatut(event.target.value as UpdatePurchaseInput["statut"])
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="VALIDE">Validé</option>
                    <option value="ANNULE">Annulé</option>
                  </select>
                </label>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Détails de l'achat
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Quantité (kg)
                </span>

                <input
                  type="number"
                  name="quantiteKg"
                  value={form.quantiteKg}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Prix par kilogramme (Ar)
                </span>

                <input
                  type="number"
                  name="prixKg"
                  value={form.prixKg}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Qualité du cacao
                </span>

                <select
                  name="qualite"
                  value={form.qualite}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  {qualityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <div className="flex items-center gap-2 text-green-800">
              <Calculator size={20} />
              <span className="text-sm font-semibold">
                Calcul du montant total
              </span>
            </div>

            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              {formatCurrency(montantTotal)}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              {form.quantiteKg} kg × {formatCurrency(form.prixKg)} / kg
            </p>
          </div>

          <section>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Observations
              </span>

              <textarea
                name="observations"
                value={form.observations}
                onChange={handleChange}
                rows={3}
                placeholder="Informations complémentaires sur cet achat..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </section>

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
              disabled={activeProducers.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {purchase ? "Enregistrer les modifications" : "Enregistrer l'achat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
