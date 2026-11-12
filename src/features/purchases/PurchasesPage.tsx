
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Package,
  Wallet,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import PurchasesTable from "./components/PurchasesTable";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseDetails from "./components/PurchaseDetails";

import type {
  Purchase,
  CreatePurchaseInput,
  UpdatePurchaseInput,
} from "./purchases.types";

import {
  getPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "./purchases.service";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    getPurchases()
  );

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] =
    useState<Purchase | null>(null);
  const [detailsPurchase, setDetailsPurchase] =
    useState<Purchase | null>(null);

  const filteredPurchases = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return purchases;
    }

    return purchases.filter((purchase) =>
      [
        purchase.numero,
        purchase.producerName,
        purchase.dateAchat,
        purchase.qualite,
        purchase.statut,
      ].some((value) => value.toLowerCase().includes(searchValue))
    );
  }, [purchases, search]);

  const totalQuantity = purchases.reduce(
    (total, purchase) => total + purchase.quantiteKg,
    0
  );

  const totalAmount = purchases.reduce(
    (total, purchase) => total + purchase.montantTotal,
    0
  );

  const pendingPurchases = purchases.filter(
    (purchase) => purchase.statut === "EN_ATTENTE"
  ).length;

  const validatedPurchases = purchases.filter(
    (purchase) => purchase.statut === "VALIDE"
  ).length;

  function refreshPurchases() {
    setPurchases(getPurchases());
  }

  function handleOpenCreate() {
    setEditingPurchase(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(purchase: Purchase) {
    setEditingPurchase(purchase);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingPurchase(null);
  }

  function handleCreate(data: CreatePurchaseInput) {
    try {
      createPurchase(data);
      refreshPurchases();
      handleCloseForm();
      toast.success("Achat enregistré avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer cet achat."
      );
    }
  }

  function handleUpdate(data: UpdatePurchaseInput) {
    if (!editingPurchase) {
      return;
    }

    try {
      updatePurchase(editingPurchase.id, data);
      refreshPurchases();
      handleCloseForm();
      toast.success("Achat modifié avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier cet achat."
      );
    }
  }

  function handleDelete(purchase: Purchase) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'achat ${purchase.numero} ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      deletePurchase(purchase.id);
      refreshPurchases();
      toast.success("Achat supprimé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer cet achat."
      );
    }
  }

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EAB308]" />

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532D]">
              Approvisionnement
            </p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Achats de cacao
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Gérez les achats de cacao auprès des producteurs et suivez
            les transactions d'approvisionnement.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#166534] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <Plus size={18} />
          Nouvel achat
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Nombre d'achats"
          value={purchases.length.toLocaleString("fr-FR")}
          description="Achats enregistrés"
          icon={<ShoppingCart size={21} />}
          iconColor="bg-blue-50 text-[#2563EB]"
          accentColor="bg-[#2563EB]"
        />

        <StatCard
          title="Quantité totale"
          value={`${totalQuantity.toLocaleString("fr-FR")} kg`}
          description="Volume total acheté"
          icon={<Package size={21} />}
          iconColor="bg-green-50 text-[#15803D]"
          accentColor="bg-[#15803D]"
        />

        <StatCard
          title="Montant total"
          value={formatCurrency(totalAmount)}
          description="Valeur de tous les achats"
          icon={<Wallet size={21} />}
          iconColor="bg-amber-50 text-[#CA8A04]"
          accentColor="bg-[#EAB308]"
          compact
        />

        <StatCard
          title="En attente"
          value={pendingPurchases.toLocaleString("fr-FR")}
          description={`${validatedPurchases} achat(s) validé(s)`}
          icon={<Clock size={21} />}
          iconColor="bg-orange-50 text-orange-600"
          accentColor="bg-orange-500"
        />
      </div>

      {/* Historique des achats */}
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                <ShoppingCart size={18} />
              </div>

              <h2 className="font-bold text-gray-900">
                Historique des achats
              </h2>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Consultez et gérez les transactions d'approvisionnement
              enregistrées.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un achat..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#14532D] focus:bg-white focus:ring-4 focus:ring-green-50"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <PurchasesTable
            purchases={filteredPurchases}
            onView={setDetailsPurchase}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3">
          <p className="text-xs text-gray-500">
            {filteredPurchases.length} résultat(s) affiché(s) sur{" "}
            {purchases.length} achat(s).
          </p>
        </div>
      </section>

      {/* Formulaire */}
      {isFormOpen && (
        <PurchaseForm
          purchase={editingPurchase}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={handleCloseForm}
        />
      )}

      {/* Détails */}
      {detailsPurchase && (
        <PurchaseDetails
          purchase={detailsPurchase}
          onClose={() => setDetailsPurchase(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconColor,
  accentColor,
  compact = false,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  accentColor: string;
  compact?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute left-0 top-0 h-full w-1 ${accentColor}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p
            className={`mt-3 break-words font-extrabold tracking-tight text-gray-900 ${
              compact ? "text-lg sm:text-xl" : "text-2xl"
            }`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
