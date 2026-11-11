
import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

import type {
  Producer,
  CreateProducerInput,
  UpdateProducerInput,
} from "../producers.types";

interface ProducerFormProps {
  producer: Producer | null;
  onCreate: (data: CreateProducerInput) => void;
  onUpdate: (data: UpdateProducerInput) => void;
  onClose: () => void;
}

const initialForm: CreateProducerInput = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  adresse: "",
  fokontany: "",
  commune: "",
  district: "",
  region: "",
  superficie: 0,
  nombreParcelles: 0,
};

export default function ProducerForm({
  producer,
  onCreate,
  onUpdate,
  onClose,
}: ProducerFormProps) {
  const [form, setForm] = useState<CreateProducerInput>(initialForm);

  useEffect(() => {
    if (producer) {
      const {
        nom,
        prenom,
        telephone,
        email,
        adresse,
        fokontany,
        commune,
        district,
        region,
        superficie,
        nombreParcelles,
      } = producer;

      setForm({
        nom,
        prenom,
        telephone,
        email,
        adresse,
        fokontany,
        commune,
        district,
        region,
        superficie,
        nombreParcelles,
      });
    } else {
      setForm(initialForm);
    }
  }, [producer]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "superficie" || name === "nombreParcelles"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (producer) {
        const updateData: UpdateProducerInput = {
          ...form,
          actif: producer.actif,
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

  function renderInput(
    label: string,
    name: keyof CreateProducerInput,
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
          min={type === "number" ? 0 : undefined}
          step={name === "superficie" ? "0.01" : "1"}
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
              {producer ? "Modifier le producteur" : "Nouveau producteur"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations du producteur.
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
              Informations personnelles
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput("Nom", "nom", "text", true)}
              {renderInput("Prénom", "prenom", "text", true)}
              {renderInput("Téléphone", "telephone", "tel", true)}
              {renderInput("Adresse e-mail", "email", "email")}
              {renderInput("Adresse", "adresse")}
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Localisation
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput("Fokontany", "fokontany")}
              {renderInput("Commune", "commune", "text", true)}
              {renderInput("District", "district")}
              {renderInput("Région", "region", "text", true)}
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Exploitation agricole
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput(
                "Superficie (hectares)",
                "superficie",
                "number",
              )}

              {renderInput(
                "Nombre de parcelles",
                "nombreParcelles",
                "number",
              )}
            </div>
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
              {producer ? "Enregistrer les modifications" : "Créer le producteur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
