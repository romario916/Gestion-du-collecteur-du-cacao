
import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  Power,
  Building2,
  UserRound,
} from "lucide-react";

import type { Customer } from "../customers.types";

interface CustomersTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
}

export default function CustomersTable({
  customers,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
          <Users size={30} />
        </div>

        <h3 className="mt-4 font-bold text-gray-900">
          Aucun client trouvé
        </h3>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Les clients enregistrés apparaîtront ici. Essayez une autre recherche
          si nécessaire.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="bg-[#103F26] text-white">
          <tr>
            <th className="px-5 py-4 font-semibold">Client</th>
            <th className="px-5 py-4 font-semibold">Contact</th>
            <th className="px-5 py-4 font-semibold">Localisation</th>
            <th className="px-5 py-4 font-semibold">Type</th>
            <th className="px-5 py-4 font-semibold">Statut</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {customers.map((customer) => {
            const customerName =
              customer.type === "ENTREPRISE"
                ? customer.nomEntreprise
                : `${customer.nom} ${customer.prenom}`.trim();

            const isCompany = customer.type === "ENTREPRISE";
            const isActive = customer.statut === "ACTIF";

            return (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-green-50/40"
              >
                {/* Client */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCompany
                          ? "bg-amber-50 text-amber-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {isCompany ? (
                        <Building2 size={19} />
                      ) : (
                        <UserRound size={19} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">
                        {customerName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Réf. {customer.numero}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone size={14} className="shrink-0 text-green-700" />
                    {customer.telephone}
                  </div>

                  {customer.email && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={13} className="shrink-0 text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </td>

                {/* Localisation */}
                <td className="px-5 py-4">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="font-medium text-gray-700">
                        {customer.ville || "Non renseignée"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {customer.pays}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      isCompany
                        ? "bg-blue-50 text-blue-700 ring-blue-200"
                        : "bg-green-50 text-green-700 ring-green-200"
                    }`}
                  >
                    {isCompany ? (
                      <Building2 size={13} />
                    ) : (
                      <Users size={13} />
                    )}

                    {isCompany ? "Entreprise" : "Particulier"}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
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
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(customer)}
                      aria-label={`Voir les détails de ${customerName}`}
                      title="Voir les détails"
                      className="rounded-lg bg-gray-50 p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(customer)}
                      aria-label={
                        isActive
                          ? `Désactiver ${customerName}`
                          : `Réactiver ${customerName}`
                      }
                      title={isActive ? "Désactiver" : "Réactiver"}
                      className={`rounded-lg p-2.5 transition ${
                        isActive
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      <Power size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      aria-label={`Modifier ${customerName}`}
                      title="Modifier"
                      className="rounded-lg bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      aria-label={`Supprimer ${customerName}`}
                      title="Supprimer"
                      className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
