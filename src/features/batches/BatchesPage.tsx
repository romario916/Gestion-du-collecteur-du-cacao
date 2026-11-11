
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Scale,
  Warehouse,
} from "lucide-react";

import type { Batch, CreateBatchInput } from "./batches.types";

import {
  createBatch,
  deleteBatch,
  getBatches,
} from "./batches.service";

import BatchesTable from "./components/BatchesTable";
import BatchForm from "./components/BatchForm";

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadBatches = useCallback(() => {
    setBatches(getBatches());
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  function handleCreate(data: CreateBatchInput) {
    try {
      createBatch(data);
      loadBatches();
      setIsFormOpen(false);
      toast.success("Le lot a été créé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création du lot.",
      );
    }
  }

  function handleDelete(batch: Batch) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le lot ${batch.numero} ?`,
    );

    if (!confirmed) return;

    try {
      deleteBatch(batch.id);
      loadBatches();
      toast.success(`Le lot ${batch.numero} a été supprimé.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression.",
      );
    }
  }

  const totalInitial = batches.reduce(
    (total, batch) => total + batch.quantiteInitialeKg,
    0,
  );

  const totalAvailable = batches.reduce(
    (total, batch) => total + batch.quantiteDisponibleKg,
    0,
  );

  const stockLots = batches.filter(
    (batch) => batch.statut === "EN_STOCK",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des lots
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez les lots de cacao issus des achats validés.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
        >
          <Plus size={18} />
          Nouveau lot
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Nombre de lots
            </p>
            <Package className="text-green-700" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {batches.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Lots en stock
            </p>
            <Warehouse className="text-green-700" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {stockLots}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Quantité initiale
            </p>
            <Scale className="text-amber-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {totalInitial.toLocaleString("fr-FR")} kg
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Quantité disponible
            </p>
            <Package className="text-blue-600" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {totalAvailable.toLocaleString("fr-FR")} kg
          </p>
        </div>
      </div>

      <BatchesTable
        batches={batches}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <BatchForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
