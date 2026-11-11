
import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../customers.types";

interface CustomerFormProps {
  customer: Customer | null;
  onCreate: (data: CreateCustomerInput) => void;
  onUpdate: (data: UpdateCustomerInput) => void;
  onClose: () => void;
}

const initialForm: CreateCustomerInput = {
  type: "PARTICULIER",
  nom: "",
  prenom: "",
  nomEntreprise: "",
  telephone: "",
  email: "",
  adresse: "",
  ville: "",
  pays: "Madagascar",
  nif: "",
  stat: "",
  observations: "",
};

export default function CustomerForm({
  customer,
  onCreate,
  onUpdate,
  onClose,
}: CustomerFormProps) {
  const [form, setForm] = useState<CreateCustomerInput>(initialForm);

  useEffect(() => {
    if (customer) {
      const {
        type,
        nom,
        prenom,
        nomEntreprise,
        telephone,
        email,
        adresse,
        ville,
        pays,
        nif,
        stat,
        observations,
      } = customer;

      setForm({
        type,
        nom,
        prenom,
        nomEntreprise,
        telephone,
        email,
        adresse,
        ville,
        pays,
        nif,
        stat,
        observations,
      });
    } else {
      setForm(initialForm);
    }
  }, [customer]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (customer) {
        onUpdate(form);
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

  function renderInput(
    label: string,
    name: keyof CreateCustomerInput,
    type = "text",
    required = false,
  ) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </span>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </label>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {customer ? "Modifier le client" : "Nouveau client"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations du client.
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
              Type de client
            </h3>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="PARTICULIER">Particulier</option>
              <option value="ENTREPRISE">Entreprise</option>
            </select>
          </section>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              {form.type === "PARTICULIER"
                ? "Informations personnelles"
                : "Informations de l'entreprise"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {form.type === "PARTICULIER" ? (
                <>
                  {renderInput("Nom", "nom", "text", true)}
                  {renderInput("Prénom", "prenom")}
                </>
              ) : (
                renderInput(
                  "Nom de l'entreprise",
                  "nomEntreprise",
                  "text",
                  true,
                )
              )}

              {renderInput("Téléphone", "telephone", "tel", true)}
              {renderInput("Adresse e-mail", "email", "email")}
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Localisation
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput("Adresse", "adresse")}
              {renderInput("Ville", "ville")}
              {renderInput("Pays", "pays")}
            </div>
          </section>

          {form.type === "ENTREPRISE" && (
            <section>
              <h3 className="mb-4 font-semibold text-gray-900">
                Informations fiscales
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {renderInput("NIF", "nif")}
                {renderInput("STAT", "stat")}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Informations complémentaires
            </h3>

            <textarea
              name="observations"
              value={form.observations}
              onChange={handleChange}
              rows={3}
              placeholder="Observations concernant le client..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <Save size={17} />
              {customer ? "Enregistrer les modifications" : "Créer le client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
