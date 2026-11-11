
import { useState, type FormEvent } from "react";
import { X, LockKeyhole } from "lucide-react";

import type {
  AppUser,
  CreateUserInput,
  UpdateUserInput,
} from "../users.types";

import type { UserRole } from "../../auth/auth.types";

interface UserFormProps {
  user: AppUser | null;
  onCreate: (data: CreateUserInput) => Promise<void>;
  onUpdate: (data: UpdateUserInput) => void;
  onResetPassword: (password: string) => Promise<void>;
  onClose: () => void;
}

const roles: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Administrateur" },
  {
    value: "RESPONSABLE_PRODUCTION",
    label: "Responsable production",
  },
  { value: "MAGASINIER", label: "Magasinier" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "COMPTABLE", label: "Comptable" },
];

export default function UserForm({
  user,
  onCreate,
  onUpdate,
  onResetPassword,
  onClose,
}: UserFormProps) {
  const isEditing = user !== null;

  const [nom, setNom] = useState(user?.nom ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole>(
    user?.role ?? "MAGASINIER",
  );
  const [actif, setActif] = useState(user?.actif ?? true);

  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!nom.trim() || !email.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (!isEditing && password.length < 10) {
      setError(
        "Le mot de passe doit contenir au moins 10 caractères.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        onUpdate({
          nom,
          email,
          role,
          actif,
        });
      } else {
        await onCreate({
          nom,
          email,
          role,
          password,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setSuccess("");

    if (resetPassword.length < 10) {
      setError(
        "Le nouveau mot de passe doit contenir au moins 10 caractères.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onResetPassword(resetPassword);

      setResetPassword("");
      setSuccess("Le mot de passe a été réinitialisé.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de réinitialiser le mot de passe.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEditing
                ? "Modifier l'utilisateur"
                : "Ajouter un utilisateur"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Modifiez les informations et les autorisations."
                : "Créez un nouveau compte utilisateur."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nom complet
            </label>

            <input
              type="text"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              placeholder="Ex : Jean Rakoto"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Adresse email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nom@cacao.mg"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {!isEditing && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 10 caractères"
                minLength={10}
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />

              <p className="mt-1 text-xs text-gray-500">
                Le mot de passe sera haché avant son enregistrement.
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Rôle utilisateur
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value as UserRole)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              {roles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {isEditing && (
            <>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={actif}
                  onChange={(event) => setActif(event.target.checked)}
                  className="h-4 w-4 accent-green-700"
                />

                <span>
                  <span className="block text-sm font-semibold text-gray-800">
                    Compte actif
                  </span>

                  <span className="text-xs text-gray-500">
                    Autoriser l'utilisation de ce compte.
                  </span>
                </span>
              </label>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <LockKeyhole size={18} className="text-amber-700" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Réinitialiser le mot de passe
                  </h3>
                </div>

                <p className="mb-3 text-xs leading-5 text-gray-600">
                  Définissez un nouveau mot de passe pour cet utilisateur.
                  Son ancien mot de passe ne fonctionnera plus lors d'une
                  prochaine connexion.
                </p>

                <input
                  type="password"
                  value={resetPassword}
                  onChange={(event) =>
                    setResetPassword(event.target.value)
                  }
                  placeholder="Nouveau mot de passe (10 caractères minimum)"
                  minLength={10}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isSubmitting || resetPassword.length < 10}
                  className="mt-3 w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Réinitialiser le mot de passe
                </button>
              </div>
            </>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
