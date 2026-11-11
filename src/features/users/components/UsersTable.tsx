
import {
  Edit2,
  Trash2,
  UserRound,
} from "lucide-react";

import type { AppUser } from "../users.types";
import { ROLE_LABELS } from "../../auth/auth.service";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
          <UserRound size={28} className="text-green-700" />
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Aucun utilisateur
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Ajoutez votre premier utilisateur pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Utilisateur
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Rôle
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Date de création
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                      {user.nom.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      user.actif
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.actif ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                    {user.actif ? "Actif" : "Inactif"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.dateCreation).toLocaleDateString("fr-FR")}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      title="Modifier"
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      title="Supprimer"
                      className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50"
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

      <div className="border-t border-gray-100 px-6 py-4">
        <p className="text-xs text-gray-500">
          {users.length} utilisateur(s) affiché(s)
        </p>
      </div>
    </div>
  );
}
