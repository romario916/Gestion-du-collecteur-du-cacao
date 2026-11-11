
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import UsersTable from "../components/UsersTable";
import UserForm from "../components/UserForm";

import type {
  AppUser,
  CreateUserInput,
  UpdateUserInput,
} from "../users.types";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "../users.service";

import { useAuth } from "../../../context/AuthContext";

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  function refreshUsers() {
    setUsers(getUsers());
  }

  async function handleCreate(data: CreateUserInput) {
    await createUser(data);

    refreshUsers();
    setIsFormOpen(false);
    setSelectedUser(null);

    toast.success("Utilisateur créé avec succès.");
  }

  function handleUpdate(data: UpdateUserInput) {
    if (!selectedUser) return;

    if (selectedUser.id === currentUser?.id) {
      toast.error("Vous ne pouvez pas modifier votre propre compte ici.");
      return;
    }

    const activeAdmins = users.filter(
      (item) => item.role === "ADMIN" && item.actif,
    );

    const removingAdmin =
      selectedUser.role === "ADMIN" &&
      selectedUser.actif &&
      (data.role !== "ADMIN" || !data.actif);

    if (removingAdmin && activeAdmins.length <= 1) {
      toast.error(
        "Impossible de désactiver ou de rétrograder le dernier administrateur actif.",
      );
      return;
    }

    try {
      updateUser(selectedUser.id, data);

      refreshUsers();
      setSelectedUser(null);

      toast.success("Utilisateur modifié avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    }
  }

  async function handleResetPassword(password: string) {
    if (!selectedUser) {
      throw new Error("Aucun utilisateur sélectionné.");
    }

    if (selectedUser.id === currentUser?.id) {
      throw new Error(
        "Vous ne pouvez pas réinitialiser votre propre mot de passe ici.",
      );
    }

    await resetUserPassword(selectedUser.id, password);

    refreshUsers();

    toast.success(
      `Mot de passe réinitialisé pour ${selectedUser.nom}.`,
    );
  }

  function handleDelete(target: AppUser) {
    if (target.id === currentUser?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    const activeAdmins = users.filter(
      (item) => item.role === "ADMIN" && item.actif,
    );

    if (
      target.role === "ADMIN" &&
      target.actif &&
      activeAdmins.length <= 1
    ) {
      toast.error(
        "Impossible de supprimer le dernier administrateur actif.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le compte de ${target.nom} ?`,
    );

    if (!confirmed) return;

    try {
      deleteUser(target.id);
      refreshUsers();
      toast.success("Utilisateur supprimé.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    }
  }

  const filteredUsers = users.filter((item) => {
    const searchValue = search.toLowerCase();

    return (
      item.nom.toLowerCase().includes(searchValue) ||
      item.email.toLowerCase().includes(searchValue)
    );
  });

  const activeUsers = users.filter((item) => item.actif).length;
  const inactiveUsers = users.filter((item) => !item.actif).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            Gestion des utilisateurs
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Consultez et gérez les comptes et les rôles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total utilisateurs"
          value={users.length}
          icon={<Users size={21} />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Comptes actifs"
          value={activeUsers}
          icon={<UserCheck size={21} />}
          color="bg-green-50 text-green-700"
        />

        <StatCard
          title="Comptes inactifs"
          value={inactiveUsers}
          icon={<UserX size={21} />}
          color="bg-red-50 text-red-700"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Liste des utilisateurs
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Comptes enregistrés dans cette application.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <UsersTable
          users={filteredUsers}
          onEdit={(target) => {
            setSelectedUser(target);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {users.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <p className="text-sm text-amber-800">
            Aucun compte n'est encore enregistré dans le module.
            Les comptes de démonstration de connexion sont gérés
            séparément.
          </p>
        </div>
      )}

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onResetPassword={handleResetPassword}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
