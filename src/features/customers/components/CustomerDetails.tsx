
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CalendarDays,
  Hash,
  ShieldCheck,
} from "lucide-react";

import type { Customer } from "../customers.types";

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetails({
  customer,
  onClose,
}: CustomerDetailsProps) {
  const isCompany = customer.type === "ENTREPRISE";
  const isActive = customer.statut === "ACTIF";

  const customerName = isCompany
    ? customer.nomEntreprise
    : `${customer.nom} ${customer.prenom}`.trim();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-[#103F26] px-6 py-6 text-white">
          <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full border-[28px] border-white/5" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Détails du client
              </h2>

              <p className="mt-1 text-sm text-green-100">
                Fiche complète du client enregistré.
              </p>
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

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50/60 p-5 sm:p-6">
          {/* Profil client */}
          <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-green-50" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                  isCompany
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-700 text-white"
                }`}
              >
                {isCompany ? (
                  <Building2 size={29} />
                ) : (
                  <User size={29} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="break-words text-xl font-bold text-gray-900">
                  {customerName}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Hash size={14} />
                  <span>{customer.numero}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      isCompany
                        ? "bg-blue-50 text-blue-700 ring-blue-200"
                        : "bg-green-50 text-green-700 ring-green-200"
                    }`}
                  >
                    {isCompany ? (
                      <Building2 size={13} />
                    ) : (
                      <User size={13} />
                    )}

                    {isCompany ? "Entreprise" : "Particulier"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      isActive
                        ? "bg-green-50 text-green-700 ring-green-200"
                        : "bg-red-50 text-red-700 ring-red-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-green-600" : "bg-red-500"
                      }`}
                    />

                    {isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<User size={18} />}
              title="Informations générales"
              description="Identité et coordonnées du client."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {!isCompany && (
                <>
                  <DetailItem
                    label="Nom"
                    value={customer.nom}
                    icon={<User size={17} />}
                  />

                  <DetailItem
                    label="Prénom"
                    value={customer.prenom}
                    icon={<User size={17} />}
                  />
                </>
              )}

              {isCompany && (
                <DetailItem
                  label="Nom de l'entreprise"
                  value={customer.nomEntreprise}
                  icon={<Building2 size={17} />}
                />
              )}

              <DetailItem
                label="Téléphone"
                value={customer.telephone}
                icon={<Phone size={17} />}
              />

              <DetailItem
                label="Adresse e-mail"
                value={customer.email}
                icon={<Mail size={17} />}
              />
            </div>
          </section>

          {/* Localisation */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<MapPin size={18} />}
              title="Localisation"
              description="Adresse géographique du client."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Adresse"
                value={customer.adresse}
                icon={<MapPin size={17} />}
              />

              <DetailItem
                label="Ville"
                value={customer.ville}
                icon={<MapPin size={17} />}
              />

              <DetailItem
                label="Pays"
                value={customer.pays}
                icon={<MapPin size={17} />}
              />
            </div>
          </section>

          {/* Informations fiscales */}
          {isCompany && (
            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <SectionTitle
                icon={<ShieldCheck size={18} />}
                title="Informations fiscales"
                description="Identifiants administratifs de l'entreprise."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="NIF"
                  value={customer.nif}
                  icon={<FileText size={17} />}
                />

                <DetailItem
                  label="STAT"
                  value={customer.stat}
                  icon={<FileText size={17} />}
                />
              </div>
            </section>
          )}

          {/* Observations */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<FileText size={18} />}
              title="Informations complémentaires"
              description="Remarques et notes concernant le client."
            />

            <DetailItem
              label="Observations"
              value={customer.observations}
              icon={<FileText size={17} />}
            />
          </section>

          {/* Date de création */}
          <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Date de création
                </p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatDate(customer.dateCreation)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-gray-100 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103F26] focus:outline-none focus:ring-4 focus:ring-green-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionTitle({
  icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-green-100 hover:bg-green-50/30">
      {icon && (
        <div className="mt-0.5 shrink-0 text-green-700">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  );
}
