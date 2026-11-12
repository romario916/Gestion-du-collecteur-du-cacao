
import { useEffect, useState } from "react";
import {
  X,
  Save,
  UserRound,
  Building2,
  MapPin,
  FileText,
  ClipboardList,
  User,
} from "lucide-react";
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

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100";

const labelClassName =
  "mb-1.5 block text-sm font-semibold text-gray-700";

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
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

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
        <span className={labelClassName}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          placeholder={`Saisir ${label.toLowerCase()}`}
          className={inputClassName}
        />
      </label>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-[#103F26] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />
          <div className="absolute -bottom-16 right-32 h-32 w-32 rounded-full bg-yellow-400/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-yellow-400">
                {customer ? (
                  <UserRound size={23} />
                ) : (
                  <User size={23} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  {customer ? "Modifier le client" : "Nouveau client"}
                </h2>

                <p className="mt-1 text-sm text-green-100">
                  {customer
                    ? "Actualisez les informations de ce client."
                    : "Enregistrez un nouveau client dans votre système."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-24 bg-[#E5B54B]" />
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto bg-gray-50/60 p-5 sm:p-7">
            {/* Type de client */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={UsersIcon}
                title="Type de client"
                description="Sélectionnez la catégorie du client à enregistrer."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      type: "PARTICULIER",
                    }))
                  }
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    form.type === "PARTICULIER"
                      ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      form.type === "PARTICULIER"
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Particulier</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Client individuel
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      type: "ENTREPRISE",
                    }))
                  }
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    form.type === "ENTREPRISE"
                      ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      form.type === "ENTREPRISE"
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Building2 size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Entreprise</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Société ou organisation
                    </p>
                  </div>
                </button>
              </div>
            </section>

            {/* Informations personnelles */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={form.type === "ENTREPRISE" ? Building2 : UserRound}
                title={
                  form.type === "PARTICULIER"
                    ? "Informations personnelles"
                    : "Informations de l'entreprise"
                }
                description="Coordonnées et identité du client."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {form.type === "PARTICULIER" ? (
                  <>
                    {renderInput("Nom", "nom", "text", true)}
                    {renderInput("Prénom", "prenom")}
                  </>
                ) : (
                  <div className="sm:col-span-2">
                    {renderInput(
                      "Nom de l'entreprise",
                      "nomEntreprise",
                      "text",
                      true,
                    )}
                  </div>
                )}

                {renderInput("Téléphone", "telephone", "tel", true)}
                {renderInput("Adresse e-mail", "email", "email")}
              </div>
            </section>

            {/* Localisation */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={MapPin}
                title="Localisation"
                description="Adresse et pays de résidence ou de l'entreprise."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  {renderInput("Adresse", "adresse")}
                </div>

                {renderInput("Ville", "ville")}
                {renderInput("Pays", "pays")}
              </div>
            </section>

            {/* Informations fiscales */}
            {form.type === "ENTREPRISE" && (
              <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <SectionHeader
                  icon={FileText}
                  title="Informations fiscales"
                  description="Informations administratives et fiscales de l'entreprise."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderInput("NIF", "nif")}
                  {renderInput("STAT", "stat")}
                </div>
              </section>
            )}

            {/* Observations */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={ClipboardList}
                title="Informations complémentaires"
                description="Ajoutez des remarques utiles sur ce client."
              />

              <label className="block">
                <span className={labelClassName}>Observations</span>

                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Observations concernant le client..."
                  className={`${inputClassName} resize-y`}
                />
              </label>
            </section>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103F26] focus:outline-none focus:ring-4 focus:ring-green-100"
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

function UsersIcon({ size = 19 }: { size?: number }) {
  return <Building2 size={size} />;
}
