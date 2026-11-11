
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login({
        email,
        password,
      });

      if (!success) {
        setError("Adresse email ou mot de passe incorrect.");
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setError(
        "Une erreur est survenue pendant la connexion. Réessaie.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F4] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#14532D]">
            Cacao Sambirano
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous à votre espace de gestion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              placeholder="exemple@cacao.mg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-green-100"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#14532D] px-4 py-3 font-semibold text-white transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
