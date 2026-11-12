
import { useEffect, useState, type ReactNode } from "react";

import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Plus,
  ArrowUpRight,
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
      {/* En-tête */}
      <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-[#E5B54B]/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
              <ShieldCheck size={14} />
              Administration
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Gestion des utilisateurs
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100/75">
              Gérez les comptes, les accès et les rôles des membres
              de votre organisation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedUser(null);
              setIsFormOpen(true);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E5B54B] px-5 py-3 text-sm font-bold text-[#103F26] shadow-sm transition hover:bg-[#F0C766] active:scale-[0.98]"
          >
            <Plus size={18} />
            Ajouter un utilisateur
          </button>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs text-green-100/75">
          <span className="inline-flex items-center gap-2">
            <Users size={15} />
            {users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
          </span>

          <span className="inline-flex items-center gap-2">
            <UserCheck size={15} />
            {activeUsers} actif{activeUsers > 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total utilisateurs"
          value={users.length}
          icon={<Users size={21} />}
          color="text-blue-700"
          background="bg-blue-50"
          border="border-t-blue-500"
        />

        <StatCard
          title="Comptes actifs"
          value={activeUsers}
          icon={<UserCheck size={21} />}
          color="text-green-700"
          background="bg-green-50"
          border="border-t-green-600"
        />

        <StatCard
          title="Comptes inactifs"
          value={inactiveUsers}
          icon={<UserX size={21} />}
          color="text-red-700"
          background="bg-red-50"
          border="border-t-red-500"
        />
      </div>

      {/* Liste des utilisateurs */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:p-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <Users size={19} />
              </div>

              <h2 className="font-bold text-gray-900">
                Liste des utilisateurs
              </h2>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Consultez et gérez les comptes enregistrés dans cette application.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <UsersTable
            users={filteredUsers}
            onEdit={(target) => {
              setSelectedUser(target);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""} affiché{filteredUsers.length > 1 ? "s" : ""}
          </span>

          <span className="inline-flex items-center gap-1 font-medium text-green-700">
            Administration des accès
            <ArrowUpRight size={14} />
          </span>
        </div>
      </section>

      {/* Message informatif */}
      {users.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <p className="text-sm leading-6 text-amber-800">
            Aucun compte n'est encore enregistré dans le module.
            Les comptes de démonstration de connexion sont gérés
            séparément.
          </p>
        </div>
      )}

      {/* Formulaire */}
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
  background,
  border,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
}) {
  return (
    <div
      className={`group rounded-2xl border border-gray-200 border-t-[3px] ${border} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-500">{title}</p>

        <div
          className={`rounded-xl p-3 ${background} ${color} transition-transform duration-200 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
