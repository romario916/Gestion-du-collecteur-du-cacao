
import { useParams, Link } from "react-router-dom";
import { Construction, ShieldAlert } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { canAccessModule } from "./auth/permissions";

const modules: Record<string, { title: string; description: string }> = {
  producers: {
    title: "Gestion des producteurs",
    description: "Gestion des producteurs et de leurs informations.",
  },
  purchases: {
    title: "Gestion des achats",
    description: "Suivi des achats et des approvisionnements en cacao.",
  },
  batches: {
    title: "Gestion des lots",
    description: "Identification et traçabilité des lots de cacao.",
  },
  processing: {
    title: "Transformation",
    description: "Suivi des processus de fermentation et de séchage.",
  },
  inventory: {
    title: "Gestion des stocks",
    description: "Suivi des stocks et des mouvements de marchandises.",
  },
  customers: {
    title: "Gestion des clients",
    description: "Gestion des informations et des relations clients.",
  },
  sales: {
    title: "Gestion des ventes",
    description: "Suivi des commandes et des ventes de cacao.",
  },
  expenses: {
    title: "Gestion des dépenses",
    description: "Suivi des charges et des dépenses.",
  },
  finance: {
    title: "Gestion financière",
    description: "Suivi des recettes, dépenses et soldes.",
  },
  reports: {
    title: "Rapports et statistiques",
    description: "Analyse des performances de votre activité.",
  },
  users: {
    title: "Gestion des utilisateurs",
    description: "Gestion des comptes et des profils.",
  },
  settings: {
    title: "Paramètres",
    description: "Configuration de votre application.",
  },
};

export default function ModulePage() {
  const { module } = useParams();
  const { user } = useAuth();

  const currentModule = module ? modules[module] : undefined;

  if (!currentModule) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Page introuvable
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          La page demandée n'existe pas.
        </p>
      </div>
    );
  }

  if (!user || !canAccessModule(module ?? "", user.role)) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center sm:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <ShieldAlert size={30} />
        </div>

        <h2 className="mt-6 text-xl font-bold text-gray-800">
          Accès refusé
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Votre rôle ne vous permet pas d'accéder à ce module.
          Contactez votre administrateur si vous pensez qu'il
          s'agit d'une erreur.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
        >
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-[#16A34A]">
          <Construction size={30} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#17251B]">
          {currentModule.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {currentModule.description}
        </p>

        <span className="mt-6 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
          Module en préparation
        </span>
      </div>
    </div>
  );
}
