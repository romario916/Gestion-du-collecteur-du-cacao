
import { useState } from "react";
import { Save, X } from "lucide-react";

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

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<CreateExpenseInput>(() => {
    if (!initialData) {
      return initialForm;
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Catégorie *</label>

        <select
          value={form.categorie}
          onChange={(event) =>
            handleChange(
              "categorie",
              event.target.value as CreateExpenseInput["categorie"],
            )
          }
          className={inputClass}
        >
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Libellé de la dépense *</label>

        <input
          type="text"
          required
          value={form.libelle}
          onChange={(event) => handleChange("libelle", event.target.value)}
          placeholder="Ex : Transport des sacs de cacao"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Montant (Ar) *</label>

        <input
          type="number"
          required
          min="1"
          value={form.montant || ""}
          onChange={(event) =>
            handleChange("montant", Number(event.target.value))
          }
          placeholder="Ex : 150000"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Date de la dépense *</label>

        <input
          type="date"
          required
          value={form.dateDepense}
          onChange={(event) =>
            handleChange("dateDepense", event.target.value)
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Bénéficiaire</label>

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

      <div>
        <label className={labelClass}>Description</label>

        <textarea
          rows={3}
          value={form.description}
          onChange={(event) =>
            handleChange("description", event.target.value)
          }
          placeholder="Détails concernant cette dépense..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Observations</label>

        <textarea
          rows={2}
          value={form.observations}
          onChange={(event) =>
            handleChange("observations", event.target.value)
          }
          placeholder="Informations complémentaires..."
          className={inputClass}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <X size={17} />
          Annuler
        </button>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
        >
          <Save size={17} />
          {initialData ? "Enregistrer les modifications" : "Enregistrer la dépense"}
        </button>
      </div>
    </form>
  );
}
