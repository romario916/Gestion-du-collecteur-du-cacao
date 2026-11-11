
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Building2,
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

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">
            Gestion commerciale
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Ajouter un client
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total clients"
          value={customers.length}
          icon={<Users size={21} />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Clients actifs"
          value={activeCustomers}
          icon={<UserCheck size={21} />}
          color="bg-green-50 text-green-700"
        />

        <StatCard
          title="Clients inactifs"
          value={inactiveCustomers}
          icon={<UserX size={21} />}
          color="bg-red-50 text-red-700"
        />

        <StatCard
          title="Entreprises"
          value={companyCustomers}
          icon={<Building2 size={21} />}
          color="bg-amber-50 text-amber-700"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Liste des clients
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Retrouvez les clients enregistrés dans l'application.
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
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
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

      {detailsCustomer && (
        <CustomerDetails
          customer={detailsCustomer}
          onClose={() => setDetailsCustomer(null)}
        />
      )}

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
  icon,
  color,
}: {
  title: string;
  value: number;
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

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
