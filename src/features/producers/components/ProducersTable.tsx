
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-5 py-14 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
          <Users size={30} />
        </div>

        <h3 className="font-bold text-gray-900">
          Aucun producteur trouvé
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
          Les producteurs enregistrés apparaîtront ici. Vous pouvez
          également modifier votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full min-w-[1000px] text-left">
        <thead>
          <tr className="border-b border-green-100 bg-green-50/70 text-[11px] uppercase tracking-[0.12em] text-[#14532D]">
            <th className="px-5 py-4 font-bold">Producteur</th>
            <th className="px-5 py-4 font-bold">Contact</th>
            <th className="px-5 py-4 font-bold">Localisation</th>
            <th className="px-5 py-4 font-bold">Exploitation</th>
            <th className="px-5 py-4 font-bold">Statut</th>
            <th className="px-5 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {producers.map((producer) => (
            <tr
              key={producer.id}
              className="transition-colors duration-150 hover:bg-green-50/30"
            >
              {/* Producteur */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-sm font-bold text-white">
                    {producer.nom.charAt(0).toUpperCase()}
                    {producer.prenom.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {producer.nom} {producer.prenom}
                    </p>

                    <p className="mt-1 text-xs font-medium text-gray-400">
                      {producer.numero}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="shrink-0 text-[#14532D]" />
                  {producer.telephone}
                </div>

                {producer.email && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={13} className="shrink-0 text-gray-400" />
                    <span>{producer.email}</span>
                  </div>
                )}
              </td>

              {/* Localisation */}
              <td className="px-5 py-4">
                <div className="flex items-start gap-2">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-[#EAB308]"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {producer.commune}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {producer.region}
                    </p>
                  </div>
                </div>
              </td>

              {/* Exploitation */}
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-gray-800">
                  {producer.superficie} ha
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {producer.nombreParcelles} parcelle(s)
                </p>
              </td>

              {/* Statut */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    producer.actif
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      producer.actif ? "bg-green-600" : "bg-amber-500"
                    }`}
                  />
                  {producer.actif ? "Actif" : "Inactif"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView(producer)}
                    aria-label={`Voir les détails de ${producer.nom}`}
                    title="Voir les détails"
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-[#14532D] focus:outline-none focus:ring-2 focus:ring-green-100"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(producer)}
                    aria-label={
                      producer.actif
                        ? `Désactiver ${producer.nom}`
                        : `Réactiver ${producer.nom}`
                    }
                    title={producer.actif ? "Désactiver" : "Réactiver"}
                    className={`rounded-lg border p-2 transition focus:outline-none focus:ring-2 ${
                      producer.actif
                        ? "border-amber-200 text-amber-600 hover:bg-amber-50 focus:ring-amber-100"
                        : "border-green-200 text-green-700 hover:bg-green-50 focus:ring-green-100"
                    }`}
                  >
                    <Power size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(producer)}
                    aria-label={`Modifier ${producer.nom}`}
                    title="Modifier"
                    className="rounded-lg border border-blue-100 p-2 text-[#2563EB] transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(producer)}
                    aria-label={`Supprimer ${producer.nom}`}
                    title="Supprimer"
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <Trash2 size={16} />
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
