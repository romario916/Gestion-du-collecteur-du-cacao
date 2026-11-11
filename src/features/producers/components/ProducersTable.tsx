
import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  Power,
} from "lucide-react";

import type { Producer } from "../producers.types";

interface ProducersTableProps {
  producers: Producer[];
  onView: (producer: Producer) => void;
  onEdit: (producer: Producer) => void;
  onDelete: (producer: Producer) => void;
  onToggleStatus: (producer: Producer) => void;
}

export default function ProducersTable({
  producers,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProducersTableProps) {
  if (producers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-2xl bg-green-50 p-4 text-green-700">
          <Users size={30} />
        </div>

        <h3 className="font-semibold text-gray-900">
          Aucun producteur trouvé
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Les producteurs enregistrés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-4 font-semibold">Producteur</th>
            <th className="px-4 py-4 font-semibold">Contact</th>
            <th className="px-4 py-4 font-semibold">Localisation</th>
            <th className="px-4 py-4 font-semibold">Exploitation</th>
            <th className="px-4 py-4 font-semibold">Statut</th>
            <th className="px-4 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {producers.map((producer) => (
            <tr
              key={producer.id}
              className="transition hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <p className="font-semibold text-gray-900">
                  {producer.nom} {producer.prenom}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {producer.numero}
                </p>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="text-gray-400" />
                  {producer.telephone}
                </div>

                {producer.email && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={13} className="text-gray-400" />
                    {producer.email}
                  </div>
                )}
              </td>

              <td className="px-4 py-4">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p>{producer.commune}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {producer.region}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {producer.superficie} ha
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {producer.nombreParcelles} parcelle(s)
                </p>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    producer.actif
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {producer.actif ? "Actif" : "Inactif"}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onView(producer)}
                    aria-label={`Voir les détails de ${producer.nom}`}
                    title="Voir les détails"
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(producer)}
                    aria-label={
                      producer.actif
                        ? `Désactiver ${producer.nom}`
                        : `Réactiver ${producer.nom}`
                    }
                    title={
                      producer.actif
                        ? "Désactiver"
                        : "Réactiver"
                    }
                    className={`rounded-lg p-2 transition ${
                      producer.actif
                        ? "text-orange-600 hover:bg-orange-50"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <Power size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(producer)}
                    aria-label={`Modifier ${producer.nom}`}
                    className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(producer)}
                    aria-label={`Supprimer ${producer.nom}`}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
