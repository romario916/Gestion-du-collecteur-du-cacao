
import { useEffect, useState } from "react";
import {
  X,
  Save,
  Calculator,
  ShoppingCart,
  UserRound,
  CalendarDays,
  Package,
  ClipboardList,
  Wallet,
} from "lucide-react";
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

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-green-600 focus:ring-4 focus:ring-green-100";

const labelClassName =
  "mb-2 block text-sm font-semibold text-gray-700";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden bg-[#103F26] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-yellow-400/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-lg">
                <ShoppingCart size={23} />
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-green-200">
                  Approvisionnement
                </p>

                <h2 className="text-xl font-extrabold sm:text-2xl">
                  {purchase ? "Modifier l'achat" : "Nouvel achat de cacao"}
                </h2>

                <p className="mt-1 text-xs text-green-100 sm:text-sm">
                  Renseignez les informations de la transaction.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-400" />
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
            {/* Informations générales */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Informations générales
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Producteur et date de la transaction
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelClassName}>
                    Producteur <span className="text-red-500">*</span>
                  </span>

                  <select
                    name="producerId"
                    value={form.producerId}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  >
                    <option value="">Sélectionner un producteur</option>

                    {activeProducers.map((producer) => (
                      <option key={producer.id} value={producer.id}>
                        {producer.numero} — {producer.nom} {producer.prenom}
                      </option>
                    ))}
                  </select>

                  {activeProducers.length === 0 && (
                    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                      Aucun producteur actif disponible. Ajoutez ou réactivez
                      un producteur avant de créer un achat.
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className={labelClassName}>
                    Date d'achat <span className="text-red-500">*</span>
                  </span>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700"
                    />

                    <input
                      type="date"
                      name="dateAchat"
                      value={form.dateAchat}
                      onChange={handleChange}
                      required
                      className={`${inputClassName} pl-11`}
                    />
                  </div>
                </label>

                {purchase && (
                  <label className="block">
                    <span className={labelClassName}>Statut de l'achat</span>

                    <select
                      value={statut}
                      onChange={(event) =>
                        setStatut(
                          event.target.value as UpdatePurchaseInput["statut"],
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="EN_ATTENTE">En attente</option>
                      <option value="VALIDE">Validé</option>
                      <option value="ANNULE">Annulé</option>
                    </select>
                  </label>
                )}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Détails de l'achat */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Package size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Détails de l'achat
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Quantité, prix et qualité du cacao
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>
                    Quantité (kg) <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    name="quantiteKg"
                    value={form.quantiteKg}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                    className={inputClassName}
                    placeholder="Ex : 150"
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>
                    Prix par kilogramme (Ar){" "}
                    <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    name="prixKg"
                    value={form.prixKg}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className={inputClassName}
                    placeholder="Ex : 12000"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClassName}>
                    Qualité du cacao <span className="text-red-500">*</span>
                  </span>

                  <select
                    name="qualite"
                    value={form.qualite}
                    onChange={handleChange}
                    className={inputClassName}
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

            {/* Calcul du montant */}
            <section className="overflow-hidden rounded-2xl border border-green-200 bg-green-50">
              <div className="flex items-center gap-3 border-b border-green-100 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white">
                  <Calculator size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-green-950">
                    Calcul du montant total
                  </h3>
                  <p className="mt-0.5 text-xs text-green-700">
                    Calcul automatique de la transaction
                  </p>
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                  Montant à payer
                </p>

                <p className="mt-2 break-words text-2xl font-extrabold text-green-950 sm:text-3xl">
                  {formatCurrency(montantTotal)}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-green-800">
                  <span className="rounded-lg bg-white px-3 py-2 font-semibold">
                    {form.quantiteKg.toLocaleString("fr-FR")} kg
                  </span>

                  <span className="font-bold">×</span>

                  <span className="rounded-lg bg-white px-3 py-2 font-semibold">
                    {formatCurrency(form.prixKg)} / kg
                  </span>

                  <span className="ml-auto flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-2 font-bold text-yellow-900">
                    <Wallet size={14} />
                    MGA
                  </span>
                </div>
              </div>
            </section>

            {/* Observations */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Observations</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Informations complémentaires
                  </p>
                </div>
              </div>

              <label className="block">
                <span className={labelClassName}>
                  Notes sur cet achat
                </span>

                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informations complémentaires sur cet achat..."
                  className={`${inputClassName} resize-none`}
                />
              </label>
            </section>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={activeProducers.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {purchase
                ? "Enregistrer les modifications"
                : "Enregistrer l'achat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
