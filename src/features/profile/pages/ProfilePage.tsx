
import { useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { changeOwnPassword } from "../../users/users.service";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  RESPONSABLE_PRODUCTION: "Responsable de production",
  MAGASINIER: "Magasinier",
  COMMERCIAL: "Commercial",
  COMPTABLE: "Comptable",
};

export default function ProfilePage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Utilisateur non connecté.");
      return;
    }

    if (newPassword.length < 10) {
      setErrorMessage(
        "Le nouveau mot de passe doit contenir au moins 10 caractères.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "La confirmation du nouveau mot de passe ne correspond pas.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await changeOwnPassword(
        user.id,
        currentPassword,
        newPassword,
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        "Votre mot de passe a été modifié avec succès.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez vos informations personnelles et gérez votre mot de passe.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <UserRound size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Informations du compte
            </h2>
            <p className="text-sm text-gray-500">
              Vos informations de connexion
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Nom complet
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <UserRound size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">
                {user?.nom ?? "Non disponible"}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Adresse e-mail
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <Mail size={18} className="text-gray-400" />
              <span className="break-all text-sm font-medium text-gray-800">
                {user?.email ?? "Non disponible"}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Rôle
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <ShieldCheck size={18} className="text-green-700" />
              <span className="text-sm font-medium text-gray-800">
                {user
                  ? ROLE_LABELS[user.role] ?? user.role
                  : "Non disponible"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <LockKeyhole size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Changer mon mot de passe
            </h2>
            <p className="text-sm text-gray-500">
              Vérifiez votre mot de passe actuel avant de le remplacer.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form
          onSubmit={handleChangePassword}
          className="mt-6 max-w-xl space-y-5"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mot de passe actuel
            </label>

            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
                autoComplete="current-password"
                className={inputClassName}
                placeholder="Saisissez votre mot de passe actuel"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Afficher ou masquer le mot de passe actuel"
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nouveau mot de passe
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                required
                minLength={10}
                autoComplete="new-password"
                className={inputClassName}
                placeholder="Minimum 10 caractères"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Afficher ou masquer le nouveau mot de passe"
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirmer le nouveau mot de passe
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
                autoComplete="new-password"
                className={inputClassName}
                placeholder="Répétez le nouveau mot de passe"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Afficher ou masquer la confirmation"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
            Votre nouveau mot de passe doit contenir au moins 10 caractères.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Modification en cours..."
              : "Modifier mon mot de passe"}
          </button>
        </form>
      </section>
    </div>
  );
}
