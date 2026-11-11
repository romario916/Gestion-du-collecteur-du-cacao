
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import ProducerForm from "../components/ProducerForm";
import ProducersTable from "../components/ProducersTable";
import ProducerDetails from "../components/ProducerDetails";

import type {
  Producer,
  CreateProducerInput,
  UpdateProducerInput,
} from "../producers.types";

import {
  getProducers,
  createProducer,
  updateProducer,
  deleteProducer,
} from "../producers.service";

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] =
    useState<Producer | null>(null);
  const [detailsProducer, setDetailsProducer] =
    useState<Producer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshProducers();
  }, []);

  function refreshProducers() {
    setProducers(getProducers());
  }

  function handleCreate(data: CreateProducerInput) {
    try {
      createProducer(data);

      refreshProducers();
      setIsFormOpen(false);
      setSelectedProducer(null);

      toast.success("Producteur créé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de créer le producteur.",
      );
    }
  }

  function handleUpdate(data: UpdateProducerInput) {
    if (!selectedProducer) return;

    try {
      updateProducer(selectedProducer.id, data);

      refreshProducers();
      setIsFormOpen(false);
      setSelectedProducer(null);

      toast.success("Producteur modifié avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le producteur.",
      );
    }
  }

  function handleToggleStatus(target: Producer) {
    const newStatus = !target.actif;

    const action = newStatus ? "réactiver" : "désactiver";

    const confirmed = window.confirm(
      `Voulez-vous vraiment ${action} le producteur ${target.nom} ${target.prenom} ?`,
    );

    if (!confirmed) return;

    try {
      updateProducer(target.id, {
        nom: target.nom,
        prenom: target.prenom,
        telephone: target.telephone,
        email: target.email,
        adresse: target.adresse,
        fokontany: target.fokontany,
        commune: target.commune,
        district: target.district,
        region: target.region,
        superficie: target.superficie,
        nombreParcelles: target.nombreParcelles,
        actif: newStatus,
      });

      refreshProducers();

      toast.success(
        newStatus
          ? "Producteur réactivé avec succès."
          : "Producteur désactivé avec succès.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut du producteur.",
      );
    }
  }

  function handleDelete(target: Producer) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le producteur ${target.nom} ${target.prenom} ?`,
    );

    if (!confirmed) return;

    try {
      deleteProducer(target.id);

      refreshProducers();

      if (detailsProducer?.id === target.id) {
        setDetailsProducer(null);
      }

      toast.success("Producteur supprimé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le producteur.",
      );
    }
  }

  const filteredProducers = producers.filter((producer) => {
    const searchValue = search.trim().toLowerCase();

    return (
      producer.numero.toLowerCase().includes(searchValue) ||
      producer.nom.toLowerCase().includes(searchValue) ||
      producer.prenom.toLowerCase().includes(searchValue) ||
      producer.telephone.toLowerCase().includes(searchValue) ||
      producer.commune.toLowerCase().includes(searchValue) ||
      producer.region.toLowerCase().includes(searchValue)
    );
  });

  const activeProducers = producers.filter(
    (producer) => producer.actif,
  ).length;

  const inactiveProducers = producers.filter(
    (producer) => !producer.actif,
  ).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">
            Gestion agricole
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            Gestion des producteurs
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gérez les producteurs et les informations de leurs exploitations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProducer(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Ajouter un producteur
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total producteurs"
          value={producers.length}
          icon={<Users size={21} />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Producteurs actifs"
          value={activeProducers}
          icon={<UserCheck size={21} />}
          color="bg-green-50 text-green-700"
        />

        <StatCard
          title="Producteurs inactifs"
          value={inactiveProducers}
          icon={<UserX size={21} />}
          color="bg-red-50 text-red-700"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Liste des producteurs
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Retrouvez les producteurs enregistrés dans l'application.
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
              placeholder="Rechercher un producteur..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <ProducersTable
          producers={filteredProducers}
          onView={(target) => setDetailsProducer(target)}
          onEdit={(target) => {
            setSelectedProducer(target);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {detailsProducer && (
        <ProducerDetails
          producer={detailsProducer}
          onClose={() => setDetailsProducer(null)}
        />
      )}

      {isFormOpen && (
        <ProducerForm
          producer={selectedProducer}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProducer(null);
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
