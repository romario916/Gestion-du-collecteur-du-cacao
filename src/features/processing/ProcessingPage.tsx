
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Scale,
  Wheat,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

import type {
  Transformation,
  CreateTransformationInput,
} from "./processing.types";

import {
  createTransformation,
  deleteTransformation,
  finishTransformation,
  getTransformations,
  startTransformation,
} from "./processing.service";

import TransformationsTable from "./components/TransformationsTable";
import TransformationForm from "./components/TransformationForm";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
  iconColor,
  accent,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute bottom-0 left-0 h-1 w-full ${accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  const [transformations, setTransformations] = useState<
    Transformation[]
  >([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadTransformations = useCallback(() => {
    setTransformations(getTransformations());
  }, []);

  useEffect(() => {
    loadTransformations();
  }, [loadTransformations]);

  function handleCreate(data: CreateTransformationInput) {
    try {
      createTransformation(data);
      loadTransformations();
      setIsFormOpen(false);
      toast.success("L'opération de séchage a été créée.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création.",
      );
    }
  }

  function handleStart(transformation: Transformation) {
    const confirmed = window.confirm(
      `Démarrer l'opération ${transformation.numero} ?\n\n` +
        `Nombre de lots : ${transformation.lotsSources.length}\n` +
        `Quantité totale qui sera retirée : ${transformation.quantiteTotaleUtiliseeKg} kg.`,
    );

    if (!confirmed) return;

    try {
      startTransformation(transformation.id);
      loadTransformations();
      toast.success("Le séchage a démarré.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du démarrage.",
      );
    }
  }

  function handleFinish(transformation: Transformation) {
    const input = window.prompt(
      `Saisissez la quantité totale de cacao sec obtenue pour ${transformation.numero} (en kg) :`,
    );

    if (input === null) return;

    const quantity = Number(input);

    if (!input.trim() || !Number.isFinite(quantity) || quantity <= 0) {
      toast.error("Veuillez saisir une quantité obtenue valide.");
      return;
    }

    try {
      finishTransformation(transformation.id, quantity);
      loadTransformations();
      toast.success("L'opération de séchage est terminée.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la finalisation.",
      );
    }
  }

  function handleDelete(transformation: Transformation) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'opération ${transformation.numero} ?`,
    );

    if (!confirmed) return;

    try {
      deleteTransformation(transformation.id);
      loadTransformations();
      toast.success(
        `L'opération ${transformation.numero} a été supprimée.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression.",
      );
    }
  }

  const pendingCount = transformations.filter(
    (item) => item.statut === "EN_ATTENTE",
  ).length;

  const ongoingCount = transformations.filter(
    (item) => item.statut === "EN_COURS",
  ).length;

  const completedCount = transformations.filter(
    (item) => item.statut === "TERMINE",
  ).length;

  const totalUsed = transformations
    .filter(
      (item) =>
        item.statut === "EN_COURS" ||
        item.statut === "TERMINE",
    )
    .reduce(
      (total, item) => total + item.quantiteTotaleUtiliseeKg,
      0,
    );

  const totalObtained = transformations
    .filter((item) => item.statut === "TERMINE")
    .reduce(
      (total, item) => total + (item.quantiteObtenueKg ?? 0),
      0,
    );

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5B54B]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14532D]">
              Production et transformation
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Gestion du séchage
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Suivez les opérations de séchage groupées, les quantités
            utilisées et les rendements obtenus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all duration-200 hover:bg-[#103F26] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <Plus size={18} />
          Nouvelle opération
        </button>
      </div>

      {/* Statistiques des opérations */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total opérations"
          value={transformations.length.toLocaleString("fr-FR")}
          description="Toutes les opérations enregistrées"
          icon={<Activity size={22} />}
          iconBg="bg-green-50"
          iconColor="text-[#14532D]"
          accent="bg-[#14532D]"
        />

        <StatCard
          title="En attente"
          value={pendingCount.toLocaleString("fr-FR")}
          description="Opérations à démarrer"
          icon={<Clock size={22} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accent="bg-[#E5B54B]"
        />

        <StatCard
          title="En cours"
          value={ongoingCount.toLocaleString("fr-FR")}
          description="Séchages actuellement actifs"
          icon={<Package size={22} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          accent="bg-blue-600"
        />

        <StatCard
          title="Terminées"
          value={completedCount.toLocaleString("fr-FR")}
          description="Opérations finalisées"
          icon={<CheckCircle2 size={22} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          accent="bg-emerald-500"
        />
      </div>

      {/* Indicateurs de production */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Scale size={17} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Bilan de production
            </h2>
            <p className="text-xs text-gray-400">
              Quantités de cacao frais utilisées et de cacao sec obtenues
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title="Cacao frais utilisé"
            value={`${totalUsed.toLocaleString("fr-FR")} kg`}
            description="Quantité totale utilisée dans les opérations en cours et terminées"
            icon={<Wheat size={22} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accent="bg-[#E5B54B]"
          />

          <StatCard
            title="Cacao sec obtenu"
            value={`${totalObtained.toLocaleString("fr-FR")} kg`}
            description="Quantité totale issue des opérations terminées"
            icon={<Package size={22} />}
            iconBg="bg-green-50"
            iconColor="text-[#14532D]"
            accent="bg-[#14532D]"
          />
        </div>
      </section>

      {/* Historique des opérations */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
              <ClipboardList size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                Historique des opérations
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Suivi des opérations de séchage du cacao
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-lg bg-green-50 px-3 py-2 sm:self-center">
            <ArrowUpRight size={15} className="text-[#14532D]" />
            <span className="text-xs font-semibold text-[#14532D]">
              {transformations.length} opération
              {transformations.length > 1 ? "s" : ""} enregistrée
              {transformations.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <TransformationsTable
            transformations={transformations}
            onStart={handleStart}
            onFinish={handleFinish}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {/* Formulaire */}
      {isFormOpen && (
        <TransformationForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
