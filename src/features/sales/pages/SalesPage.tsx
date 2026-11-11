
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Wallet,
  Search,
  Plus,
  Eye,
  Check,
  XCircle,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import type { Sale } from "../sales.types";

import {
  getSales,
  validateSale,
  markSaleAsPaid,
  cancelSale,
  deleteSale,
} from "../sales.service";

import SaleForm from "../components/SaleForm";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    refreshSales();
  }, []);

  function refreshSales() {
    setSales(getSales());
  }

  const filteredSales = sales.filter((sale) => {
    const searchValue = search.trim().toLowerCase();

    return (
      sale.numero.toLowerCase().includes(searchValue) ||
      sale.clientNumero.toLowerCase().includes(searchValue) ||
      sale.clientNom.toLowerCase().includes(searchValue)
    );
  });

  const pendingSales = sales.filter(
    (sale) => sale.statut === "EN_ATTENTE",
  ).length;

  const validatedSales = sales.filter(
    (sale) => sale.statut === "VALIDEE",
  ).length;

  const paidSales = sales.filter(
    (sale) => sale.statut === "PAYEE",
  );

  const totalPaidAmount = paidSales.reduce(
    (total, sale) => total + sale.montantTotal,
    0,
  );

  function formatAmount(amount: number): string {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} Ar`;
  }

  function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");
  }

  function handleSaleCreated() {
    refreshSales();
    setShowSaleForm(false);
  }

  function handleValidateSale(sale: Sale) {
    const confirmed = window.confirm(
      `Voulez-vous valider la vente ${sale.numero} ?\n\nLes quantités seront déduites du stock de cacao sec.`,
    );

    if (!confirmed) return;

    try {
      validateSale(sale.id);
      refreshSales();

      toast.success(`La vente ${sale.numero} a été validée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de valider cette vente.",
      );
    }
  }

  function handleMarkAsPaid(sale: Sale) {
    const confirmed = window.confirm(
      `Confirmez-vous le paiement de la vente ${sale.numero} ?`,
    );

    if (!confirmed) return;

    try {
      markSaleAsPaid(sale.id);
      refreshSales();

      toast.success(`La vente ${sale.numero} est maintenant payée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le paiement.",
      );
    }
  }

  function handleCancelSale(sale: Sale) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment annuler la vente ${sale.numero} ?`,
    );

    if (!confirmed) return;

    try {
      cancelSale(sale.id);
      refreshSales();

      toast.success(`La vente ${sale.numero} a été annulée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'annuler cette vente.",
      );
    }
  }

  function handleDeleteSale(sale: Sale) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer définitivement la vente ${sale.numero} ?\n\nCette action est irréversible.\n\nLe stock déjà déduit ne sera pas restauré.\nLe montant encaissé sera recalculé si cette vente était payée.`,
    );

    if (!confirmed) return;

    try {
      deleteSale(sale.id);

      if (selectedSale?.id === sale.id) {
        setSelectedSale(null);
      }

      refreshSales();

      toast.success(`La vente ${sale.numero} a été supprimée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer cette vente.",
      );
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">
            Gestion commerciale
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            Gestion des ventes
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gérez les ventes de cacao sec et suivez les transactions clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSaleForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Nouvelle vente
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total des ventes"
          value={sales.length}
          icon={<ShoppingCart size={21} />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="En attente"
          value={pendingSales}
          icon={<Clock size={21} />}
          color="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Ventes validées"
          value={validatedSales}
          icon={<CheckCircle2 size={21} />}
          color="bg-green-50 text-green-700"
        />

        <StatCard
          title="Montant encaissé"
          value={formatAmount(totalPaidAmount)}
          icon={<Wallet size={21} />}
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Historique des ventes
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Retrouvez toutes les ventes enregistrées dans l'application.
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
              placeholder="Rechercher une vente..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-5 py-12 text-center">
            <ShoppingCart
              size={36}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 font-semibold text-gray-800">
              {sales.length === 0
                ? "Aucune vente enregistrée"
                : "Aucun résultat trouvé"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {sales.length === 0
                ? "Les ventes créées apparaîtront ici."
                : "Essayez avec un autre numéro ou nom de client."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Référence</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Quantité</th>
                  <th className="px-4 py-3 font-semibold">Montant</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {sale.numero}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">
                        {sale.clientNom}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {sale.clientNumero}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(sale.dateVente)}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {sale.quantiteKg.toLocaleString("fr-FR")} kg
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {formatAmount(sale.montantTotal)}
                    </td>

                    <td className="px-4 py-4">
                      <SaleStatusBadge status={sale.statut} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSale(sale)}
                          title="Voir les détails"
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                        >
                          <Eye size={16} />
                        </button>

                        {sale.statut === "EN_ATTENTE" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleValidateSale(sale)}
                              title="Valider la vente"
                              className="rounded-lg bg-green-50 p-2 text-green-700 transition hover:bg-green-100"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCancelSale(sale)}
                              title="Annuler la vente"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        {sale.statut === "VALIDEE" && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(sale)}
                            title="Marquer comme payée"
                            className="rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Wallet size={16} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteSale(sale)}
                          title="Supprimer définitivement la vente"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showSaleForm && (
        <SaleForm
          onCancel={() => setShowSaleForm(false)}
          onCreated={handleSaleCreated}
        />
      )}

      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}

function SaleStatusBadge({
  status,
}: {
  status: Sale["statut"];
}) {
  const styles = {
    EN_ATTENTE: "bg-amber-50 text-amber-700",
    VALIDEE: "bg-blue-50 text-blue-700",
    PAYEE: "bg-green-50 text-green-700",
    ANNULEE: "bg-red-50 text-red-700",
  };

  const labels = {
    EN_ATTENTE: "En attente",
    VALIDEE: "Validée",
    PAYEE: "Payée",
    ANNULEE: "Annulée",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function SaleDetailsModal({
  sale,
  onClose,
}: {
  sale: Sale;
  onClose: () => void;
}) {
  function formatAmount(amount: number): string {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} Ar`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Détails de la vente
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Référence : {sale.numero}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Client</p>
              <p className="mt-1 font-semibold text-gray-900">
                {sale.clientNom}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {sale.clientNumero}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Date de vente
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  `${sale.dateVente}T00:00:00`,
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Statut</p>
              <div className="mt-2">
                <SaleStatusBadge status={sale.statut} />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Quantité totale
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {sale.quantiteKg.toLocaleString("fr-FR")} kg
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-gray-900">
              Articles vendus
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Lot</th>
                    <th className="px-4 py-3 font-semibold">Quantité</th>
                    <th className="px-4 py-3 font-semibold">Prix/kg</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {sale.articles.map((item) => (
                    <tr key={item.dryBatchId}>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.dryBatchNumber}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.quantiteKg.toLocaleString("fr-FR")} kg
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {formatAmount(item.prixKg)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatAmount(item.montantTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-sm text-green-800">Montant total de la vente</p>
            <p className="mt-1 text-2xl font-extrabold text-green-900">
              {formatAmount(sale.montantTotal)}
            </p>
          </div>

          {sale.observations && (
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Observations
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                {sale.observations}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
