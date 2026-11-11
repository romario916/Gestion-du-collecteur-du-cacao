
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CalendarDays,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Détails du client
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fiche complète du client enregistré.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-4 rounded-2xl bg-green-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white">
              {isCompany ? <Building2 size={28} /> : <User size={28} />}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {customerName}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {customer.numero}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700">
                  {isCompany ? "Entreprise" : "Particulier"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    customer.statut === "ACTIF"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.statut === "ACTIF" ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          </div>

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Informations générales
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
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

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Localisation
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
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

          {isCompany && (
            <section>
              <h3 className="mb-4 font-semibold text-gray-900">
                Informations fiscales
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="NIF" value={customer.nif} />

                <DetailItem label="STAT" value={customer.stat} />
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 font-semibold text-gray-900">
              Informations complémentaires
            </h3>

            <DetailItem
              label="Observations"
              value={customer.observations}
              icon={<FileText size={17} />}
            />
          </section>

          <div className="border-t border-gray-100 pt-4">
            <DetailItem
              label="Date de création"
              value={formatDate(customer.dateCreation)}
              icon={<CalendarDays size={17} />}
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Fermer
            </button>
          </div>
        </div>
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
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
      {icon && (
        <div className="mt-0.5 text-gray-400">
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
