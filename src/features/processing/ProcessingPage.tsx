
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Scale,
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion du séchage
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez les opérations de séchage groupées et leurs rendements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
        >
          <Plus size={18} />
          Nouvelle opération
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total opérations
            </p>
            <Activity className="text-green-700" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {transformations.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              En attente
            </p>
            <Clock className="text-amber-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              En cours
            </p>
            <Package className="text-blue-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {ongoingCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Terminées
            </p>
            <CheckCircle2 className="text-green-700" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Cacao frais utilisé
            </p>
            <Scale className="text-amber-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {totalUsed.toLocaleString("fr-FR")} kg
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Cacao sec obtenu
            </p>
            <Package className="text-green-700" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {totalObtained.toLocaleString("fr-FR")} kg
          </p>
        </div>
      </div>

      <TransformationsTable
        transformations={transformations}
        onStart={handleStart}
        onFinish={handleFinish}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <TransformationForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
