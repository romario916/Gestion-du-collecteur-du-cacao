
import {
  X,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Sprout,
  CalendarDays,
  Map,
} from "lucide-react";

import type { Producer } from "../producers.types";

interface ProducerDetailsProps {
  producer: Producer;
  onClose: () => void;
}

export default function ProducerDetails({
  producer,
  onClose,
}: ProducerDetailsProps) {
  const dateInscription = new Date(producer.dateInscription);

  const formattedDate = Number.isNaN(dateInscription.getTime())
    ? "Non renseignée"
    : new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(dateInscription);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-green-700">
              Fiche producteur
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {producer.nom} {producer.prenom}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Référence : {producer.numero}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fiche"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={21} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Informations personnelles
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                producer.actif
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {producer.actif ? "Actif" : "Inactif"}
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <DetailItem
              icon={<UserRound size={17} />}
              label="Nom complet"
              value={`${producer.nom} ${producer.prenom}`}
            />

            <DetailItem
              icon={<Phone size={17} />}
              label="Téléphone"
              value={producer.telephone}
            />

            <DetailItem
              icon={<Mail size={17} />}
              label="Adresse e-mail"
              value={producer.email || "Non renseignée"}
            />

            <DetailItem
              icon={<CalendarDays size={17} />}
              label="Date d'inscription"
              value={formattedDate}
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="mb-4 font-semibold text-gray-900">
              Localisation
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={<MapPin size={17} />}
                label="Adresse"
                value={producer.adresse || "Non renseignée"}
              />

              <DetailItem
                icon={<MapPin size={17} />}
                label="Fokontany"
                value={producer.fokontany || "Non renseigné"}
              />

              <DetailItem
                icon={<Map size={17} />}
                label="Commune"
                value={producer.commune}
              />

              <DetailItem
                icon={<Map size={17} />}
                label="District"
                value={producer.district || "Non renseigné"}
              />

              <DetailItem
                icon={<Map size={17} />}
                label="Région"
                value={producer.region}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="mb-4 font-semibold text-gray-900">
              Exploitation agricole
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-green-50 p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Sprout size={19} />
                  <span className="text-sm font-medium">
                    Superficie totale
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {producer.superficie} ha
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Map size={19} />
                  <span className="text-sm font-medium">
                    Nombre de parcelles
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {producer.nombreParcelles}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
