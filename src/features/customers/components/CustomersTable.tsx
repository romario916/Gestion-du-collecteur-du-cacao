
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-2xl bg-green-50 p-4 text-green-700">
          <Users size={30} />
        </div>

        <h3 className="font-semibold text-gray-900">
          Aucun client trouvé
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Les clients enregistrés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-4 font-semibold">Client</th>
            <th className="px-4 py-4 font-semibold">Contact</th>
            <th className="px-4 py-4 font-semibold">Localisation</th>
            <th className="px-4 py-4 font-semibold">Type</th>
            <th className="px-4 py-4 font-semibold">Statut</th>
            <th className="px-4 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => {
            const customerName =
              customer.type === "ENTREPRISE"
                ? customer.nomEntreprise
                : `${customer.nom} ${customer.prenom}`.trim();

            return (
              <tr
                key={customer.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-900">
                    {customerName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {customer.numero}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    {customer.telephone}
                  </div>

                  {customer.email && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={13} className="text-gray-400" />
                      {customer.email}
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
                      <p>{customer.ville || "Non renseignée"}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {customer.pays}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {customer.type === "ENTREPRISE" ? (
                      <Building2 size={13} />
                    ) : (
                      <Users size={13} />
                    )}

                    {customer.type === "ENTREPRISE"
                      ? "Entreprise"
                      : "Particulier"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      customer.statut === "ACTIF"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {customer.statut === "ACTIF" ? "Actif" : "Inactif"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(customer)}
                      aria-label={`Voir les détails de ${customerName}`}
                      title="Voir les détails"
                      className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(customer)}
                      aria-label={
                        customer.statut === "ACTIF"
                          ? `Désactiver ${customerName}`
                          : `Réactiver ${customerName}`
                      }
                      title={
                        customer.statut === "ACTIF"
                          ? "Désactiver"
                          : "Réactiver"
                      }
                      className={`rounded-lg p-2 transition ${
                        customer.statut === "ACTIF"
                          ? "text-orange-600 hover:bg-orange-50"
                          : "text-green-700 hover:bg-green-50"
                      }`}
                    >
                      <Power size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      aria-label={`Modifier ${customerName}`}
                      className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      aria-label={`Supprimer ${customerName}`}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
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
