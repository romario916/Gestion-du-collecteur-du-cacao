
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
  Package,
  UserRound,
  CalendarDays,
  Scale,
  ArrowUpRight,
  TrendingUp,
  FileText,
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
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Gestion commerciale
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Gestion des ventes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Gérez les ventes de cacao sec, suivez les transactions et
            consultez les paiements de vos clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSaleForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-green-900/10 transition hover:bg-green-900 hover:shadow-md"
        >
          <Plus size={19} />
          Nouvelle vente
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total des ventes"
          value={sales.length}
          description="Transactions enregistrées"
          icon={<ShoppingCart size={21} />}
          color="blue"
        />

        <StatCard
          title="En attente"
          value={pendingSales}
          description="Ventes à traiter"
          icon={<Clock size={21} />}
          color="yellow"
        />

        <StatCard
          title="Ventes validées"
          value={validatedSales}
          description="En attente de paiement"
          icon={<CheckCircle2 size={21} />}
          color="green"
        />

        <StatCard
          title="Montant encaissé"
          value={formatAmount(totalPaidAmount)}
          description="Total des ventes payées"
          icon={<Wallet size={21} />}
          color="gold"
        />
      </div>

      {/* Indicateurs complémentaires */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50/70 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <TrendingUp size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Ventes payées
            </p>
            <p className="mt-1 text-xl font-extrabold text-green-950">
              {paidSales.length}
            </p>
            <p className="mt-1 text-xs text-green-700/80">
              Transactions entièrement encaissées
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Package size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Résultats de recherche
            </p>
            <p className="mt-1 text-xl font-extrabold text-blue-950">
              {filteredSales.length}
            </p>
            <p className="mt-1 text-xs text-blue-700/80">
              Ventes correspondant à votre recherche
            </p>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:p-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-800">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Historique des ventes
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Consultez et gérez toutes les transactions clients.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Référence, numéro ou nom du client..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100/70"
            />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <ShoppingCart size={30} />
            </div>

            <h3 className="mt-5 font-bold text-gray-900">
              {sales.length === 0
                ? "Aucune vente enregistrée"
                : "Aucun résultat trouvé"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {sales.length === 0
                ? "Les ventes créées apparaîtront ici. Vous pourrez suivre leur validation et leur paiement."
                : "Essayez avec une autre référence ou un autre nom de client."}
            </p>

            {sales.length === 0 && (
              <button
                type="button"
                onClick={() => setShowSaleForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                <Plus size={17} />
                Créer une vente
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4 font-bold">Référence</th>
                    <th className="px-5 py-4 font-bold">Client</th>
                    <th className="px-5 py-4 font-bold">Date</th>
                    <th className="px-5 py-4 font-bold">Quantité</th>
                    <th className="px-5 py-4 font-bold">Montant</th>
                    <th className="px-5 py-4 font-bold">Statut</th>
                    <th className="px-5 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="transition-colors hover:bg-green-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-800">
                            <ShoppingCart size={17} />
                          </div>
                          <span className="font-bold text-gray-900">
                            {sale.numero}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                            <UserRound size={15} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {sale.clientNom}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {sale.clientNumero}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={15}
                            className="text-gray-400"
                          />
                          {formatDate(sale.dateVente)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <Scale size={15} className="text-gray-400" />
                          {sale.quantiteKg.toLocaleString("fr-FR")} kg
                        </div>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-900">
                        {formatAmount(sale.montantTotal)}
                      </td>

                      <td className="px-5 py-4">
                        <SaleStatusBadge status={sale.statut} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <ActionButton
                            title="Voir les détails"
                            onClick={() => setSelectedSale(sale)}
                            color="gray"
                          >
                            <Eye size={16} />
                          </ActionButton>

                          {sale.statut === "EN_ATTENTE" && (
                            <>
                              <ActionButton
                                title="Valider la vente"
                                onClick={() => handleValidateSale(sale)}
                                color="green"
                              >
                                <Check size={16} />
                              </ActionButton>

                              <ActionButton
                                title="Annuler la vente"
                                onClick={() => handleCancelSale(sale)}
                                color="red"
                              >
                                <XCircle size={16} />
                              </ActionButton>
                            </>
                          )}

                          {sale.statut === "VALIDEE" && (
                            <ActionButton
                              title="Marquer comme payée"
                              onClick={() => handleMarkAsPaid(sale)}
                              color="blue"
                            >
                              <Wallet size={16} />
                            </ActionButton>
                          )}

                          <ActionButton
                            title="Supprimer définitivement la vente"
                            onClick={() => handleDeleteSale(sale)}
                            color="red"
                          >
                            <Trash2 size={16} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center">
              <span>
                Affichage de{" "}
                <strong className="text-gray-800">
                  {filteredSales.length}
                </strong>{" "}
                vente(s)
              </span>
              <span>
                Total enregistré :{" "}
                <strong className="text-green-800">
                  {formatAmount(
                    filteredSales.reduce(
                      (total, sale) => total + sale.montantTotal,
                      0,
                    ),
                  )}
                </strong>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Formulaire */}
      {showSaleForm && (
        <SaleForm
          onCancel={() => setShowSaleForm(false)}
          onCreated={handleSaleCreated}
        />
      )}

      {/* Détails */}
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
  description,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: "green" | "yellow" | "blue" | "gold";
}) {
  const colorStyles = {
    green: {
      icon: "bg-green-50 text-green-800",
      accent: "bg-green-700",
    },
    yellow: {
      icon: "bg-amber-50 text-amber-700",
      accent: "bg-amber-500",
    },
    blue: {
      icon: "bg-blue-50 text-blue-700",
      accent: "bg-blue-600",
    },
    gold: {
      icon: "bg-yellow-50 text-yellow-700",
      accent: "bg-yellow-500",
    },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute bottom-0 left-0 top-0 w-1 ${colorStyles[color].accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="mt-3 break-words text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            {value}
          </p>
          <p className="mt-2 text-xs text-gray-400">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[color].icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SaleStatusBadge({
  status,
}: {
  status: Sale["statut"];
}) {
  const styles = {
    EN_ATTENTE: "bg-amber-50 text-amber-800 ring-amber-200",
    VALIDEE: "bg-blue-50 text-blue-800 ring-blue-200",
    PAYEE: "bg-green-50 text-green-800 ring-green-200",
    ANNULEE: "bg-red-50 text-red-700 ring-red-200",
  };

  const labels = {
    EN_ATTENTE: "En attente",
    VALIDEE: "Validée",
    PAYEE: "Payée",
    ANNULEE: "Annulée",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  color,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  color: "gray" | "green" | "blue" | "red";
}) {
  const styles = {
    gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    green: "bg-green-50 text-green-700 hover:bg-green-100",
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-lg p-2 transition ${styles[color]}`}
    >
      {children}
    </button>
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="my-5 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="relative overflow-hidden bg-[#103F26] px-6 py-6 text-white">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-yellow-400/20" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-200">
                <ShoppingCart size={15} />
                Gestion commerciale
              </div>

              <h2 className="mt-3 text-xl font-extrabold">
                Détails de la vente
              </h2>

              <p className="mt-1 text-sm text-green-100/80">
                Référence : {sale.numero}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-500" />
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Informations générales */}
          <section>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Informations générales
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Client"
                value={sale.clientNom}
                icon={<UserRound size={17} />}
              />

              <DetailItem
                label="Référence client"
                value={sale.clientNumero}
                icon={<FileText size={17} />}
              />

              <DetailItem
                label="Date de vente"
                value={new Date(
                  `${sale.dateVente}T00:00:00`,
                ).toLocaleDateString("fr-FR")}
                icon={<CalendarDays size={17} />}
              />

              <DetailItem
                label="Quantité totale"
                value={`${sale.quantiteKg.toLocaleString("fr-FR")} kg`}
                icon={<Scale size={17} />}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4">
              <span className="text-xs font-semibold text-gray-500">
                Statut de la vente
              </span>
              <SaleStatusBadge status={sale.statut} />
            </div>
          </section>

          {/* Articles */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Package size={18} className="text-green-800" />
              <h3 className="text-sm font-bold text-gray-900">
                Articles vendus
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-bold">Lot</th>
                    <th className="px-4 py-3 font-bold">Quantité</th>
                    <th className="px-4 py-3 font-bold">Prix/kg</th>
                    <th className="px-4 py-3 font-bold">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {sale.articles.map((item) => (
                    <tr key={item.dryBatchId}>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {item.dryBatchNumber}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.quantiteKg.toLocaleString("fr-FR")} kg
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {formatAmount(item.prixKg)}
                      </td>

                      <td className="px-4 py-3 font-bold text-gray-900">
                        {formatAmount(item.montantTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Montant total */}
          <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-5 text-white">
            <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />

            <div className="relative">
              <p className="text-sm font-medium text-green-100">
                Montant total de la vente
              </p>

              <p className="mt-2 text-2xl font-extrabold tracking-tight text-yellow-400 sm:text-3xl">
                {formatAmount(sale.montantTotal)}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-green-100/80">
                <ArrowUpRight size={15} />
                <span>
                  {sale.articles.length} article(s) dans cette transaction
                </span>
              </div>
            </div>
          </section>

          {/* Observations */}
          {sale.observations && (
            <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-amber-700" />
                <p className="text-sm font-bold text-amber-900">
                  Observations
                </p>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-900/80">
                {sale.observations}
              </p>
            </section>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#103F26] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-green-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-800">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}
