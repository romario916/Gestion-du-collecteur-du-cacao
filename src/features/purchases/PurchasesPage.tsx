
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-green-700" size={25} />
            <h1 className="text-2xl font-bold text-gray-900">
              Achats de cacao
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Gérez les achats de cacao auprès des producteurs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
        >
          <Plus size={18} />
          Nouvel achat
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Nombre d'achats
            </p>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <ShoppingCart size={20} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {purchases.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Achats enregistrés
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Quantité totale
            </p>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
              <Package size={20} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {totalQuantity.toLocaleString("fr-FR")} kg
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Volume total acheté
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Montant total
            </p>
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <Wallet size={20} />
            </div>
          </div>

          <p className="mt-4 text-xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Valeur de tous les achats
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              En attente
            </p>
            <div className="rounded-xl bg-orange-50 p-3 text-orange-700">
              <Clock size={20} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {pendingPurchases}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {validatedPurchases} achat(s) validé(s)
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Historique des achats
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Consultez et gérez les transactions enregistrées.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un achat..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <PurchasesTable
          purchases={filteredPurchases}
          onView={setDetailsPurchase}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            {filteredPurchases.length} résultat(s) affiché(s) sur{" "}
            {purchases.length} achat(s).
          </p>
        </div>
      </div>

      {isFormOpen && (
        <PurchaseForm
          purchase={editingPurchase}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={handleCloseForm}
        />
      )}

      {detailsPurchase && (
        <PurchaseDetails
          purchase={detailsPurchase}
          onClose={() => setDetailsPurchase(null)}
        />
      )}
    </div>
  );
}
