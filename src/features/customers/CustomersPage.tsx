
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Building2,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

import CustomerForm from "./components/CustomerForm";
import CustomersTable from "./components/CustomersTable";
import CustomerDetails from "./components/CustomerDetails";

import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers.types";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus,
} from "./customers.service";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  const [detailsCustomer, setDetailsCustomer] =
    useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshCustomers();
  }, []);

  function refreshCustomers() {
    setCustomers(getCustomers());
  }

  function handleCreate(data: CreateCustomerInput) {
    try {
      createCustomer(data);

      refreshCustomers();
      setIsFormOpen(false);
      setSelectedCustomer(null);

      toast.success("Client créé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de créer le client.",
      );
    }
  }

  function handleUpdate(data: UpdateCustomerInput) {
    if (!selectedCustomer) return;

    try {
      updateCustomer(selectedCustomer.id, data);

      refreshCustomers();
      setIsFormOpen(false);
      setSelectedCustomer(null);

      toast.success("Client modifié avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le client.",
      );
    }
  }

  function handleToggleStatus(target: Customer) {
    const action =
      target.statut === "ACTIF" ? "désactiver" : "réactiver";

    const customerName =
      target.type === "ENTREPRISE"
        ? target.nomEntreprise
        : `${target.nom} ${target.prenom}`;

    const confirmed = window.confirm(
      `Voulez-vous vraiment ${action} le client ${customerName} ?`,
    );

    if (!confirmed) return;

    try {
      toggleCustomerStatus(target.id);

      refreshCustomers();

      if (detailsCustomer?.id === target.id) {
        setDetailsCustomer((previous) =>
          previous
            ? {
                ...previous,
                statut:
                  previous.statut === "ACTIF" ? "INACTIF" : "ACTIF",
              }
            : null,
        );
      }

      toast.success(
        target.statut === "ACTIF"
          ? "Client désactivé avec succès."
          : "Client réactivé avec succès.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut du client.",
      );
    }
  }

  function handleDelete(target: Customer) {
    const customerName =
      target.type === "ENTREPRISE"
        ? target.nomEntreprise
        : `${target.nom} ${target.prenom}`;

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le client ${customerName} ?`,
    );

    if (!confirmed) return;

    try {
      deleteCustomer(target.id);

      refreshCustomers();

      if (detailsCustomer?.id === target.id) {
        setDetailsCustomer(null);
      }

      toast.success("Client supprimé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le client.",
      );
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.trim().toLowerCase();

    const customerName =
      customer.type === "ENTREPRISE"
        ? customer.nomEntreprise
        : `${customer.nom} ${customer.prenom}`;

    return (
      customer.numero.toLowerCase().includes(searchValue) ||
      customerName.toLowerCase().includes(searchValue) ||
      customer.telephone.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      customer.ville.toLowerCase().includes(searchValue) ||
      customer.pays.toLowerCase().includes(searchValue)
    );
  });

  const activeCustomers = customers.filter(
    (customer) => customer.statut === "ACTIF",
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.statut === "INACTIF",
  ).length;

  const companyCustomers = customers.filter(
    (customer) => customer.type === "ENTREPRISE",
  ).length;

  const individualCustomers = customers.filter(
    (customer) => customer.type !== "ENTREPRISE",
  ).length;

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5B54B]" />
            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
              Gestion commerciale
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Gestion des clients
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gérez les clients particuliers et les entreprises de Cacao Sambirano.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCustomer(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103F26] hover:shadow-md"
        >
          <Plus size={18} />
          Ajouter un client
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total clients"
          value={customers.length}
          description="Clients enregistrés"
          icon={<Users size={21} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          accent="bg-blue-600"
        />

        <StatCard
          title="Clients actifs"
          value={activeCustomers}
          description="Clients opérationnels"
          icon={<UserCheck size={21} />}
          iconBg="bg-green-50"
          iconColor="text-green-700"
          accent="bg-green-600"
        />

        <StatCard
          title="Clients inactifs"
          value={inactiveCustomers}
          description="Clients désactivés"
          icon={<UserX size={21} />}
          iconBg="bg-red-50"
          iconColor="text-red-700"
          accent="bg-red-500"
        />

        <StatCard
          title="Entreprises"
          value={companyCustomers}
          description="Clients professionnels"
          icon={<Building2 size={21} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          accent="bg-amber-500"
        />
      </div>

      {/* Répartition des clients */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <UserRound size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Particuliers
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Clients individuels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {individualCustomers}
            </span>
            <ArrowUpRight size={17} className="text-green-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Building2 size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Entreprises
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Clients professionnels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {companyCustomers}
            </span>
            <ArrowUpRight size={17} className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Liste des clients
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Retrouvez et gérez les clients enregistrés dans l'application.
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
              placeholder="Rechercher un client..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-500">
              {filteredCustomers.length} résultat(s)
            </span>

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-green-700 transition hover:text-green-900"
              >
                Effacer la recherche
              </button>
            )}
          </div>

          <CustomersTable
            customers={filteredCustomers}
            onView={(target) => setDetailsCustomer(target)}
            onEdit={(target) => {
              setSelectedCustomer(target);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3 sm:px-6">
          <p className="text-xs text-gray-500">
            Gestion des relations clients · Cacao Sambirano
          </p>
        </div>
      </section>

      {/* Fenêtre de détails */}
      {detailsCustomer && (
        <CustomerDetails
          customer={detailsCustomer}
          onClose={() => setDetailsCustomer(null)}
        />
      )}

      {/* Formulaire */}
      {isFormOpen && (
        <CustomerForm
          customer={selectedCustomer}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCustomer(null);
          }}
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
  iconBg,
  iconColor,
  accent,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
