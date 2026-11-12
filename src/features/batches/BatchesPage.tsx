
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Scale,
  Warehouse,
  Wheat,
  ArrowUpRight,
} from "lucide-react";

import type { Batch, CreateBatchInput } from "./batches.types";

import {
  createBatch,
  deleteBatch,
  getBatches,
} from "./batches.service";

import BatchesTable from "./components/BatchesTable";
import BatchForm from "./components/BatchForm";

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
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5B54B]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14532D]">
              Gestion des stocks
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Lots de cacao frais
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Suivez les lots de cacao issus des achats validés et
            consultez leurs quantités disponibles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all duration-200 hover:bg-[#103F26] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <Plus size={18} />
          Nouveau lot
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Nombre de lots"
          value={batches.length.toLocaleString("fr-FR")}
          description="Total des lots enregistrés"
          icon={<Package size={22} />}
          iconBg="bg-green-50"
          iconColor="text-[#14532D]"
          accent="bg-[#14532D]"
        />

        <StatCard
          title="Lots en stock"
          value={stockLots.toLocaleString("fr-FR")}
          description="Lots actuellement disponibles"
          icon={<Warehouse size={22} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          accent="bg-emerald-500"
        />

        <StatCard
          title="Quantité initiale"
          value={`${totalInitial.toLocaleString("fr-FR")} kg`}
          description="Poids total enregistré à l'origine"
          icon={<Scale size={22} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accent="bg-[#E5B54B]"
        />

        <StatCard
          title="Quantité disponible"
          value={`${totalAvailable.toLocaleString("fr-FR")} kg`}
          description="Poids encore disponible"
          icon={<Wheat size={22} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          accent="bg-blue-600"
        />
      </div>

      {/* Tableau des lots */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                <Package size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Historique des lots
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Gestion et suivi des lots de cacao frais
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-lg bg-green-50 px-3 py-2 sm:self-center">
            <ArrowUpRight size={15} className="text-[#14532D]" />
            <span className="text-xs font-semibold text-[#14532D]">
              {batches.length} lot{batches.length > 1 ? "s" : ""} enregistré
              {batches.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <BatchesTable
            batches={batches}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {/* Formulaire */}
      {isFormOpen && (
        <BatchForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
