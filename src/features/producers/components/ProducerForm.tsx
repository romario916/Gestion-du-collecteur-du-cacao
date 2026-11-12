
import { useEffect, useState } from "react";
import { X, Save, UserRound, MapPin, Wheat } from "lucide-react";
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
        <span className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          min={type === "number" ? 0 : undefined}
          step={name === "superficie" ? "0.01" : "1"}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#14532D] focus:bg-white focus:ring-4 focus:ring-green-50"
        />
      </label>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden bg-[#14532D] px-5 py-5 text-white sm:px-7">
          <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[18px] border-white/5" />
          <div className="absolute -bottom-16 right-28 h-32 w-32 rounded-full bg-[#EAB308]/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FACC15]">
                <UserRound size={24} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-100">
                    Gestion agricole
                  </p>
                </div>

                <h2 className="text-lg font-bold sm:text-xl">
                  {producer ? "Modifier le producteur" : "Nouveau producteur"}
                </h2>

                <p className="mt-1 text-xs text-green-100/80">
                  Renseignez les informations du producteur.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Fermer"
            >
              <X size={21} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-20 bg-[#EAB308]" />
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
            {/* Informations personnelles */}
            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Informations personnelles"
                description="Identité et coordonnées du producteur"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {renderInput("Nom", "nom", "text", true)}
                {renderInput("Prénom", "prenom", "text", true)}
                {renderInput("Téléphone", "telephone", "tel", true)}
                {renderInput("Adresse e-mail", "email", "email")}
                <div className="sm:col-span-2">
                  {renderInput("Adresse", "adresse")}
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Localisation */}
            <section>
              <SectionTitle
                icon={<MapPin size={18} />}
                title="Localisation"
                description="Situation géographique de l'exploitation"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {renderInput("Fokontany", "fokontany")}
                {renderInput("Commune", "commune", "text", true)}
                {renderInput("District", "district")}
                {renderInput("Région", "region", "text", true)}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Exploitation agricole */}
            <section>
              <SectionTitle
                icon={<Wheat size={18} />}
                title="Exploitation agricole"
                description="Informations sur les terres agricoles"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100"
            >
              <Save size={17} />
              {producer
                ? "Enregistrer les modifications"
                : "Créer le producteur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}
