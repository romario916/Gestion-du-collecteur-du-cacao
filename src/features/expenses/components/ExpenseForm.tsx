
import { useState, type FormEvent } from "react";

import {
  Save,
  X,
  Receipt,
  Tag,
  Wallet,
  CalendarDays,
  UserRound,
  FileText,
  ClipboardList,
  Info,
} from "lucide-react";

import type {
  Expense,
  CreateExpenseInput,
} from "../expenses.types";

import { EXPENSE_CATEGORIES } from "../expenses.constants";

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (input: CreateExpenseInput) => void;
  onCancel: () => void;
}

const initialForm: CreateExpenseInput = {
  categorie: "TRANSPORT",
  libelle: "",
  description: "",
  montant: 0,
  dateDepense: new Date().toISOString().slice(0, 10),
  beneficiaire: "",
  observations: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-50";

const labelClass =
  "text-sm font-semibold text-gray-700";

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<CreateExpenseInput>(() => {
    if (!initialData) {
      return { ...initialForm };
    }

    return {
      categorie: initialData.categorie,
      libelle: initialData.libelle,
      description: initialData.description,
      montant: initialData.montant,
      dateDepense: initialData.dateDepense,
      beneficiaire: initialData.beneficiaire,
      observations: initialData.observations,
    };
  });

  function handleChange(
    field: keyof CreateExpenseInput,
    value: string | number,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.libelle.trim() || form.montant <= 0) {
      return;
    }

    onSubmit({
      ...form,
      libelle: form.libelle.trim(),
      description: form.description.trim(),
      beneficiaire: form.beneficiaire.trim(),
      observations: form.observations.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Informations principales */}
      <section className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <SectionHeader
          icon={Receipt}
          title="Informations principales"
          description="Identification et classification de la dépense."
        />

        <div className="space-y-5">
          <div>
            <label className={labelClass}>
              Catégorie *
            </label>

            <div className="relative">
              <Tag
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
              />

              <select
                value={form.categorie}
                onChange={(event) =>
                  handleChange(
                    "categorie",
                    event.target.value as CreateExpenseInput["categorie"],
                  )
                }
                className={`${inputClass} pl-10`}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Libellé de la dépense *
            </label>

            <input
              type="text"
              required
              value={form.libelle}
              onChange={(event) =>
                handleChange("libelle", event.target.value)
              }
              placeholder="Ex : Transport des sacs de cacao"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Montant (Ar) *
              </label>

              <div className="relative">
                <Wallet
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
                />

                <input
                  type="number"
                  required
                  min="1"
                  value={form.montant || ""}
                  onChange={(event) =>
                    handleChange("montant", Number(event.target.value))
                  }
                  placeholder="Ex : 150000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Date de la dépense *
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
                />

                <input
                  type="date"
                  required
                  value={form.dateDepense}
                  onChange={(event) =>
                    handleChange("dateDepense", event.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bénéficiaire */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5">
        <SectionHeader
          icon={UserRound}
          title="Bénéficiaire"
          description="Personne ou organisme ayant reçu le paiement."
        />

        <div>
          <label className={labelClass}>
            Nom du bénéficiaire
          </label>

          <input
            type="text"
            value={form.beneficiaire}
            onChange={(event) =>
              handleChange("beneficiaire", event.target.value)
            }
            placeholder="Nom du fournisseur ou bénéficiaire"
            className={inputClass}
          />
        </div>
      </section>

      {/* Description */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5">
        <SectionHeader
          icon={FileText}
          title="Description"
          description="Ajoutez des détails pour mieux identifier cette dépense."
        />

        <div>
          <label className={labelClass}>
            Description détaillée
          </label>

          <textarea
            rows={3}
            value={form.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            placeholder="Détails concernant cette dépense..."
            className={`${inputClass} resize-y`}
          />
        </div>
      </section>

      {/* Observations */}
      <section className="rounded-2xl border border-yellow-100 bg-yellow-50/50 p-5">
        <SectionHeader
          icon={ClipboardList}
          title="Observations"
          description="Informations complémentaires facultatives."
        />

        <textarea
          rows={2}
          value={form.observations}
          onChange={(event) =>
            handleChange("observations", event.target.value)
          }
          placeholder="Informations complémentaires..."
          className={`${inputClass} border-yellow-100 focus:border-yellow-500 focus:ring-yellow-50`}
        />

        <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-yellow-800">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            Les observations permettent de conserver des informations
            utiles pour le suivi administratif.
          </p>
        </div>
      </section>

      {/* Récapitulatif */}
      <section className="overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-green-100">
          <Wallet size={18} className="text-yellow-400" />
          Récapitulatif de la dépense
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 border-t border-white/15 pt-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs text-green-100/70">
              Montant total
            </p>

            <p className="mt-1 text-2xl font-extrabold tracking-tight text-yellow-400">
              {Math.round(form.montant || 0).toLocaleString("fr-FR")} Ar
            </p>
          </div>

          <span className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
            {EXPENSE_CATEGORIES.find(
              (category) => category.value === form.categorie,
            )?.label ?? form.categorie}
          </span>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <X size={17} />
          Annuler
        </button>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.98]"
        >
          <Save size={17} />
          {initialData
            ? "Enregistrer les modifications"
            : "Enregistrer la dépense"}
        </button>
      </div>
    </form>
  );
}
